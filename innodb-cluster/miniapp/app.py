import os
import time
import pymysql
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

ROUTER_HOST = os.environ.get("DBHOST", "mysql-router")
ROUTER_PORT = int(os.environ.get("DBPORT", "6446"))
DB_USER = os.environ.get("DBUSER", "dbwebapp")
DB_PASSWORD = os.environ.get("DBPASSWORD", "")
DB_NAME = os.environ.get("DBNAME", "dbwebappdb")

NODES = [
    {"name": "mysql-server-1", "host": os.environ.get("NODE1_HOST", "mysql-server-1")},
    {"name": "mysql-server-2", "host": os.environ.get("NODE2_HOST", "mysql-server-2")},
    {"name": "mysql-server-3", "host": os.environ.get("NODE3_HOST", "mysql-server-3")},
]


def connect(host, port=3306, timeout=2):
    return pymysql.connect(
        host=host, port=port, user=DB_USER, password=DB_PASSWORD, database=DB_NAME,
        connect_timeout=timeout, read_timeout=timeout, cursorclass=pymysql.cursors.DictCursor,
    )


def connect_router(retries=3, delay=2):
    last_error = None
    for attempt in range(retries):
        try:
            return pymysql.connect(
                host=ROUTER_HOST, port=ROUTER_PORT, user=DB_USER, password=DB_PASSWORD,
                database=DB_NAME, connect_timeout=3, cursorclass=pymysql.cursors.DictCursor,
            )
        except Exception as e:
            last_error = e
            time.sleep(delay)
    raise last_error


def ensure_table(conn):
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS entries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
    conn.commit()


def fetch_node_status(node):
    result = {
        "name": node["name"], "host": node["host"], "online": False,
        "role": None, "state": None, "error": None, "entries": [],
    }
    try:
        conn = connect(node["host"])
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT MEMBER_ROLE, MEMBER_STATE
                FROM performance_schema.replication_group_members
                WHERE MEMBER_HOST = @@hostname OR MEMBER_PORT = @@port
                LIMIT 1
                """
            )
            row = cur.fetchone()
            if row:
                result["role"] = row["MEMBER_ROLE"]
                result["state"] = row["MEMBER_STATE"]
            cur.execute("SELECT id, content FROM entries ORDER BY id")
            result["entries"] = cur.fetchall()
        result["online"] = True
        conn.close()
    except Exception as e:
        result["error"] = str(e)
    return result


def build_comparison_rows(nodes_status):
    """Construit, côté Python, une ligne par donnée avec sa présence sur
    chaque serveur — le template n'a plus qu'à afficher cette liste."""
    all_ids = []
    for n in nodes_status:
        for e in n["entries"]:
            if e["id"] not in all_ids:
                all_ids.append(e["id"])
    all_ids.sort()

    rows = []
    for entry_id in all_ids:
        content = None
        presence = []  # 'ok' | 'missing' | 'offline', un par serveur, même ordre que nodes_status
        for n in nodes_status:
            if not n["online"]:
                presence.append("offline")
                continue
            match = next((e for e in n["entries"] if e["id"] == entry_id), None)
            if match:
                presence.append("ok")
                if content is None:
                    content = match["content"]
            else:
                presence.append("missing")
        synced = all(p == "ok" for p in presence if p != "offline")
        rows.append({
            "content": content if content is not None else "(indisponible)",
            "presence": presence,
            "synced": synced,
        })
    return rows


@app.route("/")
def index():
    write_error = None
    served_by = None

    try:
        conn = connect_router(retries=1)
        ensure_table(conn)
        with conn.cursor() as cur:
            cur.execute("SELECT @@hostname AS host")
            served_by = cur.fetchone()["host"]
        conn.close()
    except Exception as e:
        write_error = str(e)

    nodes_status = [fetch_node_status(n) for n in NODES]
    total_count = len(nodes_status)
    online_nodes = [n for n in nodes_status if n["online"]]
    online_count = len(online_nodes)

    primary_count = sum(1 for n in online_nodes if n["role"] == "PRIMARY")
    secondary_count = online_count - primary_count

    consistent = True
    if online_count > 1:
        reference = [(e["id"], e["content"]) for e in online_nodes[0]["entries"]]
        for n in online_nodes[1:]:
            other = [(e["id"], e["content"]) for e in n["entries"]]
            if other != reference:
                consistent = False
                break

    online_pct = round((online_count / total_count) * 100) if total_count else 0
    primary_pct = round((primary_count / online_count) * 100) if online_count else 0
    consistency_pct = 100 if consistent else 40

    comparison_rows = build_comparison_rows(nodes_status)

    return render_template(
        "index.html",
        nodes=nodes_status,
        served_by=served_by,
        write_error=write_error,
        consistent=consistent,
        online_count=online_count,
        total_count=total_count,
        primary_count=primary_count,
        secondary_count=secondary_count,
        online_pct=online_pct,
        primary_pct=primary_pct,
        consistency_pct=consistency_pct,
        comparison_rows=comparison_rows,
    )


@app.route("/add", methods=["POST"])
def add():
    content = request.form.get("content", "").strip()
    if content:
        conn = connect_router(retries=3, delay=2)
        ensure_table(conn)
        with conn.cursor() as cur:
            cur.execute("INSERT INTO entries (content) VALUES (%s)", (content,))
        conn.commit()
        conn.close()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8090)
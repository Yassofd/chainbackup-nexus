import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts(onOpenCommandPalette: () => void) {
  const navigate = useNavigate();

  const handler = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // ⌘K → command palette
      if (mod && e.key === "k") {
        e.preventDefault();
        onOpenCommandPalette();
        return;
      }

      // Global nav shortcuts (Alt + number)
      if (e.altKey && !mod) {
        const routes: Record<string, string> = {
          "1": "/",
          "2": "/backups",
          "3": "/network",
          "4": "/monitoring",
          "5": "/users",
          "6": "/restore",
        };
        if (routes[e.key]) {
          e.preventDefault();
          navigate(routes[e.key]);
        }
      }
    },
    [navigate, onOpenCommandPalette]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}

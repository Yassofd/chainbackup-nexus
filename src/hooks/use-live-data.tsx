import { useState, useEffect, useRef } from "react";

/**
 * Simulates WebSocket-style real-time data updates.
 * Returns a value that fluctuates around a base value at a given interval.
 */
export function useLiveValue(base: number, variance: number = 2, intervalMs: number = 3000) {
  const [value, setValue] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setValue(base + (Math.random() - 0.5) * 2 * variance);
    }, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, intervalMs]);

  return Math.round(value * 100) / 100;
}

/**
 * Simulates a loading state that resolves after a delay.
 * Useful for skeleton → content transitions.
 */
export function useSimulatedLoading(delayMs: number = 1200) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  return loading;
}

/**
 * Returns a timestamp string that updates every second, simulating a live clock.
 */
export function useLiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

/**
 * Accumulates data points over time, simulating a WebSocket data stream.
 */
export function useLiveStream<T>(generator: () => T, intervalMs: number = 5000, maxPoints: number = 30) {
  const [data, setData] = useState<T[]>([]);
  const genRef = useRef(generator);
  genRef.current = generator;

  useEffect(() => {
    // Seed initial data
    const initial = Array.from({ length: maxPoints }, () => genRef.current());
    setData(initial);

    const id = setInterval(() => {
      setData((prev) => [...prev.slice(-(maxPoints - 1)), genRef.current()]);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, maxPoints]);

  return data;
}

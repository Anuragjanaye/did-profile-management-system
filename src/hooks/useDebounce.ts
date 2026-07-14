"use client";

import { useEffect, useState } from "react";

/**
 * Debounces a value by the given delay in milliseconds.
 * Prevents unnecessary API calls on every keystroke in search inputs.
 *
 * @example const debouncedSearch = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

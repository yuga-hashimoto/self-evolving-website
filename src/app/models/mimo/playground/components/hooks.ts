"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize with default value to avoid hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from local storage after mount
  useEffect(() => {
    // Wrap in timeout to avoid "synchronous setState in effect" warning/error
    const timeout = setTimeout(() => {
        try {
          if (typeof window !== "undefined") {
            const item = window.localStorage.getItem(key);
            if (item) {
              setStoredValue(JSON.parse(item));
            }
          }
        } catch (error) {
          console.error(error);
        }
    }, 0);
    return () => clearTimeout(timeout);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function that updates based on existing value
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Catch any errors and log them
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

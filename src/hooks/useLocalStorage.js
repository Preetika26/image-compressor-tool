import { useState, useEffect } from 'react';

/**
 * A hook to sync state to localStorage.
 * @param {string} key 
 * @param {any} initialValue 
 * @returns {[any, Function]}
 */
export function useLocalStorage(key, initialValue) {
  // Retrieve initial state from localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : initialValue;

      if (parsed === null || parsed === undefined) {
        return initialValue;
      }

      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        return initialValue;
      }

      return parsed;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep localStorage updated when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

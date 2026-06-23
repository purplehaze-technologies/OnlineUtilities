"use client";

import * as React from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * quiet. Used by live tools (QR preview, word counter, JSON formatter, slug
 * generator) to avoid recomputing on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

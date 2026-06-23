"use client";

import * as React from "react";

/**
 * Copy text to the clipboard and expose a transient `copied` flag.
 * Shared utility for the tools that will be built on top of this foundation.
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, []);

  React.useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), resetDelay);
    return () => clearTimeout(timer);
  }, [copied, resetDelay]);

  return { copied, copy };
}

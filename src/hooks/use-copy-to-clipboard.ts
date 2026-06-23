"use client";

import * as React from "react";

import { copyToClipboard } from "@/lib/utils/clipboard";
import { FEEDBACK_RESET_MS } from "@/lib/constants/tool";

/**
 * Copy text to the clipboard and expose a transient `copied` flag plus an
 * `error` flag for the failure case. Shared by every tool with a copy action
 * (and by the `CopyButton` primitive).
 */
export function useCopyToClipboard(resetDelay = FEEDBACK_RESET_MS) {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    const ok = await copyToClipboard(text);
    setCopied(ok);
    setError(!ok);
    return ok;
  }, []);

  React.useEffect(() => {
    if (!copied && !error) return;
    const timer = setTimeout(() => {
      setCopied(false);
      setError(false);
    }, resetDelay);
    return () => clearTimeout(timer);
  }, [copied, error, resetDelay]);

  return { copied, error, copy };
}

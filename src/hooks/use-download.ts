"use client";

import * as React from "react";

import { downloadBlob, downloadUrl, downloadText } from "@/lib/utils/file";
import { FEEDBACK_RESET_MS } from "@/lib/constants/tool";

/**
 * Wraps the download helpers with a transient `downloaded` flag so a button can
 * flash a confirmation. Shared by any tool that saves a result to disk.
 */
export function useDownload(resetDelay = FEEDBACK_RESET_MS) {
  const [downloaded, setDownloaded] = React.useState(false);

  const flash = React.useCallback(() => setDownloaded(true), []);

  const downloadBlobAs = React.useCallback(
    (blob: Blob, filename: string) => {
      downloadBlob(blob, filename);
      flash();
    },
    [flash]
  );

  const downloadUrlAs = React.useCallback(
    (url: string, filename: string) => {
      downloadUrl(url, filename);
      flash();
    },
    [flash]
  );

  const downloadTextAs = React.useCallback(
    (text: string, filename: string, type?: string) => {
      downloadText(text, filename, type);
      flash();
    },
    [flash]
  );

  React.useEffect(() => {
    if (!downloaded) return;
    const timer = setTimeout(() => setDownloaded(false), resetDelay);
    return () => clearTimeout(timer);
  }, [downloaded, resetDelay]);

  return { downloaded, downloadBlobAs, downloadUrlAs, downloadTextAs };
}

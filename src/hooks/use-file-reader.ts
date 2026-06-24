"use client";

import * as React from "react";

export type FileReaderState =
  | { status: "idle" }
  | { status: "reading" }
  | { status: "done"; result: string; file: File }
  | { status: "error"; message: string };

/**
 * Wraps the `FileReader` API in a hook. Shared by Image→Base64, JSON Formatter
 * (file upload), and any future tool that reads local files. Returns the current
 * read state and a `read` function that accepts a `File` and a read mode.
 */
export function useFileReader() {
  const [state, setState] = React.useState<FileReaderState>({ status: "idle" });
  const readerRef = React.useRef<FileReader | null>(null);

  const read = React.useCallback(
    (file: File, mode: "dataURL" | "text" = "dataURL") => {
      // Abort any in-flight read.
      readerRef.current?.abort();

      const reader = new FileReader();
      readerRef.current = reader;

      reader.onloadstart = () => setState({ status: "reading" });

      reader.onload = () => {
        if (typeof reader.result === "string") {
          setState({ status: "done", result: reader.result, file });
        } else {
          setState({ status: "error", message: "Unexpected result type" });
        }
      };

      reader.onerror = () =>
        setState({
          status: "error",
          message: reader.error?.message ?? "Failed to read file",
        });

      if (mode === "dataURL") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file, "utf-8");
      }
    },
    []
  );

  const reset = React.useCallback(() => {
    readerRef.current?.abort();
    setState({ status: "idle" });
  }, []);

  return { state, read, reset };
}

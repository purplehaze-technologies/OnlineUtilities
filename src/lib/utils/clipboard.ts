/**
 * Clipboard helpers shared by every tool with a copy action. Framework-free so
 * the same logic backs both `useCopyToClipboard` and one-off calls.
 */

/** Whether the async Clipboard API is available in this environment. */
export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  );
}

/**
 * Copy text to the clipboard, resolving to `true` on success. Falls back to the
 * legacy `execCommand("copy")` path for older or non-secure-context browsers so
 * the copy action keeps working everywhere.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (isClipboardSupported()) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to the legacy path
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  } catch {
    return false;
  }
}

import * as React from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* JSON tokenizer                                                              */
/* -------------------------------------------------------------------------- */

type TokenType =
  | "key"
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "punctuation"
  | "space";

interface Token {
  type: TokenType;
  value: string;
}

function tokenizeJson(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    // Whitespace / newlines
    if (/\s/.test(input[i])) {
      const start = i;
      while (i < input.length && /\s/.test(input[i])) i++;
      tokens.push({ type: "space", value: input.slice(start, i) });
      continue;
    }

    // String
    if (input[i] === '"') {
      const start = i++;
      while (i < input.length) {
        if (input[i] === "\\") {
          i += 2;
          continue;
        }
        if (input[i] === '"') {
          i++;
          break;
        }
        i++;
      }
      const raw = input.slice(start, i);
      // Look past whitespace for a colon to identify keys.
      let j = i;
      while (j < input.length && input[j] === " ") j++;
      tokens.push({ type: input[j] === ":" ? "key" : "string", value: raw });
      continue;
    }

    // Number
    if (/[-0-9]/.test(input[i])) {
      const start = i;
      if (input[i] === "-") i++;
      while (i < input.length && /[0-9.eE+\-]/.test(input[i])) i++;
      tokens.push({ type: "number", value: input.slice(start, i) });
      continue;
    }

    // Keywords: true, false, null
    let matched = false;
    for (const kw of ["true", "false", "null"] as const) {
      if (input.startsWith(kw, i)) {
        tokens.push({ type: kw === "null" ? "null" : "boolean", value: kw });
        i += kw.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Punctuation
    if ("{}[]:,".includes(input[i])) {
      tokens.push({ type: "punctuation", value: input[i] });
      i++;
      continue;
    }

    // Unknown — preserve as-is
    tokens.push({ type: "space", value: input[i] });
    i++;
  }

  return tokens;
}

const TOKEN_CLASS: Record<TokenType, string> = {
  key: "text-blue-600 dark:text-blue-400",
  string: "text-green-700 dark:text-green-400",
  number: "text-purple-600 dark:text-purple-400",
  boolean: "text-orange-600 dark:text-orange-400",
  null: "text-red-600 dark:text-red-400",
  punctuation: "text-foreground",
  space: "text-foreground",
};

/* -------------------------------------------------------------------------- */
/* CodeDisplay                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Read-only syntax-highlighted code block. Handles JSON and plain text, with
 * optional line numbers and configurable max height. Used by JWT Decoder, JSON
 * Formatter, Base64 tool, and any future tool that displays structured output.
 */
export function CodeDisplay({
  code,
  language = "text",
  maxHeight = 400,
  lineNumbers = false,
  className,
}: {
  code: string;
  language?: "json" | "text";
  maxHeight?: number | "none";
  lineNumbers?: boolean;
  className?: string;
}) {
  const lines = code.split("\n");
  const tokens = language === "json" ? tokenizeJson(code) : null;

  return (
    <div
      className={cn(
        "bg-muted/30 relative overflow-hidden rounded-lg border",
        className
      )}
    >
      <pre
        className="overflow-auto p-4 text-xs leading-5"
        style={maxHeight !== "none" ? { maxHeight } : undefined}
        tabIndex={0}
        aria-label="Code output"
      >
        {lineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx}>
                  <td
                    className="text-muted-foreground w-10 pr-4 text-right align-top tabular-nums select-none"
                    aria-hidden
                  >
                    {idx + 1}
                  </td>
                  <td className="w-full align-top">
                    <code>{line}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tokens ? (
          <code>
            {tokens.map((tok, idx) => (
              <span key={idx} className={TOKEN_CLASS[tok.type]}>
                {tok.value}
              </span>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}

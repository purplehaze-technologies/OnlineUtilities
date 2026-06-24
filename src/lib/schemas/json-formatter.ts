import { z } from "zod";

export const JSON_OPERATIONS = ["beautify", "minify", "validate"] as const;
export type JsonOperation = (typeof JSON_OPERATIONS)[number];

export const JSON_INDENT_SIZES = [2, 4] as const;
export type JsonIndentSize = (typeof JSON_INDENT_SIZES)[number];

export const jsonFormatterSchema = z.object({
  operation: z.enum(JSON_OPERATIONS).default("beautify"),
  indentSize: z.union([z.literal(2), z.literal(4)]).default(2),
  sortKeys: z.boolean().default(false),
});

export type JsonFormatterOptions = z.infer<typeof jsonFormatterSchema>;

/** Process JSON input with the given options. Returns formatted output or throws. */
export function processJson(
  input: string,
  opts: Pick<JsonFormatterOptions, "operation" | "indentSize" | "sortKeys">
): string {
  const parsed = JSON.parse(input); // throws SyntaxError on invalid input
  if (opts.operation === "minify") {
    return JSON.stringify(parsed);
  }
  if (opts.sortKeys) {
    return JSON.stringify(sortObjectKeys(parsed), null, opts.indentSize);
  }
  return JSON.stringify(parsed, null, opts.indentSize);
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortObjectKeys);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as object)
        .sort()
        .map((k) => [k, sortObjectKeys((value as Record<string, unknown>)[k])])
    );
  }
  return value;
}

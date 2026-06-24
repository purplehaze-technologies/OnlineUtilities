import { z } from "zod";

export const UUID_VERSIONS = [4, 7] as const;
export type UuidVersion = (typeof UUID_VERSIONS)[number];

export const UUID_COUNTS = [1, 5, 10, 25, 50, 100] as const;

export const uuidOptionsSchema = z.object({
  version: z.union([z.literal(4), z.literal(7)]).default(4),
  count: z.number().int().min(1).max(1000).default(1),
});

export type UuidOptions = z.infer<typeof uuidOptionsSchema>;

export const DEFAULT_UUID_OPTIONS: UuidOptions = {
  version: 4,
  count: 1,
};

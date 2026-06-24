import { z } from "zod";

export const passwordOptionsSchema = z.object({
  length: z.number().int().min(4).max(128).default(16),
  upper: z.boolean().default(true),
  lower: z.boolean().default(true),
  numbers: z.boolean().default(true),
  symbols: z.boolean().default(true),
  excludeSimilar: z.boolean().default(false),
  excludeAmbiguous: z.boolean().default(false),
  count: z.number().int().min(1).max(20).default(1),
});

export type PasswordOptions = z.infer<typeof passwordOptionsSchema>;

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
  count: 1,
};

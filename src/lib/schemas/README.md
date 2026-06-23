# Validation schemas

[Zod](https://zod.dev) schemas for tool inputs live here, one file per tool (`<slug>.ts`), colocated by convention.

Empty for now — schemas are added alongside each tool's UI. See [docs/adding-a-tool.md](../../../docs/adding-a-tool.md) and [docs/tool-template.md](../../../docs/tool-template.md).

Example (`slug-generator.ts`):

```ts
import { z } from "zod";

export const slugInputSchema = z.object({
  text: z.string().min(1, "Enter some text").max(200),
  separator: z.enum(["-", "_"]).default("-"),
});

export type SlugInput = z.infer<typeof slugInputSchema>;
```

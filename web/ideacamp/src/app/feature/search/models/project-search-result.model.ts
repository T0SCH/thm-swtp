import { z } from 'zod';

export const ProjectSearchResultSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
});

export type ProjectSearchResult = z.infer<typeof ProjectSearchResultSchema>;

import {z} from 'zod';


export const projectGeneralSchema = z.object({
  name: z.string()
    .trim()
    .min(3, 'Project name must be at least 3 characters.')
    .max(20, 'Project name must be shorter then 20 characters.'),

  description: z.string()
    .trim()
    .max(500, 'Project description must be shorter then 500 characters.')
    .optional()
    .or(z.literal('')),
});

export const projectSettingsSchema = z.object({
  projectUrl: z.string()
    .trim()
    .min(3, 'Project url must be at least 3 characters.')
    .max(30, 'Project url must be shorter then 30 characters.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,'Only use lowercase letters, numbers and hyphens. Hyphens are not allowed at the beginning or end.'),

  isPrivateProject: z.boolean(),
});

export const projectCreateSchema = projectGeneralSchema
  .extend(projectSettingsSchema.shape)

export type ProjectGeneralData = z.infer<typeof projectGeneralSchema>;
export type ProjectSettingsData = z.infer<typeof projectSettingsSchema>;
export type ProjectCreateData = z.infer<typeof projectCreateSchema>;

import { z } from "zod"

export const createWorkflowSchema = z.object({
  name: z.string().max(50, { message: "Name must be less than 50 characters" }),
  description: z
    .string()
    .max(100, { message: "Description must be less than 100 characters" })
    .optional(),
})

export type CreateWorkflowSchemaType = z.infer<typeof createWorkflowSchema>

export const duplicateWorkflowSchema = createWorkflowSchema.extend({
  workflowId: z.string(),
})

export type DuplicateWorkflowSchemaType = z.infer<
  typeof duplicateWorkflowSchema
>

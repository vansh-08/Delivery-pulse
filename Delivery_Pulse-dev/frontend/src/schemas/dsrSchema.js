import { z } from 'zod';

export const dsrSchema = z.object({
  project_id: z.string({
    required_error: "Project is required",
  }).min(1, "Please select a project"),
  tasks_today: z.string().min(1, "Please add at least one task for today"),
  tasks_tomorrow: z.string().min(1, "Please add at least one task for tomorrow"),
  blockers: z.string().optional(),
  notes: z.string().optional(),
});
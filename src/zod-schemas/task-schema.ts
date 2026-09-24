import { z } from "zod";

const createTaskSchema = z.object({
    leadId: z.uuid().nonempty("Please select a lead"),
    title: z.string().nonempty("Task title is required"),
    description: z.string().nonempty("Description is required"),
    priority: z.enum(["low", "medium", "high"]),
    assignedTo: z.uuid().nonempty().optional(),
});

const updateTaskSchema = z.object({
    title: z.string().nonempty("Task title is required"),
    description: z.string().nonempty("Task description is required"),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["pending", "in_progress", "completed"]),
    assignedTo: z.uuid("Please select a staff member"),
});

export { createTaskSchema, updateTaskSchema };

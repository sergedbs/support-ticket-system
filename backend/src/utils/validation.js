import { z } from 'zod';

export const ticketSchema = z.object({
  title: z.string().trim().min(4, 'Title must be at least 4 characters long').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters long').max(2000),
  category: z.string().trim().min(2, 'Category is required').max(60),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']).optional(),
});

export const ticketUpdateSchema = ticketSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required',
});

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function handleValidation(error, response) {
  return response.status(400).json({
    error: 'Invalid request body',
    details: error.issues?.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) || [],
  });
}

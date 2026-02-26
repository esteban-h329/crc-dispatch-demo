import { z } from 'zod';

/**
 * Validates a US phone number format.
 * Accepts: (555) 555-5555, 555-555-5555, 5555555555
 */
export const phoneSchema = z
  .string()
  .regex(/^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/, 'Invalid phone number format');

/**
 * Validates a non-empty trimmed string.
 */
export const requiredString = (fieldName: string): z.ZodString =>
  z.string().trim().min(1, `${fieldName} is required`);

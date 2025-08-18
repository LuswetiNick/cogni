import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export const loginSchema = z.object({
  email: z.email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export const agentSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  instructions: z.string().min(1, {
    message: 'Instructions are required',
  }),
});

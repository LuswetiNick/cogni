'use server';
import { APIError } from 'better-auth/api';
import type { z } from 'zod';
import { auth, type ErrorCode } from '@/lib/auth';
import { loginSchema, signUpSchema } from '@/lib/zod-schemas';

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  const validatedFields = signUpSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.message,
    };
  }
  try {
    await auth.api.signUpEmail({
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
      },
    });
    return {
      status: 'success',
      message: 'Registration successful.',
    };
  } catch (err) {
    if (err instanceof APIError) {
      const errorCode = err.body ? (err.body.code as ErrorCode) : 'UNKNOWN';
      switch (errorCode) {
        case 'USER_ALREADY_EXISTS':
          return {
            status: 'error',
            message: 'User already exists',
          };
        case 'INVALID_PASSWORD':
          return {
            status: 'error',
            message: 'Invalid password',
          };
        default:
          return {
            status: 'error',
            message: err.message || 'Registration failed',
          };
      }
    }
    return {
      status: 'error',
      message: 'Something went wrong',
    };
  }
};

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.message,
    };
  }
  try {
    await auth.api.signInEmail({
      body: {
        email: values.email,
        password: values.password,
      },
    });
    return {
      status: 'success',
      message: 'Welcome back!',
    };
  } catch (err) {
    if (err instanceof APIError) {
      const errorCode = err.body ? (err.body.code as ErrorCode) : 'UNKNOWN';
      switch (errorCode) {
        case 'INVALID_EMAIL_OR_PASSWORD':
          return {
            status: 'error',
            message: 'Invalid email or password',
          };
        default:
          return {
            status: 'error',
            message: err.message || 'Login failed',
          };
      }
    }
    return {
      status: 'error',
      message: 'Something went wrong',
    };
  }
};

import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers/_app';

export type GetOneAgent = inferRouterOutputs<AppRouter>['agents']['getOne'];

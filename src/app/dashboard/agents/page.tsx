import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { LoadingState } from '@/components/loading-state';
import { loadSearchParams } from '@/data/agents/params';
import requireUser from '@/data/user/require-user';
import { getQueryClient, trpc } from '@/trpc/server';
import { AllAgents } from './_components/all-agents';
import Header from './_components/header';

interface Props {
  searchParams: Promise<SearchParams>;
}

const Agents = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);
  await requireUser();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <>
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <LoadingState
                description="Please wait while we load the agents"
                title="Loading Agents"
              />
            </div>
          }
        >
          <AllAgents />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};
export default Agents;

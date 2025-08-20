import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { LoadingState } from '@/components/loading-state';
import { getQueryClient, trpc } from '@/trpc/server';
import SingleAgent from './_components/single-agent';

interface Props {
  params: Promise<{ agentId: string }>;
}

const AgentPage = async ({ params }: Props) => {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <LoadingState
              description="Please wait while we load your agent info"
              title="Loading Agents"
            />
          </div>
        }
      >
        <SingleAgent agentId={agentId} />
      </Suspense>
    </HydrationBoundary>
  );
};
export default AgentPage;

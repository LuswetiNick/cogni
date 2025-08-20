'use client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { GenerateAvatar } from '@/components/generate-avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useConfirm } from '@/hooks/use-confirm';
import { useTRPC } from '@/trpc/client';
import { UpdateAgentDialog } from '../../_components/update-agent-dialog';
import AgentHeader from './agent-header';

interface Props {
  agentId: string;
}
const SingleAgent = ({ agentId }: Props) => {
  const [updateAgent, setUpdateAgent] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        router.push('/dashboard/agents');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    `Are you sure you want to remove agent: ${data.name} ?`,
    'This action will remove all associated meetings and cannot be undone.'
  );
  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeAgent.mutateAsync({ id: agentId });
  };
  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        initialValues={data}
        onOpenChange={setUpdateAgent}
        open={updateAgent}
      />
      <div className="flex flex-1 flex-col">
        <AgentHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgent(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="my-4 rounded-md border">
          <div className="col-span-5 flex flex-col p-4">
            <div className="flex items-center gap-3">
              <GenerateAvatar
                className="size-10"
                seed={data.name}
                variant="bottts"
              />
              <div className="flex items-center gap-x-4">
                <h2 className="font-medium text-xl">{data.name}</h2>
                <Badge className="flex items-center gap-2" variant="outline">
                  <Video className="size-4 text-primary" />
                  {data.meetingCount}
                  {data.meetingCount === 1 ? ' meeting' : ' meetings'}
                </Badge>
              </div>
            </div>

            <div className="my-2 flex flex-col gap-2">
              <h2 className="font-medium text-lg">Instructions</h2>
              <Separator />
              <p>{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SingleAgent;

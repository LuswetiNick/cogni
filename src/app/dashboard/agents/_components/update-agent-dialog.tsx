import ResponsiveDialog from '@/components/responsive-dialog';
import type { GetOneAgent } from '@/data/agents/types';
import { AgentForm } from './agent-form';

interface UpdateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: GetOneAgent;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      description=" Edit your agent and update it's instructions"
      onOpenChange={onOpenChange}
      open={open}
      title="Edit Agent"
    >
      <AgentForm
        initialValues={initialValues}
        onCancel={() => {
          onOpenChange(false);
        }}
        onSuccess={() => {
          onOpenChange(false);
        }}
      />
    </ResponsiveDialog>
  );
};

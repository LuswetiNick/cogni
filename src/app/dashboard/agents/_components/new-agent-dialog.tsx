import ResponsiveDialog from '@/components/responsive-dialog';
import { AgentForm } from './agent-form';

interface NewAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      description="Create your new agent and give it instructions"
      onOpenChange={onOpenChange}
      open={open}
      title="New Agent"
    >
      <AgentForm
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

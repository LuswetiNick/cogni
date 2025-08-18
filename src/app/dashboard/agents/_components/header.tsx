'use client';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NewAgentDialog } from './new-agent-dialog';

const Header = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <NewAgentDialog onOpenChange={setDialogOpen} open={isDialogOpen} />
      <div className="mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="max-w-lg">
            <h3 className="font-bold text-2xl ">Your Agents</h3>
          </div>

          <Button onClick={() => setDialogOpen(true)}>
            {' '}
            <Plus className="size-4" /> New Agent
          </Button>
        </div>
      </div>
    </>
  );
};
export default Header;

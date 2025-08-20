'use client';
import { type JSX, useState } from 'react';
import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';

export const useConfirm = (
  title: string,
  description: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);
  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };
  const handleClose = () => {
    setPromise(null);
  };
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      description={description}
      onOpenChange={handleClose}
      open={promise !== null}
      title={title}
    >
      <div className="my-4 flex w-full flex-col-reverse items-center justify-end gap-2 lg:flex-row">
        <Button
          className="w-full md:w-auto"
          onClick={handleCancel}
          variant="ghost"
        >
          Cancel
        </Button>
        <Button className="w-full md:w-auto" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );
  return [ConfirmationDialog, confirm];
};

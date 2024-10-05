import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/dialog";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";

// confirmation hook to bring pop-up
export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<boolean>] => {
  const [open, setOpen] = useState(false);
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => new Promise<boolean>((resolve) => {
    setPromise({ resolve });
    setOpen(true); // Open the dialog when the confirm is called
  });

  const handleClose = () => {
    setPromise(null);
    setOpen(false); // Close the dialog
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = () => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};

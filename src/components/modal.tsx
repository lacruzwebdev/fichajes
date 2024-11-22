"use client";

import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDialog } from "@/hooks/use-dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

type Props = {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Modal() {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { isOpen, modal, toggleModal } = useDialog();
  // const { isOpen, toggleModal } = useDialog();

  // const handleOpenChange = () => {
  //   const isUserFormModified = localStorage.getItem("userFormModified");
  //   if (isUserFormModified && JSON.parse(isUserFormModified)) {
  //     setShowExitConfirmation(true);
  //   } else {
  //     setOpen(false);
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogOverlay className="bg-transparent backdrop-blur-sm">
        <DialogContent className="overflow-y-hidden">
          <DialogHeader>
            <DialogTitle>{modal.title}</DialogTitle>
            <DialogDescription>{modal.description}</DialogDescription>
          </DialogHeader>
          {/* <AlertConfirmation
            open={showExitConfirmation}
            setOpen={setShowExitConfirmation}
            confirmationAction={() => setOpen(false)}
            message="You haven't saved your changes. Please confirm you want to exit without saving."
          /> */}
          {modal.content}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}

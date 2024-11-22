"use client";
import { useDialog } from "@/hooks/use-dialog";
import React from "react";

type Props = {
  title: string;
  description: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
};
export default function ModalTrigger({
  title,
  description,
  trigger,
  children,
}: Props) {
  const { toggleModal, setModal } = useDialog();

  function handleClick() {
    setModal({
      title,
      description,
      content: children,
    });
    toggleModal();
  }

  return <button onClick={handleClick}>{trigger}</button>;
}

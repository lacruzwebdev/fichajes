import { useState } from "react";
import { create } from "zustand";

type Modal = {
  title: string;
  description: string;
  content: React.ReactNode;
};

type Dialog = {
  isOpen: boolean;
  modal: Modal;
  toggleModal: () => void;
  setModal: (modal: Modal) => void;
};

//Global State
export const useDialog = create<Dialog>((set) => {
  return {
    isOpen: false,
    modal: {
      title: "",
      description: "",
      content: null,
    },
    toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
    setModal: (modal) => set({ modal }),
  };
});

//Local State
// export function useDialog() {
//   const [isOpen, setIsOpen] = useState(false);
//   const toggleModal = () => setIsOpen(!isOpen);
//   return { isOpen, toggleModal };
// }

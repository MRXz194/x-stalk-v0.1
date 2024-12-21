"use client";

import {
  Modal as NextUIModal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <NextUIModal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </NextUIModal>
  );
}

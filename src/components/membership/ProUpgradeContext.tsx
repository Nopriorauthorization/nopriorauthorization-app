"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ProUpgradeContextValue = {
  openProModal: (reason?: string) => void;
  closeProModal: () => void;
  isOpen: boolean;
  modalReason: string | null;
};

const ProUpgradeContext = createContext<ProUpgradeContextValue | null>(null);

export function ProUpgradeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string | null>(null);

  const openProModal = useCallback((reason?: string) => {
    setModalReason(reason?.trim() || null);
    setOpen(true);
  }, []);

  const closeProModal = useCallback(() => {
    setOpen(false);
    setModalReason(null);
  }, []);

  const value = useMemo(
    () => ({ openProModal, closeProModal, isOpen, modalReason }),
    [openProModal, closeProModal, isOpen, modalReason],
  );

  return (
    <ProUpgradeContext.Provider value={value}>{children}</ProUpgradeContext.Provider>
  );
}

export function useProUpgrade() {
  const ctx = useContext(ProUpgradeContext);
  if (!ctx) {
    throw new Error("useProUpgrade must be used within ProUpgradeProvider");
  }
  return ctx;
}

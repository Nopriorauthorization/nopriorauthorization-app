"use client";

import { type ReactNode } from "react";
import { FiLock } from "react-icons/fi";
import Button from "@/components/ui/button";
import { useProUpgrade } from "./ProUpgradeContext";

type Props = {
  children: ReactNode;
  teaserTitle?: string;
  className?: string;
  overlayClassName?: string;
};

export function GatedProTeaser({
  children,
  teaserTitle = "Full interactive preview is included with NPA Pro.",
  className = "",
  overlayClassName = "",
}: Props) {
  const { openProModal } = useProUpgrade();

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`.trim()}>
      <div className="pointer-events-none select-none opacity-40 blur-[0.5px] [&_*]:pointer-events-none">
        {children}
      </div>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 p-4 backdrop-blur-[2px] ${overlayClassName}`.trim()}
        aria-hidden
      >
        <FiLock className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden />
        <p className="max-w-sm text-center text-sm font-medium text-white">{teaserTitle}</p>
        <Button
          type="button"
          size="sm"
          onClick={() => openProModal(teaserTitle)}
          className="pointer-events-auto"
        >
          See Pro benefits
        </Button>
      </div>
    </div>
  );
}

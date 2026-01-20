"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function BlueprintCTA() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/blueprint");
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      className="rounded-full px-6 py-3 text-sm font-semibold text-white/90"
    >
      See My Blueprint
    </Button>
  );
}

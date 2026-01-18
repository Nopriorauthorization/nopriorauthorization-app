"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function BlueprintCTA() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "loading") {
      return;
    }
    if (session) {
      router.push("/blueprint");
    } else {
      router.push("/login?callbackUrl=/blueprint");
    }
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

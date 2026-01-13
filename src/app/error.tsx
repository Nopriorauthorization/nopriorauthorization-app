"use client";

import { useEffect } from "react";
import Button from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl mx-auto mb-6">
          !
        </div>
        <h1 className="text-4xl font-bold mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          We encountered an unexpected error. Please try again, or contact support
          if the problem persists.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

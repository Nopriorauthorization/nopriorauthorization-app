"use client";

import { useEffect } from "react";
import { trackProviderWidgetOpen, trackProviderWidgetView } from "@/lib/analytics";

export default function WidgetTracker() {
  useEffect(() => {
    trackProviderWidgetView();
    trackProviderWidgetOpen();
  }, []);

  return null;
}

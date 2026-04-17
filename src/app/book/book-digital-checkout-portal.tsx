"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { CheckoutButton } from "@/app/shop/[slug]/CheckoutButton";
import {
  HELLO_GORGEOUS_BOOK_PRICE_CENTS,
  HELLO_GORGEOUS_BOOK_SLUG,
} from "@/config/hello-gorgeous-book.config";

/** Matches `.btn-primary` on the sneak-peek landing (Lato uppercase, pink). */
const BOOK_DIGITAL_BTN_CLASS =
  "inline-flex min-h-0 w-auto items-center gap-3 bg-[#D4537E] px-10 py-[18px] font-sans text-xs font-bold uppercase tracking-[0.2em] text-white shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(212,83,126,0.35)] disabled:cursor-wait disabled:opacity-60";

const PRICE = `$${(HELLO_GORGEOUS_BOOK_PRICE_CENTS / 100).toFixed(0)}`;

/**
 * Mounts Square checkout for Hello Gorgeous — THE BOOK into `public/book/sneak-peek.html`
 * (#book-digital-checkout-root). Delivery: gated PDF via post-purchase link.
 */
export function BookDigitalCheckoutPortal() {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMount(document.getElementById("book-digital-checkout-root"));
  }, []);

  if (!mount) return null;

  return createPortal(
    <CheckoutButton
      slug={HELLO_GORGEOUS_BOOK_SLUG}
      label={`Get Digital Download — ${PRICE} →`}
      buttonClassName={BOOK_DIGITAL_BTN_CLASS}
    />,
    mount
  );
}

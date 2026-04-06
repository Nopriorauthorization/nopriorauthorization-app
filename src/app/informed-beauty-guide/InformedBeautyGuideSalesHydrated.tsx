"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createRoot, type Root } from "react-dom/client";
import { INFORMED_BEAUTY_GUIDE_SLUG } from "@/config/informed-beauty-guide.config";
import { CheckoutButton } from "@/app/shop/[slug]/CheckoutButton";
import "./informed-beauty-sales-scoped.css";

const PROMO_SRC = "/images/informed-beauty-guide-promo.png";
const PROMO_ALT =
  "The Informed Beauty Guide — skincare, lasers, injectables, hormones, and wellness. Become an informed patient before your next treatment. Only $49, instant access. By Danielle Alcala, Hello Gorgeous Med Spa.";

const FREE_CHEAT_HREF = "/forms/NPA-Free-Treatment-Guide-Cheat-Sheet.html";

function IbgCheckoutMount() {
  return (
    <div className="ibg-checkout-stack flex flex-col items-center gap-4 py-2">
      <div className="ibg-checkout-primary w-full max-w-md [&_button]:w-full [&_button]:justify-center">
        <CheckoutButton
          slug={INFORMED_BEAUTY_GUIDE_SLUG}
          label="Download The Informed Beauty Guide — $49"
          funnelEventOnCheckout="funnel_informed_beauty_checkout"
          funnelEventParams={{ source: "informed_beauty_sales_html" }}
        />
      </div>
      <div className="ibg-checkout-secondary w-full max-w-md [&_button]:w-full [&_button]:justify-center">
        <CheckoutButton
          slug={INFORMED_BEAUTY_GUIDE_SLUG}
          label="Take Control of Your Care — Starting Today — $49"
          funnelEventOnCheckout="funnel_informed_beauty_checkout"
          funnelEventParams={{ source: "informed_beauty_sales_html_secondary" }}
        />
      </div>
      <p className="max-w-md text-center text-xs leading-relaxed text-white/45">
        Free bonus cheat sheet:{" "}
        <a
          href={FREE_CHEAT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#D4537E] underline underline-offset-2 hover:text-white"
        >
          NPA Free Treatment Guide (view &amp; print)
        </a>
      </p>
    </div>
  );
}

export function InformedBeautyGuideSalesHydrated({ bodyHtml }: { bodyHtml: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [checkoutInView, setCheckoutInView] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const mount = host.querySelector("#npa-ibg-checkout-root");
    if (!mount) return;
    const root = createRoot(mount);
    root.render(<IbgCheckoutMount />);
    rootRef.current = root;
    return () => {
      queueMicrotask(() => {
        root.unmount();
        rootRef.current = null;
      });
    };
  }, [bodyHtml]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scrollCheckout = () => {
      host
        .querySelector("#checkout")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    const clickTargetElement = (target: EventTarget | null): Element | null => {
      if (!target || !(target instanceof Node)) return null;
      return target instanceof Element ? target : target.parentElement;
    };
    const onClick = (e: MouseEvent) => {
      const el = clickTargetElement(e.target);
      if (!el) return;
      const sticky = el.closest("[data-npa-ibg-scroll-checkout]");
      const checkoutHash = el.closest('a[href="#checkout"]');
      if (sticky || checkoutHash) {
        e.preventDefault();
        scrollCheckout();
      }
    };
    host.addEventListener("click", onClick);
    return () => host.removeEventListener("click", onClick);
  }, [bodyHtml]);

  useEffect(() => {
    const onScroll = () => {
      if (checkoutInView) {
        setStickyVisible(false);
        return;
      }
      setStickyVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [checkoutInView]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const checkoutEl = host.querySelector("#checkout");
    if (!checkoutEl) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setCheckoutInView(e.isIntersecting));
      },
      { threshold: 0.1 },
    );
    obs.observe(checkoutEl);
    return () => obs.disconnect();
  }, [bodyHtml]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const bar = host.querySelector("#stickyBar");
    if (!bar) return;
    if (stickyVisible) bar.classList.add("visible");
    else bar.classList.remove("visible");
  }, [stickyVisible, bodyHtml]);

  return (
    <div className="ibg-page-with-promo">
      <figure className="border-b border-white/10 bg-[#1a0a10] px-4 py-6 sm:px-6 sm:py-8">
        <Image
          src={PROMO_SRC}
          alt={PROMO_ALT}
          width={1024}
          height={682}
          className="mx-auto h-auto w-full max-w-5xl rounded-lg shadow-lg shadow-black/40"
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
      </figure>
      <div
        ref={hostRef}
        id="npa-ibg-sales"
        className="npa-ibg-sales-root -mx-4 pb-28 sm:-mx-6"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}

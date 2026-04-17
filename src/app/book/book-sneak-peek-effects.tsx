"use client";

import { useEffect } from "react";

/** Mirrors inline script from public/book/sneak-peek.html (smooth anchors + scroll reveals). */
export function BookSneakPeekEffects() {
  useEffect(() => {
    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", onAnchorClick);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal-item, .part-card, .who-card").forEach((el, i) => {
      const h = el as HTMLElement;
      h.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
      h.style.transform = "translateY(16px)";
      h.style.opacity = "0";
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.removeEventListener("click", onAnchorClick);
      });
      observer.disconnect();
    };
  }, []);

  return null;
}

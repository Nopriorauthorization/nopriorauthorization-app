"use client";

import { useCallback, useEffect, useState } from "react";

const SHARE_TEXT =
  "24 chapters — skin, lasers, injectables, hormones & wellness. Sneak peek: ";

const PDF_FILENAME = "HelloGorgeous-Book-Sneak-Peek.pdf";

export function BookShareToolbar() {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const copyLink = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, []);

  const share = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = "Hello Gorgeous — The Book (Sneak Peek)";
    try {
      if (navigator.share) {
        await navigator.share({ title, text: SHARE_TEXT, url });
        return;
      }
    } catch {
      /* user cancelled or share failed */
    }
    await copyLink();
  }, [copyLink]);

  const downloadPdf = useCallback(async () => {
    const root = document.getElementById("book-sneak-peek-root");
    if (!root) {
      window.alert("Could not find the page content to export.");
      return;
    }
    setDownloading(true);
    try {
      document.querySelectorAll(".reveal-item, .part-card, .who-card").forEach((node) => {
        const el = node as HTMLElement;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
      window.scrollTo(0, 0);
      await document.fonts.ready.catch(() => {});
      await new Promise((r) => setTimeout(r, 150));

      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [6, 6, 6, 6],
          filename: PDF_FILENAME,
          image: { type: "jpeg", quality: 0.92 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            scrollY: -window.scrollY,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"], avoid: [".hero", "section", "footer", ".page-mockup"] },
        })
        .from(root)
        .save();
    } catch (e) {
      console.error(e);
      window.alert(
        "Could not build the PDF in the browser. Use Print → Save as PDF instead (button below)."
      );
    } finally {
      setDownloading(false);
    }
  }, []);

  return (
    <div
      className="book-print-toolbar print:hidden fixed bottom-6 left-1/2 z-[100] flex w-[min(100vw-1.5rem,26rem)] -translate-x-1/2 flex-col gap-3 sm:left-auto sm:right-6 sm:translate-x-0 sm:items-end"
      role="region"
      aria-label="Share and export"
    >
      <div className="w-full rounded-sm border border-white/10 bg-[#0a0a0a]/95 px-3 py-2.5 text-[11px] leading-snug shadow-lg backdrop-blur-sm sm:max-w-[22rem]">
        <p className="mb-1 font-bold uppercase tracking-[0.12em] text-white/55">Post this link on social</p>
        <p className="select-all break-all font-mono text-[12px] text-[#e8a4bc]">{shareUrl || "…"}</p>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-sm border border-white/20 bg-[#0E0E0E]/90 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm transition hover:border-[#D4537E]/50 hover:bg-[#1A1A1A] sm:px-4"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={share}
          className="rounded-sm border border-[#D4537E]/40 bg-[#D4537E]/20 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-sm transition hover:bg-[#D4537E]/35 sm:px-4"
        >
          Share
        </button>
        <button
          type="button"
          disabled={downloading}
          onClick={downloadPdf}
          className="rounded-sm border border-[#D4537E] bg-[#D4537E] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg transition hover:bg-[#c04572] disabled:opacity-60 sm:px-4"
        >
          {downloading ? "Building PDF…" : "Download PDF"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-sm border border-white/15 bg-transparent px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70 shadow-lg transition hover:border-white/30 hover:text-white sm:px-4"
        >
          Print
        </button>
      </div>
    </div>
  );
}

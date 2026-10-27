"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollExperience() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      ".section-heading, .feature-copy, .about-copy, .quote-panel, .journal-home-inner, .connect-inner, .book-card, .journal-card, .journal-empty, .shelf-book, .shelf-stats"
    ));
    let observer: IntersectionObserver | undefined;
    if (!reduce && "IntersectionObserver" in window) {
      for (const target of targets) target.classList.add("motion-reveal");
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
      for (const target of targets) observer.observe(target);
      document.documentElement.classList.add("motion-ready");
    }

    let frame = 0;
    function updateProgress() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
        if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
        frame = 0;
      });
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove("motion-ready");
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (frame) cancelAnimationFrame(frame);
      for (const target of targets) { target.classList.remove("motion-reveal", "is-visible"); }
    };
  }, [pathname]);

  return <div ref={bar} className="reading-progress" aria-hidden="true"/>;
}

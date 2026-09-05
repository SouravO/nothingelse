"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LOGO_SELECTOR = 'header a[aria-label="Nothing Else — Home"]';
const BRAND_DEEP = "#0E1E42"; // darker navy, matches hero background — no color jump on reveal

function whenImageReady(img) {
  if (!img) return Promise.resolve();
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

export default function SiteIntro() {
  const bgRef = useRef(null);
  const titleRef = useRef(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (done) return;

    const navLogo = document.querySelector(NAV_LOGO_SELECTOR);
    const navImg = navLogo ? navLogo.querySelector("img") : null;

    // Hide the real navbar logo before the browser ever paints, so there's
    // zero chance of it flashing into view underneath the intro.
    if (navLogo) gsap.set(navLogo, { autoAlpha: 0 });

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    let tl;

    const start = () => {
      if (cancelled) return;

      // Measured only once both logo images are fully decoded and the
      // resulting layout has painted. An unloaded <img> reports a stale
      // box (wrong height, sometimes wrong position) — that stale box was
      // what made the traveling logo land next to, not on top of, the
      // real navbar logo.
      const target = (() => {
        if (!navLogo || !titleRef.current) return null;
        const rect = navLogo.getBoundingClientRect();
        const titleRect = titleRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height || !titleRect.width || !titleRect.height) return null;

        // Contain-fit: don't assume the two logo files share one exact
        // aspect ratio. Scaling by the tighter of the two axis-ratios
        // keeps the traveling mark inside the navbar slot instead of
        // overshooting it on one axis.
        const scale = Math.min(rect.width / titleRect.width, rect.height / titleRect.height);

        // Center-to-center delta, measured directly off both live rects —
        // no assumption that the traveling logo starts at window-center.
        return {
          x: rect.left + rect.width / 2 - (titleRect.left + titleRect.width / 2),
          y: rect.top + rect.height / 2 - (titleRect.top + titleRect.height / 2),
          scale,
        };
      })();

      tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          if (navLogo) gsap.set(navLogo, { autoAlpha: 1 });
          document.documentElement.style.overflow = prevOverflow;
          setDone(true);
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      )
        .to({}, { duration: 0.5 }) // hold, centered, before it travels
        .to(titleRef.current, {
          duration: 0.7,
          x: target ? target.x : 0,
          y: target ? target.y : 0,
          scale: target ? target.scale : 1,
          ease: "power3.inOut",
        })
        // The traveling logo stays fully opaque for the entire move, so it
        // arrives crisp — only once it's sitting exactly on top of the real
        // navbar logo do the two cross-dissolve into each other.
        .to(titleRef.current, { opacity: 0, duration: 0.28, ease: "power1.inOut" });

      if (navLogo) {
        tl.fromTo(
          navLogo,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.28, ease: "power1.inOut" },
          "<" // exactly in sync with the traveling logo's fade-out
        );
      }

      // The dark backdrop only starts clearing once the handoff is underway,
      // and finishes just after — so the rest of the page is never revealed
      // before the logo has actually landed in the navbar.
      tl.to(bgRef.current, { opacity: 0, duration: 0.4, ease: "power1.out" }, "<");
    };

    Promise.all([
      document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve(),
      whenImageReady(navImg),
      whenImageReady(titleRef.current),
    ]).then(() => {
      // Two rAFs: the first lets the browser flush the reflow triggered by
      // the image loads above, the second guarantees we measure a fully
      // painted frame rather than one mid-reflow.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) start();
        });
      });
    });

    return () => {
      cancelled = true;
      tl?.kill();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [done]);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: BRAND_DEEP }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          ref={titleRef}
          src="/Nothingelse White logo.png"
          alt="Nothing Else"
          className="h-auto w-[min(78vw,560px)] select-none pointer-events-none"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
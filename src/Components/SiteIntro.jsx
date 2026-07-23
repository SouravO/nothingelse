"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LOGO_SELECTOR = 'header a[aria-label="Nothing Else — Home"]';
const BRAND_DEEP = "#0E1E42"; // darker navy, matches hero background — no color jump on reveal
export default function SiteIntro() {
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    if (done) return;

    const navLogo = document.querySelector(NAV_LOGO_SELECTOR);

    // Hide the real navbar logo before the browser ever paints, so there's
    // zero chance of it flashing into view underneath the intro.
    if (navLogo) gsap.set(navLogo, { autoAlpha: 0 });

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    let cancelled = false;
    let tl;

    const start = () => {
      if (cancelled) return;

      const target = (() => {
        if (!navLogo || !titleRef.current) return null;
        const rect = navLogo.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - window.innerWidth / 2,
          y: rect.top + rect.height / 2 - window.innerHeight / 2,
          scale: rect.width / (titleRef.current.offsetWidth || 1),
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
        // Overlay only starts clearing once the title is essentially home,
        // and finishes exactly as it lands — no gap for the real logo
        // (or anything else on the page) to show through early.
        .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power1.out" }, "-=0.3");
    };

    // Wait for web fonts so the measured logo/title size is accurate —
    // otherwise a late font swap can make the title land in the wrong spot.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      tl?.kill();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
      style={{ backgroundColor: BRAND_DEEP }}
    >
      <h1
        ref={titleRef}
        className="font-display font-extrabold tracking-[-0.02em] whitespace-nowrap text-white select-none pointer-events-none"
        style={{ fontSize: "min(13vw, 140px)", opacity: 0 }}
      >
        nothing <span className="text-white/90">else</span>
        <span className="text-[#3B5BDB]">.</span>
      </h1>
    </div>
  );
}

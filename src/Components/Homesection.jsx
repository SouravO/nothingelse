import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Square } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   SECTION 1: HOME (HERO)
   ----------------------------------------------------------------------------
   Auto-playing product showcase (images/copy cycle on a timer, looping),
   with the cinematic "nothing else." pinned title-morph intro layered on
   top: giant wordmark shrinks and slides into the navbar's logo position as
   you scroll, then fades out to reveal the showcase running underneath.
   Looks up the Navbar's logo anchor by aria-label to compute the morph
   target, so this must render on the same page as <Navbar />.
   ============================================================================ */

const PRODUCT_IMAGES = ["/pdt1.png", "/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];

const SHOWCASE_DATA = [
  {
    eyebrow: "Pantry Essential",
    title: "Rice",
    description:
      "Single-origin grains, milled slowly for a cleaner, more consistent cook. Nothing added, nothing to hide.",
    button: "Shop Rice",
    image: PRODUCT_IMAGES[0],
  },
  {
    eyebrow: "Home Care",
    title: "Dishwash Liquid",
    description:
      "A concentrated citrus formula that cuts through grease without stripping your hands. Simple chemistry, done right.",
    button: "Shop Dishwash",
    image: PRODUCT_IMAGES[1],
  },
  {
    eyebrow: "Daily Staple",
    title: "Atta",
    description:
      "Stone-ground from whole wheat, keeping the bran and the flavor intact. Just flour, the way it should be.",
    button: "Shop Atta",
    image: PRODUCT_IMAGES[2],
  },
  {
    eyebrow: "Morning Ritual",
    title: "Black Tea",
    description:
      "Slow-oxidized leaves for a bold, malty cup, no blends, no shortcuts, no filler.",
    button: "Shop Black Tea",
    image: PRODUCT_IMAGES[3],
  },
  {
    eyebrow: "Hair Care",
    title: "Shampoo",
    description:
      "A gentle, sulfate-free wash built on exactly what your scalp needs, and not one ingredient more.",
    button: "Shop Shampoo",
    image: PRODUCT_IMAGES[4],
  },
];

const SHOWCASE_N = SHOWCASE_DATA.length;
const AUTO_ADVANCE_MS = 4000;

export default function HomeSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);

  const contentRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance the showcase — runs continuously, independent of the intro animation
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_N);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    // Guard against React StrictMode / hot-reload double-invoking this effect,
    // which otherwise leaves a stale ScrollTrigger pinned underneath the new one.
    ScrollTrigger.getById("home-pin")?.kill();

    const ctx = gsap.context(() => {
      // Prevent Flash of Unstyled Content (FOUC)
      gsap.set(contentRefs.current, { opacity: 0, y: 40 });
      gsap.set(titleRef.current, {
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        left: "50%",
        scale: 1,
        transformOrigin: "center center",
      });

      // Target the external Navbar logo to calculate bounds and crossfade
      const navLogo = document.querySelector('header a[aria-label="Nothing Else — Home"]');
      if (navLogo) {
        gsap.set(navLogo, { opacity: 0 }); // Hide actual nav logo initially
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "home-pin",
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%", // Total scroll distance (cinematic duration)
          scrub: 0.8,    // Smooth, slight lag for premium feel
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculate on window resize
        },
      });

      // Phase 1 (0-25%): Fade dark overlay slightly to hint at the showcase behind it
      tl.to(overlayRef.current, { opacity: 0.4, duration: 25, ease: "none" }, 0);

      // Phase 2 & 3 (25-75%): Morph giant title to navbar logo position
      tl.to(
        titleRef.current,
        {
          x: () => {
            if (!navLogo) return 0;
            const targetRect = navLogo.getBoundingClientRect();
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const startCenterX = window.innerWidth / 2;
            return targetCenterX - startCenterX;
          },
          y: () => {
            if (!navLogo) return 0;
            const targetRect = navLogo.getBoundingClientRect();
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const startCenterY = window.innerHeight / 2;
            return targetCenterY - startCenterY;
          },
          scale: () => {
            if (!navLogo) return 1;
            const targetRect = navLogo.getBoundingClientRect();
            const baseWidth = titleRef.current.offsetWidth;
            return targetRect.width / baseWidth;
          },
          duration: 50,
          ease: "power2.inOut",
        },
        25
      );

      // Phase 4 (60-85%): Reveal the showcase content behind the title
      tl.to(
        contentRefs.current,
        { opacity: 1, y: 0, duration: 25, stagger: 4, ease: "power2.out" },
        60
      );

      // Phase 5 (75-80%): Seamless crossfade into the permanent Navbar logo
      if (navLogo) {
        tl.to(titleRef.current, { opacity: 0, duration: 5, ease: "none" }, 75);
        tl.to(navLogo, { opacity: 1, duration: 5, ease: "none" }, 75);
      }

      // Phase 6 (80-95%): Clear the dark overlay fully so the showcase reads at full color
      tl.to(overlayRef.current, { opacity: 0, duration: 15, ease: "none" }, 80);

      // Safety net: fonts/images finishing late can shift layout after the
      // ScrollTrigger has already measured it, which is the #1 cause of a
      // pin that seems to "not work" (wrong start/end points). Re-measure
      // once everything has actually settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const raf = requestAnimationFrame(refresh);

      return () => {
        window.removeEventListener("load", refresh);
        cancelAnimationFrame(raf);
      };
    }, sectionRef);

    // Cleanup: restore nav logo visibility if hero unmounts
    return () => {
      ctx.revert();
      const navLogo = document.querySelector('header a[aria-label="Nothing Else — Home"]');
      if (navLogo) gsap.set(navLogo, { opacity: 1 });
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative bg-[#040A18]">
      {/* This container acts as our pinned viewport.
        It locks at 100vh while the ScrollTrigger scrubs the animation timeline.
      */}
      <div
        ref={containerRef}
        className="relative h-[100svh] w-full overflow-hidden"
        style={{ background: "radial-gradient(circle at 20% 50%, #2950F5 0%, #1E3FE0 60%, #152EAA 100%)" }}
      >
        {/* Subtle background noise overlay to break up flat digital colors */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* ELEGANT CIRCLE STAGE */}
        <div ref={addToRefs} className="absolute -right-[15%] top-[6%] w-[90%] sm:w-[70%] md:w-[52%] aspect-square">

          {/* Accent Rings */}
          <motion.div
            className="absolute -top-4 -left-10 w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md"
            animate={{ y: [0, -12, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </motion.div>

          {/* Premium Soft-Gradient Circle */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white to-blue-50/95"
            style={{
              boxShadow: "0 30px 80px rgba(0,0,0,0.15), inset 0 0 40px rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.6)"
            }}
          />
          {/* Inner decorative rim for an editorial touch */}
          <div className="absolute inset-6 rounded-full border border-blue-200/40 pointer-events-none" />

          {/* Floating Glass element */}
          <motion.div
            className="absolute bottom-12 right-12 w-24 h-24 rounded-3xl bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center shadow-xl"
            animate={{ rotate: [12, -5, 12], y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotate: 12 }}
          >
            <span className="w-8 h-8 rounded-full border-[1.5px] border-white/60" />
          </motion.div>
        </div>

        {/* Vertical filmstrip column — Product Images */}
        <div ref={addToRefs} className="relative z-10 w-full h-[280px] sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ height: `${SHOWCASE_N * 100}%` }}
            animate={{ y: `-${activeIndex * (100 / SHOWCASE_N)}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {SHOWCASE_DATA.map((item, i) => (
              <div
                key={i}
                className="w-full flex items-center justify-center"
                style={{ height: `${100 / SHOWCASE_N}%` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[68%] sm:h-[72%] md:h-[78%] object-contain mt-10 md:mt-0"
                  style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))" }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* PREMIUM TEXT PANEL */}
        <div ref={addToRefs} className="relative z-20 h-[calc(100%-280px)] sm:h-[calc(100%-340px)] md:h-full flex items-center">
          <div className="mx-auto max-w-[1280px] w-full px-6 sm:px-12">
            <div className="max-w-xl md:pl-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >

                  {/* Styled Eyebrow Badge instead of raw text */}
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="font-mono font-semibold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white">
                      0{activeIndex + 1} &mdash; {SHOWCASE_DATA[activeIndex].eyebrow}
                    </span>
                  </div>

                  {/* High-end gradient title */}
                  <h2 className="font-head font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-blue-200 text-6xl sm:text-7xl lg:text-8xl leading-[1] tracking-tighter mb-6">
                    {SHOWCASE_DATA[activeIndex].title}
                  </h2>

                  {/* Softened body text for better contrast harmony */}
                  <p className="font-body text-lg sm:text-xl text-blue-50/80 font-light mb-10 leading-relaxed max-w-md">
                    {SHOWCASE_DATA[activeIndex].description}
                  </p>

                  {/* Elevated Button with hover dynamics */}
                  <button
                    className="group flex items-center gap-4 bg-white hover:bg-blue-50 text-[#1E3FE0] px-8 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1"
                  >
                    <span>{SHOWCASE_DATA[activeIndex].button}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Elegant Side Progress Indicators */}
        <div ref={addToRefs} className="hidden md:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-30">
          {SHOWCASE_DATA.map((_, i) => (
            <div key={i} className="flex items-center justify-center w-4 h-4">
              <span
                className="rounded-full transition-all duration-500 ease-out"
                style={{
                  width: i === activeIndex ? "12px" : "6px",
                  height: i === activeIndex ? "12px" : "6px",
                  background: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.3)",
                  boxShadow: i === activeIndex ? "0 0 15px rgba(255,255,255,0.5)" : "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Cinematic Dark Overlay — covers the showcase at the start, fades away on scroll */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#040A18] opacity-[0.98] pointer-events-none z-40"
        />

        {/* The Giant Morphing Title (Standalone Layer) */}
        <h1
          ref={titleRef}
          className="fixed z-[105] font-display font-extrabold tracking-[-0.02em] whitespace-nowrap pointer-events-none text-white select-none"
          style={{ fontSize: "min(13vw, 140px)" }}
        >
          nothing <span className="text-white/95">else</span><span className="text-[#0C4DD5]">.</span>
        </h1>
      </div>

      {/* Marquee Strip (Sits below the pinned section) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#040A18] overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-[homeMarquee_20s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-extrabold text-[12px] sm:text-[13px] tracking-[0.28em] uppercase mx-6 flex items-center gap-6 text-white/60"
            >
              Blue first <Square size={7} className="fill-white/30" />
              Product second <Square size={7} className="fill-white/30" />
              Nothing else <Square size={7} className="fill-white/30" />
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes homeMarquee { from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
      `}</style>
    </section>
  );
}
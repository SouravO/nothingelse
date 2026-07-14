import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight, Square } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   SECTION 1: HOME (HERO)
   ----------------------------------------------------------------------------
   The original cinematic hero: same layers, same pinned title-morph scroll
   timeline (giant "nothing else." wordmark shrinks and slides into the
   navbar's logo position as you scroll), same copy. Note: this section
   still looks up the Navbar's logo anchor in the DOM by aria-label to
   compute the morph target, so it must be rendered on the same page as
   <Navbar />.
   ============================================================================ */

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function handleAnchorClick(e, id) {
  e.preventDefault();
  scrollToSection(id);
}

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

  const heroWords = "Just the product.".split(" ");
  const heroWords2 = "Nothing else.".split(" ");

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

      // Phase 1 (0-25%): Fade dark overlay to reveal background
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

      // Phase 4 (65-90%): Reveal standard hero content behind the title
      tl.to(
        contentRefs.current,
        { opacity: 1, y: 0, duration: 25, stagger: 4, ease: "power2.out" },
        60
      );

      // Phase 4 (75-80%): Seamless crossfade into the permanent Navbar logo
      if (navLogo) {
        tl.to(titleRef.current, { opacity: 0, duration: 5, ease: "none" }, 75);
        tl.to(navLogo, { opacity: 1, duration: 5, ease: "none" }, 75);
      }

      // Safety net: fonts/images finishing late can shift layout after the
      // ScrollTrigger has already measured it, which is the #1 cause of a
      // pin that seems to "not work" (wrong start/end points). Re-measure
      // once everything has actually settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const bgImg = sectionRef.current?.querySelector("img");
      if (bgImg && !bgImg.complete) bgImg.addEventListener("load", refresh);
      const raf = requestAnimationFrame(refresh);

      return () => {
        window.removeEventListener("load", refresh);
        if (bgImg) bgImg.removeEventListener("load", refresh);
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
    <section id="home" ref={sectionRef} className="relative bg-black">
      {/* This container acts as our pinned viewport.
        It locks at 100vh while the ScrollTrigger scrubs the animation timeline.
      */}
      <div ref={containerRef} className="relative h-[100svh] w-full overflow-hidden">

        {/* Fullscreen Background Image */}
        <img
          src="https://picsum.photos/seed/nothingelse-hero/1920/1080"
          alt="Premium FMCG Products"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Cinematic Dark Overlay (Fades slightly, never fully leaves to maintain text contrast) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#040A18] opacity-[0.98] pointer-events-none z-10"
        />

        {/* The Giant Morphing Title (Standalone Layer) */}
        <h1
          ref={titleRef}
          className="fixed z-[105] font-display font-extrabold tracking-[-0.02em] whitespace-nowrap pointer-events-none text-white select-none"
          style={{ fontSize: "min(13vw, 140px)" }}
        >
          nothing <span className="text-white/95">else</span><span className="text-[#0C4DD5]">.</span>
        </h1>

        {/* Standard Hero Content (Revealed during scroll) */}
        <div className="relative z-20 w-full h-full mx-auto max-w-[1280px] px-5 sm:px-8 pb-16 pt-[140px] flex flex-col justify-end">

          <div ref={addToRefs} className="inline-flex self-start items-center gap-2 rounded-full bg-white/10 border border-white/25 px-4 py-2 mb-6 backdrop-blur-md">
            <Square size={9} className="fill-white text-white" />
            <span className="font-body text-[13px] sm:text-[14px] text-white/90">
              Good everyday products. Honest pricing, Nothing else.
            </span>
          </div>

          <h1 ref={addToRefs} className="font-head font-bold text-white text-[11vw] sm:text-[8vw] lg:text-[5.5vw] leading-[1] tracking-[-0.03em] max-w-4xl">
            <span className="block overflow-hidden">
              {heroWords.map((w, i) => (
                <span key={i} className="inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden font-display italic text-white/80">
              {heroWords2.map((w, i) => (
                <span key={i} className="inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <p ref={addToRefs} className="mt-6 max-w-xl text-white/80 text-[16px] sm:text-[18px] leading-relaxed font-body">
            A minimal FMCG brand built to make everyday buying simpler, clearer and more honest.
          </p>

          <div ref={addToRefs} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#products"
              onClick={(e) => handleAnchorClick(e, "products")}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-[#0A3FB0] px-7 py-3.5 font-body font-semibold text-[15px] hover:bg-[#111111] hover:text-white transition-colors duration-300"
            >
              See the products
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#about"
              onClick={(e) => handleAnchorClick(e, "about")}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-body font-semibold text-[15px] text-white hover:bg-white/10 transition-colors duration-300"
            >
              Our story
            </a>
          </div>
        </div>
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
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const BRAND = {
  deep: "#101F7A", base: "#1E3FE0", bright: "#2950F5",
  ice: "#DCE6FF", gold: "#D9A84A", goldLight: "#F3CE7C", goldGlow: "#FFEFC7",
};

const EASE = [0.16, 1, 0.3, 1];

// Per-slide content: image, wordmark label, tags, description, bg/spotlight theme.
const SLIDES = [
  {
    image: "/pdt2.png",
    label: ["DAILY GLOW", "SHAMPOO"],
    tags: ["Sulfate-Free", "Deep Nourish", "Salon Shine", "pH Balanced", "Frizz Control"],
    description: "A weightless lather that rinses clean and leaves hair soft and easy to manage — every single wash.",
    theme: {
      bg: "radial-gradient(130% 100% at 50% -10%, #24469E 0%, #102668 42%, #060D33 100%)",
      spotlight: "rgba(200,220,255,0.42)",
    },
  },
  {
    image: "/pdt3.png",
    label: ["GOLDEN", "HARVEST RICE"],
    tags: ["Long Grain", "Naturally Aged", "Non-Sticky", "Farm Sourced", "Fluffy Texture"],
    description: "Slow-aged for a fluffier bite and a cleaner aroma — everyday rice that makes every meal feel special.",
    theme: {
      bg: "radial-gradient(130% 100% at 50% -10%, #1B2454 0%, #101A42 45%, #05060F 100%)",
      spotlight: "rgba(243,206,124,0.48)",
    },
  },
  {
    image: "/pdt4.png",
    label: ["POWER CLEAN", "DETERGENT"],
    tags: ["Stain Lift", "Fresh Rinse", "Fabric Safe", "Low Suds", "Skin Gentle"],
    description: "Tough on stains, gentle on fabric — a wash that gets clothes properly clean without harsh trade-offs.",
    theme: {
      bg: "radial-gradient(130% 100% at 50% -10%, #3358D6 0%, #16337F 42%, #060B2E 100%)",
      spotlight: "rgba(222,232,255,0.5)",
    },
  },
  {
    image: "/pdt5.png",
    label: ["EVERYDAY", "MASALA MIX"],
    tags: ["Stone Ground", "No Fillers", "Bold Aroma", "Small Batch", "Vibrant Color"],
    description: "A balanced blend ground the old way — real spice and real aroma, nothing added to cut corners.",
    theme: {
      bg: "radial-gradient(130% 100% at 50% -10%, #0E1638 0%, #080B22 45%, #030309 100%)",
      spotlight: "rgba(217,168,74,0.34)",
    },
  },
];

// Floating-tag base position (cqw = % of stage width) + inward collapse travel distance.
const TAG_LAYOUT = [
  { top: "5%", left: "1%", travelX: "30cqw", travelY: "26cqw" },
  { top: "30%", left: "-3%", travelX: "38cqw", travelY: "6cqw" },
  { top: "58%", left: "3%", travelX: "26cqw", travelY: "-12cqw" },
  { top: "14%", right: "0%", travelX: "-30cqw", travelY: "20cqw" },
  { top: "44%", right: "-3%", travelX: "-38cqw", travelY: "-4cqw" },
];

// Timing: HOLD_MS visible -> TRANSITION_MS slide push -> next slide.
// Tags run on their own clock (in after TAGS_IN_DELAY, out before slide ends).
const HOLD_MS = 3600;
const TRANSITION_MS = 900;
const TAGS_IN_DELAY = 620;
const TAGS_OUT_BEFORE_END = 950;

// Background panel push: leads content by CONTENT_SLIDE_DELAY.
const BG_SLIDE_TRANSITION = { duration: 0.72, ease: EASE };
const CONTENT_SLIDE_DELAY = 0.15;
const CONTENT_SLIDE_TRANSITION = { duration: 0.65, delay: CONTENT_SLIDE_DELAY, ease: EASE };
const SNAP = { duration: 0 };

// Subtle film-grain texture (data-URI SVG turbulence).
const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// Current + next slide bg are full-bleed flat panels; next sits parked off-
// screen right until transition, when both translate together (a real push).
function SlideBackgrounds({ activeIndex, phase }) {
  const nextIndex = (activeIndex + 1) % SLIDES.length;
  const isTransitioning = phase === "transitioning";
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{ background: SLIDES[activeIndex].theme.bg }}
        initial={false}
        animate={{ x: isTransitioning ? "-100%" : "0%" }}
        transition={isTransitioning ? BG_SLIDE_TRANSITION : SNAP}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: SLIDES[nextIndex].theme.bg }}
        initial={false}
        animate={{ x: isTransitioning ? "0%" : "100%" }}
        transition={isTransitioning ? BG_SLIDE_TRANSITION : SNAP}
      />
    </div>
  );
}

// Directional glow behind the stage, screen-blended so it only brightens.
function SpotlightGlow({ activeIndex }) {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none" style={{ mixBlendMode: "screen" }} aria-hidden="true">
      {SLIDES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ background: `radial-gradient(46% 42% at 50% 56%, ${s.theme.spotlight}, transparent 72%)` }}
          animate={{ opacity: i === activeIndex ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE }}
        />
      ))}
    </div>
  );
}

function GrainOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[45]" style={{ backgroundImage: NOISE_BG, opacity: 0.045, mixBlendMode: "overlay" }} aria-hidden="true" />
  );
}

function Vignette() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[7]" style={{ background: "radial-gradient(ellipse 78% 68% at 50% 42%, transparent 55%, rgba(0,0,0,0.48) 100%)" }} aria-hidden="true" />
  );
}

function FloorGlow() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "linear-gradient(to top, rgba(2,5,20,0.55) 0%, rgba(2,5,20,0.26) 24%, transparent 48%)" }} aria-hidden="true" />
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[2]"
        style={{ bottom: "-30%", width: "150%", aspectRatio: "3 / 1", borderRadius: "9999px", filter: "blur(90px)", background: "radial-gradient(ellipse at center, rgba(217,168,74,0.22), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-[2]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }} aria-hidden="true" />
    </>
  );
}

function AmbientDust() {
  const particles = [
    { size: 8, top: "70%", left: "10%", delay: 0, dur: 11, gold: false },
    { size: 4, top: "85%", left: "30%", delay: 1.6, dur: 14, gold: false },
    { size: 10, top: "60%", left: "92%", delay: 0.8, dur: 10, gold: true },
    { size: 5, top: "78%", left: "60%", delay: 2.4, dur: 13, gold: false },
    { size: 6, top: "90%", left: "78%", delay: 1.2, dur: 12, gold: false },
    { size: 9, top: "65%", left: "42%", delay: 3.1, dur: 10.5, gold: true },
    { size: 4, top: "94%", left: "18%", delay: 0.4, dur: 15, gold: false },
    { size: 7, top: "55%", left: "20%", delay: 2.0, dur: 11.5, gold: false },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[3]" aria-hidden="true">
      {particles.map((p, i) => {
        const blur = Math.max(0, 3 - p.size * 0.3);
        const peakOpacity = 0.25 + (p.size / 10) * 0.45;
        const color = p.gold ? "#F3CE7C" : "#AFC7FF";
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size, top: p.top, left: p.left,
              background: `radial-gradient(circle, #ffffff 0%, ${color} 65%, transparent 100%)`,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 ${p.size * 1.8}px rgba(${p.gold ? "243,206,124" : "175,199,255"},0.4)`,
            }}
            animate={{ y: [0, -140 - p.size * 6], opacity: [0, peakOpacity, peakOpacity, 0], x: [0, i % 2 === 0 ? 10 : -10] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay, times: [0, 0.15, 0.8, 1] }}
          />
        );
      })}
    </div>
  );
}

function HeroCTA() {
  return (
    <motion.a
      href="#products"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.32, ease: EASE }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-body font-medium text-[15px] text-[#0B1B5C] shadow-[0_10px_36px_rgba(217,168,74,0.4)]"
      style={{ background: `linear-gradient(135deg, ${BRAND.goldLight}, ${BRAND.gold})` }}
    >
      Explore the range
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#0B1B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
  );
}

function HeroHeadline() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');
        .hero-title-font { font-family: 'Bricolage Grotesque', sans-serif; font-optical-sizing: auto; }
        .hero-wordmark-font { font-family: 'Baloo 2', sans-serif; }
        .hero-line-1 { font-size: clamp(1.6rem, 5.4vw, 2.3rem); letter-spacing: -0.01em; }
      `}</style>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="hero-title-font hero-line-1 font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#AFC7FF]"
        style={{ textShadow: "0 0 60px rgba(175,199,255,0.45)" }}
      >
        Good everyday products. Honest pricing.
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 0.8, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
        className="w-14 h-[3px] rounded-full mt-4"
        style={{ background: `linear-gradient(90deg, transparent, ${BRAND.gold}, transparent)` }}
      />
    </div>
  );
}

// Description fade below the stage — separate element, not part of the push.
const descVariants = {
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, delay: 0.32, ease: EASE } },
  transitioning: { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.3, ease: "easeIn" } },
};

// Product on a pointer-tilt stage; slide push itself is handled by SlideContent.
// Anchored bottom with pb-[1%] so there's clear space above for the wordmark.
function ProductStage({ slide }) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -5, ry: px * 7 });
  };
  const handleLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div ref={wrapRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className="absolute inset-0 flex items-end justify-center pb-[1%]" style={{ perspective: 1200 }}>
      <div style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d" }}>
        <img
          src={slide.image}
          alt="Product"
          className="relative z-10 w-auto object-contain"
          style={{
            // cqh keeps a consistent clear band above the product across aspect ratios
            height: "clamp(180px, 46cqh, 460px)",
            filter: "drop-shadow(0 24px 26px rgba(0,0,0,0.4))",
          }}
        />
      </div>
    </div>
  );
}

// Tags pulse in/out on their own visibility clock (see TAGS_IN_DELAY / TAGS_OUT_BEFORE_END).
function FloatingTag({ text, layout, index, visible }) {
  const tagVariants = {
    shown: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 0.55, delay: 0.1 + index * 0.09, ease: EASE } },
    hidden: { opacity: 0, scale: 0.25, x: layout.travelX, y: layout.travelY, transition: { duration: 0.4, delay: index * 0.05, ease: "easeIn" } },
  };

  return (
    <motion.div className="absolute z-20" style={{ top: layout.top, left: layout.left, right: layout.right }} initial={false} animate={visible ? "shown" : "hidden"} variants={tagVariants}>
      {/* idle bob loops independently, separate from the visibility transform */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}>
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-white whitespace-nowrap shadow-[0_8px_22px_rgba(0,0,0,0.4)]"
          style={{ background: "linear-gradient(135deg, rgba(20,34,120,0.94), rgba(8,15,58,0.97))", border: "1px solid rgba(255,255,255,0.16)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: index % 2 === 0 ? BRAND.gold : BRAND.ice }} />
          {text}
        </span>
      </motion.div>
    </motion.div>
  );
}

// Wordmark + tags + shadow + product, all as one moving container so they
// push left/in together as a rigid unit in sync with the background.
function SlideContent({ slide, slideIndex, xTo, phase, tagsVisible }) {
  return (
    <motion.div className="absolute inset-0" initial={false} animate={{ x: xTo }} transition={phase === "transitioning" ? CONTENT_SLIDE_TRANSITION : SNAP}>
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center z-0 px-4 pt-[7%] pointer-events-none select-none">
        {slide.label.map((line, i) => (
          <span
            key={i}
            className="hero-wordmark-font font-extrabold uppercase leading-[0.98] tracking-tight"
            style={{
              fontSize: "clamp(2rem, 11cqw, 4.8rem)",
              backgroundImage: slideIndex % 2 === 0 ? `linear-gradient(135deg, #ffffff, ${BRAND.ice})` : `linear-gradient(135deg, ${BRAND.goldLight}, ${BRAND.gold})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: slideIndex % 2 === 0 ? "0 0 70px rgba(175,199,255,0.5)" : "0 0 70px rgba(217,168,74,0.5)",
            }}
          >
            {line}
          </span>
        ))}
      </div>

      {slide.tags.map((tag, i) => (
        <FloatingTag key={i} text={tag} layout={TAG_LAYOUT[i]} index={i} visible={tagsVisible} />
      ))}

      <div
        className="absolute left-1/2 -translate-x-1/2 z-[9] rounded-full blur-2xl pointer-events-none"
        style={{ bottom: "4%", width: "34%", height: "6%", background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 72%)" }}
      />

      <ProductStage slide={slide} />
    </motion.div>
  );
}

// Current + next slide each get their own SlideContent layer, pushed in sync
// with the background panels behind them.
function AnimatedStage({ activeIndex, phase, tagsVisible }) {
  const nextIndex = (activeIndex + 1) % SLIDES.length;
  const isTransitioning = phase === "transitioning";
  const currentTagsVisible = tagsVisible && !isTransitioning;

  return (
    <div className="relative w-full max-w-[820px] aspect-[3/4] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden" style={{ containerType: "inline-size" }}>
      <SpotlightGlow activeIndex={activeIndex} />
      <AmbientDust />
      <SlideContent slide={SLIDES[activeIndex]} slideIndex={activeIndex} xTo={isTransitioning ? "-100%" : "0%"} phase={phase} tagsVisible={currentTagsVisible} />
      <SlideContent slide={SLIDES[nextIndex]} slideIndex={nextIndex} xTo={isTransitioning ? "0%" : "100%"} phase={phase} tagsVisible={false} />
    </div>
  );
}

export default function ProductShowcase() {
  const [showcaseState, setShowcaseState] = useState({ activeIndex: 0, phase: "visible" });
  const [tagsVisible, setTagsVisible] = useState(false);
  const { activeIndex, phase } = showcaseState;

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    setTagsVisible(false);
    const showTags = setTimeout(() => setTagsVisible(true), TAGS_IN_DELAY);
    const hideTags = setTimeout(() => setTagsVisible(false), Math.max(TAGS_IN_DELAY + 400, HOLD_MS - TAGS_OUT_BEFORE_END));
    const startTransition = setTimeout(() => {
      setShowcaseState((current) => ({ ...current, phase: "transitioning" }));
    }, HOLD_MS);
    const advanceSlide = setTimeout(() => {
      setShowcaseState((current) => ({ activeIndex: (current.activeIndex + 1) % SLIDES.length, phase: "visible" }));
    }, HOLD_MS + TRANSITION_MS);

    return () => {
      clearTimeout(showTags);
      clearTimeout(hideTags);
      clearTimeout(startTransition);
      clearTimeout(advanceSlide);
    };
  }, [activeIndex]);

  const slide = SLIDES[activeIndex];

  return (
    <section id="hero" className="relative min-h-[100svh] md:h-screen w-full overflow-hidden flex flex-col" style={{ backgroundColor: BRAND.deep }}>
      <SlideBackgrounds activeIndex={activeIndex} phase={phase} />
      <FloorGlow />
      <Vignette />
      <GrainOverlay />

      <div className="relative z-20 flex flex-col items-center gap-1 pt-10 sm:pt-12 px-6">
        <div className="mt-4">
          <HeroHeadline />
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 pt-10 pb-4 sm:pt-12">
        <AnimatedStage activeIndex={activeIndex} phase={phase} tagsVisible={tagsVisible} />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center gap-5 px-6 pb-10 sm:pb-12">
        <motion.p className="font-body text-base sm:text-lg text-white font-light leading-relaxed max-w-lg" initial={false} animate={phase} variants={descVariants}>
          {slide.description}
        </motion.p>

        <HeroCTA />

        <div className="flex items-center gap-2 pt-1" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: i === activeIndex ? 22 : 8, background: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.3)", boxShadow: i === activeIndex ? "0 0 10px rgba(255,255,255,0.6)" : "none" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
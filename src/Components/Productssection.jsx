import { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";

/* ============================================================================
   SECTION 3: PRODUCTS  — UNTOUCHED, exactly as before.
   ============================================================================ */

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const PRODUCT_IMAGES = ["/pdt1.png", "/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];

const PERIOD = PRODUCT_IMAGES.length;
const CYCLES = 12;
const TOTAL = PERIOD * CYCLES;
const RESET_AT = TOTAL - PERIOD * 2;
const RESET_TO = PERIOD * 2;
const STEP_MS = 2000;
const TRANSITION_MS = 850;

const ITEM_WIDTH = 270;
const GAP = -20;
const SLOT = ITEM_WIDTH + GAP;

function ProductSlide({ src, distance, instant, isHovered, onEnter, onLeave }) {
  const d = Math.min(distance, 3);
  const baseScale = d === 0 ? 1.15 : d === 1 ? 1.02 : d === 2 ? 0.92 : 0.84;
  const baseOpacity = d === 0 ? 1 : d === 1 ? 0.95 : d === 2 ? 0.88 : 0.8;
  const isCenter = distance === 0;
  const scale = baseScale;
  const opacity = isHovered ? 1 : baseOpacity;
  const zIndex = isHovered ? 50 : isCenter ? 30 : 10;
  const transition = instant
    ? "none"
    : "transform 700ms cubic-bezier(0.65,0,0.35,1), opacity 700ms ease-out";

  return (
    <div
      className="flex-none flex items-end justify-center h-[380px] sm:h-[480px] lg:h-[580px] cursor-pointer"
      style={{ width: ITEM_WIDTH, marginRight: GAP }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div style={{ width: ITEM_WIDTH, transform: `scale(${scale})`, transformOrigin: "bottom center", opacity, zIndex, transition }}>
        <div className="relative flex items-end justify-center">
          <div
            className="absolute bottom-2 h-11 w-28 rounded-full bg-white/10 blur-xl"
            style={{ opacity: isCenter || isHovered ? 0.9 : 0.35 }}
          />
          <img
            src={src}
            alt=""
            draggable={false}
            className="relative w-full h-[360px] sm:h-[460px] lg:h-[560px] object-contain"
            style={{
              filter:
                isCenter || isHovered
                  ? "drop-shadow(0 22px 30px rgba(0,0,0,0.65)) brightness(1.05)"
                  : "drop-shadow(0 10px 14px rgba(0,0,0,0.5)) brightness(0.92)",
              transition: "filter 260ms ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ProductCarousel() {
  const [step, setStep] = useState(RESET_TO);
  const [instant, setInstant] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (hovered !== null) return;
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(id);
  }, [hovered]);

  useEffect(() => {
    if (step !== RESET_AT) return;
    const t = setTimeout(() => {
      setInstant(true);
      setStep(RESET_TO);
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    }, TRANSITION_MS + 60);
    return () => clearTimeout(t);
  }, [step]);

  const trackX = `calc(50% - ${ITEM_WIDTH / 2}px - ${step * SLOT}px)`;

  return (
    <div className="relative w-full overflow-hidden">
      <ul className="sr-only">
        {PRODUCT_IMAGES.map((_, i) => (
          <li key={i}>Product photo {i + 1}</li>
        ))}
      </ul>
      <div
        className="flex items-end"
        aria-hidden="true"
        style={{
          transform: `translateX(${trackX})`,
          transition: instant ? "none" : `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)`,
        }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <ProductSlide
            key={i}
            src={PRODUCT_IMAGES[i % PERIOD]}
            distance={Math.abs(i - step)}
            instant={instant}
            isHovered={hovered === i}
            onEnter={() => setHovered(i)}
            onLeave={() => setHovered((h) => (h === i ? null : h))}
          />
        ))}
      </div>
    </div>
  );
}

export function ProductsSection() {
  return (
    <section id="products" className="relative bg-black scroll-mt-[68px] sm:scroll-mt-[76px] pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#5C8DFF] mb-3">
            Products
          </p>
          <h2 className="font-head font-bold text-white text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] uppercase mb-0 max-w-xl">
            Blue first. Product second. Nothing else.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative left-1/2 -translate-x-1/2 w-screen">
          <ProductCarousel />
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================================
   SECTION 4: SCROLL-DRIVEN PRODUCT SHOWCASE  — REDESIGNED
   ----------------------------------------------------------------------------
   Concept: "The Pour." Everything the brand promises — single-origin rice,
   concentrated dishwash liquid, stone-ground atta, slow-oxidized tea,
   sulfate-free shampoo — comes down to one honest gesture: pouring a pure
   ingredient out with nothing else added. That idea now runs through the
   whole section instead of sitting on a flat gradient:

   - WaveField: a soft poured-wave backdrop with fine contour lines, echoing
     the reference image but reframed as "flow" rather than pure decoration.
   - The product stage is an organic, gently breathing pool (not a static
     circle) that a droplet trails into on a loop — the section's one
     signature beat, kept singular and quiet everywhere else.
   - The corner labels reuse real copy ("Nothing else.") and a real count
     (SHOWCASE_N) instead of invented text.
   - The side index is a rising level gauge instead of plain dots — the same
     positional information, but it reads as "filling up," reinforcing the
     pour idea rather than decorating for its own sake.

   All scroll math, state, refs and data props are unchanged from the
   original — only markup/visual styling was touched.
   ============================================================================ */

const BRAND = {
  deep: "#101F7A",
  base: "#1E3FE0",
  bright: "#2950F5",
  ice: "#DCE6FF",
};

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
const HOLD_FRACTION = 0.62;
const SEG = 1 / (SHOWCASE_N - 1);

/* Poured-wave backdrop: one soft filled sweep + two fine contour lines,
   directly inspired by the reference image but adapted to a full-bleed
   landscape stage. */
function WaveField() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BRAND.bright} stopOpacity="0.45" />
          <stop offset="100%" stopColor={BRAND.deep} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M-100,340 C 260,180 480,520 800,380 C 1120,250 1320,540 1750,400 L1750,-100 L-100,-100 Z"
        fill="url(#waveFade)"
      />
      <path
        d="M-100,540 C 300,400 520,660 860,510 C 1150,380 1350,610 1750,490"
        fill="none"
        stroke={BRAND.ice}
        strokeOpacity="0.16"
        strokeWidth="1.5"
      />
      <path
        d="M-100,600 C 320,470 540,710 880,570 C 1160,440 1360,670 1750,550"
        fill="none"
        stroke={BRAND.ice}
        strokeOpacity="0.1"
        strokeWidth="1"
      />
    </svg>
  );
}

/* A droplet trailing down a curved line into the stage, rippling on
   impact — the section's single signature moment. Ambient/looping,
   independent of scroll position. */
function PourDrop() {
  return (
    <div className="absolute -top-[12%] left-[34%] w-[10%] h-[24%] hidden sm:block pointer-events-none">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 40 140" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pourStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path d="M20,0 C8,35 32,70 16,110" fill="none" stroke="url(#pourStroke)" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <motion.span
        className="absolute left-1/2 top-0 w-[6px] h-[6px] -ml-[3px] rounded-full bg-white"
        style={{ boxShadow: "0 0 8px rgba(255,255,255,0.9)" }}
        animate={{ top: ["0%", "82%"], opacity: [0, 1, 1, 0], x: [0, -5, 4, -2] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeIn", times: [0, 0.15, 0.85, 1] }}
      />
      <motion.span
        className="absolute left-1/2 top-[82%] -ml-[5px] w-[10px] h-[10px] rounded-full border border-white/70"
        animate={{ scale: [0.4, 2.6], opacity: [0.8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}

export function ProductShowcase() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  const { times, values } = useMemo(() => {
    const times = [0];
    const values = [`0%`];
    for (let m = 0; m < SHOWCASE_N - 1; m++) {
      const segStart = m * SEG;
      const holdEnd = segStart + HOLD_FRACTION * SEG;
      const segEnd = segStart + SEG;
      const yFrom = `-${(m / SHOWCASE_N) * 100}%`;
      const yTo = `-${((m + 1) / SHOWCASE_N) * 100}%`;
      times.push(holdEnd);
      values.push(yFrom);
      times.push(segEnd);
      values.push(yTo);
    }
    return { times, values };
  }, []);

  const trackY = useTransform(smoothProgress, times, values);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const idx = Math.max(0, Math.min(SHOWCASE_N - 1, Math.floor(latest / SEG)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  const blobRadii = [
    "63% 37% 54% 46% / 43% 47% 53% 57%",
    "48% 52% 63% 37% / 57% 43% 57% 43%",
    "63% 37% 54% 46% / 43% 47% 53% 57%",
  ];

  return (
    <section
      ref={containerRef}
      className="relative h-[600vh]"
      style={{
        background: `radial-gradient(circle at 18% 18%, ${BRAND.bright} 0%, ${BRAND.base} 48%, ${BRAND.deep} 100%)`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Poured-wave backdrop */}
        <WaveField />

        {/* Grounding vignette for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 25% 100%, rgba(0,0,0,0.28), transparent 60%)" }}
        />

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* Corner label — brand line, reused verbatim from the packaging */}
        <div className="hidden sm:flex absolute top-6 left-6 md:top-8 md:left-10 z-30 items-center gap-3">
          <span className="w-6 h-px bg-white/40" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
            Nothing else.
          </span>
        </div>

        {/* Corner label — real product count, not invented copy */}
        <div className="hidden sm:flex absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
            {String(SHOWCASE_N).padStart(2, "0")} staples — zero fillers
          </span>
          <span className="w-6 h-px bg-white/30" />
        </div>

        {/* Oversized index watermark, fills the empty lower-left field */}
        <div
          className="hidden md:block absolute left-6 lg:left-12 bottom-0 z-0 overflow-hidden pointer-events-none select-none"
          style={{ width: "45%", height: "60%" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.05, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-head font-black text-white leading-none absolute bottom-0 left-0 whitespace-nowrap"
              style={{ fontSize: "min(28vw, 380px)" }}
            >
              0{activeIndex + 1}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* PRODUCT STAGE */}
        <div className="absolute -right-[15%] top-[6%] w-[90%] sm:w-[70%] md:w-[52%] aspect-square">

          {/* Accent ring */}
          <motion.div
            className="absolute -top-4 -left-10 w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md"
            animate={{ y: [0, -12, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </motion.div>

          {/* Organic, gently breathing pool — replaces the flat circle */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-white to-blue-50/95"
            animate={{ borderRadius: blobRadii }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: "0 30px 80px rgba(0,0,0,0.15), inset 0 0 40px rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.6)",
            }}
          />
          {/* Inner rim, synced to the same breathing shape */}
          <motion.div
            className="absolute inset-6 border border-blue-200/40 pointer-events-none"
            animate={{ borderRadius: blobRadii }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Droplet trailing into the pool */}
          <PourDrop />

          {/* Floating glass chip */}
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
        <div className="relative z-10 w-full h-[280px] sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ height: `${SHOWCASE_N * 100}%`, y: trackY }}
          >
            {SHOWCASE_DATA.map((item, i) => (
              <div
                key={i}
                className="w-full flex flex-col items-center justify-center"
                style={{ height: `${100 / SHOWCASE_N}%` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[68%] sm:h-[72%] md:h-[78%] object-contain mt-10 md:mt-0"
                  style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))" }}
                />
                {/* Grounding puddle shadow, keeps products from feeling like they float in empty space */}
                <div className="w-[34%] h-3 rounded-[100%] bg-black/25 blur-md -mt-3" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* TEXT PANEL */}
        <div className="relative z-20 h-[calc(100%-280px)] sm:h-[calc(100%-340px)] md:h-full flex items-center">
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
                  {/* Eyebrow tag, split with a tick mark like a shelf label */}
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="font-mono font-semibold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white">
                      0{activeIndex + 1}
                    </span>
                    <span className="w-px h-3 bg-white/30" />
                    <span className="font-mono font-semibold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/80">
                      {SHOWCASE_DATA[activeIndex].eyebrow}
                    </span>
                  </div>

                  {/* Title with a soft outlined echo behind it for depth */}
                  <div className="relative mb-2">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 font-head font-black text-6xl sm:text-7xl lg:text-8xl leading-[1] tracking-tighter"
                      style={{
                        WebkitTextStroke: "1px rgba(255,255,255,0.14)",
                        color: "transparent",
                        transform: "translate(6px, 6px)",
                      }}
                    >
                      {SHOWCASE_DATA[activeIndex].title}
                    </div>
                    <h2 className="relative font-head font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#AFC7FF] text-6xl sm:text-7xl lg:text-8xl leading-[1] tracking-tighter">
                      {SHOWCASE_DATA[activeIndex].title}
                    </h2>
                  </div>

                  <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-white to-transparent opacity-70 mb-6" />

                  <p className="font-body text-lg sm:text-xl text-blue-50/80 font-light mb-10 leading-relaxed max-w-md">
                    {SHOWCASE_DATA[activeIndex].description}
                  </p>

                  <button className="group flex items-center gap-4 bg-white hover:bg-blue-50 text-[#1E3FE0] px-8 py-4 rounded-full font-bold text-sm sm:text-base tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1">
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

        {/* Level gauge — same positional info as the old dots, reads as a rising fill line */}
        <div className="hidden md:flex flex-col items-center gap-3 absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30">
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">01</span>
          <div className="relative w-[3px] h-[180px] rounded-full bg-white/15 overflow-visible">
            <motion.div
              className="absolute bottom-0 left-0 w-full rounded-full bg-gradient-to-t from-white to-[#AFC7FF]"
              animate={{ height: `${((activeIndex + 1) / SHOWCASE_N) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
            {SHOWCASE_DATA.map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 w-2 h-2 rounded-full transition-all duration-500"
                style={{
                  top: `${(i / (SHOWCASE_N - 1)) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  background: i <= activeIndex ? "#ffffff" : "rgba(255,255,255,0.3)",
                  boxShadow: i === activeIndex ? "0 0 12px rgba(255,255,255,0.7)" : "none",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">0{SHOWCASE_N}</span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   DEFAULT EXPORT WRAPPER
   ============================================================================ */

export default function ProductPage() {
  return (
    <main>
      <ProductsSection />
      <ProductShowcase />
    </main>
  );
}
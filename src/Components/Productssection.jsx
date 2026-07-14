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
   SECTION 4: SCROLL-DRIVEN PRODUCT SHOWCASE (UPDATED FOR ELEGANCE)
   ============================================================================ */

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

  return (
    <section 
      ref={containerRef} 
      className="relative h-[600vh]" 
      // Replaced solid color with a rich radial gradient to add depth to the background
      style={{ background: "radial-gradient(circle at 20% 50%, #2950F5 0%, #1E3FE0 60%, #152EAA 100%)" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Subtle background noise overlay to break up flat digital colors */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* ELEGANT CIRCLE STAGE */}
        <div className="absolute -right-[15%] top-[6%] w-[90%] sm:w-[70%] md:w-[52%] aspect-square">
          
          {/* Accent Rings */}
          <motion.div
            className="absolute -top-4 -left-10 w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-md"
            animate={{ y: [0, -12, 0], rotate: [0, 90, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </motion.div>

          {/* Premium Soft-Gradient Circle replacing the flat white one */}
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
        <div className="relative z-10 w-full h-[280px] sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{ height: `${SHOWCASE_N * 100}%`, y: trackY }}
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
        <div className="hidden md:flex flex-col gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-30">
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
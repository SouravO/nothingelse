import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

/* ============================================================================
   SECTION 3: PRODUCTS (ORIGINAL — untouched)
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

const PRODUCT_IMAGES = ["/pdt1.jpg", "/pdt2.jpg", "/pdt3.jpg", "/pdt4.jpeg", "/pdt5.jpeg"];

const PERIOD = PRODUCT_IMAGES.length;
const CYCLES = 12;
const TOTAL = PERIOD * CYCLES;
const RESET_AT = TOTAL - PERIOD * 2;
const RESET_TO = PERIOD * 2;
const STEP_MS = 2000;
const TRANSITION_MS = 700;

const ITEM_WIDTH = 210;
const GAP = 84;
const SLOT = ITEM_WIDTH + GAP;

function ProductSlide({ src, distance, instant, isHovered, onEnter, onLeave }) {
  const d = Math.min(distance, 3);
  const baseScale = d === 0 ? 1.2 : d === 1 ? 0.94 : d === 2 ? 0.82 : 0.72;
  const baseOpacity = d === 0 ? 1 : d === 1 ? 0.9 : d === 2 ? 0.78 : 0.65;
  const isCenter = distance === 0;

  const scale = baseScale;
  const opacity = isHovered ? 1 : baseOpacity;
  const zIndex = isHovered ? 50 : isCenter ? 30 : 10;

  const transition = instant
    ? "none"
    : "transform 700ms cubic-bezier(0.65,0,0.35,1), opacity 700ms ease-out";

  return (
    <div
      className="flex-none flex items-end justify-center h-[240px] sm:h-[300px] lg:h-[380px] cursor-pointer"
      style={{ width: ITEM_WIDTH, marginRight: GAP }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div style={{ width: ITEM_WIDTH, transform: `scale(${scale})`, transformOrigin: "bottom center", opacity, zIndex, transition }}>
        <div className="relative flex items-end justify-center">
          <div
            className="absolute bottom-2 h-9 w-24 rounded-full bg-white/10 blur-xl"
            style={{ opacity: isCenter || isHovered ? 0.9 : 0.35 }}
          />
          <img
            src={src}
            alt=""
            draggable={false}
            className="relative w-full h-[220px] sm:h-[280px] lg:h-[350px] object-contain"
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
    <div className="relative w-full overflow-hidden pt-10 sm:pt-14 lg:pt-20">
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
    <section id="products" className="relative bg-black scroll-mt-[68px] sm:scroll-mt-[76px] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#5C8DFF] mb-3">
            Products
          </p>
          <h2 className="font-head font-bold text-white text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] uppercase mb-4 max-w-xl">
            Blue first. Product second. Nothing else.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-24 sm:mt-28 lg:mt-32">
        <div className="relative left-1/2 -translate-x-1/2 w-screen">
          <ProductCarousel />
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================================
   SECTION 4: SCROLL-DRIVEN PRODUCT SHOWCASE
   Layout modelled on the reference: a big product image + soft glow circle
   bleeding off the right edge of the viewport, text pinned left on plain
   background. Colors are your blue ramp only — no red/orange/amber.
   ============================================================================ */

// TEMP: every panel uses this single placeholder image while real product
// shots are being finalised. Swap back to SHOWCASE_DATA[i].image (or update
// this path) once the real assets are ready — nothing else needs to change.
const PLACEHOLDER_IMAGE = "/about.png";

// Same blue ramp used by the About section — keeps the whole site on one palette.
const BLUE_ACCENTS = ["#A9C6FF", "#6E93FF", "#3D63E0", "#0C4DD5", "#153E9E"];

const SHOWCASE_DATA = [
  {
    title: "BBQ Sauces",
    description: "Mouthwatering flavors to take your BBQ to the next level of delicious perfection.",
    button: "View All Sauces",
    image: PRODUCT_IMAGES[0],
  },
  {
    title: "Spice Rubs",
    description: "Versatile seasonings for minimum prep and maximum flavor.",
    button: "View All Rubs",
    image: PRODUCT_IMAGES[1],
  },
  {
    title: "Marinades",
    description: "Effortless ways to tenderize while boosting flavor.",
    button: "View All Marinades",
    image: PRODUCT_IMAGES[2],
  },
  {
    title: "Signature Glazes",
    description: "Sweet and sticky finishes for the perfect bark on any cut of meat.",
    button: "View All Glazes",
    image: PRODUCT_IMAGES[3],
  },
  {
    title: "Hot Blends",
    description: "Bring the heat with our perfectly balanced fiery pepper profiles.",
    button: "View Hot Blends",
    image: PRODUCT_IMAGES[4],
  },
];

export function ProductShowcase() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalItems = SHOWCASE_DATA.length;
    const index = Math.min(Math.floor(latest * totalItems), totalItems - 1);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const accent = BLUE_ACCENTS[activeIndex % BLUE_ACCENTS.length];

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#FAFBFF]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* IMAGE PANEL — big glow circle + product image bleeding off the
            right edge. Normal block on mobile (stacked above text),
            becomes an absolute full-bleed overlay from md: up. */}
        <div className="relative w-full h-[280px] sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
          {/* soft glow circle, bleeds past the section edge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${activeIndex}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.08, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-[15%] top-[6%] w-[90%] aspect-square rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${accent}4D, ${accent}1A 60%, transparent 75%)`,
              }}
            />
          </AnimatePresence>

          {/* product image, slides up from below and fades in */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`img-${activeIndex}`}
              initial={{ opacity: 0, y: 200, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -200, scale: 0.92 }}
              transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-0 flex items-end justify-center"
            >
              <img
                src={PLACEHOLDER_IMAGE}
                alt={SHOWCASE_DATA[activeIndex].title}
                className="h-[85%] sm:h-[92%] md:h-[104%] object-contain"
                style={{ filter: `drop-shadow(0 30px 40px ${accent}40)` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TEXT PANEL — pinned left, plain background */}
        <div className="relative z-20 h-[calc(100%-280px)] sm:h-[calc(100%-340px)] md:h-full flex items-center">
          <div className="mx-auto max-w-[1280px] w-full px-5 sm:px-12">
            <div className="max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span
                    className="font-mono font-bold text-[11px] tracking-[0.25em] uppercase mb-3 block"
                    style={{ color: accent }}
                  >
                    0{activeIndex + 1} / 0{SHOWCASE_DATA.length}
                  </span>

                  <h2 className="font-head font-black text-[#111111] text-[10vw] sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight mb-5 sm:mb-6">
                    {SHOWCASE_DATA[activeIndex].title}
                  </h2>

                  <div
                    className="w-14 h-[4px] rounded-full mb-6 sm:mb-8"
                    style={{ background: accent }}
                  />

                  <p className="font-body text-base sm:text-lg text-[#4B5567] mb-8 sm:mb-10 leading-relaxed max-w-sm">
                    {SHOWCASE_DATA[activeIndex].description}
                  </p>

                  <button
                    className="text-white px-7 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base tracking-wide shadow-lg transition-transform duration-200 hover:scale-105"
                    style={{ background: accent }}
                  >
                    {SHOWCASE_DATA[activeIndex].button}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* progress dots, right edge, desktop only */}
        <div className="hidden md:flex flex-col gap-3 absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30">
          {SHOWCASE_DATA.map((_, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full block transition-all duration-300"
              style={{
                background: BLUE_ACCENTS[i % BLUE_ACCENTS.length],
                opacity: i === activeIndex ? 1 : 0.3,
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ============================================================================
   STANDALONE /products PAGE
   This is a full, independent copy of the Products carousel section — it does
   NOT import anything from Productssection.jsx. You can delete either file
   later without breaking the other.
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

  // Autoplay runs continuously regardless of hover — it used to pause
  // whenever `hovered !== null`, but since each slide's hover zone spans
  // most of the section's height/width, that made the carousel freeze any
  // time the cursor was almost anywhere over the section. `hovered` is only
  // used for the per-slide visual highlight (scale/opacity/glow) now, not
  // to gate this interval.
  useEffect(() => {
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(id);
  }, []);

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

function ProductsSection() {
  return (
    <section id="products" className="relative bg-white scroll-mt-[68px] sm:scroll-mt-[76px] pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 flex flex-col items-center text-center">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#5C8DFF] mb-3">Products</p>
          <h2 className="font-head font-bold text-black text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] uppercase mb-0 max-w-xl">
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
   DEFAULT EXPORT — the page rendered at the /products route
   ============================================================================ */
export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <ProductsSection />
    </main>
  );
}
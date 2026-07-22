import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ============================================================================
   STANDALONE /products PAGE
   This is a full, independent copy of the Products carousel section
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
const CYCLES = 7;
const TOTAL = PERIOD * CYCLES;
const RESET_AT = TOTAL - PERIOD * 2;
const RESET_TO = PERIOD * 2;
const STEP_MS = 2000;
const TRANSITION_MS = 850;

const ITEM_WIDTH = 270;
const GAP = -20;
const SLOT = ITEM_WIDTH + GAP;

// --- CAROUSEL LOGIC UNTOUCHED ---
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
            loading="lazy"
            decoding="async"
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

// --- CAROUSEL LOGIC UNTOUCHED ---
function ProductCarousel() {
  const [step, setStep] = useState(RESET_TO);
  const [instant, setInstant] = useState(false);
  const [hovered, setHovered] = useState(null);

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
    <section id="products" className="section-paint-lazy relative overflow-hidden scroll-mt-[68px] sm:scroll-mt-[76px] pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-24">
      
      {/* =========================================
          NEW BACKGROUND: AURORA & DOT GRID
          ========================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-white via-[#F5F8FF] to-[#E8F0FF]">
        {/* Subtle Technical Dot Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `radial-gradient(#0C4DD5 1.5px, transparent 1.5px)`, 
            backgroundSize: '32px 32px' 
          }}
        />
        
        {/* Animated Aurora Orbs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[60vw] max-w-[700px] aspect-square rounded-full bg-[#0C4DD5] mix-blend-multiply filter blur-[120px] sm:blur-[160px] opacity-15"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[-10%] w-[50vw] max-w-[600px] aspect-square rounded-full bg-[#5C8DFF] mix-blend-multiply filter blur-[100px] sm:blur-[140px] opacity-25"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[20%] w-[55vw] max-w-[800px] aspect-square rounded-full bg-[#A0C4FF] mix-blend-multiply filter blur-[130px] sm:blur-[180px] opacity-30"
        />
      </div>

      {/* =========================================
          CONTENT & TYPOGRAPHY
          ========================================= */}
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 flex flex-col items-center text-center relative z-10">
        <Reveal>
          {/* Refined Kicker */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-8 sm:w-16 bg-[#0C4DD5]/30"></span>
            <p className="font-body text-[11px] sm:text-[13px] font-bold tracking-[0.3em] uppercase text-[#0C4DD5]">
              The Collection
            </p>
            <span className="h-[1px] w-8 sm:w-16 bg-[#0C4DD5]/30"></span>
          </div>
          
          {/* New Stylish Typography */}
          <h2 className="font-head text-[#111111] text-[9vw] sm:text-[5vw] lg:text-[4vw] leading-[1.1] tracking-[-0.03em] max-w-4xl mx-auto drop-shadow-sm">
            <span className="font-black uppercase tracking-tighter">Blue First.</span>{" "}
            <span className="font-medium text-[#111111]/40 tracking-tight">Product Second.</span>
            <br />
            <div className="mt-1 sm:mt-2">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0C4DD5] to-[#4580FF] uppercase tracking-tighter drop-shadow-md">
                Nothing Else.
              </span>
            </div>
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        {/* 
          Using negative top margins (-mt-6, -mt-12, -mt-24) to pull the carousel up.
          This drastically reduces the large empty white space between the title 
          and the product images, visually tightening the section.
        */}
        <div className="relative z-10 left-1/2 -translate-x-1/2 w-screen mt-2 sm:-mt-12 lg:-mt-24">
          <ProductCarousel />
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================================
   DEFAULT EXPORT
   ============================================================================ */
export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProductsSection />
    </main>
  );
}
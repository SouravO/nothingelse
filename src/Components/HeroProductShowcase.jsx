import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  deep: "#101F7A",
  base: "#1E3FE0",
  bright: "#2950F5",
  ice: "#DCE6FF",
  gold: "#D9A84A",
  goldLight: "#F3CE7C",
  goldGlow: "#FFEFC7",
};

const PRODUCT_IMAGES = ["/pdt1.png", "/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];

const SHOWCASE_DATA = [
  { image: PRODUCT_IMAGES[0] },
  { image: PRODUCT_IMAGES[1] },
  { image: PRODUCT_IMAGES[2] },
  { image: PRODUCT_IMAGES[3] },
  { image: PRODUCT_IMAGES[4] },
];

const SHOWCASE_N = SHOWCASE_DATA.length;

// ---- Table asset tuning ---------------------------------------------------
const TABLE_ASPECT_RATIO = "1221 / 681";

// Where the tabletop line sits inside the table.png box, measured up from
// the bottom of the aspect-ratio box. This should be the SAME for every
// product, since it's a property of table.png, not of the bottle photos.
const TABLE_SURFACE_FROM_BOTTOM = "53%";

// Moves the whole table+product group up/down within its section. Using a
// transform here (instead of padding-top on the centering wrapper) so it's
// a single predictable knob that doesn't also change how flex distributes
// space above/below — positive = further down the page.
const TABLE_VERTICAL_SHIFT = "20%";

// ---- Per-product tuning ----------------------------------------------------
// Each product PNG almost certainly has a different amount of transparent
// padding baked into its canvas (different bottle heights, different export
// margins), so one global "sits on the table" number can't work for all
// five. Nudge each one individually here until its base visually touches
// the tabletop. Positive px = move that product DOWN (closer to the table),
// negative = move it UP. Start at 0 and adjust per product while previewing.
const PRODUCT_Y_NUDGE_PX = [0, 0, 0, 0, 0];

function WaveField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bgBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0A3D7A" />
            <stop offset="45%" stopColor="#082F63" />
            <stop offset="100%" stopColor="#062750" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#bgBlue)" />

        <path
          d="M-60,760 C150,650 380,625 620,660 C860,695 1080,760 1600,980 L1600,900 L-60,900 Z"
          fill="#FFFFFF"
        />

        <path
          d="M-80,835 C160,710 420,700 700,740 C980,780 1230,860 1600,1040"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="18"
          strokeLinecap="round"
        />

        <path
          d="M-70,860 C170,740 430,730 715,770 C1000,810 1250,890 1600,1060"
          fill="none"
          stroke="#082F63"
          strokeWidth="28"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

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

function HeroHeadline() {
  return (
    <div className="relative mb-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');

        .hero-title-font {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-optical-sizing: auto;
        }
        .hero-line-1 { font-size: clamp(1.9rem, 8vw, 2.75rem); letter-spacing: -0.01em; }
        .hero-line-2 { font-size: clamp(1.5rem, 6vw, 2.25rem); letter-spacing: -0.005em; }
        @media (min-width: 768px) {
          .hero-line-1 { font-size: clamp(2rem, 3.6vw, 3.5rem); }
          .hero-line-2 { font-size: clamp(1.6rem, 2.8vw, 2.5rem); }
        }
        @media (min-width: 1024px) {
          .hero-line-1 { font-size: clamp(2.25rem, 3.2vw, 4rem); }
          .hero-line-2 { font-size: clamp(1.75rem, 2.5vw, 3rem); }
        }
      `}</style>
      <h1 className="hero-title-font relative font-black leading-[1.05] tracking-normal">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="hero-line-1 block max-w-full break-words text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#AFC7FF]"
          style={{ textShadow: "0 0 60px rgba(175,199,255,0.45)" }}
        >
          Good everyday products.
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="hero-line-2 block max-w-full break-words text-transparent bg-clip-text bg-gradient-to-br from-[#F3CE7C] via-[#FFEFC7] to-[#D9A84A] mt-1 sm:mt-2"
          style={{ textShadow: "0 0 60px rgba(217,168,74,0.45)" }}
        >
          Honest pricing. Nothing else.
        </motion.span>
      </h1>
    </div>
  );
}

function LandingProduct({ activeIndex }) {
  const nudge = PRODUCT_Y_NUDGE_PX[activeIndex] ?? 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        className="relative flex flex-col items-center"
        style={{ transform: `translateY(${nudge}px)` }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.img
          src={SHOWCASE_DATA[activeIndex].image}
          alt="Product"
          className="relative z-10 h-[200px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[480px] w-auto object-contain"
          style={{ filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.35))" }}
          variants={{
            // Starting offset kept small enough to stay inside the clipped
            // section on mobile (~380px tall). The old -300px pushed the
            // bottle above that boundary, so it was being hard-clipped
            // (invisible) rather than faded, then "popped" into view the
            // instant it crossed back into the visible area — that hard
            // pop is what read as flashing.
            hidden: { y: -140, opacity: 0, scale: 0.92 },
            visible: {
              y: [-140, 10, -4, 0],
              // Opacity now reaches 1 by 35% of the fall and holds there,
              // so the bottle is fully visible for the rest of the fall
              // and the whole sit-down — it only goes invisible again on
              // exit, never mid-entrance.
              opacity: [0, 1, 1, 1],
              scale: 1,
              transition: { duration: 0.8, times: [0, 0.35, 0.75, 1], ease: [0.16, 1, 0.3, 1] },
            },
            exit: { y: 15, opacity: 0, scale: 0.95, transition: { duration: 0.25, ease: "easeOut" } },
          }}
        />

        {/* contact shadow — anchored to the same element as the bottle so the
            nudge above keeps the shadow glued to the bottle's own base */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 blur-md"
          style={{ width: "65%", height: 12 }}
          variants={{
            hidden: { scaleX: 0.35, opacity: 0 },
            visible: {
              scaleX: [0.35, 1.2, 1],
              opacity: [0, 0.65, 0.45],
              transition: { duration: 0.9, times: [0, 0.62, 1] },
            },
            exit: { opacity: 0, transition: { duration: 0.2 } },
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Preload all product images so cycling never waits on a network
    // fetch mid-transition (that wait was the source of the flicker).
    PRODUCT_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_N);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-[100svh] md:h-screen w-full overflow-hidden"
      style={{ backgroundColor: BRAND.deep }}
    >
      <WaveField />
      <div
        className="absolute inset-0 pointer-events-none z-[6]"
        style={{ background: "radial-gradient(ellipse at 25% 100%, rgba(0,0,0,0.18), transparent 60%)" }}
      />

      <div className="hidden sm:flex absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50">
          {String(SHOWCASE_N).padStart(2, "0")} staples — zero fillers
        </span>
        <span className="w-6 h-px bg-white/30" />
      </div>

      <div className="relative z-10 w-full h-[440px] sm:h-[520px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-[100%] sm:w-[95%] md:w-[98%] lg:w-[90%] xl:w-[85%] max-w-[1050px]"
            style={{ aspectRatio: TABLE_ASPECT_RATIO, transform: `translateY(${TABLE_VERTICAL_SHIFT})` }}
          >
            <img
              src="/table.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
              style={{ filter: "drop-shadow(0 30px 26px rgba(0,0,0,0.4))" }}
            />

            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ bottom: TABLE_SURFACE_FROM_BOTTOM }}
            >
              <LandingProduct activeIndex={activeIndex} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-40 h-[calc(100%-440px)] sm:h-[calc(100%-520px)] md:h-full flex items-center">
        <div className="w-full px-6 sm:px-12 md:w-[44%] md:pr-6">
          <div className="max-w-full md:pl-8">
            <HeroHeadline />

            <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-white to-transparent opacity-70 mb-6" />

            <p className="font-body text-lg sm:text-xl text-blue-50/90 font-light leading-relaxed max-w-lg drop-shadow-md">
              A minimalist FMCG brand built for India first, then GCC and global markets.
            </p>

            <div className="flex md:hidden items-center gap-2 mt-6" aria-hidden="true">
              {SHOWCASE_DATA.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIndex ? 22 : 8,
                    background: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.3)",
                    boxShadow: i === activeIndex ? "0 0 10px rgba(255,255,255,0.6)" : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center gap-3 absolute right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30">
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
      </div>
    </section>
  );
}
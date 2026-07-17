import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

// Animation state sequence
const ANIMATION_STATE = {
  MOVING_IN: 0,
  SITTING: 1,
  MOVING_OUT: 2,
};

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
          className="hero-line-1 block max-w-full whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#AFC7FF]"
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

// Sub-component for the dynamic product animation
// ... (previous imports and constants remain the same)

// Sub-component for the dynamic product animation
function ProductAnimateSlot({ currentPdtImage, animState }) {
  const variants = {
    movingIn: { y: "-40%", opacity: 0, scale: 0.95 }, 
    sitting: { y: "0%", opacity: 1, scale: 1.1 }, 
    movingOut: { y: "40%", opacity: 0, scale: 0.95 }, 
  };

  return (
    <motion.div
      key={currentPdtImage} 
      initial="movingIn"
      animate={
        animState === ANIMATION_STATE.MOVING_IN ? "movingIn" :
        animState === ANIMATION_STATE.SITTING ? "sitting" :
        "movingOut"
      }
      variants={variants}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} 
      className="absolute z-20 flex flex-col items-center justify-end pointer-events-none"
      style={{
        // UPDATED: 'top' increased to 65% to position the product on the bottom shelf
        width: "16%", 
        height: "26%", 
        top: "65%", 
        right: "7%", 
      }}
    >
      <img
        src={currentPdtImage}
        alt="Product"
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}
      />
      <div className="w-[85%] h-3 rounded-[100%] bg-black/40 blur-md -mt-2" />
    </motion.div>
  );
}

// ... (rest of the component remains the same)

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animState, setAnimState] = useState(ANIMATION_STATE.MOVING_IN);

  useEffect(() => {
    setAnimState(ANIMATION_STATE.MOVING_IN);

    // Starts sitting after 1s
    const sitTimer = setTimeout(() => {
      setAnimState(ANIMATION_STATE.SITTING);
    }, 1000);

    // Exits after 2s total
    const exitTimer = setTimeout(() => {
      setAnimState(ANIMATION_STATE.MOVING_OUT);
    }, 2000);

    // Complete cycle and move to next product after 3s total
    const cycleInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_N);
      setAnimState(ANIMATION_STATE.MOVING_IN); 
    }, 3000);

    return () => {
      clearTimeout(sitTimer);
      clearTimeout(exitTimer);
      clearInterval(cycleInterval);
    };
  }, [activeIndex]);

  const currentPdt = SHOWCASE_DATA[activeIndex];

  return (
    <section
      id="hero"
      className="relative h-[100svh] md:h-screen w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/shelf.png')`, 
        backgroundColor: BRAND.deep, 
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-[6]"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}
      />

      <div className="hidden sm:flex absolute bottom-6 right-6 md:bottom-8 md:right-10 z-30 items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/70">
          {String(SHOWCASE_N).padStart(2, "0")} staples — zero fillers
        </span>
        <span className="w-6 h-px bg-white/40" />
      </div>

      {/* Main product animation area */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        <ProductAnimateSlot currentPdtImage={currentPdt.image} animState={animState} />
      </div>

      <div className="relative z-40 h-full flex items-center">
        <div className="w-full px-6 sm:px-12 md:w-[50%] md:pr-6">
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

      {/* Right side navigation dots */}
      <div className="hidden md:flex flex-col items-center gap-3 absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30">
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
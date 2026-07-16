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
          <radialGradient id="circleFill" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F7FBFF" />
          </radialGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#bgBlue)" />

        <circle cx="1240" cy="430" r="255" fill="none" stroke="#0A2E63" strokeWidth="32" />
        <circle cx="1240" cy="430" r="235" fill="url(#circleFill)" />

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

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
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

      <div className="relative z-10 w-full h-[280px] sm:h-[340px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-x-0 top-0"
          style={{ height: `${SHOWCASE_N * 100}%` }}
          animate={{ y: `-${(activeIndex / SHOWCASE_N) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {SHOWCASE_DATA.map((item, i) => (
            <div
              key={i}
              className="w-full flex flex-col items-center justify-center pointer-events-auto"
              style={{ height: `${100 / SHOWCASE_N}%` }}
            >
              <img
                src={item.image}
                alt="Product"
                className="h-[68%] sm:h-[72%] md:h-[78%] object-contain mt-10 md:mt-0"
                style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.25))" }}
              />
              <div className="w-[34%] h-3 rounded-[100%] bg-black/25 blur-md -mt-3" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-40 h-[calc(100%-280px)] sm:h-[calc(100%-340px)] md:h-full flex items-center">
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
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  deep: "#6B78B8", base: "#9AB0FB", bright: "#BBD0FF",
  ice: "#DCEEFF", gold: "#E9C98A", goldLight: "#F6E0AC", goldGlow: "#FFF7E4",
  black: "#000000", white: "#FFFFFF",
  ink: "#333A63", inkSoft: "#4A5080", inkWarm: "#8A5A2E"
};

const EASE = [0.16, 1, 0.3, 1];

const THEME_COLORS = {
  icy: "#DCEEFF",         
  cornflower: "#C7D6FF",  
  customPersian: "#B9C9FA", 
  dusk: "#CFC6EA",        
  navy: "#B7C0E0"         
};

const SLIDES = [
  {
    image: "/pdt2.png",
    label: ["DAILY GLOW", "SHAMPOO"],
    tags: ["Sulfate-Free", "Deep Nourish", "Salon Shine", "pH Balanced", "Frizz Control"],
    description: "A weightless lather that rinses clean and leaves hair soft and easy to manage — every single wash.",
    theme: {
      bg: THEME_COLORS.icy, 
      text: BRAND.ink,
      descText: BRAND.inkSoft,
      spotlight: "rgba(255,255,255,0.55)",
      isLight: true
    },
  },
  {
    image: "/pdt3.png",
    label: ["GOLDEN", "HARVEST RICE"],
    tags: ["Long Grain", "Naturally Aged", "Non-Sticky", "Farm Sourced", "Fluffy Texture"],
    description: "Slow-aged for a fluffier bite and a cleaner aroma — everyday rice that makes every meal feel special.",
    theme: {
      bg: THEME_COLORS.cornflower, 
      text: BRAND.ink,
      descText: BRAND.inkSoft,
      spotlight: "rgba(255,255,255,0.45)",
      isLight: true
    },
  },
  {
    image: "/pdt4.png",
    label: ["POWER CLEAN", "DETERGENT"],
    tags: ["Stain Lift", "Fresh Rinse", "Fabric Safe", "Low Suds", "Skin Gentle"],
    description: "Tough on stains, gentle on fabric — a wash that gets clothes properly clean without harsh trade-offs.",
    theme: {
      bg: THEME_COLORS.customPersian, 
      text: BRAND.ink,
      descText: BRAND.inkSoft,
      spotlight: "rgba(255,255,255,0.4)",
      isLight: true
    },
  },
  {
    image: "/pdt5.png",
    label: ["EVERYDAY", "MASALA MIX"],
    tags: ["Stone Ground", "No Fillers", "Bold Aroma", "Small Batch", "Vibrant Color"],
    description: "A balanced blend ground the old way — real spice and real aroma, nothing added to cut corners.",
    theme: {
      bg: THEME_COLORS.dusk, 
      text: BRAND.ink,
      descText: BRAND.inkSoft,
      spotlight: "rgba(255,255,255,0.45)",
      isLight: true
    },
  },
  {
    image: "/pdt2.png", 
    label: ["GENTLE CARE", "BODY WASH"],
    tags: ["Hydrating", "Vegan", "Rich Lather", "Skin Safe", "Fresh Scent"],
    description: "A soothing everyday wash that purifies and locks in moisture, leaving your skin soft and refreshed.",
    theme: {
      bg: THEME_COLORS.navy, 
      text: BRAND.ink,
      descText: BRAND.inkSoft,
      spotlight: "rgba(255,255,255,0.4)",
      isLight: true
    },
  }
];

const HOLD_MS = 3600;
const TAGS_IN_DELAY = 620;
const TAGS_OUT_BEFORE_END = 950;

const BG_SLIDE_TRANSITION = { duration: 0.72, ease: EASE };
const TITLE_SLIDE_TRANSITION = { duration: 0.6, delay: 0.1, ease: EASE };
const IMAGE_SLIDE_TRANSITION = { duration: 1.5, delay: 0.25, ease: EASE };

const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const FONT_FIT_CONSTANT = 181;
const FONT_MIN_CQW = 12;
const FONT_MAX_CQW = 20;
function getTitleFontSizeCqw(labelLines) {
  const longest = Math.max(...labelLines.map((l) => l.length));
  const raw = FONT_FIT_CONSTANT / longest;
  return Math.min(FONT_MAX_CQW, Math.max(FONT_MIN_CQW, raw));
}

function SlideBackgrounds({ activeIndex }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          style={{ backgroundColor: SLIDES[activeIndex].theme.bg }}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={BG_SLIDE_TRANSITION}
        />
      </AnimatePresence>
    </div>
  );
}

function SpotlightGlow({ activeIndex, isLight }) {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none" style={{ mixBlendMode: isLight ? "overlay" : "screen" }} aria-hidden="true">
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
    <div className="absolute inset-0 pointer-events-none z-[45]" style={{ backgroundImage: NOISE_BG, opacity: 0.05, mixBlendMode: "overlay" }} aria-hidden="true" />
  );
}

function FloorGlow({ isLight }) {
  if (isLight) return null;
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 24%, transparent 48%)" }} aria-hidden="true" />
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[2]"
        style={{ bottom: "-30%", width: "150%", aspectRatio: "3 / 1", borderRadius: "9999px", filter: "blur(90px)", background: "radial-gradient(ellipse at center, rgba(171,210,250,0.12), transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-[2]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} aria-hidden="true" />
    </>
  );
}

function AmbientDust({ isLight }) {
  if (isLight) return null; 
  
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
        const peakOpacity = 0.2 + (p.size / 10) * 0.35;
        const color = p.gold ? "#F3CE7C" : "#ABD2FA";
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size, top: p.top, left: p.left,
              background: `radial-gradient(circle, #ffffff 0%, ${color} 65%, transparent 100%)`,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 ${p.size * 1.5}px rgba(${p.gold ? "243,206,124" : "171,210,250"},0.3)`,
            }}
            animate={{ y: [0, -140 - p.size * 6], opacity: [0, peakOpacity, peakOpacity, 0], x: [0, i % 2 === 0 ? 10 : -10] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay, times: [0, 0.15, 0.8, 1] }}
          />
        );
      })}
    </div>
  );
}

function HeroHeadline({ isLight }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');
        .hero-title-font { font-family: 'Bricolage Grotesque', sans-serif; font-optical-sizing: auto; }
        .hero-wordmark-font { font-family: 'Baloo 2', sans-serif; }
        .hero-line-1 { font-size: clamp(1.6rem, 5.4vw, 2.3rem); letter-spacing: -0.01em; }

        .product-hero-img {
          height: clamp(300px, 82cqw, 430px);
          max-width: 92cqw;
        }
        @media (min-width: 640px) {
          .product-hero-img { height: clamp(360px, 68cqw, 480px); max-width: 88cqw; }
        }
        @media (min-width: 768px) {
          .product-hero-img { height: clamp(400px, 58cqw, 520px); max-width: 84cqw; }
        }
        @media (min-width: 1024px) {
          .product-hero-img { height: 580px; max-width: none; }
        }

        .product-position-wrap {
          top: 46%;
        }
        @media (min-width: 1024px) {
          .product-position-wrap { top: 50%; }
        }
      `}</style>
    </div>
  );
}

function ProductStage({ slide, interactive }) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [floatDir, setFloatDir] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const updateFromPoint = (clientX, clientY) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -5, ry: px * 7 });
    setFloatDir({ x: px, y: py });
  };

  const handleMouseMove = (e) => {
    if (!interactive) return;
    updateFromPoint(e.clientX, e.clientY);
  };
  const handleMouseEnter = () => {
    if (!interactive) return;
    setHovering(true);
  };
  const handleMouseLeave = () => {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
    setFloatDir({ x: 0, y: 0 });
  };

  const handleTouchStart = (e) => {
    if (!interactive) return;
    setHovering(true);
    const t = e.touches[0];
    if (t) updateFromPoint(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    if (!interactive) return;
    const t = e.touches[0];
    if (!t) return;
    updateFromPoint(t.clientX, t.clientY);
  };
  const handleTouchEnd = () => {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
    setFloatDir({ x: 0, y: 0 });
  };

  const FLOAT_RANGE_X = 46;
  const FLOAT_RANGE_Y = 34;

  return (
    <motion.div
      style={{ transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: -34, rotate: -7 }}
      animate={{
        opacity: 1,
        rotate: 0,
        x: hovering ? [0, floatDir.x * FLOAT_RANGE_X, 0] : 0,
        y: hovering ? [0, floatDir.y * FLOAT_RANGE_Y, 0] : 0,
      }}
      transition={{
        opacity: { duration: 0.5, ease: EASE },
        rotate: { duration: 0.9, ease: EASE },
        x: hovering
          ? { duration: 5.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          : { duration: 0.6, ease: EASE },
        y: hovering
          ? { duration: 5.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          : { duration: 0.6, ease: EASE },
      }}
    >
      <div
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: 1200 }}
      >
        <div
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={slide.image}
            alt="Product"
            className="product-hero-img relative w-auto object-contain"
            style={{
              filter: "drop-shadow(0 24px 26px rgba(91,107,168,0.28))",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TitleLayer({ slide }) {
  const isLight = slide.theme.isLight;
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-start text-center z-0 px-4 pt-[6vh] lg:pt-[11%] select-none pointer-events-none"
      initial={{ x: "-100%", y: 26, rotate: -5, opacity: 0 }}
      animate={{ x: "0%", y: 0, rotate: 0, opacity: 1 }}
      exit={{ x: "100%", y: -26, rotate: 5, opacity: 0 }}
      transition={TITLE_SLIDE_TRANSITION}
    >
      <div className="relative flex flex-col items-center">
        {slide.label.map((line, i) => (
          <span
            key={i}
            className="hero-wordmark-font font-extrabold uppercase leading-[1.1] lg:leading-[0.98] tracking-tight whitespace-nowrap"
            style={{
              fontSize: `clamp(min(3.6rem, 10vw), ${fontSizeCqw}cqw, 15.5rem)`,
              color: slide.theme.text,
              textShadow: isLight ? "none" : `0 0 60px ${slide.theme.text}40`,
            }}
          >
            {line}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ImageLayer({ slide }) {
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);
  const [settled, setSettled] = useState(false);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-start text-center z-10 px-4 pt-[6vh] lg:pt-[11%] select-none"
      initial={{ x: "-90%", y: 70, rotate: -34, scale: 0.88, opacity: 0 }}
      animate={{ x: "0%", y: 0, rotate: 0, scale: 1, opacity: 1 }}
      exit={{ x: "90%", y: -70, rotate: 34, scale: 0.88, opacity: 0 }}
      transition={IMAGE_SLIDE_TRANSITION}
      onAnimationComplete={() => setSettled(true)}
    >
      <div className="relative flex flex-col items-center w-full h-full lg:h-auto" aria-hidden="true">
        <div className="hidden lg:flex flex-col items-center w-full">
          {slide.label.map((line, i) => (
            <span
              key={i}
              className="hero-wordmark-font font-extrabold uppercase leading-[0.98] tracking-tight whitespace-nowrap invisible"
              style={{ fontSize: `clamp(min(3.6rem, 10vw), ${fontSizeCqw}cqw, 15.5rem)` }}
            >
              {line}
            </span>
          ))}
        </div>

        <div className="absolute product-position-wrap left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <motion.div
            className="relative flex flex-col items-center"
            animate={{
              rotate: [0, -4, 3, -3, 2, -1, 0],
              x: [0, -5, 4, -3, 2, -1, 0],
            }}
            transition={{
              duration: IMAGE_SLIDE_TRANSITION.duration,
              delay: IMAGE_SLIDE_TRANSITION.delay,
              ease: "easeInOut",
              times: [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1],
            }}
          >
            <ProductStage slide={slide} interactive={settled} />
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full blur-2xl pointer-events-none"
              style={{ bottom: "4%", width: "60%", height: "12%", background: "radial-gradient(ellipse at center, rgba(91,107,168,0.28), transparent 72%)" }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedStage({ activeIndex, tagsVisible }) {
  const slide = SLIDES[activeIndex];
  const isLight = slide.theme.isLight;

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-auto lg:aspect-[16/9] max-w-[1920px]" style={{ containerType: "inline-size" }}>
      <SpotlightGlow activeIndex={activeIndex} isLight={isLight} />
      <AmbientDust isLight={isLight} />

      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <TitleLayer key={activeIndex} slide={slide} />
        </AnimatePresence>
        <AnimatePresence initial={false}>
          <ImageLayer key={activeIndex} slide={slide} />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tagsVisible, setTagsVisible] = useState(false);

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
    const advanceSlide = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, HOLD_MS);

    return () => {
      clearTimeout(showTags);
      clearTimeout(hideTags);
      clearTimeout(advanceSlide);
    };
  }, [activeIndex]);

  const slide = SLIDES[activeIndex];
  const isLight = slide.theme.isLight;

  return (
    <section id="hero" className="relative min-h-[100svh] md:h-screen w-full overflow-hidden flex flex-col" style={{ backgroundColor: slide.theme.bg }}>
      <SlideBackgrounds activeIndex={activeIndex} />
      <FloorGlow isLight={isLight} />
      <GrainOverlay />

      <div className="relative z-20 flex flex-col items-center gap-1 pt-10 sm:pt-12 px-6">
        <div className="mt-4">
          <HeroHeadline isLight={isLight} />
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 pt-4 pb-12 sm:pt-12 sm:pb-16 lg:pt-10 lg:pb-4">
        <AnimatedStage activeIndex={activeIndex} tagsVisible={tagsVisible} />
      </div>

    </section>
  );
}
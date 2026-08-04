import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  deep: "#6B78B8", base: "#9AB0FB", bright: "#BBD0FF",
  ice: "#DCEEFF", gold: "#E9C98A", goldLight: "#F6E0AC", goldGlow: "#FFF7E4",
  black: "#000000", white: "#FFFFFF",
  ink: "#333A63", inkSoft: "#4A5080", inkWarm: "#8A5A2E",
};

const EASE = [0.16, 1, 0.3, 1];

const THEME_COLORS = {
  icy: "#DCEEFF",
  cornflower: "#C7D6FF",
  customPersian: "#B9C9FA",
  dusk: "#CFC6EA",
  navy: "#B7C0E0",
};

const SLIDES = [
  {
    image: "/tea.png",
    label: ["HONEST", "EVERYDAY"],
    tags: ["No Fake Premium", "No Overclaims", "Fair Pricing", "Simple Products", "Trusted Quality"],
    description: "Good everyday products. Honest pricing. Nothing else.",
    theme: { bg: THEME_COLORS.icy, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.55)", isLight: true },
  },
  {
    image: "/dishwash.png",
    label: ["NOT CHEAP", "NOT LUXURY"],
    tags: ["Smart Value", "No Overdesign", "Everyday India", "Fair Price", "Honest Quality"],
    description: "Positioned between cheap unorganised products and expensive branded FMCG — smart value for everyday India.",
    theme: { bg: THEME_COLORS.cornflower, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.45)", isLight: true },
  },
  {
    image: "/wheat.png",
    label: ["ONE SHELF", "TEN CATEGORIES"],
    tags: ["60+ SKUs", "10 Categories", "Grocery To Personal Care", "Stronger Shelf Presence", "One Rule"],
    description: "We are not launching a product. We are launching a shelf — a complete FMCG system across 10 categories at once.",
    theme: { bg: THEME_COLORS.customPersian, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.4)", isLight: true },
  },
  {
    image: "/jam.png",
    label: ["OFFLINE TRUST", "ONLINE DEMAND"],
    tags: ["Retail Shelf Visibility", "Reels & Storytelling", "No-Drama Campaigns", "Distributor Network", "Demand Follows Trust"],
    description: "A visible brand block on real shelves creates trust. Online storytelling turns that trust into demand.",
    theme: { bg: THEME_COLORS.dusk, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.45)", isLight: true },
  },
  // {
  //   image: "/pdt2.png",
  //   label: ["INDIA FIRST", "GCC NEXT"],
  //   tags: ["National Distribution", "GCC Export Ready", "Diaspora First", "UAE Gateway", "$2B Ambition"],
  //   description: "Built for India first, then GCC and global markets — from pilot stores to national distribution.",
  //   theme: { bg: THEME_COLORS.navy, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.4)", isLight: true },
  // },
];

// ---------------------------------------------------------------------------
// Timeline (per slide, resets every HOLD_MS):
//   0.0 – 0.4s   background crossfade
//   0.15 – 0.8s  title masked reveal
//   0.45 – 1.7s  portal + product entrance
//   1.7 – 3.4s   stable hero / product micro-motion
//   3.4 – 4.2s   product depth exit
// ---------------------------------------------------------------------------
const HOLD_MS = 4200;
const TAGS_IN_DELAY = 620;
const TAGS_OUT_BEFORE_END = 950;

const IMAGE_SHOW_DELAY = 450;
const IMAGE_HIDE_DELAY = 3400;

const BG_CROSSFADE_TRANSITION = { duration: 0.4, ease: EASE };
const PRODUCT_ENTER_TRANSITION = { duration: 1.25, ease: EASE, delay: 0.05 };
const PRODUCT_EXIT_TRANSITION = { duration: 0.8, ease: EASE };
const TITLE_LINE_DURATION = 0.65;
const TITLE_LINE_STAGGER = 0.09;
const TITLE_LINE_BASE_DELAY = 0.15;
const TITLE_EXIT_TRANSITION = { duration: 0.4, ease: EASE };

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

// Background: cross-faded color + a very subtle radial gradient centered on
// the product portal, instead of the old horizontal slide.
function SlideBackgrounds({ activeIndex }) {
  const slide = SLIDES[activeIndex];
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BG_CROSSFADE_TRANSITION}
        >
          <div className="absolute inset-0" style={{ backgroundColor: slide.theme.bg }} />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(42% 38% at 50% 55%, ${slide.theme.spotlight}, transparent 74%)`,
              mixBlendMode: "overlay",
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[45]"
      style={{ backgroundImage: NOISE_BG, opacity: 0.05, mixBlendMode: "overlay" }}
      aria-hidden="true"
    />
  );
}

function FloorGlow({ isLight }) {
  if (isLight) return null;
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 24%, transparent 48%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[2]"
        style={{
          bottom: "-30%", width: "150%", aspectRatio: "3 / 1", borderRadius: "9999px",
          filter: "blur(90px)", background: "radial-gradient(ellipse at center, rgba(171,210,250,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none z-[2]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
        aria-hidden="true"
      />
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

function HeroHeadline() {
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
      `}</style>
    </div>
  );
}

// Diffused studio-light portal behind the package. Expands from ~20% scale
// to 100% while fading in; contracts back on exit.
function PortalGlow() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: "min(64cqw, 620px)",
        height: "min(64cqw, 620px)",
        background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 72%)",
        filter: "blur(22px)",
      }}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { duration: 1.3, ease: EASE } }}
      exit={{ scale: 0.45, opacity: 0, transition: { duration: 0.8, ease: EASE } }}
      aria-hidden="true"
    />
  );
}

// 2–3 extremely subtle concentric elliptical light rings, expanding and
// fading behind the product to suggest depth without reading as sci-fi.
function ConcentricRings() {
  const rings = [
    { delay: 0.15, startScale: 0.5, endScale: 0.85, duration: 2.6 },
    { delay: 0.4, startScale: 0.6, endScale: 1.0, duration: 3.0 },
    { delay: 0.7, startScale: 0.7, endScale: 1.15, duration: 3.4 },
  ];
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "min(48cqw, 440px)",
            height: "min(30cqw, 280px)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
          initial={{ scale: r.startScale, opacity: 0 }}
          animate={{
            scale: [r.startScale, r.endScale],
            opacity: [0, 0.18, 0],
            transition: { duration: r.duration, delay: r.delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" },
          }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        />
      ))}
    </div>
  );
}

// Soft elliptical contact shadow. Starts wide + faint, tightens to
// slightly narrower + stronger as the product settles forward.
function ProductShadow() {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
      style={{
        bottom: "3%",
        background: "radial-gradient(ellipse at center, rgba(58,68,118,0.38), transparent 72%)",
        filter: "blur(12px)",
      }}
      initial={{ width: "82%", height: "11%", opacity: 0.12 }}
      animate={{ width: "56%", height: "9%", opacity: 0.3, transition: { duration: 1.3, ease: EASE } }}
      exit={{ width: "80%", height: "10%", opacity: 0.08, transition: { duration: 0.8, ease: EASE } }}
      aria-hidden="true"
    />
  );
}

// The package itself: gentle idle bob/sway once settled, plus a lightweight,
// heavily-damped mouse tilt so the product reads as physical, not floaty.
function ProductStage({ slide, interactive }) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const updateFromPoint = (clientX, clientY) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -2, ry: px * 3 });
  };

  const handleMouseMove = (e) => { if (!interactive) return; updateFromPoint(e.clientX, e.clientY); };
  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });
  const handleTouchStart = (e) => { if (!interactive) return; const t = e.touches[0]; if (t) updateFromPoint(t.clientX, t.clientY); };
  const handleTouchMove = (e) => { if (!interactive) return; const t = e.touches[0]; if (!t) return; updateFromPoint(t.clientX, t.clientY); };
  const handleTouchEnd = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      style={{ transformStyle: "preserve-3d" }}
      animate={
        interactive
          ? { y: [0, -6, 0], rotateY: [-1, 1, -1], transition: { duration: 6.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] } }
          : { y: 0, rotateY: 0, transition: { duration: 0.4, ease: EASE } }
      }
    >
      <div
        ref={wrapRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: 1200 }}
      >
        <div
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={slide.image}
            alt="Product"
            className="product-hero-img relative w-auto object-contain"
            style={{ filter: "drop-shadow(0 24px 26px rgba(91,107,168,0.28))" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Masked vertical title reveal — each line slides up out of an
// overflow-hidden mask with a short stagger, and softly lifts + fades on exit.
function TitleLayer({ slide }) {
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 px-4 select-none pointer-events-none">
      <div className="relative flex flex-col items-center">
        {slide.label.map((line, i) => (
          <span key={i} className="block overflow-hidden leading-[1.1] lg:leading-[0.98]">
            <motion.span
              className="hero-wordmark-font font-extrabold uppercase tracking-tight whitespace-nowrap block"
              style={{
                fontSize: `clamp(min(2.4rem, 9cqw), min(${fontSizeCqw}cqw, 34cqh), 15.5rem)`,
                color: slide.theme.text,
              }}
              initial={{ y: "112%", opacity: 0 }}
              animate={{
                y: "0%", opacity: 1,
                transition: { duration: TITLE_LINE_DURATION, delay: TITLE_LINE_BASE_DELAY + i * TITLE_LINE_STAGGER, ease: EASE },
              }}
              exit={{ y: "-40%", opacity: 0, transition: TITLE_EXIT_TRANSITION }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </div>
    </div>
  );
}

// The product layer: portal glow + rings + shadow + package, entering from
// depth (blurred, scaled down, tipped back) and settling forward into place.
function ImageLayer({ slide }) {
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);
  const [settled, setSettled] = useState(false);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 select-none">
      {/* Relative block sized to match the title's actual rendered height
          (same font-size formula + line-height as TitleLayer) so the
          product below can be centered on the real midpoint of the text,
          across any number of lines, instead of a guessed top offset. */}
      <div className="relative flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full" aria-hidden="true">
          {slide.label.map((line, i) => (
            <span
              key={i}
              className="hero-wordmark-font font-extrabold uppercase leading-[1.1] lg:leading-[0.98] tracking-tight whitespace-nowrap invisible"
              style={{ fontSize: `clamp(min(2.4rem, 9cqw), min(${fontSizeCqw}cqw, 34cqh), 15.5rem)` }}
            >
              {line}
            </span>
          ))}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <PortalGlow />
          <ConcentricRings />
          <motion.div
            className="relative flex flex-col items-center"
            style={{ transformStyle: "preserve-3d", transformPerspective: 1400 }}
            initial={{ opacity: 0, scale: 0.72, y: 40, rotateX: 8, filter: "blur(14px)" }}
            animate={{
              opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px)",
              transition: PRODUCT_ENTER_TRANSITION,
            }}
            exit={{
              opacity: 0, scale: 0.82, y: -10, filter: "blur(10px)",
              transition: PRODUCT_EXIT_TRANSITION,
            }}
            onAnimationComplete={(definition) => {
              if (typeof definition === "object" && definition.opacity === 1) setSettled(true);
            }}
          >
            <ProductStage slide={slide} interactive={settled} />
            <ProductShadow />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AnimatedStage({ activeIndex, imageVisible }) {
  const slide = SLIDES[activeIndex];
  const isLight = slide.theme.isLight;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-[1920px] h-[clamp(300px,58svh,460px)] sm:h-[clamp(340px,60svh,520px)] lg:h-[clamp(420px,68svh,760px)]"
      style={{ containerType: "size" }}
    >
      <AmbientDust isLight={isLight} />

      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <TitleLayer key={activeIndex} slide={slide} />
        </AnimatePresence>

        <AnimatePresence>
          {imageVisible && <ImageLayer key={`img-${activeIndex}`} slide={slide} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    setTagsVisible(false);
    setImageVisible(false);

    const showTags = setTimeout(() => setTagsVisible(true), TAGS_IN_DELAY);
    const hideTags = setTimeout(() => setTagsVisible(false), Math.max(TAGS_IN_DELAY + 400, HOLD_MS - TAGS_OUT_BEFORE_END));

    // Portal + product entrance: 0.45s – 1.7s
    const showImg = setTimeout(() => setImageVisible(true), IMAGE_SHOW_DELAY);
    // Depth exit: 3.4s – 4.2s (0.8s exit lands exactly on HOLD_MS)
    const hideImg = setTimeout(() => setImageVisible(false), IMAGE_HIDE_DELAY);

    const advanceSlide = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, HOLD_MS);

    return () => {
      clearTimeout(showTags);
      clearTimeout(hideTags);
      clearTimeout(showImg);
      clearTimeout(hideImg);
      clearTimeout(advanceSlide);
    };
  }, [activeIndex]);

  const slide = SLIDES[activeIndex];
  const isLight = slide.theme.isLight;

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden flex flex-col" style={{ backgroundColor: slide.theme.bg }}>
      <SlideBackgrounds activeIndex={activeIndex} />
      <FloorGlow isLight={isLight} />
      <GrainOverlay />

      <div className="relative z-20 flex flex-col items-center gap-1 pt-10 sm:pt-12 px-6">
        <div className="mt-4">
          <HeroHeadline isLight={isLight} />
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 pt-4 pb-12 sm:pt-12 sm:pb-16 lg:pt-10 lg:pb-4">
        <AnimatedStage activeIndex={activeIndex} imageVisible={imageVisible} />
      </div>
    </section>
  );
}

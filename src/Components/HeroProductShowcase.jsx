import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = {
  deep: "#6B78B8", base: "#9AB0FB", bright: "#BBD0FF",
  ice: "#DCEEFF", gold: "#E9C98A", goldLight: "#F6E0AC", goldGlow: "#FFF7E4",
  black: "#000000", white: "#FFFFFF",
  ink: "#333A63", inkSoft: "#4A5080", inkWarm: "#8A5A2E",
};

const EASE = [0.16, 1, 0.3, 1];

const THEME_COLORS = { icy: "#DCEEFF", cornflower: "#C7D6FF", customPersian: "#B9C9FA", dusk: "#CFC6EA", navy: "#B7C0E0" };

// Badge orbit layout — deliberately NOT mirrored: each of the 6 slots has its
// own distance, gap, scale and rotation, and the two ingredient images are
// mixed across slots instead of alternating, so it reads as naturally scattered.
const BADGE_SLOTS = [
  { id: "l1", x: -300, y: -215, scale: 0.88, rotate: -20, delay: 0.05, imgKey: "A" },
  { id: "l2", x: -410, y: 15, scale: 1.08, rotate: 24, delay: 0.19, imgKey: "B" },
  { id: "l3", x: -245, y: 250, scale: 0.8, rotate: -9, delay: 0.11, imgKey: "B" },
  { id: "r1", x: 265, y: -175, scale: 1.02, rotate: 19, delay: 0.07, imgKey: "B" },
  { id: "r2", x: 415, y: 65, scale: 0.76, rotate: -16, delay: 0.15, imgKey: "A" },
  { id: "r3", x: 305, y: 255, scale: 0.98, rotate: 11, delay: 0.09, imgKey: "A" },
];

function buildIngredientPair(prefix, imageA, imageB) {
  return BADGE_SLOTS.map((slot) => ({
    id: `${prefix}-${slot.id}`,
    image: slot.imgKey === "A" ? imageA : imageB,
    x: slot.x, y: slot.y, scale: slot.scale, rotate: slot.rotate, delay: slot.delay,
  }));
}

// SLIDES — 3 ingredient badges per side (6 total) orbiting each product.
// imageScale lets a single slide's product image be sized down/up relative
// to the shared .product-hero-img box without touching the other slides.
const SLIDES = [
  {
    image: "/wheat.png",
    imageScale: 0.85,
    label: ["ONE SHELF", "TEN CATEGORIES"],
    tags: ["60+ SKUs", "10 Categories", "Grocery To Personal Care", "Stronger Shelf Presence", "One Rule"],
    description: "We are not launching a product. We are launching a shelf — a complete FMCG system across 10 categories at once.",
    theme: { bg: THEME_COLORS.customPersian, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.4)", isLight: true },
    ingredients: buildIngredientPair("w", "/wheatbadge.png", "/wheatbadge1.png"),
  },
  {
    image: "/jam.png",
    label: ["OFFLINE TRUST", "ONLINE DEMAND"],
    tags: ["Retail Shelf Visibility", "Reels & Storytelling", "No-Drama Campaigns", "Distributor Network", "Demand Follows Trust"],
    description: "A visible brand block on real shelves creates trust. Online storytelling turns that trust into demand.",
    theme: { bg: THEME_COLORS.dusk, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.45)", isLight: true },
    ingredients: buildIngredientPair("s", "/straw1.png", "/straw.png"),
  },
  {
    image: "/chilli.png",
    label: ["HONEST", "EVERYDAY"],
    tags: ["No Fake Premium", "No Overclaims", "Fair Pricing", "Simple Products", "Trusted Quality"],
    description: "Good everyday products. Honest pricing. Nothing else.",
    theme: { bg: THEME_COLORS.icy, text: BRAND.ink, descText: BRAND.inkSoft, spotlight: "rgba(255,255,255,0.55)", isLight: true },
    ingredients: buildIngredientPair("c", "/chillis.png", "/chillis1.png"),
  },
];

// Timeline
const HOLD_MS = 4200, TAGS_IN_DELAY = 620, TAGS_OUT_BEFORE_END = 950;
const IMAGE_SHOW_DELAY = 450, IMAGE_HIDE_DELAY = 3400;
const BG_CROSSFADE_TRANSITION = { duration: 0.4, ease: EASE };
const PRODUCT_EXIT_TRANSITION = { duration: 0.6, ease: EASE };

// Product loop: rises to center, holds with a mild float, retreats the same way.
const PRODUCT_OUT_DURATION = 0.85, PRODUCT_HOLD_DURATION = 1.5, PRODUCT_BACK_DURATION = 0.85;
const PRODUCT_LOOP_DURATION = PRODUCT_OUT_DURATION + PRODUCT_HOLD_DURATION + PRODUCT_BACK_DURATION;
const PRODUCT_T1 = PRODUCT_OUT_DURATION / PRODUCT_LOOP_DURATION;
const PRODUCT_T_MID = (PRODUCT_OUT_DURATION + PRODUCT_HOLD_DURATION / 2) / PRODUCT_LOOP_DURATION;
const PRODUCT_T2 = (PRODUCT_OUT_DURATION + PRODUCT_HOLD_DURATION) / PRODUCT_LOOP_DURATION;
const PRODUCT_LOOP_TIMES = [0, PRODUCT_T1, PRODUCT_T_MID, PRODUCT_T2, 1];
const TITLE_LINE_DURATION = 0.65, TITLE_LINE_STAGGER = 0.09, TITLE_LINE_BASE_DELAY = 0.15;
const TITLE_EXIT_TRANSITION = { duration: 0.4, ease: EASE };

const NOISE_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const FONT_FIT_CONSTANT = 181, FONT_MIN_CQW = 12, FONT_MAX_CQW = 20;

function getTitleFontSizeCqw(labelLines) {
  const longest = Math.max(...labelLines.map((l) => l.length));
  return Math.min(FONT_MAX_CQW, Math.max(FONT_MIN_CQW, FONT_FIT_CONSTANT / longest));
}

// Responsive travel-distance scale — shrinks badge orbit radius on small screens
// without touching their visual size (handled by the badge wrapper classes).
function getBadgeOrbitScale() {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  return w < 480 ? 0.42 : w < 640 ? 0.5 : w < 768 ? 0.64 : w < 1024 ? 0.8 : 1;
}

function useBadgeOrbitScale() {
  const [orbitScale, setOrbitScale] = useState(getBadgeOrbitScale);
  useEffect(() => {
    const onResize = () => setOrbitScale(getBadgeOrbitScale());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return orbitScale;
}

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
            style={{ background: `radial-gradient(42% 38% at 50% 55%, ${slide.theme.spotlight}, transparent 74%)`, mixBlendMode: "overlay" }}
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
        style={{ bottom: "-30%", width: "150%", aspectRatio: "3 / 1", borderRadius: "9999px", filter: "blur(90px)", background: "radial-gradient(ellipse at center, rgba(171,210,250,0.12), transparent 70%)" }}
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
        
        /* Mobile View Adjustments: Reduced size and pushed down to overlap 2nd text line */
        .product-hero-img { 
          height: clamp(220px, 60cqw, 320px); 
          max-width: 80cqw; 
          margin-top: clamp(50px, 15cqw, 80px);
        }

        /* Tablet and PC View (Kept exactly as original) */
        @media (min-width: 640px) { 
          .product-hero-img { 
            height: clamp(360px, 68cqw, 480px); 
            max-width: 88cqw; 
            margin-top: 0;
          } 
        }
        @media (min-width: 768px) { 
          .product-hero-img { 
            height: clamp(400px, 58cqw, 520px); 
            max-width: 84cqw; 
            margin-top: 0;
          } 
        }
        @media (min-width: 1024px) { 
          .product-hero-img { 
            height: 580px; 
            max-width: none; 
            margin-top: 0;
          } 
        }
      `}</style>
    </div>
  );
}

function PortalGlow() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: "min(64cqw, 620px)", height: "min(64cqw, 620px)", background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 72%)", filter: "blur(22px)" }}
      initial={{ scale: 0.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { duration: 1.3, ease: EASE } }}
      exit={{ scale: 0.45, opacity: 0, transition: { duration: 0.8, ease: EASE } }}
      aria-hidden="true"
    />
  );
}

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
          style={{ width: "min(48cqw, 440px)", height: "min(30cqw, 280px)", border: "1px solid rgba(255,255,255,0.4)" }}
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

function ProductShadow() {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
      style={{ bottom: "3%", background: "radial-gradient(ellipse at center, rgba(58,68,118,0.38), transparent 72%)", filter: "blur(12px)" }}
      initial={{ width: "82%", height: "11%", opacity: 0.12 }}
      animate={{ width: "56%", height: "9%", opacity: 0.3, transition: { duration: 1.3, ease: EASE } }}
      exit={{ width: "80%", height: "10%", opacity: 0.08, transition: { duration: 0.8, ease: EASE } }}
      aria-hidden="true"
    />
  );
}

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

  const handleMouseMove = (e) => { if (interactive) updateFromPoint(e.clientX, e.clientY); };
  const handleMouseLeave = () => setTilt({ rx: 0, ry: 0 });
  const handleTouchStart = (e) => { if (interactive && e.touches[0]) updateFromPoint(e.touches[0].clientX, e.touches[0].clientY); };
  const handleTouchMove = (e) => { if (interactive && e.touches[0]) updateFromPoint(e.touches[0].clientX, e.touches[0].clientY); };
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
        <div style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d" }}>
          <img
            src={slide.image}
            alt="Product"
            className="product-hero-img relative w-auto object-contain"
            style={{ filter: "drop-shadow(0 24px 26px rgba(91,107,168,0.28))", transform: `scale(${slide.imageScale ?? 1})` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TitleLayer({ slide }) {
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 px-4 select-none pointer-events-none">
      <div className="relative flex flex-col items-center">
        {slide.label.map((line, i) => (
          <span key={i} className="block overflow-hidden leading-[1.1] lg:leading-[0.98]">
            <motion.span
              className="hero-wordmark-font font-extrabold uppercase tracking-tight whitespace-nowrap block"
              style={{ fontSize: `clamp(min(2.4rem, 9cqw), min(${fontSizeCqw}cqw, 34cqh), 15.5rem)`, color: slide.theme.text }}
              initial={{ y: "112%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1, transition: { duration: TITLE_LINE_DURATION, delay: TITLE_LINE_BASE_DELAY + i * TITLE_LINE_STAGGER, ease: EASE } }}
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

// IngredientBadge loops: emerges from behind the product, travels to its spot
// with a tilt/shake wiggle, holds with a bob, then retreats — repeating for as
// long as it's mounted. Unmount uses the same retreat motion for consistency.
function IngredientBadge({ ing, index, orbitScale }) {
  const tx = ing.x * orbitScale;
  const ty = ing.y * orbitScale;
  const hiddenRotate = ing.rotate - 70;
  const floatAmt = 9 * orbitScale;

  const outDuration = 0.55, holdDuration = 1.0, backDuration = 0.55;
  const duration = outDuration + holdDuration + backDuration;
  const t1 = outDuration / duration;
  const tMid = (outDuration + holdDuration / 2) / duration;
  const t2 = (outDuration + holdDuration) / duration;

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={{ x: 0, y: 0, scale: 0, rotate: hiddenRotate, opacity: 0 }}
        animate={{
          x: [0, tx, tx, 0],
          y: [0, ty, ty - floatAmt, ty, 0],
          scale: [0, ing.scale, ing.scale * 1.03, ing.scale, 0],
          opacity: [0, 1, 1, 1, 0],
          rotate: [hiddenRotate, ing.rotate + 28, ing.rotate, ing.rotate + 4, ing.rotate, ing.rotate - 24, hiddenRotate],
          transition: {
            default: { repeat: Infinity, delay: ing.delay },
            x: { duration, times: [0, t1, t2, 1], ease: ["easeOut", "linear", "easeIn"] },
            y: { duration, times: [0, t1, tMid, t2, 1], ease: ["easeOut", "easeInOut", "easeInOut", "easeIn"] },
            scale: { duration, times: [0, t1, tMid, t2, 1], ease: ["easeOut", "easeInOut", "easeInOut", "easeIn"] },
            opacity: { duration, times: [0, t1, tMid, t2, 1], ease: ["easeOut", "linear", "linear", "easeIn"] },
            rotate: { duration, times: [0, t1 * 0.55, t1, tMid, t2, t2 + (1 - t2) * 0.5, 1], ease: "easeInOut" },
          },
        }}
        exit={{ x: 0, y: 0, scale: 0, rotate: hiddenRotate, opacity: 0, transition: { duration: 0.5, ease: EASE, delay: index * 0.015 } }}
      >
        <img src={ing.image} alt="Ingredient" className="w-full h-full object-contain" style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.18))" }} />
      </motion.div>
    </div>
  );
}

function ImageLayer({ slide, orbitScale }) {
  const fontSizeCqw = getTitleFontSizeCqw(slide.label);
  const [settled, setSettled] = useState(false);

  // Product wrapper loops forever, so onAnimationComplete never fires — use a
  // timer matched to the "arrival" point to switch on mouse-tilt interactivity.
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), PRODUCT_OUT_DURATION * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4 select-none">
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

          {slide.ingredients && slide.ingredients.map((ing, i) => (
            <IngredientBadge key={ing.id} ing={ing} index={i} orbitScale={orbitScale} />
          ))}

          <motion.div
            className="relative flex flex-col items-center z-20"
            style={{ transformStyle: "preserve-3d", transformPerspective: 1400 }}
            initial={{ opacity: 0, scale: 0.72, y: 40, rotateX: 8, filter: "blur(14px)" }}
            animate={{
              opacity: [0, 1, 1, 1, 0],
              scale: [0.72, 1, 1.012, 1, 0.72],
              y: [40, 0, -4, 0, 40],
              rotateX: [8, 0, 0, 0, 8],
              filter: ["blur(14px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(14px)"],
              transition: {
                default: { repeat: Infinity },
                opacity: { duration: PRODUCT_LOOP_DURATION, times: PRODUCT_LOOP_TIMES, ease: ["easeOut", "linear", "linear", "easeIn"] },
                scale: { duration: PRODUCT_LOOP_DURATION, times: PRODUCT_LOOP_TIMES, ease: ["easeOut", "easeInOut", "easeInOut", "easeIn"] },
                y: { duration: PRODUCT_LOOP_DURATION, times: PRODUCT_LOOP_TIMES, ease: ["easeOut", "easeInOut", "easeInOut", "easeIn"] },
                rotateX: { duration: PRODUCT_LOOP_DURATION, times: PRODUCT_LOOP_TIMES, ease: ["easeOut", "linear", "linear", "easeIn"] },
                filter: { duration: PRODUCT_LOOP_DURATION, times: PRODUCT_LOOP_TIMES, ease: ["easeOut", "linear", "linear", "easeIn"] },
              },
            }}
            exit={{ opacity: 0, scale: 0.72, y: 30, filter: "blur(12px)", transition: PRODUCT_EXIT_TRANSITION }}
          >
            <ProductStage slide={slide} interactive={settled} />
            <ProductShadow />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function AnimatedStage({ activeIndex, imageVisible, orbitScale }) {
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
          {imageVisible && <ImageLayer key={`img-${activeIndex}`} slide={slide} orbitScale={orbitScale} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Bottom slide indicator — one pill per slide. The active pill widens and its
// inner bar fills left-to-right over HOLD_MS, so it's synced with the actual
// autoplay timing instead of just marking position. Track opacity + shadow
// bumped up for visibility against all three pastel theme backgrounds.
function SlideIndicators({ activeIndex, theme }) {
  return (
    <div className="absolute bottom-5 sm:bottom-7 lg:bottom-9 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 sm:gap-3" aria-hidden="true">
      {SLIDES.map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className="relative h-2 sm:h-2.5 rounded-full overflow-hidden"
            style={{
              width: isActive ? 40 : 10,
              backgroundColor: theme.text,
              opacity: 0.45,
              boxShadow: "0 1px 4px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.3)",
              transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
            }}
          >
            {isActive && (
              <motion.div
                key={activeIndex}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: theme.text, boxShadow: "0 0 8px rgba(0,0,0,0.3)" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tagsVisible, setTagsVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const orbitScale = useBadgeOrbitScale();

  useEffect(() => {
    SLIDES.forEach((s) => { const img = new Image(); img.src = s.image; });
  }, []);

  useEffect(() => {
    setTagsVisible(false);
    setImageVisible(false);

    const showTags = setTimeout(() => setTagsVisible(true), TAGS_IN_DELAY);
    const hideTags = setTimeout(() => setTagsVisible(false), Math.max(TAGS_IN_DELAY + 400, HOLD_MS - TAGS_OUT_BEFORE_END));
    const showImg = setTimeout(() => setImageVisible(true), IMAGE_SHOW_DELAY);
    const hideImg = setTimeout(() => setImageVisible(false), IMAGE_HIDE_DELAY);
    const advanceSlide = setTimeout(() => setActiveIndex((current) => (current + 1) % SLIDES.length), HOLD_MS);

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
    <section id="hero" className="relative min-h-[70svh] sm:min-h-[100svh] w-full overflow-hidden flex flex-col" style={{ backgroundColor: slide.theme.bg }}>
      <SlideBackgrounds activeIndex={activeIndex} />
      <FloorGlow isLight={isLight} />
      <GrainOverlay />

      <div className="relative z-20 flex flex-col items-center gap-1 pt-6 sm:pt-12 px-6">
        <div className="mt-4">
          <HeroHeadline isLight={isLight} />
        </div>
      </div>

      <div className="relative z-10 flex-1 min-h-0 w-full flex items-center justify-center px-4 pt-2 pb-6 sm:pt-12 sm:pb-16 lg:pt-10 lg:pb-4">
        <AnimatedStage activeIndex={activeIndex} imageVisible={imageVisible} orbitScale={orbitScale} />
      </div>

      <SlideIndicators activeIndex={activeIndex} theme={slide.theme} />
    </section>
  );
}
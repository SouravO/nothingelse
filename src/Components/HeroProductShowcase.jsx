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

const PRODUCT_IMAGES = ["/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];

const SHOWCASE_DATA = [
  { image: PRODUCT_IMAGES[0] },
  { image: PRODUCT_IMAGES[1] },
  { image: PRODUCT_IMAGES[2] },
  { image: PRODUCT_IMAGES[3] },
];

const SHOWCASE_N = SHOWCASE_DATA.length;

// ---- Table geometry (single source of truth) -------------------------------
// The table used to be a PNG with its own baked-in proportions, and the
// bottle's "rest here" position was a hand-tuned % guess against it, and the
// bottle's height jumped between fixed px values at each Tailwind breakpoint.
// Three independently-scaling things that only agreed by coincidence at the
// sizes that got tested — which is exactly why it looked fine on some
// desktops and broken on others.
//
// Now the table is drawn from this viewBox, and the bottle's rest line and
// size are both *fractions of this same box* (via CSS container query units,
// `cqw`, on the stage below). There's one number line, not three, so it
// can't drift out of sync at any viewport width.
const TABLE_VB_W = 1221;
const TABLE_VB_H = 681;
const TABLE_ASPECT_RATIO = `${TABLE_VB_W} / ${TABLE_VB_H}`;

const TABLE_CENTER_X = TABLE_VB_W / 2;
const TABLE_TOP_CENTER_Y = 250;
const TABLE_TOP_RX = 300;
const TABLE_TOP_RY = 46;
const TABLE_EDGE_THICKNESS = 16;

const LEG_WIDTH = 16;
const LEG_BOTTOM_Y = 600;

const BASE_CENTER_Y = 604;
const BASE_RX = 130;
const BASE_RY = 18;
const BASE_THICKNESS = 12;

// Front-most point of the tabletop disc — where a centered bottle's base
// should sit for it to read as resting on the table.
const SURFACE_Y = TABLE_TOP_CENTER_Y + TABLE_TOP_RY;
const SURFACE_FROM_BOTTOM_PCT = ((TABLE_VB_H - SURFACE_Y) / TABLE_VB_H) * 100;

// Moves the whole table+product group up/down within its section. Using a
// transform here (instead of padding-top on the centering wrapper) so it's
// a single predictable knob that doesn't also change how flex distributes
// space above/below — positive = further down the page.
const TABLE_VERTICAL_SHIFT = "20%";

// Bottle height as a fraction of the STAGE's own width (cqw = % of the
// nearest `container-type` ancestor, set on the stage wrapper below).
// Because it's expressed the same way as the table geometry — as a fraction
// of the same box — it stays in proportion at every screen size, instead of
// only at the breakpoint it was tuned on.
const PRODUCT_HEIGHT = "clamp(170px, 50cqw, 540px)";

// ---- Per-product tuning ----------------------------------------------------
// Each product PNG almost certainly has a different amount of transparent
// padding baked into its canvas (different bottle heights, different export
// margins), so one global "sits on the table" number can't work for all of
// them. Nudge each one individually here until its base visually touches
// the tabletop. In cqw, so a value tuned at one size stays correct at every
// size. Positive = further down (closer to the table), negative = further
// up. Started all four at the same value (pdt2's tuned nudge) since they're
// likely from the same shoot/export — check pdt3/pdt4/pdt5 individually as
// they cycle through and adjust their own index if any still show a gap.
const PRODUCT_Y_NUDGE_CQW = [3, 3, 3, 3];

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

// ---- Ambient depth --------------------------------------------------------
// The product stage was a flat gradient with a table dropped in the middle —
// nothing to give it depth. A handful of slow, low-opacity drifting dots
// behind the table reads as ambient dust/light without competing with the
// product or text. Cheap (no canvas, no images), same visual language as
// the particle work on Pitch Studio.
// ---- Ambient depth --------------------------------------------------------
// Previous version was uniform dots jittering on the spot — random noise,
// no sense of intent. This version gives them a single shared direction
// (slow upward drift, like light motes rising past the product) and ties
// size to blur so nearer/farther particles read as actual depth rather
// than identical dots at different opacities. One in four uses the brand
// gold instead of ice-blue, echoing the badge/CTA color so it feels tied
// to the palette instead of generic sparkle.
function AmbientDust() {
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => {
        // Bigger particle = "closer" = sharper + brighter. Smaller = "farther"
        // = softer + dimmer. Same rule for every dot, so the variation reads
        // as depth rather than randomness.
        const blur = Math.max(0, 3 - p.size * 0.3);
        const peakOpacity = 0.25 + (p.size / 10) * 0.45;
        const color = p.gold ? "#F3CE7C" : "#AFC7FF";

        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              background: `radial-gradient(circle, #ffffff 0%, ${color} 65%, transparent 100%)`,
              filter: `blur(${blur}px)`,
              boxShadow: `0 0 ${p.size * 1.8}px rgba(${p.gold ? "243,206,124" : "175,199,255"},0.4)`,
            }}
            animate={{
              y: [0, -140 - p.size * 6],
              opacity: [0, peakOpacity, peakOpacity, 0],
              x: [0, i % 2 === 0 ? 10 : -10],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
              times: [0, 0.15, 0.8, 1],
            }}
          />
        );
      })}
    </div>
  );
}

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm"
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.gold }} />
      <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#F3CE7C]">
        4 staples — zero fillers
      </span>
    </motion.div>
  );
}

function HeroCTA() {
  return (
    <motion.a
      href="#products"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group inline-flex items-center gap-2.5 mt-8 px-6 py-3.5 rounded-full font-body font-medium text-[15px] text-[#0B1B5C] shadow-[0_8px_30px_rgba(217,168,74,0.35)]"
      style={{ background: `linear-gradient(135deg, ${BRAND.goldLight}, ${BRAND.gold})` }}
    >
      Explore the range
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="#0B1B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.a>
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

// ---- The table, drawn in code -----------------------------------------------
// Same disc trick for both the tabletop and the base: an "edge" ellipse
// drawn first, offset down by the material's thickness, then the "top face"
// ellipse drawn on top of it — the thin crescent that peeks out below the
// top face reads as the rim/thickness of the object.
function TableGraphic() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox={`0 0 ${TABLE_VB_W} ${TABLE_VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tableTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E7E0D2" />
          <stop offset="55%" stopColor="#CFC7B6" />
          <stop offset="100%" stopColor="#B7AE9A" />
        </linearGradient>
        <linearGradient id="tableEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A79E8C" />
          <stop offset="100%" stopColor="#8C8271" />
        </linearGradient>
        <linearGradient id="metalLeg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1C1C1F" />
          <stop offset="45%" stopColor="#4A4A50" />
          <stop offset="55%" stopColor="#4A4A50" />
          <stop offset="100%" stopColor="#0A0A0C" />
        </linearGradient>
        <linearGradient id="metalBaseTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5A5A60" />
          <stop offset="100%" stopColor="#232326" />
        </linearGradient>
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground contact shadow */}
      <ellipse
        cx={TABLE_CENTER_X}
        cy={BASE_CENTER_Y + BASE_THICKNESS + 18}
        rx={BASE_RX * 1.6}
        ry={22}
        fill="url(#floorShadow)"
      />

      {/* leg */}
      <rect
        x={TABLE_CENTER_X - LEG_WIDTH / 2}
        y={SURFACE_Y + TABLE_EDGE_THICKNESS - 4}
        width={LEG_WIDTH}
        height={LEG_BOTTOM_Y - (SURFACE_Y + TABLE_EDGE_THICKNESS - 4)}
        rx={LEG_WIDTH / 2}
        fill="url(#metalLeg)"
      />

      {/* base */}
      <ellipse cx={TABLE_CENTER_X} cy={BASE_CENTER_Y + BASE_THICKNESS} rx={BASE_RX} ry={BASE_RY} fill="#161618" />
      <ellipse cx={TABLE_CENTER_X} cy={BASE_CENTER_Y} rx={BASE_RX} ry={BASE_RY} fill="url(#metalBaseTop)" />

      {/* tabletop */}
      <ellipse
        cx={TABLE_CENTER_X}
        cy={TABLE_TOP_CENTER_Y + TABLE_EDGE_THICKNESS}
        rx={TABLE_TOP_RX}
        ry={TABLE_TOP_RY}
        fill="url(#tableEdge)"
      />
      <ellipse cx={TABLE_CENTER_X} cy={TABLE_TOP_CENTER_Y} rx={TABLE_TOP_RX} ry={TABLE_TOP_RY} fill="url(#tableTop)" />
      <ellipse
        cx={TABLE_CENTER_X - TABLE_TOP_RX * 0.25}
        cy={TABLE_TOP_CENTER_Y - TABLE_TOP_RY * 0.35}
        rx={TABLE_TOP_RX * 0.4}
        ry={TABLE_TOP_RY * 0.3}
        fill="#FFFFFF"
        opacity="0.25"
      />
    </svg>
  );
}

function LandingProduct({ activeIndex }) {
  const nudgeCqw = PRODUCT_Y_NUDGE_CQW[activeIndex] ?? 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        className="relative flex flex-col items-center"
        style={{ transform: `translateY(${nudgeCqw}cqw)` }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.img
          src={SHOWCASE_DATA[activeIndex].image}
          alt="Product"
          className="relative z-10 w-auto object-contain"
          style={{ height: PRODUCT_HEIGHT, filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.35))" }}
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

      <div className="relative z-10 w-full h-[440px] sm:h-[520px] md:absolute md:inset-y-0 md:right-0 md:h-full md:w-[56%] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-[100%] sm:w-[95%] md:w-[98%] lg:w-[90%] xl:w-[85%] max-w-[1050px]"
            style={{
              aspectRatio: TABLE_ASPECT_RATIO,
              transform: `translateY(${TABLE_VERTICAL_SHIFT})`,
              containerType: "inline-size",
            }}
          >
            <AmbientDust />
            <TableGraphic />

            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{ bottom: `${SURFACE_FROM_BOTTOM_PCT}%` }}
            >
              <LandingProduct activeIndex={activeIndex} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-40 h-[calc(100%-440px)] sm:h-[calc(100%-520px)] md:h-full flex items-center">
        <div className="w-full px-6 sm:px-12 md:w-[44%] md:pr-6">
          <div className="max-w-full md:pl-8">
            <HeroBadge />

            <HeroHeadline />

            <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-white to-transparent opacity-70 mb-6" />

            <p className="font-body text-lg sm:text-xl text-blue-50/90 font-light leading-relaxed max-w-lg drop-shadow-md">
              A minimalist FMCG brand built for India first, then GCC and global markets.
            </p>

            <HeroCTA />

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
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/* =========================================================
   Design tokens for the text system
   — light-to-dark blue ramp, echoes the sunburst rays
   — tweak these two arrays to retune the whole section
   ========================================================= */
const ACCENTS = ["#A9C6FF", "#6E93FF", "#3D63E0", "#0C4DD5"];
const FLOATS = [0, 1, 2, 3]; // stagger index for ambient bob only, no tilt anymore

/* =========================================================
   Side text block (no card, no glass, no border)
   Standard FMCG editorial pattern:
   kicker label -> bold title -> accent underline -> body copy
   Only motion left is a slow ambient bob (independent of
   scroll) so the copy still feels alive on the page.
   ========================================================= */
function SideText({ title, text, index, side, reduceMotion }) {
  const accent = ACCENTS[index];
  const isRight = side === "right";

  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 5.5 + index * 0.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }
      }
      className={`relative w-[260px] md:w-[280px] lg:w-[340px] xl:w-[400px] 2xl:w-[440px]
                  ${isRight ? "text-right items-end" : "text-left items-start"}
                  flex flex-col`}
    >
      

      {/* title */}
      <h3 className="font-head font-extrabold text-[#111111] text-2xl md:text-[26px] lg:text-[30px] xl:text-[34px] leading-[1.05] tracking-tight mb-3 xl:mb-4">
        {title}
      </h3>

      {/* accent underline */}
      <div
        className="h-[4px] w-14 xl:w-16 rounded-full mb-3 xl:mb-4"
        style={{ background: `linear-gradient(${isRight ? "270deg" : "90deg"}, ${accent}, transparent)` }}
      />

      {/* body copy */}
      <p className="font-body text-[#4B5567] text-[15px] md:text-base xl:text-[17px] leading-relaxed max-w-[280px] xl:max-w-[320px]">
        {text}
      </p>
    </motion.div>
  );
}

/* =========================================================
   Main About Section
   ========================================================= */
export default function AboutSection() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sunburstScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.2]);
  const sunburstRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const textScale = useTransform(scrollYProgress, [0, 0.4], [0.95, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, 20]);

  const leftCards = [
    { title: "Radical Simplicity", text: "What does this actually need to do, and what can we take away?" },
    { title: "Everyday Quality", text: "The same good product every time you buy it — no quiet formula changes." },
    { title: "Recognisable Shelf", text: "Every pack reads as the same brand from ten feet away — on purpose." },
    { title: "Just The Product", text: "If a design exists just to make the box busier, it doesn't survive." },
  ];

  const rightCards = [
    { title: "Fair Pricing", text: "The price on the shelf is the price you pay. No inflated MRP built in." },
    { title: "No Extras", text: "No added fragrance you didn't ask for, no bonus gimmick." },
    { title: "Honest Brand", text: "Not cheap. Not luxury. Not overdesigned. Modern and honest." },
    { title: "Nothing Else.", text: "The logo is already complete. Add nothing else." },
  ];

  return (
    <section id="about" ref={containerRef} className="relative bg-[#FAFBFF] h-[200vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient centre glow so the text has something to sit against */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(163,193,255,0.35),transparent_60%)]" />

        {/* Sunburst rays */}
        <motion.div
          style={{ scale: sunburstScale, rotate: sunburstRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="absolute top-1/2 left-1/2 w-0 h-0">
            {[...Array(42)].map((_, i) => {
              const rotation = i * (360 / 42);
              const colors = [
                "bg-[#0C4DD5]",
                "bg-[#477BFF]",
                "bg-[#A3C1FF]",
                "bg-[#E2E8F0]",
                "bg-[#111111]/10",
                "bg-[#111111]/5",
              ];
              const color = colors[i % colors.length];
              const heights = [60, 120, 160, 90, 180, 140, 220];
              const height = heights[i % heights.length];
              const offsets = [130, 165, 145, 195, 120, 175];
              const offset = offsets[i % offsets.length];
              const widths = [12, 18, 24, 16, 20];
              const width = widths[i % widths.length];

              return (
                <div
                  key={i}
                  className={`absolute bottom-0 ${color} rounded-full`}
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    marginLeft: `-${width / 2}px`,
                    transformOrigin: "bottom center",
                    transform: `rotate(${rotation}deg) translateY(-${offset}px)`,
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* LEFT SIDE TEXT — always visible, no scroll reveal, no card */}
        <div className="absolute left-2 md:left-4 lg:left-10 xl:left-16 2xl:left-24 top-0 h-full hidden md:flex flex-col justify-center gap-8 lg:gap-10 xl:gap-12 z-30">
          {leftCards.map((card, index) => (
            <SideText
              key={`left-${index}`}
              title={card.title}
              text={card.text}
              index={index}
              side="left"
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        {/* RIGHT SIDE TEXT — always visible, no scroll reveal, no card */}
        <div className="absolute right-2 md:right-4 lg:right-10 xl:right-16 2xl:right-24 top-0 h-full hidden md:flex flex-col justify-center gap-8 lg:gap-10 xl:gap-12 z-30">
          {rightCards.map((card, index) => (
            <SideText
              key={`right-${index}`}
              title={card.title}
              text={card.text}
              index={index}
              side="right"
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        {/* Central Title — stacked two lines: "nothing" / "else." */}
        <motion.div
          style={{ scale: textScale, y: textY }}
          className="relative z-20 flex flex-col items-center transform-gpu"
        >
          <h2 className="font-head font-black text-[#111111] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] select-none drop-shadow-md text-center">
            <span className="block">nothing</span>
            <span className="block">else.</span>
          </h2>
        </motion.div>

        {/* Mobile fallback — horizontal snap-scroll list, same editorial style, no cards */}
        <div className="md:hidden absolute bottom-6 left-0 right-0 z-30">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 pb-2 [&::-webkit-scrollbar]:hidden">
            {[...leftCards, ...rightCards].map((card, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <div
                  key={`mobile-${i}`}
                  className="snap-start shrink-0 w-[78vw] flex flex-col"
                >
                  
                  <h4 className="font-head font-extrabold text-[#111111] text-lg leading-tight mb-2">
                    {card.title}
                  </h4>
                  <div
                    className="h-[3px] w-10 rounded-full mb-2"
                    style={{ background: accent }}
                  />
                  <p className="font-body text-[#4B5567] text-[13px] leading-relaxed">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
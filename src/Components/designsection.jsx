import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Compact echo of the hero sunburst — a handful of slim rays around a small
// center disc, sized to work as a permanent brand mark once the pillar is shut.
function MiniSunburst() {
  const rays = [...Array(18)].map((_, i) => {
    const rotation = i * (360 / 18);
    const colors = [
      "bg-[#0C4DD5]", "bg-[#477BFF]", "bg-[#A3C1FF]",
      "bg-[#E2E8F0]", "bg-[#111111]/10",
    ];
    const color = colors[i % colors.length];
    const heights = [24, 40, 30, 46, 34];
    const height = heights[i % heights.length];
    const offset = 32;
    const width = i % 3 === 0 ? 4 : 3;
    return { rotation, color, height, offset, width, key: i };
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Slowly rotating ray fan — independent of scroll, gives the sealed mark a subtle sense of life */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 w-0 h-0">
          {rays.map((r) => (
            <div
              key={r.key}
              className={`absolute bottom-0 ${r.color}`}
              style={{
                width: `${r.width}px`,
                height: `${r.height}px`,
                marginLeft: `-${r.width / 2}px`,
                transformOrigin: "bottom center",
                transform: `rotate(${r.rotation}deg) translateY(-${r.offset}px)`,
                borderRadius: "1px",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Center disc with the wordmark, sitting still while the rays turn around it */}
      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-[0_8px_24px_rgba(12,77,213,0.2)] ring-1 ring-[#0C4DD5]/15">
        <div className="flex flex-col items-center justify-center text-center leading-[1.05]">
          <span className="font-head font-black text-[#111111]" style={{ fontSize: "10px" }}>
            nothing
          </span>
          <span className="font-head font-black text-[#111111]" style={{ fontSize: "10px" }}>
            else.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DesignSection() {
  const containerRef = useRef(null);

  // Set to 200vh.
  // 0% to 50% of scroll: The animation plays.
  // 50% to 100% of scroll: Everything is completely frozen.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // By explicitly mapping the end of the scroll (1) to the exact same final value,
  // we guarantee absolutely zero movement or fading after it finishes at 0.5.
  const sunburstScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.15, 1.15]);
  const sunburstRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 20]);
  const textScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 1.05]);

  // The compressing "screen": full viewport width at scroll start, closes all the
  // way to 0 by the midpoint — a true seam, not a resting gap — then locks shut.
  const pillarWidth = useTransform(scrollYProgress, [0, 0.5, 1], ["100vw", "0vw", "0vw"]);

  // Big glow + title fade out well before the pillar finishes closing, so nothing
  // gets awkwardly cropped mid-fade as the window shrinks to nothing.
  const heroContentOpacity = useTransform(scrollYProgress, [0, 0.24, 0.36, 1], [1, 1, 0, 0]);

  // The mini brand mark only appears once the pillar has fully sealed shut —
  // no overlap, no gap between the two states.
  const markOpacity = useTransform(scrollYProgress, [0.46, 0.58, 1], [0, 1, 1]);
  const markScale = useTransform(scrollYProgress, [0.46, 0.58, 1], [0.7, 1, 1]);

  return (
    <section
      id="design"
      ref={containerRef}
      className="section-paint-lazy relative bg-[#FAFBFF] h-[200vh]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&display=swap');
        .principle-serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* Left principles — sit underneath the pillar, revealed as it narrows.
            Narrower column + extra center-side padding + tighter max-w on mobile
            keep this text clear of the mini mark on small screens; sm:/md: values
            match the original desktop layout exactly. */}
        <div className="absolute inset-y-0 left-0 z-0 w-[44%] sm:w-1/2 flex flex-col justify-center gap-10 sm:gap-12 md:gap-16 pl-[4vw] sm:pl-[6vw] pr-[6vw] sm:pr-[3vw]">
          <div className="max-w-[140px] sm:max-w-[360px]">
            <h3 className="principle-serif text-lg sm:text-3xl md:text-4xl text-[#0C4DD5] leading-tight mb-2 sm:mb-3">
              Say What It Is
            </h3>
            <p className="text-[11px] sm:text-sm md:text-base text-gray-600 leading-relaxed">
              No invented stories, no lifestyle spin. Just the product name, what it does, and nothing dressed up around it.
            </p>
          </div>
          <div className="max-w-[140px] sm:max-w-[360px]">
            <h3 className="principle-serif text-lg sm:text-3xl md:text-4xl text-[#0C4DD5] leading-tight mb-2 sm:mb-3">
              No Fake Premium
            </h3>
            <p className="text-[11px] sm:text-sm md:text-base text-gray-600 leading-relaxed">
              No heavy packaging, no celebrity campaigns, no artificial premium positioning. Just clean design that does its job.
            </p>
          </div>
        </div>

        {/* Right principles — mirrored spacing rules */}
        <div className="absolute inset-y-0 right-0 z-0 w-[44%] sm:w-1/2 flex flex-col items-end justify-center gap-10 sm:gap-12 md:gap-16 pr-[4vw] sm:pr-[6vw] pl-[6vw] sm:pl-[3vw] text-right">
          <div className="max-w-[140px] sm:max-w-[360px]">
            <h3 className="principle-serif text-lg sm:text-3xl md:text-4xl text-[#0C4DD5] leading-tight mb-2 sm:mb-3">
              Honest Pricing
            </h3>
            <p className="text-[11px] sm:text-sm md:text-base text-gray-600 leading-relaxed">
              Positioned between cheap basics and overpriced legacy brands. Smart value, not inflated retail markups.
            </p>
          </div>
          <div className="max-w-[140px] sm:max-w-[360px]">
            <h3 className="principle-serif text-lg sm:text-3xl md:text-4xl text-[#0C4DD5] leading-tight mb-2 sm:mb-3">
              One Shelf, One Rule
            </h3>
            <p className="text-[11px] sm:text-sm md:text-base text-gray-600 leading-relaxed">
              60+ SKUs across 10 categories from day one, grocery to home care, all held to the same honest standard.
            </p>
          </div>
        </div>

        {/* Compressing center pillar — the "screen" that closes fully shut on scroll */}
        <motion.div
          style={{ width: pillarWidth }}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full z-10 overflow-hidden bg-[#FAFBFF]"
        >
          {/* Fixed at full viewport width so it only gets cropped by the parent's
              shrinking overflow-hidden window, never rescaled */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full flex flex-col items-center justify-center">

            {/* Ambient center glow */}
            <motion.div
              style={{ opacity: heroContentOpacity }}
              className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(163,193,255,0.35),transparent_60%)]"
            />

            {/* Sunburst rays */}
            <motion.div
              style={{ scale: sunburstScale, rotate: sunburstRotate, opacity: heroContentOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
              <div className="absolute top-1/2 left-1/2 w-0 h-0">
                {[...Array(40)].map((_, i) => {
                  const rotation = i * (360 / 40);
                  const colors = [
                    "bg-[#0C4DD5]", "bg-[#477BFF]", "bg-[#A3C1FF]",
                    "bg-[#E2E8F0]", "bg-[#111111]/10", "bg-[#111111]/5",
                  ];
                  const color = colors[i % colors.length];
                  const heights = [140, 260, 180, 320, 200, 280, 160, 220];
                  const height = heights[i % heights.length];
                  const offsets = [100, 130, 110, 150, 120, 140];
                  const offset = offsets[i % offsets.length];
                  const widths = [16, 28, 20, 36, 24, 30];
                  const width = widths[i % widths.length];

                  const clipPaths = [
                    "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",
                    "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                    "polygon(10% 0, 90% 0, 95% 100%, 5% 100%)",
                  ];
                  const clipPath = clipPaths[i % clipPaths.length];

                  return (
                    <div
                      key={i}
                      className={`absolute bottom-0 ${color}`}
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        marginLeft: `-${width / 2}px`,
                        transformOrigin: "bottom center",
                        transform: `rotate(${rotation}deg) translateY(-${offset}px)`,
                        clipPath: clipPath,
                        borderRadius: "2px",
                      }}
                    />
                  );
                })}
              </div>
            </motion.div>

            {/* Central Title — fades out well before the pillar finishes closing */}
            <motion.div
              style={{ scale: textScale, opacity: heroContentOpacity }}
              className="relative z-20 flex flex-col items-center transform-gpu pointer-events-none"
            >
              <h2 className="font-head font-black text-[#111111] text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] select-none text-center drop-shadow-md">
                <span className="block">nothing</span>
                <span className="block">else.</span>
              </h2>
            </motion.div>

          </div>
        </motion.div>

        {/* Mini brand mark — independent of the pillar, only appears once the
            seam has fully closed. Sits centered on top of everything.
            Inner wrapper scales the mark down on phones (separate element from
            the motion.div's own scroll-driven scale, so the two transforms don't collide). */}
        <motion.div
          style={{ opacity: markOpacity, scale: markScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
        >
          <div className="scale-[0.55] sm:scale-[0.75] md:scale-100">
            <MiniSunburst />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
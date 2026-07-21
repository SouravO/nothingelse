import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

  const distanceX = "40vw";
  const distanceY = "40vh";

  // Cards animate in until 0.5, then lock perfectly at 0vw/0vh until the user leaves the section
  const tlX = useTransform(scrollYProgress, [0, 0.5, 1], [`-${distanceX}`, "0vw", "0vw"]);
  const tlY = useTransform(scrollYProgress, [0, 0.5, 1], [`-${distanceY}`, "0vh", "0vh"]);
  
  const trX = useTransform(scrollYProgress, [0, 0.5, 1], [distanceX, "0vw", "0vw"]);
  const trY = useTransform(scrollYProgress, [0, 0.5, 1], [`-${distanceY}`, "0vh", "0vh"]);
  
  const blX = useTransform(scrollYProgress, [0, 0.5, 1], [`-${distanceX}`, "0vw", "0vw"]);
  const blY = useTransform(scrollYProgress, [0, 0.5, 1], [distanceY, "0vh", "0vh"]);
  
  const brX = useTransform(scrollYProgress, [0, 0.5, 1], [distanceX, "0vw", "0vw"]);
  const brY = useTransform(scrollYProgress, [0, 0.5, 1], [distanceY, "0vh", "0vh"]);

  // Opacity fades in cleanly by 0.4, and is strictly locked at 1 (fully visible) until the end
  const cardOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  return (
    <section
      id="design"
      ref={containerRef}
      className="section-paint-lazy relative bg-[#FAFBFF] h-[200vh]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient center glow */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(163,193,255,0.35),transparent_60%)]" />

        {/* Sunburst rays */}
        <motion.div
          style={{ scale: sunburstScale, rotate: sunburstRotate }}
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

        {/* 
            CARD LAYER 
            Anchored perfectly to the center of the viewport
        */}
        <div className="absolute top-1/2 left-1/2 w-0 h-0 z-30 pointer-events-none">
          
          {/* Top Left Card */}
          <motion.div 
            style={{ x: tlX, y: tlY, opacity: cardOpacity }} 
            className="absolute right-[12vw] md:right-[15vw] bottom-[15vh] md:bottom-[18vh] w-[260px] md:w-[320px] pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-blue-50 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#0C4DD5] rounded-full" />
                </div>
                <h3 className="font-bold text-[#0C4DD5] text-lg md:text-xl tracking-tight m-0">
                  Pure Ingredients
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-snug m-0">
                Zero fillers, zero compromises. Just the absolute essentials that get the job done.
              </p>
            </div>
          </motion.div>

          {/* Top Right Card */}
          <motion.div 
            style={{ x: trX, y: trY, opacity: cardOpacity }} 
            className="absolute left-[12vw] md:left-[15vw] bottom-[15vh] md:bottom-[18vh] w-[260px] md:w-[320px] pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-blue-50 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#0C4DD5] rounded-full" />
                </div>
                <h3 className="font-bold text-[#0C4DD5] text-lg md:text-xl tracking-tight m-0">
                  Honest Pricing
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-snug m-0">
                Direct from us to you. No middleman markups or artificial retail inflation.
              </p>
            </div>
          </motion.div>

          {/* Bottom Left Card */}
          <motion.div 
            style={{ x: blX, y: blY, opacity: cardOpacity }} 
            className="absolute right-[12vw] md:right-[15vw] top-[15vh] md:top-[18vh] w-[260px] md:w-[320px] pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-blue-50 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#0C4DD5] rounded-full" />
                </div>
                <h3 className="font-bold text-[#0C4DD5] text-lg md:text-xl tracking-tight m-0">
                  Sustainable Focus
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-snug m-0">
                Thoughtfully sourced and responsibly packaged for a much lighter footprint.
              </p>
            </div>
          </motion.div>

          {/* Bottom Right Card */}
          <motion.div 
            style={{ x: brX, y: brY, opacity: cardOpacity }} 
            className="absolute left-[12vw] md:left-[15vw] top-[15vh] md:top-[18vh] w-[260px] md:w-[320px] pointer-events-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-blue-50 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-[#0C4DD5] rounded-full" />
                </div>
                <h3 className="font-bold text-[#0C4DD5] text-lg md:text-xl tracking-tight m-0">
                  Everyday Staples
                </h3>
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-snug m-0">
                Built for India first, carefully formulated for modern living spaces worldwide.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Central Title */}
        <motion.div
          style={{ scale: textScale }}
          className="relative z-20 flex flex-col items-center transform-gpu pointer-events-none"
        >
          <h2 className="font-head font-black text-[#111111] text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.85] select-none text-center drop-shadow-md">
            <span className="block">nothing</span>
            <span className="block">else.</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}

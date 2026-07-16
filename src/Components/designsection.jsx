import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DesignSection() {
  const containerRef = useRef(null);

  // Scroll tracking for the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Adjusted for a slight, high-end scaling and rotation effect
  const sunburstScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.15]);
  const sunburstRotate = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [0.95, 1.05]);

  return (
    <section id="design" ref={containerRef} className="relative bg-[#FAFBFF] h-[150vh]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Ambient center glow to make the text pop */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(163,193,255,0.35),transparent_60%)]" />

        {/* Sunburst rays */}
        <motion.div
          style={{ scale: sunburstScale, rotate: sunburstRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="absolute top-1/2 left-1/2 w-0 h-0">
            {[...Array(40)].map((_, i) => {
              const rotation = i * (360 / 40);
              
              // Reverted to your original blue/grey color palette
              const colors = [
                "bg-[#0C4DD5]",
                "bg-[#477BFF]",
                "bg-[#A3C1FF]",
                "bg-[#E2E8F0]",
                "bg-[#111111]/10",
                "bg-[#111111]/5",
              ];
              const color = colors[i % colors.length];
              
              // Varied heights and offsets for an organic, hand-painted feel
              const heights = [140, 260, 180, 320, 200, 280, 160, 220];
              const height = heights[i % heights.length];
              const offsets = [100, 130, 110, 150, 120, 140];
              const offset = offsets[i % offsets.length];
              const widths = [16, 28, 20, 36, 24, 30];
              const width = widths[i % widths.length];

              // Tapered clip-paths to replace the pill-shape with rougher sun rays
              const clipPaths = [
                "polygon(20% 0, 80% 0, 100% 100%, 0 100%)",  // Wider base
                "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",  // Wider top
                "polygon(10% 0, 90% 0, 95% 100%, 5% 100%)",  // Slight taper
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
                    borderRadius: "2px", // Slight softening of the sharp polygon edges
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Central Title */}
        <motion.div
          style={{ scale: textScale }}
          className="relative z-20 flex flex-col items-center transform-gpu"
        >
          <h2 className="font-head font-black text-[#111111] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter leading-[0.85] select-none text-center drop-shadow-md">
            <span className="block">nothing</span>
            <span className="block">else.</span>
          </h2>
        </motion.div>
        
      </div>
    </section>
  );
}
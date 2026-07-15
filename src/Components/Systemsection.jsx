import { useState, useEffect, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    num: "Step 01",
    title: (
      <>
        Groceries, <br />
        <span className="text-[#0C4DD5]">Redefined.</span>
      </>
    ),
    desc: "We believe premium quality shouldn’t come with a premium price tag. Our transparent system cuts the noise, delivering everyday essentials straight to you.",
  },
  {
    num: "Step 02",
    title: (
      <>
        Honest <br />
        <span className="text-[#0C4DD5]">Sourcing.</span>
      </>
    ),
    desc: "No middlemen. No hidden markups. We partner directly with top-tier manufacturers to bring you FMCG staples at their true, authentic cost.",
  },
  {
    num: "Step 03",
    title: (
      <>
        Unmatched <br />
        <span className="text-[#0C4DD5]">Value.</span>
      </>
    ),
    desc: "High-quality groceries beautifully packaged to elevate your home. Everything you need, nothing you don't. Zero compromises. Nothing else.",
  },
];

export default function SystemSection() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track the scroll progress within this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Listen to scroll progress and cleanly switch steps without overlapping
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (latest < 0.33) {
        setActiveIndex(0);
      } else if (latest >= 0.33 && latest < 0.66) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Expanded typography text to wrap around the larger circle flawlessly
  const circleText = "NOTHING ELSE • HIGH QUALITY • AFFORDABLE PRICES • DIRECT TO CONSUMER • ".repeat(2);

  return (
    <section
      id="system"
      ref={containerRef}
      className="relative bg-[#111111] h-[300vh]"
    >
      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden w-full">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 w-full relative z-10">
          
          {/* Using a custom grid ratio to give the larger circle ample breathing room */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            {/* =========================================
                LEFT SIDE: STATIC FLOATING IMAGE
                ========================================= */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative flex justify-center lg:justify-start"
            >
              {/* Soft Blue Glow behind the image */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#0C4DD5] blur-[130px] rounded-full opacity-25"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              
              {/* Floating Product Basket Image (Scaled Up) */}
              <motion.img
                src="/about.png"
                alt="Nothing Else Products"
                className="relative z-10 w-full max-w-[480px] lg:max-w-[580px] object-contain drop-shadow-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* =========================================
                RIGHT SIDE: EXPANDED CIRCULAR CONTAINER
                ========================================= */}
            <div className="lg:col-span-7 relative flex items-center justify-center w-full max-w-[580px] sm:max-w-[620px] mx-auto aspect-square">
              
              {/* Scaled SVG Typography Ring (Bigger Viewbox & Circle Diameter) */}
              <motion.svg
                viewBox="0 0 600 600"
                className="absolute inset-0 w-full h-full text-[#0C4DD5] opacity-90 pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              >
                <defs>
                  <path
                    id="circlePath"
                    // Perfectly proportioned path with radius 240 centered at 300,300
                    d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                  />
                </defs>
                <text className="text-[17px] sm:text-[18px] font-head font-bold uppercase tracking-[0.22em]" fill="currentColor">
                  <textPath href="#circlePath" startOffset="0%">
                    {circleText}
                  </textPath>
                </text>
              </motion.svg>

              {/* Centered Content Container with AnimatePresence to eliminate overlapping */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative z-10 text-center max-w-[320px] sm:max-w-[340px] px-6 pointer-events-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="text-[#0C4DD5] font-body text-[12px] sm:text-[13px] tracking-[0.25em] uppercase mb-4 font-semibold">
                        {STEPS[activeIndex].num}
                      </p>
                      <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 font-head leading-[1.12] tracking-tight">
                        {STEPS[activeIndex].title}
                      </h2>
                      <p className="text-white/70 text-[14px] sm:text-[15px] leading-relaxed font-body">
                        {STEPS[activeIndex].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


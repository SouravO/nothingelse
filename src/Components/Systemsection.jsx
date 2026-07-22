import { motion } from "framer-motion";

const STEP = {
  num: "Step 01",
  title: (
    <>
      Groceries, <br />
      <span className="text-[#0C4DD5]">Redefined.</span>
    </>
  ),
  desc: "We believe premium quality shouldn't come with a premium price tag. Our transparent system cuts the noise, delivering everyday essentials straight to you.",
};

export default function SystemSection() {
  // Expanded typography text to wrap around the larger circle flawlessly
  const circleText = "NOTHING ELSE • HIGH QUALITY • AFFORDABLE PRICES • DIRECT TO CONSUMER • ".repeat(2);

  return (
    <section id="system" className="section-paint-lazy relative bg-[#F5F3EF] py-16 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 w-full relative z-10">

        {/* Using a custom grid ratio to give the larger circle ample breathing room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-12 items-center">

          {/* =========================================
              LEFT SIDE: STATIC FLOATING IMAGE
              ========================================= */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-start w-full"
          >
            {/* Soft Blue Glow behind the image */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#0C4DD5] blur-[130px] rounded-full opacity-15"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            {/* Floating Product Basket Image (scales gradually instead of jumping straight to lg) */}
            <motion.img
              src="/about.png"
              alt="Nothing Else Products"
              loading="lazy"
              decoding="async"
              className="relative z-10 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[580px] object-contain drop-shadow-2xl"
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
              {/* Font-size stays in the SVG's own coordinate space, so it scales
                  in lockstep with the ring itself on every screen width */}
              <text className="text-[17px] sm:text-[18px] font-head font-bold uppercase tracking-[0.22em]" fill="currentColor">
                <textPath href="#circlePath" startOffset="0%">
                  {circleText}
                </textPath>
              </text>
            </motion.svg>

            {/* Centered Static Content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center max-w-[clamp(200px,72vw,340px)] px-[clamp(0.75rem,3vw,1.5rem)] pointer-events-auto"
              >
                <p className="text-[#0C4DD5] font-body text-[clamp(10px,2.6vw,13px)] tracking-[0.25em] uppercase mb-[clamp(0.5rem,1.5vw,1rem)] font-semibold">
                  {STEP.num}
                </p>
                <h2 className="text-[#111111] text-[clamp(1.35rem,6vw,3rem)] font-bold mb-[clamp(0.75rem,2vw,1.25rem)] font-head leading-[1.12] tracking-tight">
                  {STEP.title}
                </h2>
                <p className="text-[#111111]/65 text-[clamp(11px,2.8vw,15px)] leading-[1.45] font-body">
                  {STEP.desc}
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
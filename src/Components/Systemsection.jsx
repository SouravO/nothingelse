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
    <section id="system" className="section-paint-lazy relative bg-white py-16 sm:py-20 lg:py-32 overflow-hidden">

      {/* =========================================
          BACKGROUND ANIMATION: TOP LEFT CORNER
          ========================================= */}
      <div className="absolute top-0 left-0 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] z-0 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Outer Soft Wave */}
          <motion.path
            d="M0 0 H400 C300 50 350 200 200 250 C100 280 50 200 0 350 V0 Z"
            fill="#A9C6FA"
            fillOpacity="0.08"
            animate={{ d: ["M0 0 H400 C300 50 350 200 200 250 C100 280 50 200 0 350 V0 Z", "M0 0 H400 C320 80 320 220 180 270 C80 300 60 220 0 380 V0 Z", "M0 0 H400 C300 50 350 200 200 250 C100 280 50 200 0 350 V0 Z"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Middle Wave */}
          <motion.path
            d="M0 0 H320 C240 60 280 180 160 220 C80 240 40 160 0 280 V0 Z"
            fill="#A9C6FA"
            fillOpacity="0.25"
            animate={{ d: ["M0 0 H320 C240 60 280 180 160 220 C80 240 40 160 0 280 V0 Z", "M0 0 H330 C220 80 290 190 150 230 C70 250 50 150 0 300 V0 Z", "M0 0 H320 C240 60 280 180 160 220 C80 240 40 160 0 280 V0 Z"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner Solid Wave */}
          <motion.path
            d="M0 0 H250 C180 50 200 150 120 180 C60 200 30 120 0 220 V0 Z"
            fill="#A9C6FA"
            animate={{ d: ["M0 0 H250 C180 50 200 150 120 180 C60 200 30 120 0 220 V0 Z", "M0 0 H260 C160 70 210 160 110 190 C50 210 40 110 0 240 V0 Z", "M0 0 H250 C180 50 200 150 120 180 C60 200 30 120 0 220 V0 Z"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating Decorative Lines */}
          <motion.g animate={{ y: [0, 8, 0], x: [0, 4, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M0 240 C40 140 80 220 140 200 C220 170 190 70 270 60" stroke="#A9C6FA" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
            <path d="M0 255 C50 150 90 230 150 210 C230 180 200 80 280 70" stroke="#A9C6FA" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
            <path d="M0 270 C60 160 100 240 160 220 C240 190 210 90 290 80" stroke="#A9C6FA" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
            <path d="M0 285 C70 170 110 250 170 230 C250 200 220 100 300 90" stroke="#A9C6FA" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
          </motion.g>
        </svg>
      </div>

      {/* =========================================
          BACKGROUND ANIMATION: BOTTOM RIGHT CORNER
          ========================================= */}
      <div className="absolute bottom-0 right-0 w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] z-0 pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Outer Soft Wave */}
          <motion.path
            d="M400 400 H0 C100 350 50 200 200 150 C300 120 350 200 400 50 V400 Z"
            fill="#A9C6FA"
            fillOpacity="0.08"
            animate={{ d: ["M400 400 H0 C100 350 50 200 200 150 C300 120 350 200 400 50 V400 Z", "M400 400 H0 C80 320 80 180 220 130 C320 100 340 180 400 20 V400 Z", "M400 400 H0 C100 350 50 200 200 150 C300 120 350 200 400 50 V400 Z"] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Middle Wave */}
          <motion.path
            d="M400 400 H80 C160 340 120 220 240 180 C320 160 360 240 400 120 V400 Z"
            fill="#A9C6FA"
            fillOpacity="0.25"
            animate={{ d: ["M400 400 H80 C160 340 120 220 240 180 C320 160 360 240 400 120 V400 Z", "M400 400 H70 C180 320 110 210 250 170 C330 150 350 250 400 100 V400 Z", "M400 400 H80 C160 340 120 220 240 180 C320 160 360 240 400 120 V400 Z"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner Solid Wave */}
          <motion.path
            d="M400 400 H150 C220 350 200 250 280 220 C340 200 370 280 400 180 V400 Z"
            fill="#A9C6FA"
            animate={{ d: ["M400 400 H150 C220 350 200 250 280 220 C340 200 370 280 400 180 V400 Z", "M400 400 H140 C240 330 190 240 290 210 C350 190 360 290 400 160 V400 Z", "M400 400 H150 C220 350 200 250 280 220 C340 200 370 280 400 180 V400 Z"] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Floating Decorative Lines */}
          <motion.g animate={{ y: [0, -8, 0], x: [0, -4, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M130 400 C150 320 230 350 260 270 C290 190 350 210 400 160" stroke="#A9C6FA" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
            <path d="M115 400 C135 310 215 340 245 260 C275 180 335 200 400 145" stroke="#A9C6FA" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
            <path d="M100 400 C120 300 200 330 230 250 C260 170 320 190 400 130" stroke="#A9C6FA" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
            <path d="M85 400 C105 290 185 320 215 240 C245 160 305 180 400 115" stroke="#A9C6FA" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
          </motion.g>
        </svg>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 w-full relative z-10">
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
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] bg-[#0C4DD5] blur-[130px] rounded-full opacity-15"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
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
            <motion.svg
              viewBox="0 0 600 600"
              className="absolute inset-0 w-full h-full text-[#0C4DD5] opacity-90 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0"
                />
              </defs>
              <text className="text-[17px] sm:text-[18px] font-head font-bold uppercase tracking-[0.22em]" fill="currentColor">
                <textPath href="#circlePath" startOffset="0%">
                  {circleText}
                </textPath>
              </text>
            </motion.svg>

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
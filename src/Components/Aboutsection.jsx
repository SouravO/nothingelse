import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";

const FEATURES = [
  {
    title: "100% Transparent",
    desc: "No hidden ingredients or artificial fillers.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Directly Sourced",
    desc: "From farm and factory straight to your pantry.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: 5, suffix: "+", label: "Everyday categories" },
  { value: 100, suffix: "%", label: "Full transparency" },
  { value: 0, suffix: "", label: "Artificial fillers" },
];

// Vertical gallery columns — mix of product renders (pdt1–5) and the
// two lifestyle shelf shots (about.png, abt.jpg), pulled straight from /public.
const COLUMN_A = ["/pdt1.png", "/pdt3.png", "/pdt5.png", "/about.png"];
const COLUMN_B = ["/pdt2.png", "/pdt4.png", "/abt.jpg", "/pdt1.png"];

const isProductShot = (src) => src.includes("pdt");

// Injects the marquee keyframes + hover-pause rule once. Two directions
// (up / down) so the two columns drift opposite ways — this is what
// creates the "alive" showcase-wall feel instead of a static image.
function MarqueeStyles() {
  return (
    <style>{`
      @keyframes ne-marquee-up {
        from { transform: translateY(0); }
        to   { transform: translateY(-50%); }
      }
      @keyframes ne-marquee-down {
        from { transform: translateY(-50%); }
        to   { transform: translateY(0); }
      }
      .ne-marquee-wrap:hover .ne-marquee-track {
        animation-play-state: paused;
      }
    `}</style>
  );
}

function MarqueeColumn({ images, direction = "up", duration = 28, reduceMotion, className = "" }) {
  const doubled = [...images, ...images];
  return (
    <div className={`ne-marquee-wrap relative h-full overflow-hidden ${className}`}>
      <div
        className="ne-marquee-track flex flex-col gap-5"
        style={{
          animationName: reduceMotion ? "none" : direction === "up" ? "ne-marquee-up" : "ne-marquee-down",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className={`relative shrink-0 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg shadow-blue-900/10 ${
              isProductShot(src) ? "bg-white p-6 flex items-center justify-center" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className={isProductShot(src) ? "w-full h-auto max-h-40 object-contain" : "w-full h-56 object-cover"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple count-up used for the stats row — fires once when scrolled
// into view, eases the same way the rest of the section's motion does.
function CountUp({ value, suffix = "", duration = 1.6 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section ref={containerRef} id="about" className="relative bg-[#FAFBFF] py-24 md:py-32 overflow-hidden">
      <MarqueeStyles />

      {/* Background Ambient Orbs */}
      <motion.div
        style={{ y: reduceMotion ? 0 : y1 }}
        className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: reduceMotion ? 0 : y2 }}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-100/30 blur-[150px] pointer-events-none"
      />
      <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#D9A84A]/10 blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">

        {/* LEFT COLUMN — Text Content & Features */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative lg:col-span-5 max-w-xl lg:max-w-none mx-auto lg:mx-0"
        >
          {/* Giant faint watermark letter, purely decorative */}
          <span
            aria-hidden="true"
            className="absolute -left-6 -top-16 font-head font-black text-[240px] leading-none text-[#0B1220]/[0.03] select-none pointer-events-none hidden sm:block"
          >
            N
          </span>

          <motion.div variants={itemVariants} className="relative flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-blue-600/50" />
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-blue-600">The Philosophy</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="relative font-head font-black text-[#0B1220] text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
            Honest Food.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B1220] to-[#1E3FE0]">
              Nothing Else.
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="relative font-body text-[#4B5567] text-lg md:text-xl leading-relaxed mb-10">
            We exist because we believe that cooking for family and friends
            is one of life's simple pleasures — and that the products you
            use to make it should be simple too.
          </motion.p>

          {/* Feature cards — restyled with gradient icon chips + lift on hover */}
          <motion.div variants={itemVariants} className="relative grid sm:grid-cols-2 gap-4 mb-10">
            {FEATURES.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={reduceMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-gray-200/70 shadow-sm hover:shadow-md hover:border-blue-200 transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3FE0] to-[#2950F5] flex items-center justify-center text-white shadow-md shadow-blue-600/20">
                  {feat.icon}
                </div>
                <h4 className="font-head font-bold text-[#0B1220] text-lg">{feat.title}</h4>
                <p className="font-body text-sm text-[#4B5567] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats strip — animated count-up, fires once in view */}
          <motion.div variants={itemVariants} className="relative flex items-stretch gap-6 sm:gap-10 pt-8 border-t border-gray-200/70">
            {STATS.map((stat, idx) => (
              <div key={idx} className={`flex-1 ${idx !== 0 ? "border-l border-gray-200/70 pl-6 sm:pl-10" : ""}`}>
                <p className="font-head font-black text-3xl sm:text-4xl text-[#0B1220]">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="font-body text-xs sm:text-sm text-[#4B5567] mt-1 leading-snug">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN — Vertical Auto-Scrolling Gallery */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-end mt-4 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative w-full max-w-[640px]"
          >
            {/* Floating pill tag */}
            <div className="absolute -top-5 left-6 z-20 bg-white border border-gray-200/70 shadow-lg rounded-full px-4 py-1.5 flex items-center gap-2 -rotate-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3FE0]" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#0B1220]/70">On the shelf</span>
            </div>

            {/* Gallery frame with top/bottom fade mask */}
            <div
              className="relative rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border border-gray-200/70 shadow-[0_30px_60px_-15px_rgba(30,63,224,0.15)] p-4 sm:p-5 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div className="grid grid-cols-2 gap-5 h-[520px] md:h-[600px]">
                <MarqueeColumn images={COLUMN_A} direction="up" duration={30} reduceMotion={reduceMotion} />
                <MarqueeColumn images={COLUMN_B} direction="down" duration={24} reduceMotion={reduceMotion} className="mt-10" />
              </div>
            </div>

            {/* Floating Glassmorphism Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute -bottom-8 left-4 sm:-left-8 z-20 bg-white/70 backdrop-blur-xl border border-white p-5 rounded-2xl shadow-xl flex items-center gap-4 w-[240px]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E3FE0] to-[#2950F5] flex items-center justify-center flex-shrink-0">
                <span className="font-head font-black text-white text-xl">0</span>
              </div>
              <div>
                <p className="font-head font-bold text-gray-900 text-sm leading-tight">Zero Compromise</p>
                <p className="font-body text-xs text-gray-500 mt-0.5">On quality & pricing</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
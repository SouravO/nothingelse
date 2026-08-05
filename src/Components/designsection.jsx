import { useRef, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const PRINCIPLES = [
  {
    title: "Say What It Is",
    description:
      "No invented stories, no lifestyle spin. Just the product name, what it does, and nothing dressed up around it.",
  },
  {
    title: "No Fake Premium",
    description:
      "No heavy packaging, no celebrity campaigns, no artificial premium positioning. Just clean design that does its job.",
  },
  {
    title: "Honest Pricing",
    description:
      "Positioned between cheap, unorganised products and expensive branded FMCG — smart value, not inflated pricing.",
  },
  {
    title: "One Shelf, One Rule",
    description:
      "60+ SKUs across 10 categories from day one, grocery to home care, all held to the same honest standard.",
  },
];

// Parent cascades its children in: title first, then the
// description — one clean stagger per card.
const cardVariants = {
  hidden: {},
  visible: (i) => ({
    transition: { staggerChildren: 0.09, delayChildren: 0.08 + i * 0.1 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function PrincipleCard({ principle, index }) {
  const isDark = index % 2 === 1;
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  function handleMouseMove(e) {
    const rect = cardRef.current.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        "group relative rounded-xl px-6 sm:px-7 py-6 sm:py-7 overflow-hidden transition-shadow duration-300",
        isDark
          ? "bg-gradient-to-br from-[#0C4DD5] to-[#345FE8] shadow-[0_10px_30px_-14px_rgba(12,77,213,0.55)] group-hover:shadow-[0_24px_44px_-14px_rgba(12,77,213,0.55)]"
          : "bg-white border border-[#0C4DD5]/12 shadow-[0_6px_20px_-14px_rgba(12,77,213,0.25)] group-hover:border-[#0C4DD5]/30 group-hover:shadow-[0_24px_44px_-16px_rgba(12,77,213,0.28)]",
      ].join(" ")}
    >
      {/* cursor-reactive glow, replaces the old icon chip as the card's
          one bit of personality */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(420px circle at ${spot.x}% ${spot.y}%, ${
            isDark ? "rgba(255,255,255,0.14)" : "rgba(12,77,213,0.09)"
          }, transparent 70%)`,
        }}
      />

      <motion.h3
        variants={itemVariants}
        className={[
          "relative principle-serif text-xl sm:text-2xl md:text-[1.7rem] leading-tight mb-2 sm:mb-2.5",
          isDark ? "text-white" : "text-[#0C4DD5]",
        ].join(" ")}
      >
        {principle.title}
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className={[
          "relative text-[13px] sm:text-[15px] leading-relaxed max-w-[38ch]",
          isDark ? "text-white/80" : "text-gray-600",
        ].join(" ")}
      >
        {principle.description}
      </motion.p>

      <span
        className={[
          "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out",
          isDark
            ? "bg-gradient-to-r from-white/10 via-white/80 to-white/10"
            : "bg-gradient-to-r from-[#0C4DD5]/10 via-[#0C4DD5] to-[#0C4DD5]/10",
        ].join(" ")}
      />
    </motion.div>
  );
}

export default function DesignSection() {
  const sectionRef = useRef(null);

  return (
    <section
      id="design"
      ref={sectionRef}
      className="section-paint-lazy relative bg-[#FAFBFF] pt-10 sm:pt-14 lg:pt-16 pb-20 sm:pb-28 lg:pb-32 px-6 sm:px-10 overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&display=swap');
        .principle-serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      {/* soft concentric fan of blue, anchored to the bottom-right corner —
          a calmer echo of the reference mood, purely decorative. It's
          drawn in a scaled SVG viewBox so it stays responsive at any
          section width/height instead of relying on fixed pixels. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMaxYMax slice"
        fill="none"
      >
        <circle cx="1200" cy="700" r="1250" fill="#0C4DD5" fillOpacity="0.035" />
        <circle cx="1200" cy="700" r="1020" fill="#0C4DD5" fillOpacity="0.05" />
        <circle cx="1200" cy="700" r="800" fill="#0C4DD5" fillOpacity="0.07" />
        <circle cx="1200" cy="700" r="600" fill="#0C4DD5" fillOpacity="0.10" />
        <circle cx="1200" cy="700" r="420" fill="#0C4DD5" fillOpacity="0.16" />
        <circle cx="1200" cy="700" r="160" fill="#0C4DD5" fillOpacity="0.26" />

        {/* two close accent lines, echoing the pair in the reference */}
        <circle cx="1200" cy="700" r="760" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.5" />
        <circle cx="1200" cy="700" r="740" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />

        {/* one further, brighter solo line nearer the deeper blue */}
        <circle cx="1200" cy="700" r="300" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative max-w-3xl mx-auto text-center mb-12 sm:mb-16"
      >
        <h2 className="font-head font-black text-[#111111] text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95]">
          Four rules.{" "}
          <span className="bg-gradient-to-r from-[#0C4DD5] to-[#477BFF] bg-clip-text text-transparent">
            Nothing else.
          </span>
        </h2>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {PRINCIPLES.map((principle, i) => (
          <PrincipleCard key={principle.title} principle={principle} index={i} />
        ))}
      </div>
    </section>
  );
}
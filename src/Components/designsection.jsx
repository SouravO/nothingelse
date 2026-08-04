import { useRef } from "react";
import { motion } from "framer-motion";
import { Tag, Package, Scale, LayoutGrid } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const PRINCIPLES = [
  {
    icon: Tag,
    title: "Say What It Is",
    description:
      "No invented stories, no lifestyle spin. Just the product name, what it does, and nothing dressed up around it.",
  },
  {
    icon: Package,
    title: "No Fake Premium",
    description:
      "No heavy packaging, no celebrity campaigns, no artificial premium positioning. Just clean design that does its job.",
  },
  {
    icon: Scale,
    title: "Honest Pricing",
    description:
      "Positioned between cheap basics and overpriced legacy brands. Smart value, not inflated retail markups.",
  },
  {
    icon: LayoutGrid,
    title: "One Shelf, One Rule",
    description:
      "60+ SKUs across 10 categories from day one, grocery to home care, all held to the same honest standard.",
  },
];

// Parent cascades its children in: icon chip pops first, then title,
// then the description — one clean stagger per card, no scroll-linked
// clip-path trickery to go wrong.
const cardVariants = {
  hidden: {},
  visible: (i) => ({
    transition: { staggerChildren: 0.08, delayChildren: 0.08 + i * 0.1 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

function PrincipleCard({ principle, index }) {
  const isDark = index % 2 === 1;
  const Icon = principle.icon;

  return (
    <motion.div
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
      <motion.div
        variants={itemVariants}
        className={[
          "inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-lg mb-4 sm:mb-5 transition-colors duration-300",
          isDark
            ? "bg-white/15 text-white group-hover:bg-white/25"
            : "bg-[#0C4DD5]/8 text-[#0C4DD5] group-hover:bg-[#0C4DD5]/14",
        ].join(" ")}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </motion.div>

      <motion.h3
        variants={itemVariants}
        className={[
          "principle-serif text-xl sm:text-2xl md:text-[1.7rem] leading-tight mb-2 sm:mb-2.5",
          isDark ? "text-white" : "text-[#0C4DD5]",
        ].join(" ")}
      >
        {principle.title}
      </motion.h3>

      <motion.p
        variants={itemVariants}
        className={[
          "text-[13px] sm:text-[15px] leading-relaxed max-w-[38ch]",
          isDark ? "text-white/80" : "text-gray-600",
        ].join(" ")}
      >
        {principle.description}
      </motion.p>

      <span
        className={[
          "absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out",
          isDark ? "bg-white/50" : "bg-[#0C4DD5]",
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
      className="section-paint-lazy relative bg-[#FAFBFF] py-20 sm:py-28 lg:py-32 px-6 sm:px-10 overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&display=swap');
        .principle-serif { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
      `}</style>

      {/* soft ambient glow behind the heading — static, not the old sunburst */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(163,193,255,0.28), transparent 65%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative max-w-3xl mx-auto text-center mb-12 sm:mb-16"
      >
        <span className="inline-block text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#0C4DD5]/55 font-semibold mb-4">
          What we stand for
        </span>
        <h2 className="font-head font-black text-[#111111] text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[0.95]">
          Four rules.{" "}
          <span className="bg-gradient-to-r from-[#0C4DD5] to-[#477BFF] bg-clip-text text-transparent">
            Nothing else.
          </span>
        </h2>
      </motion.div>

      <div className="relative max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {PRINCIPLES.map((principle, i) => (
          <PrincipleCard key={principle.title} principle={principle} index={i} />
        ))}
      </div>
    </section>
  );
}
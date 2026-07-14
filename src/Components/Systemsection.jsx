import { motion } from "framer-motion";

/* ============================================================================
   SECTION 4: SYSTEM — colour, typography, pack shapes in one block
   ============================================================================ */

/* Shared reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PackBox(props) {
  return (
    <svg viewBox="0 0 90 130" fill="none" {...props}>
      <rect x="1" y="1" width="88" height="128" rx="6" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="14" width="70" height="26" rx="3" fill="currentColor" fillOpacity="0.12" />
      <line x1="10" y1="52" x2="80" y2="52" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PackBottle(props) {
  return (
    <svg viewBox="0 0 60 130" fill="none" {...props}>
      <rect x="20" y="1" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M14 24C14 19 20 17 20 17H40S46 19 46 24V112C46 120 40 129 30 129C20 129 14 120 14 112V24Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PackJar(props) {
  return (
    <svg viewBox="0 0 90 100" fill="none" {...props}>
      <rect x="1" y="30" width="88" height="69" rx="10" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="1" width="58" height="34" rx="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PackPouch(props) {
  return (
    <svg viewBox="0 0 90 120" fill="none" {...props}>
      <path d="M6 18C6 10 12 4 22 4H68C78 4 84 10 84 18V96C84 108 70 116 45 116C20 116 6 108 6 96V18Z" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="20" width="58" height="22" rx="3" fill="currentColor" fillOpacity="0.14" />
    </svg>
  );
}
function PackSachet(props) {
  return (
    <svg viewBox="0 0 90 100" fill="none" {...props}>
      <path d="M4 10L86 10L78 92L12 92Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="14" y1="28" x2="76" y2="28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const SYSTEM_COLORS = [
  { name: "Nothing Else Blue", hex: "#0C4DD5", usage: "60–70%", swatchText: "text-white" },
  { name: "Nothing Else White", hex: "#FFFFFF", usage: "20–30%", swatchText: "text-[#111111]", border: true },
  { name: "Nothing Else Black", hex: "#111111", usage: "10% or less", swatchText: "text-white" },
  { name: "Utility Grey", hex: "#EDEDED", usage: "Support only", swatchText: "text-[#111111]", border: true },
];

const SYSTEM_TYPE = [
  { role: "Logo typeface", name: "Montserrat", note: "Used only in the logo — never retyped." },
  { role: "Primary typeface", name: "Helvetica Neue", note: "Headlines & product names." },
  { role: "Secondary typeface", name: "Inter", note: "Body copy & functional info." },
];

const SYSTEM_SHAPES = [
  { Shape: PackBox, label: "Box" },
  { Shape: PackBottle, label: "Bottle" },
  { Shape: PackJar, label: "Jar" },
  { Shape: PackPouch, label: "Pouch" },
  { Shape: PackSachet, label: "Sachet" },
];

export default function SystemSection() {
  return (
    <section id="system" className="relative bg-[#111111] scroll-mt-[68px] sm:scroll-mt-[76px] py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-white/40 mb-3">The visual system</p>
          <h2 className="font-head font-bold text-white text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] mb-10 max-w-xl">
            One Blue. One System.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {SYSTEM_COLORS.map((c) => (
              <div key={c.hex} className={`rounded-2xl overflow-hidden ${c.border ? "border border-white/15" : ""}`}>
                <div className="h-[70px]" style={{ backgroundColor: c.hex }} />
                <div className="p-3.5 bg-white/[0.05]">
                  <p className="font-head font-bold text-[13px] text-white mb-1">{c.name}</p>
                  <div className="flex justify-between text-[11.5px] text-white/45 font-body">
                    <span>{c.hex}</span>
                    <span className="text-[#3B6FE0]">{c.usage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {SYSTEM_TYPE.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <p className="text-[11px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-2">{t.role}</p>
                <p className="font-head font-bold text-white text-[19px] mb-1.5">{t.name}</p>
                <p className="text-white/45 text-[13px] leading-snug">{t.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-white/10 py-6">
            {SYSTEM_SHAPES.map(({ Shape, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Shape className="text-[#3B6FE0] w-[38px] h-auto" />
                <span className="text-[11px] text-white/40 font-body">{label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
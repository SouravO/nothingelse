import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  Volume2,
  Wrench,
  Fingerprint,
  Check,
  X,
  Square,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POSITIONING_BULLETS = [
  "Not cheap.",
  "Not luxury.",
  "Not overdesigned.",
  "Modern, honest and recognisable.",
];

const PERSONALITY = [
  { icon: Sparkles, title: "Simple", detail: "Nothing unnecessary" },
  { icon: MessageCircle, title: "Honest", detail: "Clear communication" },
  { icon: Volume2, title: "Confident", detail: "No need to shout" },
  { icon: Wrench, title: "Useful", detail: "Every decision has purpose" },
  { icon: Fingerprint, title: "Recognisable", detail: "One visual system" },
];

const COLORS = [
  {
    tag: "Primary Colour",
    name: "Nothing Else Blue",
    hex: "#0C4DD5",
    rgb: "12, 77, 213",
    usage: "60–70%",
    bar: 65,
    swatchText: "text-white",
  },
  {
    tag: "Secondary Colour",
    name: "Nothing Else White",
    hex: "#FFFFFF",
    rgb: "255, 255, 255",
    usage: "20–30%",
    bar: 25,
    swatchText: "text-[#111111]",
    border: true,
  },
  {
    tag: "Functional Colour",
    name: "Nothing Else Black",
    hex: "#111111",
    rgb: "17, 17, 17",
    usage: "10% or less",
    bar: 10,
    swatchText: "text-white",
  },
  {
    tag: "Supporting Neutral",
    name: "Utility Grey",
    hex: "#EDEDED",
    rgb: "237, 237, 237",
    usage: "Support only",
    bar: 4,
    swatchText: "text-[#111111]",
    border: true,
  },
];

const PREFERRED = [
  "Natural light",
  "Real settings",
  "Simple composition",
  "Clean shelves",
  "Product focus",
  "Neutral background",
];
const AVOID = [
  "Artificial luxury",
  "Over-styled sets",
  "Excess props",
  "Celebrity imagery",
  "Over-saturated scenes",
  "Unreal claims",
];

const FORMAT_RULES = [
  "Solid blue backgrounds",
  "Large white typography",
  "One product",
  "One message",
  "Minimal logos",
  "No decorative visual noise",
];

export default function About() {
  const rootRef = useRef(null);
  const [activeTrait, setActiveTrait] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray(".reveal-stagger").forEach((group) => {
        const items = group.querySelectorAll(".stagger-item");
        gsap.fromTo(
          items,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 88%" },
          }
        );
      });

      // animated colour usage bars
      gsap.utils.toArray(".usage-bar-fill").forEach((el) => {
        gsap.fromTo(
          el,
          { width: "0%" },
          {
            width: el.dataset.width + "%",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      // logo reveal box
      gsap.fromTo(
        ".logo-box",
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".logo-box", start: "top 85%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-white font-body overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#FAFBFF] pt-[160px] pb-20 sm:pt-[190px] sm:pb-28 overflow-hidden">
        <span className="pointer-events-none select-none absolute top-[6%] -right-[8%] font-display font-extrabold text-[26vw] leading-none text-[#0C4DD5]/[0.045] whitespace-nowrap">
          honest
        </span>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-5"
          >
            About Nothing Else
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-head font-bold text-[#111111] text-[10vw] sm:text-[6vw] lg:text-[4.6vw] leading-[1.02] tracking-[-0.02em] max-w-4xl"
          >
            The Honest Everyday Brand
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 grid lg:grid-cols-2 gap-10 lg:gap-16"
          >
            <p className="text-[17px] sm:text-[19px] text-[#111111]/65 leading-relaxed max-w-lg">
              Nothing Else is positioned between low-cost unorganised
              products and over-marketed branded FMCG.
            </p>
            <ul className="space-y-3">
              {POSITIONING_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 text-[16px] sm:text-[17px] text-[#111111] font-medium"
                >
                  <span className="h-[7px] w-[7px] shrink-0 rounded-[2px] bg-[#0C4DD5]" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ================= BRAND PERSONALITY ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up mb-14">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Brand personality
            </p>
            <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.4vw] lg:text-[2.4vw] leading-[1.1] tracking-[-0.02em] max-w-2xl">
              Five traits. One consistent voice.
            </h2>
          </div>

          <div className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PERSONALITY.map((trait, i) => (
              <button
                key={trait.title}
                onMouseEnter={() => setActiveTrait(i)}
                onMouseLeave={() => setActiveTrait(null)}
                onClick={() =>
                  setActiveTrait(activeTrait === i ? null : i)
                }
                className={`stagger-item text-left rounded-[20px] p-6 border transition-all duration-400 ${
                  activeTrait === i
                    ? "bg-[#0C4DD5] border-[#0C4DD5] -translate-y-1.5 shadow-[0_20px_50px_-20px_rgba(12,77,213,0.4)]"
                    : "bg-[#FAFBFF] border-[#111111]/6"
                }`}
              >
                <trait.icon
                  size={24}
                  strokeWidth={1.6}
                  className={`mb-8 transition-colors duration-300 ${
                    activeTrait === i ? "text-white" : "text-[#0C4DD5]"
                  }`}
                />
                <p
                  className={`font-head font-bold text-[19px] mb-1.5 transition-colors duration-300 ${
                    activeTrait === i ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {trait.title}
                </p>
                <p
                  className={`text-[14px] transition-colors duration-300 ${
                    activeTrait === i ? "text-white/75" : "text-[#111111]/50"
                  }`}
                >
                  {trait.detail}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOGO ================= */}
      <section className="relative bg-[#FAFBFF] py-24 sm:py-32 border-y border-[#111111]/5">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-up">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Logo
            </p>
            <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.2vw] lg:text-[2.3vw] leading-[1.12] tracking-[-0.02em] mb-5">
              The Nothing Else Logo
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#111111]/60 leading-relaxed mb-10 max-w-md">
              The Nothing Else logo is the most important element of the
              brand identity. It must always remain exactly as originally
              designed.
            </p>

            <p className="font-head font-bold text-[16px] text-[#111111] mb-1.5">
              Primary Logo
            </p>
            <p className="text-[15px] text-[#111111]/55 mb-10 max-w-sm">
              Use the uploaded original Nothing Else logo without any
              modification.
            </p>

            <div className="rounded-xl bg-[#EAF0FE] px-5 py-4 inline-block">
              <p className="text-[#0C4DD5] font-body font-semibold text-[13px] mb-1">
                Logo Rule
              </p>
              <p className="font-head font-bold text-[17px] sm:text-[19px] text-[#111111]">
                The logo is already complete. Add nothing else.
              </p>
            </div>
          </div>

          <div>
            <div className="logo-box bg-[#0C4DD5] rounded-[28px] h-[220px] sm:h-[280px] flex items-center justify-center mb-6">
              <span className="font-display font-extrabold text-white text-[13vw] sm:text-[4.6vw] tracking-[-0.02em]">
                nothing else
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0C4DD5] rounded-2xl h-[90px] sm:h-[110px] flex items-center justify-center">
                <span className="font-display font-extrabold text-white text-[4.2vw] sm:text-[1.5vw]">
                  ne
                </span>
              </div>
              <div className="bg-white border border-[#111111]/10 rounded-2xl h-[90px] sm:h-[110px] flex items-center justify-center">
                <span className="font-display font-extrabold text-[#0C4DD5] text-[4.2vw] sm:text-[1.5vw]">
                  ne
                </span>
              </div>
              <div className="bg-[#111111] rounded-2xl h-[90px] sm:h-[110px] flex items-center justify-center">
                <span className="font-display font-extrabold text-white text-[4.2vw] sm:text-[1.5vw]">
                  ne
                </span>
              </div>
            </div>
            <p className="text-center text-[13px] text-[#111111]/45 mt-4">
              The original proportions and letterforms must always be
              preserved.
            </p>
          </div>
        </div>
      </section>

      {/* ================= COLOUR SYSTEM ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up mb-4">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Colour palette
            </p>
            <h2 className="font-head font-bold text-[#111111] text-[9vw] sm:text-[4vw] lg:text-[2.8vw] leading-[1.06] tracking-[-0.02em] mb-3">
              One Blue. One System.
            </h2>
            <p className="text-[16px] text-[#111111]/55">
              Colour leads recognition before the logo.
            </p>
          </div>

          <div className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
            {COLORS.map((c) => (
              <div
                key={c.hex}
                className={`stagger-item rounded-[22px] overflow-hidden ${
                  c.border ? "border border-[#111111]/10" : ""
                }`}
              >
                <div
                  className="h-[120px] flex items-end p-4"
                  style={{ backgroundColor: c.hex }}
                >
                  <span
                    className={`font-body text-[11px] tracking-[0.15em] uppercase ${c.swatchText} opacity-70`}
                  >
                    {c.tag}
                  </span>
                </div>
                <div className="p-5 bg-[#FAFBFF]">
                  <p className="font-head font-bold text-[17px] text-[#111111] mb-3">
                    {c.name}
                  </p>
                  <div className="space-y-1 text-[13px] text-[#111111]/55 font-body mb-4">
                    <div className="flex justify-between">
                      <span>HEX</span>
                      <span className="text-[#111111] font-medium">
                        {c.hex}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>RGB</span>
                      <span className="text-[#111111] font-medium">
                        {c.rgb}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage</span>
                      <span className="text-[#0C4DD5] font-medium">
                        {c.usage}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#111111]/8 rounded-full overflow-hidden">
                    <div
                      className="usage-bar-fill h-full rounded-full"
                      data-width={c.bar}
                      style={{
                        width: 0,
                        backgroundColor:
                          c.hex === "#FFFFFF" || c.hex === "#EDEDED"
                            ? "#0C4DD5"
                            : c.hex,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal-up mt-14 rounded-2xl bg-[#EAF0FE] py-6 px-8 text-center">
            <p className="font-head font-bold text-[17px] sm:text-[19px] text-[#0C4DD5]">
              Blue leads. White clarifies. Black informs.
            </p>
          </div>
        </div>
      </section>

      {/* ================= TYPOGRAPHY ================= */}
      <section className="relative bg-[#111111] py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up mb-16 max-w-2xl">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-white/40 mb-4">
              Typography
            </p>
            <h2 className="font-head font-bold text-white text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.08] tracking-[-0.02em] mb-4">
              Clear Words. Clear Choices.
            </h2>
            <p className="text-white/50 text-[16px] sm:text-[17px]">
              Typography should feel direct, modern and highly readable.
            </p>
          </div>

          <div className="reveal-stagger grid lg:grid-cols-3 gap-5">
            <div className="stagger-item bg-white/[0.04] border border-white/10 rounded-[22px] p-8">
              <p className="text-[12px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-6">
                Logo typeface
              </p>
              <p className="font-display font-extrabold text-white text-[42px] mb-4">
                Aa
              </p>
              <p className="font-head font-bold text-white text-[18px] mb-2">
                Montserrat
              </p>
              <p className="text-white/50 text-[14px] leading-relaxed">
                Used in the Nothing Else logo. The logo must never be
                retyped.
              </p>
            </div>

            <div className="stagger-item bg-white/[0.04] border border-white/10 rounded-[22px] p-8">
              <p className="text-[12px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-6">
                Primary typeface
              </p>
              <p className="font-head font-bold text-white text-[42px] mb-4">
                Aa
              </p>
              <p className="font-head font-bold text-white text-[18px] mb-2">
                Helvetica Neue
              </p>
              <p className="text-white/50 text-[14px] leading-relaxed mb-5">
                For headlines, product names and communication.
              </p>
              <div className="flex gap-4 text-[12px] text-white/40 border-t border-white/10 pt-4">
                <span>
                  <b className="text-white/70 font-semibold">Bold</b>
                  <br />
                  Headlines
                </span>
                <span>
                  <b className="text-white/70 font-semibold">Medium</b>
                  <br />
                  Subheads
                </span>
                <span>
                  <b className="text-white/70 font-semibold">Regular</b>
                  <br />
                  Info
                </span>
              </div>
            </div>

            <div className="stagger-item bg-white/[0.04] border border-white/10 rounded-[22px] p-8">
              <p className="text-[12px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-6">
                Secondary typeface
              </p>
              <p className="font-body font-bold text-white text-[42px] mb-4">
                Aa
              </p>
              <p className="font-head font-bold text-white text-[18px] mb-2">
                Inter
              </p>
              <p className="text-white/50 text-[14px] leading-relaxed mb-5">
                For body copy, details and digital information.
              </p>
              <div className="flex gap-4 text-[12px] text-white/40 border-t border-white/10 pt-4">
                <span>
                  <b className="text-white/70 font-semibold">SemiBold</b>
                  <br />
                  Important info
                </span>
                <span>
                  <b className="text-white/70 font-semibold">Medium</b>
                  <br />
                  Labels
                </span>
                <span>
                  <b className="text-white/70 font-semibold">Regular</b>
                  <br />
                  Body copy
                </span>
              </div>
            </div>
          </div>

          {/* font hierarchy example */}
          <div className="reveal-up mt-14 rounded-[22px] border border-white/10 p-8 sm:p-10 grid sm:grid-cols-3 gap-8">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-2">
                Level 01
              </p>
              <p className="font-head font-bold text-white text-[26px] uppercase mb-1">
                Product Name
              </p>
              <p className="text-white/40 text-[13px]">Large • Bold • Simple</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-2">
                Level 02
              </p>
              <p className="font-body font-medium text-white text-[19px] mb-1">
                Product Description
              </p>
              <p className="text-white/40 text-[13px]">Medium • Regular</p>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#3B6FE0] mb-2">
                Level 03
              </p>
              <p className="font-body text-white text-[15px] mb-1">
                Functional Information
              </p>
              <p className="text-white/40 text-[13px]">Small • Regular</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PHOTOGRAPHY ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up max-w-2xl mb-16">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Photography
            </p>
            <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.08] tracking-[-0.02em] mb-4">
              Show the Product Honestly
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#111111]/55">
              Photography should support the brand's simplicity.
            </p>
          </div>

          <div className="reveal-stagger grid sm:grid-cols-2 gap-5">
            <div className="stagger-item rounded-[22px] bg-[#EAF0FE] p-8">
              <p className="font-head font-bold text-[#0C4DD5] text-[18px] mb-5">
                Preferred
              </p>
              <ul className="space-y-3">
                {PREFERRED.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-[15px] text-[#111111]/75"
                  >
                    <Check size={16} className="text-[#0C4DD5] shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="stagger-item rounded-[22px] bg-[#FAFBFF] border border-[#111111]/8 p-8">
              <p className="font-head font-bold text-[#111111]/60 text-[18px] mb-5">
                Avoid
              </p>
              <ul className="space-y-3">
                {AVOID.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-3 text-[15px] text-[#111111]/40"
                  >
                    <X size={16} className="text-[#111111]/30 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="reveal-up mt-14 text-center font-head font-bold text-[20px] sm:text-[24px] text-[#111111]">
            One product. One surface. One shadow. Nothing else.
          </p>
        </div>
      </section>

      {/* ================= DIGITAL STYLE ================= */}
      <section className="relative bg-[#0C4DD5] py-24 sm:py-32 overflow-hidden">
        <span className="pointer-events-none select-none absolute top-1/2 -translate-y-1/2 -left-[6%] font-display font-extrabold text-[20vw] leading-none text-white/[0.06] whitespace-nowrap">
          scroll
        </span>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal-up">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-white/55 mb-4">
              Digital &amp; social style
            </p>
            <h2 className="font-head font-bold text-white text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.08] tracking-[-0.02em] mb-4">
              Blue Stops the Scroll.
            </h2>
            <p className="text-white/65 text-[16px] sm:text-[17px] max-w-md">
              Digital communication should follow the same rules as
              packaging.
            </p>
          </div>

          <div className="reveal-stagger grid grid-cols-2 gap-3">
            {FORMAT_RULES.map((rule) => (
              <div
                key={rule}
                className="stagger-item flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/15 px-4 py-3.5"
              >
                <Square size={8} className="fill-white text-white shrink-0" />
                <span className="text-white text-[14px] font-body">
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
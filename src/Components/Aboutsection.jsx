import React from "react";

// Vertical gallery columns — mix of product renders (pdt1–5) and the
// two lifestyle shelf shots (about.png, abt.jpg), pulled straight from /public.
const COLUMN_A = ["/pdt1.png", "/pdt3.png", "/pdt5.png", "/about.png"];
const COLUMN_B = ["/pdt2.png", "/pdt4.png", "/abt.jpg", "/pdt1.png"];

const isProductShot = (src) => src.includes("pdt");

// Injects the marquee keyframes + hover-pause rule, plus a section-scoped
// font override so the About title matches the hero's title font.
function MarqueeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap');

      #about .font-head {
        font-family: 'Bricolage Grotesque', sans-serif;
        font-optical-sizing: auto;
      }

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

function MarqueeColumn({ images, direction = "up", duration = 28, className = "" }) {
  const doubled = [...images, ...images];
  return (
    <div className={`ne-marquee-wrap relative h-full overflow-hidden ${className}`}>
      <div
        className="ne-marquee-track flex flex-col gap-3 xl:gap-5"
        style={{
          animationName: direction === "up" ? "ne-marquee-up" : "ne-marquee-down",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className={`relative shrink-0 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg shadow-blue-900/10 ${
              isProductShot(src) ? "bg-white p-3 lg:p-3 xl:p-6 flex items-center justify-center" : ""
            }`}
          >
            <img
              src={src}
              alt=""
              className={isProductShot(src) ? "w-full h-auto max-h-28 xl:max-h-40 object-contain" : "w-full h-40 xl:h-56 object-cover"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-[#FAFBFF] py-20 lg:py-28 overflow-hidden w-full">
      <MarqueeStyles />

      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-100/30 blur-[160px] pointer-events-none" />

      {/* 100% Width Grid Container */}
      <div className="relative z-10 w-full px-6 md:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* LEFT COLUMN — Text Content (Occupies 7/12th of screen width) */}
        <div className="relative lg:col-span-7 w-full">
          
          {/* Decorative faint background initial */}
          <span
            aria-hidden="true"
            className="absolute -left-10 -top-24 font-head font-black text-[280px] leading-none text-[#0B1220]/[0.02] select-none pointer-events-none hidden lg:block"
          >
            N
          </span>

          <div className="relative flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-blue-600/50" />
            <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-blue-600">The Philosophy</span>
          </div>

          {/* Styled Border Title Frame */}
          <div className="relative border-l-4 border-t border-b border-r border-gray-200/80 border-l-[#1E3FE0] bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(30,63,224,0.08)] mb-8">
            <h2 className="font-head font-black text-[#1E3FE0] text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Honest Food.<br />
              Nothing Else.
            </h2>
          </div>

          {/* Primary Statement */}
          <p className="relative font-body text-[#4B5567] text-lg md:text-xl leading-relaxed mb-6">
            We exist because we believe that cooking for family and friends
            is one of life's simple pleasures — and that the products you
            use to make it should be simple too.
          </p>

          <p className="relative font-body text-[#4B5567] text-base md:text-lg leading-relaxed mb-10">
            From our own kitchens to yours, every product starts with one
            question: would we serve this to our own family? If the answer
            isn't yes, it doesn't make the cut. That's the standard behind
            every batch — no exceptions, no fine print, no shortcuts.
          </p>

          {/* Replacement Editorial Paragraphs (Replacing Stats and Lists) */}
          <div className="relative border-t border-gray-200/70 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-head font-bold text-lg text-[#0B1220] mb-2">Our Absolute Standard</h3>
              <p className="font-body text-sm text-[#4B5567] leading-relaxed">
                By maintaining complete control over sourcing, packing, and design, we preserve our commitment to transparency. What you read on our labels is exactly what enters your kitchen.
              </p>
            </div>
            <div>
              <h3 className="font-head font-bold text-lg text-[#0B1220] mb-2">Everyday Integrity</h3>
              <p className="font-body text-sm text-[#4B5567] leading-relaxed">
                We work alongside responsible producers to eliminate unnecessary hand-offs, assuring premium grade ingredients make it to your pantry shelf at direct, fair pricing.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Vertical Auto-Scrolling Gallery (Occupies 5/12th of screen width) */}
        <div className="relative lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
          <div className="relative w-full max-w-md lg:max-w-none">
            
            {/* Floating pill tag */}
            <div className="absolute -top-5 left-6 z-20 bg-white border border-gray-200/70 shadow-lg rounded-full px-4 py-1.5 flex items-center gap-2 -rotate-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3FE0]" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#0B1220]/70">On the shelf</span>
            </div>

            {/* Gallery frame with top/bottom fade mask */}
            <div
              className="relative rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border border-gray-200/70 shadow-[0_30px_60px_-15px_rgba(30,63,224,0.15)] p-3 sm:p-4 lg:p-3 xl:p-5 overflow-hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div className="grid grid-cols-2 gap-3 lg:gap-3 xl:gap-5 h-[420px] sm:h-[480px] md:h-[520px] xl:h-[580px]">
                <MarqueeColumn images={COLUMN_A} direction="up" duration={30} />
                <MarqueeColumn images={COLUMN_B} direction="down" duration={24} className="mt-8 xl:mt-10" />
              </div>
            </div>

            {/* Floating Glassmorphism Badge */}
            <div className="absolute -bottom-8 left-4 sm:-left-6 z-20 bg-white/75 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 w-[200px] sm:w-[230px] -rotate-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#1E3FE0] to-[#2950F5] flex items-center justify-center flex-shrink-0">
                <span className="font-head font-black text-white text-xl">0</span>
              </div>
              <div>
                <p className="font-head font-bold text-gray-900 text-sm leading-tight">Zero Compromise</p>
                <p className="font-body text-xs text-gray-500 mt-0.5">On quality & pricing</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Vertical gallery columns — mix of product renders (pdt1–5) and the
// two lifestyle shelf shots (about.png, abt.jpg), pulled straight from /public.
const COLUMN_A = ["/pdt1.png", "/pdt3.png", "/pdt5.png", "/about.png"];
const COLUMN_B = ["/pdt2.png", "/pdt4.png", "/pdt3.png", "/pdt1.png"];

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

/**
 * Custom SplitText Component 
 * Breaks a string of text into individual word spans for staggered animation.
 */
const SplitText = ({ text }) => {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <React.Fragment key={i}>
          <span className="inline-block animate-word opacity-0">
            {word}
          </span>
          {" "}
        </React.Fragment>
      ))}
    </>
  );
};

export default function AboutSection() {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    // gsap.context ensures all animations are scoped to this component and cleaned up safely
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%", // Triggers the animation when the top of the section hits 70% of the viewport height
          toggleActions: "play none none none"
        }
      });

      // 1. Animate words flying in from the right (Mimics the Matisse Reference)
      tl.fromTo(
        ".animate-word",
        { x: "50vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.02, // Adjust this to make the word-by-word flow faster/slower
          duration: 0.8,
          ease: "power3.out"
        }
      )
      // 2. Animate the full Gallery block from the right after the text finishes
      .fromTo(
        galleryRef.current,
        { x: "30vw", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        },
        "-=0.2" // Starts just slightly before the last words settle for a smooth transition
      );

    }, sectionRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#FAFBFF] py-20 lg:py-28 overflow-hidden w-full">
      <MarqueeStyles />

      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-indigo-100/30 blur-[160px] pointer-events-none" />

      {/* 100% Width Grid Container */}
      <div className="relative z-10 w-full px-6 md:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* LEFT COLUMN — Text Content (Occupies 7/12th of screen width) */}
        {/* Framed as its own panel — rounded + overflow-hidden so the shelf
            photo and its overlay stay clipped to this card, matching the
            gallery card's rounded treatment on the right. */}
        <div className="relative lg:col-span-7 w-full rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(16,31,122,0.35)]">
          {/* Shelf photo, behind everything in this panel */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/abt.jpg')" }}
            aria-hidden="true"
          />

          {/* Dark navy overlay (matches the hero's palette) so the copy on
              top stays readable against the photo — darkest on the left
              where the longest text lines sit, easing off to the right. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, rgba(16,31,122,0.95) 0%, rgba(11,35,88,0.92) 45%, rgba(8,28,68,0.85) 100%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-8 sm:p-10 md:p-14 xl:p-16">

            {/* Decorative faint background initial */}
            <span
              aria-hidden="true"
              className="absolute -left-4 -top-10 font-head font-black text-[280px] leading-none text-white/[0.05] select-none pointer-events-none hidden lg:block animate-word opacity-0"
            >
              N
            </span>

            <div className="relative flex items-center gap-3 mb-6 animate-word opacity-0">
              <span className="w-8 h-px bg-[#D9A84A]/70" />
            </div>

            {/* Clean, unboxed Title Frame — same white-to-gold treatment as
                the hero headline, so the two sections read as one brand. */}
            <div className="relative mb-10 md:mb-12">
              <h2 className="font-head font-black text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tighter">
                <span className="animate-word opacity-0 block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#AFC7FF]">
                  Honest Food.
                </span>
                <span className="animate-word opacity-0 block text-transparent bg-clip-text bg-gradient-to-br from-[#F3CE7C] via-[#FFEFC7] to-[#D9A84A] mt-1">
                  Nothing Else.
                </span>
              </h2>
            </div>

            {/* Primary Statement */}
            <p className="relative font-body text-blue-50/85 text-lg md:text-xl leading-relaxed mb-6">
              <SplitText text="We exist because we believe that cooking for family and friends is one of life's simple pleasures — and that the products you use to make it should be simple too." />
            </p>

            <p className="relative font-body text-blue-50/70 text-base md:text-lg leading-relaxed mb-10">
              <SplitText text="From our own kitchens to yours, every product starts with one question: would we serve this to our own family? If the answer isn't yes, it doesn't make the cut. That's the standard behind every batch — no exceptions, no fine print, no shortcuts." />
            </p>

            {/* Replacement Editorial Paragraphs */}
            <div className="relative border-t border-white/15 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Treating these smaller blocks as entire pieces rather than splitting every single word keeps the DOM light */}
              <div className="animate-word opacity-0">
                <h3 className="font-head font-bold text-lg text-white mb-2">Our Absolute Standard</h3>
                <p className="font-body text-sm text-blue-50/70 leading-relaxed">
                  By maintaining complete control over sourcing, packing, and design, we preserve our commitment to transparency. What you read on our labels is exactly what enters your kitchen.
                </p>
              </div>
              <div className="animate-word opacity-0">
                <h3 className="font-head font-bold text-lg text-white mb-2">Everyday Integrity</h3>
                <p className="font-body text-sm text-blue-50/70 leading-relaxed">
                  We work alongside responsible producers to eliminate unnecessary hand-offs, assuring premium grade ingredients make it to your pantry shelf at direct, fair pricing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Vertical Auto-Scrolling Gallery */}
        {/* We apply the ref and initial opacity-0 here to stage it for the final animation */}
        <div 
          ref={galleryRef} 
          className="relative lg:col-span-5 w-full flex justify-center lg:justify-end mt-4 lg:mt-0 opacity-0"
        >
          <div className="relative w-full max-w-md lg:max-w-none">
            
           
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

            
          </div>
        </div>

      </div>
    </section>
  );
}
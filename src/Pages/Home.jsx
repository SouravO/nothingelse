import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Eye,
  CheckCircle2,
  Star,
  Square,
  Target,
  ShieldCheck,
  Gem,
  Truck,
  BadgeCheck,
  Wallet,
  Boxes,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Small brand-styled pack silhouettes, redrawn in the line-art style  */
/* used throughout the brand book (outlined bottles / cartons / jars). */
/* ------------------------------------------------------------------ */
function PackBox(props) {
  return (
    <svg viewBox="0 0 90 130" fill="none" {...props}>
      <rect x="1" y="1" width="88" height="128" rx="6" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="14" width="70" height="26" rx="3" fill="currentColor" fillOpacity="0.12" />
      <line x1="10" y1="52" x2="80" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="64" x2="60" y2="64" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PackBottle(props) {
  return (
    <svg viewBox="0 0 60 130" fill="none" {...props}>
      <rect x="20" y="1" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14 24C14 19 20 17 20 17H40S46 19 46 24V112C46 120 40 129 30 129C20 129 14 120 14 112V24Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function PackJar(props) {
  return (
    <svg viewBox="0 0 90 100" fill="none" {...props}>
      <rect x="1" y="30" width="88" height="69" rx="10" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="1" width="58" height="34" rx="6" stroke="currentColor" strokeWidth="2" />
      <rect x="10" y="45" width="70" height="18" rx="3" fill="currentColor" fillOpacity="0.14" />
    </svg>
  );
}
function PackPouch(props) {
  return (
    <svg viewBox="0 0 90 120" fill="none" {...props}>
      <path
        d="M6 18C6 10 12 4 22 4H68C78 4 84 10 84 18V96C84 108 70 116 45 116C20 116 6 108 6 96V18Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="16" y="20" width="58" height="22" rx="3" fill="currentColor" fillOpacity="0.14" />
      <line x1="16" y1="52" x2="66" y2="52" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="62" x2="50" y2="62" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const PACK_SHAPES = [PackBox, PackBottle, PackPouch, PackBottle, PackBox, PackPouch];

const NOISE_ITEMS = [
  "Too many colours.",
  "Too many claims.",
  "Too many promises.",
  "Too much packaging.",
];

const CATEGORIES = [
  { name: "Breakfast & Grains", count: "5 products", icon: Boxes },
  { name: "Beverages", count: "4 products", icon: Boxes },
  { name: "Pantry & Cooking", count: "11 products", icon: Boxes },
  { name: "Spices & Seasoning", count: "9 products", icon: Boxes },
  { name: "Home Care", count: "5 products", icon: Boxes },
  { name: "Personal Care", count: "5 products", icon: Boxes },
];

const FLEET_POINTS = [
  { icon: BadgeCheck, label: "good quality" },
  { icon: Wallet, label: "right price" },
  { icon: ShieldCheck, label: "trusted everyday" },
];

const PRINCIPLES = [
  { icon: Eye, label: "Clear." },
  { icon: CheckCircle2, label: "Useful." },
  { icon: Star, label: "Recognisable." },
  { icon: Square, label: "Nothing else." },
];

const heroWords = "Just the product.".split(" ");
const heroWords2 = "Nothing else.".split(" ");

export default function Home() {
  const rootRef = useRef(null);
  const shelfTrackRef = useRef(null);
  const shelfSectionRef = useRef(null);
  const dotRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ---------- generic reveal-on-scroll for anything tagged ---------- */
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
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
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%" },
          }
        );
      });

      /* ---------- hero parallax ---------- */
      gsap.to(heroImgRef.current, {
        yPercent: 16,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      /* ---------- positioning dot slides to centre ---------- */
      gsap.fromTo(
        dotRef.current,
        { left: "2%" },
        {
          left: "50%",
          ease: "none",
          scrollTrigger: {
            trigger: dotRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 0.6,
          },
        }
      );

      /* ---------- shelf builder: pinned horizontal build sequence ---------- */
      const track = shelfTrackRef.current;
      const cards = track.querySelectorAll(".shelf-card");
      gsap.set(cards, { y: 90, opacity: 0, rotate: -3 });

      const shelfTl = gsap.timeline({
        scrollTrigger: {
          trigger: shelfSectionRef.current,
          start: "top top",
          end: "+=140%",
          scrub: 0.7,
          pin: true,
        },
      });

      shelfTl.to(cards, {
        y: 0,
        opacity: 1,
        rotate: 0,
        stagger: 0.12,
        ease: "power2.out",
        duration: 1,
      });
      shelfTl.fromTo(
        ".price-flip",
        { rotateY: -90, opacity: 0 },
        { rotateY: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.2"
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="bg-white font-body overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] flex items-end bg-[#0A3FB0] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 15% 0%, #1450E0 0%, #0A3FB0 45%, #082F8A 100%)",
          }}
        />
        {/* faint watermark wordmark */}
        <span className="pointer-events-none select-none absolute top-[8%] -right-[6%] font-display font-extrabold text-[34vw] leading-none text-white/[0.05] whitespace-nowrap">
          else
        </span>

        {/* duotone hero image */}
        <div
          ref={heroImgRef}
          className="absolute right-[-8%] top-[10%] w-[62%] sm:w-[46%] lg:w-[38%] aspect-[4/5] rounded-[28px] overflow-hidden opacity-90"
        >
          <img
            src="https://picsum.photos/seed/nothingelse-hero/1000/1300"
            alt=""
            className="w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-[#0C4DD5] mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#082F8A]/70 via-transparent to-[#1450E0]/30" />
        </div>

        <div className="relative z-10 w-full mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20 pt-[140px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/25 px-4 py-2 mb-8 backdrop-blur-sm"
          >
            <Square size={9} className="fill-white text-white" />
            <span className="font-body text-[13px] sm:text-[14px] text-white/90">
              Good everyday products. Honest pricing, Nothing else.
            </span>
          </motion.div>

          <h1 className="font-head font-bold text-white text-[13vw] sm:text-[9vw] lg:text-[6.4vw] leading-[0.98] tracking-[-0.03em] max-w-4xl">
            <span className="block overflow-hidden">
              {heroWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.28em]"
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden font-display italic">
              {heroWords2.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.45 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-[0.28em] text-white/80"
                >
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-7 max-w-xl text-white/75 text-[16px] sm:text-[18px] leading-relaxed"
          >
            A minimal FMCG brand built to make everyday buying simpler,
            clearer and more honest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-[#0A3FB0] px-7 py-3.5 font-body font-semibold text-[15px] hover:bg-[#111111] hover:text-white transition-colors duration-300"
            >
              See the products
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-body font-semibold text-[15px] text-white hover:bg-white/10 transition-colors duration-300"
            >
              Our story
            </Link>
          </motion.div>
        </div>

        {/* marquee strip */}
        <div className="relative z-10 w-full border-t border-white/15 bg-[#082F8A]/60 overflow-hidden py-3">
          <div className="flex whitespace-nowrap animate-[homeMarquee_20s_linear_infinite]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="font-display font-extrabold text-[12px] sm:text-[13px] tracking-[0.28em] uppercase mx-6 flex items-center gap-6 text-white/70"
              >
                Blue first <Square size={7} className="fill-white/50" />
                Product second <Square size={7} className="fill-white/50" />
                Nothing else <Square size={7} className="fill-white/50" />
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes homeMarquee { from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
        `}</style>
      </section>

      {/* ================= NOISE -> CLARITY ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* left: the problem */}
          <div className="reveal-stagger">
            <p className="stagger-item font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              The problem
            </p>
            <h2 className="stagger-item font-head font-bold text-[#111111] text-[8vw] sm:text-[3.4vw] lg:text-[2.6vw] leading-[1.08] tracking-[-0.02em] mb-4">
              Just the product.
              <br />
              Nothing else.
            </h2>
            <div className="stagger-item h-[3px] w-16 bg-[#0C4DD5] mb-8" />

            <p className="stagger-item font-body font-semibold text-[17px] text-[#111111] mb-5">
              The FMCG market has become increasingly noisy.
            </p>

            <ul className="space-y-3 mb-10">
              {NOISE_ITEMS.map((item) => (
                <li
                  key={item}
                  className="stagger-item flex items-center gap-3 text-[16px] text-[#111111]/60"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#111111]/30" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="stagger-item font-head font-bold text-[22px] sm:text-[26px] text-[#111111]">
              Less noise. More clarity.
            </p>
          </div>

          {/* right: our approach */}
          <div className="reveal-stagger">
            <p className="stagger-item font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Our approach
            </p>
            <h3 className="stagger-item font-head font-bold text-[26px] sm:text-[30px] text-[#111111] mb-4 max-w-md">
              Nothing Else takes the opposite approach.
            </h3>
            <p className="stagger-item text-[16px] sm:text-[17px] text-[#111111]/65 leading-relaxed max-w-md mb-12">
              We make everyday products easy to recognise, easy to
              understand and easy to buy.
            </p>

            {/* line-art pack silhouettes, brand-book style */}
            <div className="stagger-item flex items-end gap-4 sm:gap-6 border-b border-[#111111]/10 pb-6">
              {PACK_SHAPES.map((Shape, i) => (
                <Shape
                  key={i}
                  className="text-[#0C4DD5] w-[11%] sm:w-[13%] h-auto"
                  style={{ opacity: 0.35 + (i % 3) * 0.22 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= POSITIONING SPECTRUM ================= */}
      <section className="relative bg-[#FAFBFF] py-24 sm:py-32 border-y border-[#111111]/5">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up max-w-2xl mb-16">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Positioning
            </p>
            <h2 className="font-head font-bold text-[8vw] sm:text-[3.6vw] lg:text-[2.8vw] leading-[1.06] tracking-[-0.02em] text-[#111111]">
              The Honest Everyday Brand
            </h2>
          </div>

          {/* spectrum bar */}
          <div className="reveal-up relative mb-6">
            <div className="flex justify-between items-start mb-10 text-[13px] sm:text-[15px] font-body">
              <span className="max-w-[120px] sm:max-w-[180px] text-[#111111]/60">
                Low-cost unorganised products
              </span>
              <span className="font-head font-bold text-[#0C4DD5] text-[16px] sm:text-[19px]">
                Nothing Else
              </span>
              <span className="max-w-[120px] sm:max-w-[180px] text-right text-[#111111]/60">
                Over-marketed branded FMCG
              </span>
            </div>
            <div className="relative h-[2px] bg-[#0C4DD5]/25 rounded-full">
              <span className="absolute -top-[3px] left-0 h-2 w-2 rounded-full border-2 border-[#0C4DD5] bg-white" />
              <span className="absolute -top-[3px] right-0 h-2 w-2 rounded-full border-2 border-[#0C4DD5] bg-white" />
              <span
                ref={dotRef}
                className="absolute -top-[5px] h-3 w-3 rounded-full bg-[#0C4DD5] -translate-x-1/2"
              />
            </div>
            <p className="mt-8 text-center font-body text-[15px] sm:text-[17px] text-[#0C4DD5] max-w-xl mx-auto leading-relaxed">
              We sit in the middle — offering honest quality at a fair
              price, without the noise or the premium.
            </p>
          </div>

          {/* three pillars */}
          <div className="reveal-stagger grid sm:grid-cols-3 gap-5 mt-20">
            {[
              {
                icon: Target,
                title: "Our Positioning",
                lines: ["Good product.", "Fair price.", "Clear choice."],
              },
              {
                icon: ShieldCheck,
                title: "Brand Promise",
                lines: ["You get what", "you need.", "Nothing else."],
              },
              {
                icon: Gem,
                title: "Brand Essence",
                lines: ["Radical Simplicity"],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="stagger-item bg-white rounded-[22px] p-8 border border-[#111111]/6 hover:border-[#0C4DD5]/30 hover:shadow-[0_20px_50px_-20px_rgba(12,77,213,0.25)] transition-all duration-300"
              >
                <card.icon size={26} className="text-[#0C4DD5] mb-5" strokeWidth={1.6} />
                <p className="font-head font-bold text-[18px] text-[#111111] mb-3">
                  {card.title}
                </p>
                {card.lines.map((l) => (
                  <p key={l} className="text-[15px] text-[#111111]/60 leading-relaxed">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHELF BUILDER (signature, pinned) ================= */}
      <section
        ref={shelfSectionRef}
        className="relative bg-[#0C4DD5] min-h-[100svh] flex flex-col justify-center overflow-hidden py-20"
      >
        <span className="pointer-events-none select-none absolute -bottom-[10%] left-1/2 -translate-x-1/2 font-display font-extrabold text-[22vw] leading-none text-white/[0.06] whitespace-nowrap">
          shelf
        </span>

        <div className="relative mx-auto max-w-[1400px] w-full px-5 sm:px-8 lg:px-12">
          <p className="font-body text-[13px] tracking-[0.22em] uppercase text-white/60 mb-4">
            On shelf
          </p>
          <h2 className="font-head font-bold text-white text-[7.5vw] sm:text-[4vw] lg:text-[3vw] leading-[1.08] tracking-[-0.02em] max-w-3xl mb-3 uppercase">
            We are not building a product.
            <br />
            We are building a shelf.
          </h2>
          <p className="text-white/70 text-[16px] sm:text-[18px] mb-14 max-w-lg">
            An entire blue block inside a supermarket.
          </p>

          <div
            ref={shelfTrackRef}
            className="flex items-end gap-3 sm:gap-4 overflow-x-visible pb-2"
          >
            {Array.from({ length: 9 }).map((_, i) => {
              const Shape = PACK_SHAPES[i % PACK_SHAPES.length];
              return (
                <div
                  key={i}
                  className="shelf-card shrink-0 w-[9.5%] min-w-[54px] sm:min-w-[74px] bg-white/95 rounded-lg p-2.5 flex flex-col items-center"
                >
                  <Shape className="text-[#0C4DD5] w-full h-auto" />
                </div>
              );
            })}

            <div className="price-flip shrink-0 ml-2 sm:ml-6 bg-[#111111] text-white rounded-2xl px-5 sm:px-7 py-5 sm:py-6 [perspective:800px]">
              <p className="font-display font-extrabold text-[26px] sm:text-[34px] leading-none">
                ₹49
              </p>
              <p className="font-body text-[12px] sm:text-[13px] text-white/70 mt-2 max-w-[110px] leading-snug">
                Good products.
                <br />
                Honest prices.
              </p>
            </div>
          </div>

          <div className="mt-16 h-px w-full bg-white/15" />
          <p className="mt-8 font-head font-bold text-white text-[18px] sm:text-[22px]">
            Own the shelf through consistency, not clutter.
          </p>
        </div>
      </section>

      {/* ================= BLUE FIRST / PRODUCT SYSTEM TEASER ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
                The system
              </p>
              <h2 className="font-head font-bold text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.05] tracking-[-0.02em] text-[#111111] uppercase max-w-2xl">
                Blue first. Product second.
                <br />
                Nothing else.
              </h2>
            </div>
            <p className="text-[#111111]/60 text-[16px] max-w-xs">
              One blue system across every product.
            </p>
          </div>

          <div className="reveal-stagger grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="stagger-item group relative overflow-hidden rounded-[22px] bg-[#0C4DD5] p-7 sm:p-8 h-[190px] flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1.5"
              >
                <span className="absolute -right-6 -bottom-8 font-display font-extrabold text-[90px] text-white/[0.08] leading-none group-hover:scale-110 transition-transform duration-500">
                  ne
                </span>
                <cat.icon size={24} className="text-white/70" strokeWidth={1.6} />
                <div>
                  <p className="font-head font-bold text-white text-[19px] mb-1">
                    {cat.name}
                  </p>
                  <p className="font-body text-white/60 text-[13px] mb-3">
                    {cat.count}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-white text-[13px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View category <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="reveal-up mt-12 flex justify-center">
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-[#111111] text-white px-8 py-4 font-body font-semibold text-[15px] hover:bg-[#0C4DD5] transition-colors duration-300"
            >
              View all products
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ON THE MOVE ================= */}
      <section className="relative bg-[#082F8A] py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://picsum.photos/seed/nothingelse-fleet/1800/900"
            alt=""
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-[#0A3FB0] mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#082F8A] via-[#082F8A]/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-stagger max-w-xl">
            <p className="stagger-item font-body text-[13px] tracking-[0.22em] uppercase text-white/60 mb-4">
              Distribution
            </p>
            <h2 className="stagger-item font-head font-bold text-white text-[8vw] sm:text-[3.6vw] lg:text-[2.8vw] leading-[1.08] tracking-[-0.02em] mb-5">
              Nothing Else on the Move
            </h2>
            <p className="stagger-item text-white/70 text-[16px] sm:text-[18px] leading-relaxed mb-10">
              The Nothing Else delivery fleet should be as recognisable as
              the products.
            </p>

            <div className="stagger-item flex flex-wrap gap-x-8 gap-y-4">
              {FLEET_POINTS.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-2 text-white/90 font-body text-[15px]"
                >
                  <p.icon size={17} className="text-white" />
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          <div className="reveal-up mt-16 flex items-center gap-4 sm:gap-6 overflow-hidden">
            <Truck size={40} className="text-white/50 shrink-0" strokeWidth={1.3} />
            <div className="flex gap-3 sm:gap-4">
              {PACK_SHAPES.slice(0, 5).map((Shape, i) => (
                <div
                  key={i}
                  className="w-[46px] sm:w-[58px] bg-white/95 rounded-md p-1.5"
                >
                  <Shape className="text-[#0C4DD5] w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRINCIPLE CLOSER ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 text-center">
          <p className="reveal-up font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-5">
            The nothing else principle
          </p>
          <h2 className="reveal-up font-head font-bold text-[#111111] text-[9vw] sm:text-[4.4vw] lg:text-[3.2vw] leading-[1.06] tracking-[-0.02em] mb-6">
            One Brand. Many Products.
            <br />
            One Colour. One Rule.
          </h2>
          <p className="reveal-up max-w-2xl mx-auto text-[#111111]/60 text-[16px] sm:text-[18px] leading-relaxed mb-4">
            Every part of Nothing Else must feel like it belongs to the
            same simple system.
          </p>
          <p className="reveal-up max-w-2xl mx-auto text-[#111111]/60 text-[16px] sm:text-[18px] leading-relaxed mb-14">
            From a{" "}
            <span className="text-[#0C4DD5] font-semibold">
              packet of salt
            </span>{" "}
            to a{" "}
            <span className="text-[#0C4DD5] font-semibold">
              supermarket shelf
            </span>
            . From a{" "}
            <span className="text-[#0C4DD5] font-semibold">
              hand wash bottle
            </span>{" "}
            to a{" "}
            <span className="text-[#0C4DD5] font-semibold">
              delivery truck
            </span>
            . From a{" "}
            <span className="text-[#0C4DD5] font-semibold">price tag</span>{" "}
            to a{" "}
            <span className="text-[#0C4DD5] font-semibold">
              social media post
            </span>
            .
          </p>

          <div className="reveal-stagger flex flex-wrap justify-center gap-x-10 gap-y-6">
            {PRINCIPLES.map((p) => (
              <span
                key={p.label}
                className="stagger-item inline-flex items-center gap-2.5 font-head font-bold text-[17px] text-[#111111]"
              >
                <p.icon size={19} className="text-[#0C4DD5]" />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
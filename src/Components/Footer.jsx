import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Share2,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Eye,
  CheckCircle2,
  Star,
  Square,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

const PRINCIPLES = [
  { icon: Eye, label: "Clear." },
  { icon: CheckCircle2, label: "Useful." },
  { icon: Star, label: "Recognisable." },
  { icon: Square, label: "Nothing else." },
];

export default function Footer() {
  const rootRef = useRef(null);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordmarkRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.utils.toArray(".footer-reveal").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden bg-[#0C4DD5] text-white"
    >
      {/* marquee ticker */}
      <div className="relative border-b border-white/15 overflow-hidden py-3.5">
        <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-extrabold text-[13px] tracking-[0.25em] uppercase mx-6 flex items-center gap-6 text-white/80"
            >
              Blue first <Square size={8} className="fill-white/60" />
              Product second <Square size={8} className="fill-white/60" />
              Nothing else <Square size={8} className="fill-white/60" />
            </span>
          ))}
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* big CTA */}
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pt-16 sm:pt-24 pb-12">
        <div ref={wordmarkRef}>
          <p className="footer-reveal font-body text-white/60 text-sm tracking-[0.2em] uppercase mb-5">
            Good products. Honest prices.
          </p>
          <h2 className="font-head font-bold text-[9vw] sm:text-[6vw] lg:text-[4.4vw] leading-[1.02] tracking-[-0.02em] max-w-5xl">
            Good everyday products.
            <br />
            Honest pricing.{" "}
            <span className="font-display italic font-extrabold">
              nothing else.
            </span>
          </h2>
        </div>

        <div className="footer-reveal mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#0C4DD5] px-7 py-3.5 font-body font-semibold text-[15px] hover:bg-[#111111] hover:text-white transition-colors duration-300"
          >
            See the products
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 font-body font-semibold text-[15px] hover:bg-white/10 transition-colors duration-300"
          >
            Talk to us
          </Link>
        </div>
      </div>

      {/* sitemap grid */}
      <div className="footer-reveal mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 pb-14 grid grid-cols-2 sm:grid-cols-4 gap-10 border-t border-white/15 pt-12">
        <div>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-white/50 mb-4">
            Explore
          </p>
          <ul className="space-y-2.5">
            {EXPLORE.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-body text-[15px] text-white/85 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-white/50 mb-4">
            Connect
          </p>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://instagram.com/nothing_else"
                target="_blank"
                rel="noreferrer"
                className="font-body text-[15px] text-white/85 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Share2 size={15} /> @nothing_else
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@nothingelse.co.in"
                className="font-body text-[15px] text-white/85 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Mail size={15} /> hello@nothingelse.co.in
              </a>
            </li>
            <li>
              <a
                href="tel:+911800000000"
                className="font-body text-[15px] text-white/85 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Phone size={15} /> 1800-000-000
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-white/50 mb-4">
            Visit
          </p>
          <p className="font-body text-[15px] text-white/85 inline-flex gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0" />
            Nothing Else House,
            <br />
            Andheri East, Mumbai 400069
          </p>
        </div>

        <div>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-white/50 mb-4">
            The principle
          </p>
          <ul className="space-y-2.5">
            {PRINCIPLES.map((p) => (
              <li
                key={p.label}
                className="font-body text-[15px] text-white/85 inline-flex items-center gap-2 mr-4"
              >
                <p.icon size={14} className="text-white/60" />
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* bottom bar */}
      <div className="footer-reveal relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 py-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-[13px] text-white/50">
          Blue leads. White clarifies. Black informs.
        </p>
        <p className="font-body text-[13px] text-white/50">
          © {new Date().getFullYear()} Nothing Else. All rights reserved.
        </p>
        <button
          onClick={scrollTop}
          aria-label="Back to top"
          className="h-10 w-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#0C4DD5] transition-colors duration-300"
        >
          <ArrowUp size={16} />
        </button>
      </div>

      {/* faint background wordmark */}
      <span className="pointer-events-none select-none absolute -bottom-[6%] left-1/2 -translate-x-1/2 font-display font-extrabold text-[26vw] leading-none text-white/[0.05] whitespace-nowrap">
        nothing else.
      </span>
    </footer>
  );
}

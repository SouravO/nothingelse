import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Global smooth-scroll (Lenis) + GSAP ticker bridge.                  */
/* Guarded as a module singleton so it only ever boots once, even      */
/* through React StrictMode's double-invoke or route re-mounts.        */
/* ------------------------------------------------------------------ */
let __lenis = null;
function useGlobalSmoothScroll() {
  useEffect(() => {
    if (__lenis) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    __lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      lenis.stop();
    }

    return () => {
      // Intentionally not destroyed — Navbar acts as a persistent
      // layout element for the app's lifetime.
    };
  }, []);
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  useGlobalSmoothScroll();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Entrance animation for the bar itself
  useEffect(() => {
    gsap.fromTo(
      barRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 }
    );
  }, []);

  return (
    <>
      {/* Site-wide font + brand tokens. Navbar mounts on every page so
          this only needs to live here once. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap');
        :root{
          --ne-blue:#0C4DD5;
          --ne-blue-deep:#082F8A;
          --ne-blue-soft:#3B6FE0;
          --ne-ink:#111111;
          --ne-grey:#EDEDED;
          --ne-tint:#EAF0FE;
        }
        .font-display{ font-family:'Montserrat', sans-serif; }
        .font-head{ font-family:'Helvetica Neue', Inter, Arial, sans-serif; }
        .font-body{ font-family:'Inter', sans-serif; }
        html{ scroll-behavior:auto; }
        ::selection{ background:#0C4DD5; color:#fff; }
      `}</style>

      <header
        ref={barRef}
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
          scrolled || open
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(17,17,17,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[76px] sm:h-[84px]">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2 select-none"
              aria-label="Nothing Else — Home"
            >
              <span
                className={`font-display font-extrabold text-[22px] sm:text-[26px] tracking-[-0.02em] transition-colors duration-500 ${
                  scrolled || open ? "text-[#111111]" : "text-white"
                }`}
              >
                nothing
                <span
                  className={`transition-colors duration-500 ${
                    scrolled || open ? "text-[#0C4DD5]" : "text-white"
                  }`}
                >
                  {" "}
                  else
                </span>
                <span className="text-[#0C4DD5]">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `relative px-4 py-2 font-body text-[15px] font-medium rounded-full transition-colors duration-300 ${
                      scrolled
                        ? isActive
                          ? "text-[#0C4DD5]"
                          : "text-[#111111]/70 hover:text-[#111111]"
                        : isActive
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative inline-flex items-center gap-1.5">
                      {isActive && (
                        <span className="h-[6px] w-[6px] rounded-[2px] bg-[#0C4DD5]" />
                      )}
                      {link.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-body text-[14px] font-semibold transition-all duration-300 ${
                  scrolled
                    ? "bg-[#111111] text-white hover:bg-[#0C4DD5]"
                    : "bg-white text-[#111111] hover:bg-[#0C4DD5] hover:text-white"
                }`}
              >
                Get in touch
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>

              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className={`md:hidden relative z-[110] h-10 w-10 flex items-center justify-center rounded-full transition-colors ${
                  open
                    ? "text-white"
                    : scrolled
                    ? "text-[#111111]"
                    : "text-white"
                }`}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 5%)" }}
            animate={{ clipPath: "circle(150% at 92% 5%)" }}
            exit={{ clipPath: "circle(0% at 92% 5%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[105] bg-[#0C4DD5] flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.07,
                    duration: 0.5,
                    ease: "power3.out",
                  }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `font-display font-extrabold text-[13vw] leading-[1.05] block ${
                        isActive ? "text-white" : "text-white/50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-white/70 mt-10 text-sm"
            >
              Good everyday products. Honest pricing.{" "}
              <span className="text-white font-semibold">Nothing else.</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
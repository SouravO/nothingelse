import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================================
   NAVBAR
   ============================================================================ */

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products", path: "/products", observeIds: ["products", "products-showcase"] },
  { id: "system", label: "System" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");

  // Navbar goes solid the moment the (pinned) hero has fully scrolled away —
  // until then it rides transparent over the hero's dark background.
  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // Track which section is currently in view to highlight the matching nav item
  useEffect(() => {
    const sectionLinks = NAV_LINKS.flatMap((link) =>
      (link.observeIds || [link.id]).map((sectionId) => ({
        linkId: link.id,
        el: document.getElementById(sectionId),
      }))
    ).filter((item) => item.el);

    const sections = sectionLinks.map((item) => item.el);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const match = sectionLinks.find((item) => item.el === entry.target);
          if (match) setActiveId(match.linkId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const onNavClick = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[110] transition-colors duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#111111]/8"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 h-[68px] sm:h-[76px] flex items-center justify-between">
        <a
          href="#hero"
          aria-label="Nothing Else — Home"
          onClick={(e) => onNavClick(e, "hero")}
          className="font-logo font-extrabold text-[19px] tracking-[-0.02em] select-none"
        >
          <span className={scrolled ? "text-[#111111]" : "text-white"}>nothing</span>{" "}
          <span className={scrolled ? "text-[#111111]/95" : "text-white/95"}>else</span>
          <span className="text-[#0C4DD5]">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.path || `/#${link.id}`}
              onClick={(e) => {
                if (link.path) {
                  setMobileOpen(false);
                  return;
                }
                onNavClick(e, link.id);
              }}
              className={`relative px-3.5 py-2 rounded-full font-body text-[13.5px] font-medium transition-colors duration-300 ${
                activeId === link.id
                  ? scrolled ? "text-[#0C4DD5]" : "text-white"
                  : scrolled ? "text-[#111111]/55 hover:text-[#111111]" : "text-white/65 hover:text-white"
              }`}
            >
              {link.label}
              {activeId === link.id && (
                <span className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full ${scrolled ? "bg-[#0C4DD5]" : "bg-white"}`} />
              )}
            </Link>
          ))}
          <a
            href="#contact"
            onClick={(e) => onNavClick(e, "contact")}
            className={`ml-2 inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body font-semibold text-[13.5px] transition-colors duration-300 ${
              scrolled ? "bg-[#0C4DD5] text-white hover:bg-[#111111]" : "bg-white text-[#0A3FB0] hover:bg-[#111111] hover:text-white"
            }`}
          >
            Get in touch
          </a>
        </nav>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`md:hidden p-2 -mr-2 transition-colors duration-300 ${scrolled ? "text-[#111111]" : "text-white"}`}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-[#111111]/8 overflow-hidden"
          >
            <div className="px-5 py-3 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id}
                  to={link.path || `/#${link.id}`}
                  onClick={(e) => {
                    if (link.path) {
                      setMobileOpen(false);
                      return;
                    }
                    onNavClick(e, link.id);
                  }}
                  className={`px-3 py-2.5 rounded-xl font-body text-[15px] font-medium transition-colors duration-300 ${
                    activeId === link.id ? "text-[#0C4DD5] bg-[#EAF0FE]" : "text-[#111111]/75"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  scrollToSection("contact");
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-[#0C4DD5] px-4 py-2.5 font-body text-[14px] font-semibold text-white shadow-sm"
              >
                Get in touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

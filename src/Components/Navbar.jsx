import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

// Framer Motion variants for mobile menu staggering
const mobileMenuVars = {
  initial: { opacity: 0, height: 0 },
  animate: { 
    opacity: 1, 
    height: "auto", 
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05, delayChildren: 0.1 } 
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.03, staggerDirection: -1 } 
  },
};

const mobileLinkVars = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const isSolid = location.pathname !== "/" || scrolled;

  // Navbar goes solid the moment the (pinned) hero has fully scrolled away
  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;
    const id = location.hash.slice(1);
    const t = setTimeout(() => scrollToSection(id), 80);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

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
  }, [location.pathname]);

  const onNavClick = (e, id) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    if (location.hash !== `#${id}`) {
      navigate(`/#${id}`, { replace: true });
    }
    scrollToSection(id);
  };

  const onProductsClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/products" || location.hash) {
      navigate("/products");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-[140] transition-all duration-500 ease-in-out ${
        isSolid
          ? "bg-white/85 backdrop-blur-xl border-b border-[#111111]/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 h-[68px] sm:h-[76px] flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#hero"
          aria-label="Nothing Else — Home"
          onClick={(e) => onNavClick(e, "hero")}
          className="group font-logo font-extrabold text-[19px] tracking-[-0.02em] select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className={`transition-colors duration-500 ${isSolid ? "text-[#111111]" : "text-white"}`}>nothing</span>{" "}
          <span className={`transition-colors duration-500 ${isSolid ? "text-[#111111]/70 group-hover:text-[#111111]" : "text-white/80 group-hover:text-white"}`}>else</span>
          <span className="text-[#0C4DD5]">.</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.path || `/#${link.id}`}
              onClick={(e) => {
                if (link.path) {
                  onProductsClick(e);
                  return;
                }
                onNavClick(e, link.id);
              }}
              className="relative px-4 py-2 font-body text-[13.5px] font-medium transition-colors duration-300 z-10 group"
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                activeId === link.id
                  ? isSolid ? "text-[#0C4DD5]" : "text-white"
                  : isSolid ? "text-[#111111]/60 group-hover:text-[#111111]" : "text-white/70 group-hover:text-white"
              }`}>
                {link.label}
              </span>
              
              {/* Sliding Active Pill */}
              {activeId === link.id && (
                <motion.div
                  layoutId="desktop-nav-active"
                  className={`absolute inset-0 rounded-full -z-10 ${isSolid ? "bg-[#0C4DD5]/10" : "bg-white/15"}`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* CTA Button */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            onClick={(e) => onNavClick(e, "contact")}
            className={`ml-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 font-body font-semibold text-[13.5px] transition-all duration-300 shadow-sm ${
              isSolid 
                ? "bg-[#0C4DD5] text-white hover:bg-[#0A3FB0] hover:shadow-md" 
                : "bg-white text-[#0A3FB0] hover:bg-white/90 hover:shadow-md"
            }`}
          >
            Get in touch
          </motion.a>
        </nav>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`md:hidden relative z-[10] p-2 -mr-2 touch-manipulation pointer-events-auto transition-colors duration-300 ${isSolid ? "text-[#111111]" : "text-white"}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: mobileOpen ? -90 : 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: mobileOpen ? 90 : -90 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#111111]/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] absolute w-full"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <motion.div key={link.id} variants={mobileLinkVars}>
                  <Link
                    to={link.path || `/#${link.id}`}
                    onClick={(e) => {
                      if (link.path) {
                         onProductsClick(e);
                         return;
                      }
                      onNavClick(e, link.id);
                    }}
                    className={`block px-4 py-3 rounded-xl font-body text-[15px] font-medium transition-all duration-300 ${
                      activeId === link.id 
                        ? "text-[#0C4DD5] bg-[#0C4DD5]/5 shadow-sm" 
                        : "text-[#111111]/70 hover:text-[#111111] hover:bg-black/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={mobileLinkVars} className="pt-3 pb-1">
                <button
                  type="button"
                  onClick={(e) => onNavClick(e, "contact")}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-[#0C4DD5] px-4 py-3.5 font-body text-[15px] font-semibold text-white shadow-md transition-all active:scale-[0.98] hover:bg-[#0A3FB0]"
                >
                  Get in touch
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

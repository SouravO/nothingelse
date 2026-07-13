import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Menu,
  X,
  Square,
  Check,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Volume2,
  Wrench,
  Fingerprint,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Wallet,
  Eye,
  Star,
  Mail,
  Phone,
  MapPin,
  Tag,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   FILE ORGANIZATION
   ----------------------------------------------------------------------------
   One scrolling page, six short sections, each a self-contained function:

     <Navbar />          — fixed header, scrolls to sections by id
     <HomeSection />       id="home"      — hero
     <AboutSection />      id="about"     — positioning, personality, logo
     <ProductsSection />   id="products"  — category tabs + product grid
     <SystemSection />     id="system"    — colour, typography, pack shapes
     <PresenceSection />   id="presence"  — shelf, photography, fleet, digital
     <ContactSection />    id="contact"   — enquiry form

   Every section is intentionally ONE compact block (not several stacked
   full-height panels), so the page reads fast on desktop and mobile alike.
   Brand rules (colour, usage ratios, typography, logo rule, positioning,
   personality, pack shapes) are unchanged from the brand book — only the
   layout has been tightened.
   ============================================================================ */

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
function handleAnchorClick(e, id) {
  e.preventDefault();
  scrollToSection(id);
}

/* Shared reveal-on-scroll wrapper, replaces per-section scroll libraries */
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

/* ============================================================================
   NAVBAR
   ============================================================================ */

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "products", label: "Products" },
  { id: "system", label: "System" },
  { id: "presence", label: "Presence" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  // Navbar goes solid the moment the (pinned) hero has fully scrolled away —
  // until then it rides transparent over the hero's dark background.
  useEffect(() => {
    const heroEl = document.getElementById("home");
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
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
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
        scrolled ? "bg-white/95 backdrop-blur-md border-b border-[#111111]/8" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 h-[68px] sm:h-[76px] flex items-center justify-between">
        <a
          href="#home"
          aria-label="Nothing Else — Home"
          onClick={(e) => onNavClick(e, "home")}
          className="font-display font-extrabold text-[19px] tracking-[-0.02em] select-none"
        >
          <span className={scrolled ? "text-[#111111]" : "text-white"}>nothing</span>{" "}
          <span className={scrolled ? "text-[#111111]/95" : "text-white/95"}>else</span>
          <span className="text-[#0C4DD5]">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => onNavClick(e, link.id)}
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
            </a>
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
            <div className="px-5 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => onNavClick(e, link.id)}
                  className={`px-3 py-2.5 rounded-xl font-body text-[15px] font-medium transition-colors duration-300 ${
                    activeId === link.id ? "text-[#0C4DD5] bg-[#EAF0FE]" : "text-[#111111]/75"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================================================================
   SECTION 1: HOME (HERO)
   ----------------------------------------------------------------------------
   Kept exactly as the original cinematic hero: same layers, same pinned
   title-morph scroll timeline (giant "nothing else." wordmark shrinks and
   slides into the navbar's logo position as you scroll), same copy.
   ============================================================================ */

function HomeSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);

  const contentRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  const heroWords = "Just the product.".split(" ");
  const heroWords2 = "Nothing else.".split(" ");

  useLayoutEffect(() => {
    // Guard against React StrictMode / hot-reload double-invoking this effect,
    // which otherwise leaves a stale ScrollTrigger pinned underneath the new one.
    ScrollTrigger.getById("home-pin")?.kill();

    const ctx = gsap.context(() => {
      // Prevent Flash of Unstyled Content (FOUC)
      gsap.set(contentRefs.current, { opacity: 0, y: 40 });
      gsap.set(titleRef.current, {
        xPercent: -50,
        yPercent: -50,
        top: "50%",
        left: "50%",
        scale: 1,
        transformOrigin: "center center",
      });

      // Target the external Navbar logo to calculate bounds and crossfade
      const navLogo = document.querySelector('header a[aria-label="Nothing Else — Home"]');
      if (navLogo) {
        gsap.set(navLogo, { opacity: 0 }); // Hide actual nav logo initially
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "home-pin",
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%", // Total scroll distance (cinematic duration)
          scrub: 0.8,    // Smooth, slight lag for premium feel
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculate on window resize
        },
      });

      // Phase 1 (0-25%): Fade dark overlay to reveal background
      tl.to(overlayRef.current, { opacity: 0.4, duration: 25, ease: "none" }, 0);

      // Phase 2 & 3 (25-75%): Morph giant title to navbar logo position
      tl.to(
        titleRef.current,
        {
          x: () => {
            if (!navLogo) return 0;
            const targetRect = navLogo.getBoundingClientRect();
            const targetCenterX = targetRect.left + targetRect.width / 2;
            const startCenterX = window.innerWidth / 2;
            return targetCenterX - startCenterX;
          },
          y: () => {
            if (!navLogo) return 0;
            const targetRect = navLogo.getBoundingClientRect();
            const targetCenterY = targetRect.top + targetRect.height / 2;
            const startCenterY = window.innerHeight / 2;
            return targetCenterY - startCenterY;
          },
          scale: () => {
            if (!navLogo) return 1;
            const targetRect = navLogo.getBoundingClientRect();
            const baseWidth = titleRef.current.offsetWidth;
            return targetRect.width / baseWidth;
          },
          duration: 50,
          ease: "power2.inOut",
        },
        25
      );

      // Phase 4 (65-90%): Reveal standard hero content behind the title
      tl.to(
        contentRefs.current,
        { opacity: 1, y: 0, duration: 25, stagger: 4, ease: "power2.out" },
        60
      );

      // Phase 4 (75-80%): Seamless crossfade into the permanent Navbar logo
      if (navLogo) {
        tl.to(titleRef.current, { opacity: 0, duration: 5, ease: "none" }, 75);
        tl.to(navLogo, { opacity: 1, duration: 5, ease: "none" }, 75);
      }

      // Safety net: fonts/images finishing late can shift layout after the
      // ScrollTrigger has already measured it, which is the #1 cause of a
      // pin that seems to "not work" (wrong start/end points). Re-measure
      // once everything has actually settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      const bgImg = sectionRef.current?.querySelector("img");
      if (bgImg && !bgImg.complete) bgImg.addEventListener("load", refresh);
      const raf = requestAnimationFrame(refresh);

      return () => {
        window.removeEventListener("load", refresh);
        if (bgImg) bgImg.removeEventListener("load", refresh);
        cancelAnimationFrame(raf);
      };
    }, sectionRef);

    // Cleanup: restore nav logo visibility if hero unmounts
    return () => {
      ctx.revert();
      const navLogo = document.querySelector('header a[aria-label="Nothing Else — Home"]');
      if (navLogo) gsap.set(navLogo, { opacity: 1 });
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative bg-black">
      {/* This container acts as our pinned viewport.
        It locks at 100vh while the ScrollTrigger scrubs the animation timeline.
      */}
      <div ref={containerRef} className="relative h-[100svh] w-full overflow-hidden">

        {/* Fullscreen Background Image */}
        <img
          src="https://picsum.photos/seed/nothingelse-hero/1920/1080"
          alt="Premium FMCG Products"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Cinematic Dark Overlay (Fades slightly, never fully leaves to maintain text contrast) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#040A18] opacity-[0.98] pointer-events-none z-10"
        />

        {/* The Giant Morphing Title (Standalone Layer) */}
        <h1
          ref={titleRef}
          className="fixed z-[105] font-display font-extrabold tracking-[-0.02em] whitespace-nowrap pointer-events-none text-white select-none"
          style={{ fontSize: "min(13vw, 140px)" }}
        >
          nothing <span className="text-white/95">else</span><span className="text-[#0C4DD5]">.</span>
        </h1>

        {/* Standard Hero Content (Revealed during scroll) */}
        <div className="relative z-20 w-full h-full mx-auto max-w-[1280px] px-5 sm:px-8 pb-16 pt-[140px] flex flex-col justify-end">

          <div ref={addToRefs} className="inline-flex self-start items-center gap-2 rounded-full bg-white/10 border border-white/25 px-4 py-2 mb-6 backdrop-blur-md">
            <Square size={9} className="fill-white text-white" />
            <span className="font-body text-[13px] sm:text-[14px] text-white/90">
              Good everyday products. Honest pricing, Nothing else.
            </span>
          </div>

          <h1 ref={addToRefs} className="font-head font-bold text-white text-[11vw] sm:text-[8vw] lg:text-[5.5vw] leading-[1] tracking-[-0.03em] max-w-4xl">
            <span className="block overflow-hidden">
              {heroWords.map((w, i) => (
                <span key={i} className="inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden font-display italic text-white/80">
              {heroWords2.map((w, i) => (
                <span key={i} className="inline-block mr-[0.28em]">
                  {w}
                </span>
              ))}
            </span>
          </h1>

          <p ref={addToRefs} className="mt-6 max-w-xl text-white/80 text-[16px] sm:text-[18px] leading-relaxed font-body">
            A minimal FMCG brand built to make everyday buying simpler, clearer and more honest.
          </p>

          <div ref={addToRefs} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#products"
              onClick={(e) => handleAnchorClick(e, "products")}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-[#0A3FB0] px-7 py-3.5 font-body font-semibold text-[15px] hover:bg-[#111111] hover:text-white transition-colors duration-300"
            >
              See the products
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#about"
              onClick={(e) => handleAnchorClick(e, "about")}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 font-body font-semibold text-[15px] text-white hover:bg-white/10 transition-colors duration-300"
            >
              Our story
            </a>
          </div>
        </div>
      </div>

      {/* Marquee Strip (Sits below the pinned section) */}
      <div className="relative z-10 w-full border-t border-white/10 bg-[#040A18] overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-[homeMarquee_20s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-extrabold text-[12px] sm:text-[13px] tracking-[0.28em] uppercase mx-6 flex items-center gap-6 text-white/60"
            >
              Blue first <Square size={7} className="fill-white/30" />
              Product second <Square size={7} className="fill-white/30" />
              Nothing else <Square size={7} className="fill-white/30" />
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes homeMarquee { from{ transform:translateX(0);} to{ transform:translateX(-50%);} }
      `}</style>
    </section>
  );
}

/* ============================================================================
   SECTION 2: ABOUT — positioning, personality, logo rule in one block
   ============================================================================ */

const ABOUT_BULLETS = ["Not cheap.", "Not luxury.", "Not overdesigned.", "Modern, honest, recognisable."];

const ABOUT_TRAITS = [
  { icon: Sparkles, title: "Simple" },
  { icon: MessageCircle, title: "Honest" },
  { icon: Volume2, title: "Confident" },
  { icon: Wrench, title: "Useful" },
  { icon: Fingerprint, title: "Recognisable" },
];

function AboutSection() {
  return (
    <section id="about" className="relative bg-[#FAFBFF] scroll-mt-[68px] sm:scroll-mt-[76px] py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#0C4DD5]/70 mb-3">About Nothing Else</p>
          <h2 className="font-head font-bold text-[#111111] text-[9vw] sm:text-[4.4vw] lg:text-[3vw] leading-[1.05] tracking-[-0.02em] max-w-2xl mb-6">
            The Honest Everyday Brand
          </h2>
          <p className="text-[16px] sm:text-[18px] text-[#111111]/60 leading-relaxed max-w-2xl mb-8">
            The FMCG market has become noisy — too many colours, too many claims, too much packaging.
            Nothing Else sits between low-cost unorganised products and over-marketed branded FMCG:
            good product, fair price, clear choice. Brand essence: <span className="text-[#111111] font-semibold">Radical Simplicity</span>.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2.5 mb-10">
            {ABOUT_BULLETS.map((b) => (
              <span key={b} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#111111]/8 px-4 py-2 text-[13.5px] font-medium text-[#111111]/75">
                <span className="h-[6px] w-[6px] rounded-[2px] bg-[#0C4DD5]" />
                {b}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
            {ABOUT_TRAITS.map((t) => (
              <div key={t.title} className="rounded-2xl bg-white border border-[#111111]/6 p-4 flex flex-col items-center text-center gap-2">
                <t.icon size={20} strokeWidth={1.6} className="text-[#0C4DD5]" />
                <span className="font-head font-bold text-[14px] text-[#111111]">{t.title}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[#0C4DD5] px-6 py-5">
            <span className="font-display font-extrabold text-white text-[18px]">nothing else.</span>
            <span className="h-4 w-px bg-white/30 hidden sm:block" />
            <p className="font-head font-bold text-[15px] sm:text-[16px] text-white/95">
              The logo is already complete. Add nothing else.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 3: PRODUCTS — tabs + compact grid
   ============================================================================ */

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

const PRODUCT_CATEGORIES = [
  { name: "Breakfast & Grains", accent: "#0C4DD5", products: [
    { name: "Corn Flakes", size: "500 g", shape: PackBox },
    { name: "Basmati Rice", size: "1 kg", shape: PackPouch },
    { name: "Atta", size: "5 kg", shape: PackPouch },
    { name: "Penne Pasta", size: "500 g", shape: PackPouch },
  ]},
  { name: "Beverages", accent: "#1450E0", products: [
    { name: "Orange Juice", size: "1 L", shape: PackBottle },
    { name: "Black Tea", size: "250 g", shape: PackBox },
    { name: "Classic Coffee", size: "200 g", shape: PackJar },
  ]},
  { name: "Pantry & Cooking", accent: "#0A3FB0", products: [
    { name: "Sunflower Oil", size: "1 L", shape: PackBottle },
    { name: "Biscuits", size: "200 g", shape: PackPouch },
    { name: "Strawberry Jam", size: "300 g", shape: PackJar },
    { name: "Sugar", size: "1 kg", shape: PackPouch },
  ]},
  { name: "Spices & Seasoning", accent: "#082F8A", products: [
    { name: "Salt", size: "1 kg", shape: PackSachet },
    { name: "Turmeric Powder", size: "100 g", shape: PackSachet },
    { name: "Red Chilli Powder", size: "100 g", shape: PackSachet },
    { name: "Cumin Seeds", size: "100 g", shape: PackSachet },
  ]},
  { name: "Home Care", accent: "#3B6FE0", products: [
    { name: "All Purpose Cleaner", size: "500 ml", shape: PackBottle },
    { name: "Dishwash Liquid", size: "500 ml", shape: PackBottle },
    { name: "Floor Cleaner", size: "1 L", shape: PackBottle },
  ]},
  { name: "Personal Care", accent: "#111111", products: [
    { name: "Bath Soap", size: "125 g", shape: PackBox },
    { name: "Toothpaste", size: "100 g", shape: PackBottle },
    { name: "Shampoo", size: "180 ml", shape: PackBottle },
  ]},
];

const ALL_TAB = "All";
const TABS = [ALL_TAB, ...PRODUCT_CATEGORIES.map((c) => c.name)];

function ProductsSection() {
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const visible =
    activeTab === ALL_TAB ? PRODUCT_CATEGORIES.flatMap((c) => c.products.map((p) => ({ ...p, accent: c.accent })))
    : PRODUCT_CATEGORIES.find((c) => c.name === activeTab).products.map((p) => ({ ...p, accent: PRODUCT_CATEGORIES.find((c) => c.name === activeTab).accent }));

  return (
    <section id="products" className="relative bg-white scroll-mt-[68px] sm:scroll-mt-[76px] py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#0C4DD5]/70 mb-3">Products</p>
          <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] uppercase mb-8 max-w-xl">
            Blue first. Product second. Nothing else.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full font-body text-[13px] font-medium transition-colors duration-300 ${
                  activeTab === tab ? "bg-[#0C4DD5] text-white" : "bg-[#FAFBFF] text-[#111111]/60 border border-[#111111]/8 hover:text-[#111111]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {visible.map((p, i) => {
              const Shape = p.shape;
              return (
                <div key={p.name + i} className="rounded-[16px] bg-[#FAFBFF] border border-[#111111]/6 p-3.5 flex flex-col items-center text-center">
                  <Shape className="h-[56px] w-auto mb-2.5" style={{ color: p.accent }} />
                  <p className="font-head font-bold text-[#111111] text-[12.5px] leading-tight">{p.name}</p>
                  <p className="text-[#111111]/40 text-[11px] mt-0.5">{p.size}</p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 4: SYSTEM — colour, typography, pack shapes in one block
   ============================================================================ */

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

function SystemSection() {
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

/* ============================================================================
   SECTION 5: PRESENCE — shelf, photography, fleet, digital as compact cards
   ============================================================================ */

const PRESENCE_CARDS = [
  {
    icon: Star,
    title: "On Shelf",
    body: "We are not building a product — we are building a shelf. An entire blue block, owned through consistency, not clutter.",
  },
  {
    icon: Eye,
    title: "Photography",
    body: "Natural light, real settings, product-focused. Avoid artificial luxury, over-styled sets and unreal claims.",
  },
  {
    icon: Truck,
    title: "Fleet",
    body: "The delivery fleet should be as recognisable as the products: good quality, right price, trusted everyday.",
  },
  {
    icon: Tag,
    title: "Digital & Social",
    body: "Solid blue backgrounds, large white type, one product, one message. No decorative visual noise.",
  },
];

function PresenceSection() {
  return (
    <section id="presence" className="relative bg-[#FAFBFF] scroll-mt-[68px] sm:scroll-mt-[76px] py-20 sm:py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal>
          <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#0C4DD5]/70 mb-3">Presence</p>
          <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.8vw] lg:text-[2.6vw] leading-[1.06] tracking-[-0.02em] mb-10 max-w-xl">
            Built to Be Recognised Everywhere
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {PRESENCE_CARDS.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white border border-[#111111]/6 p-6">
                <c.icon size={20} className="text-[#0C4DD5] mb-4" strokeWidth={1.7} />
                <p className="font-head font-bold text-[16px] text-[#111111] mb-2">{c.title}</p>
                <p className="text-[13.5px] text-[#111111]/55 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-2xl bg-[#0C4DD5] px-6 py-6 sm:py-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            {[
              { icon: BadgeCheck, label: "Good quality" },
              { icon: Wallet, label: "Right price" },
              { icon: ShieldCheck, label: "Trusted everyday" },
              { icon: CheckCircle2, label: "Nothing else" },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-2 font-head font-bold text-[14.5px] text-white">
                <p.icon size={17} />
                {p.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   SECTION 6: CONTACT
   ============================================================================ */

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="rounded-[24px] border border-[#111111]/8 bg-[#FAFBFF] p-6 sm:p-7">
      <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#0C4DD5]/70 mb-3">Reach out</p>
      <h3 className="font-head font-bold text-[#111111] text-[24px] sm:text-[28px] leading-[1.08] tracking-[-0.02em] mb-6">
        Start a conversation.
      </h3>

      <form className="grid gap-3.5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="grid sm:grid-cols-2 gap-3.5">
          <label className="grid gap-1.5">
            <span className="text-[12.5px] font-medium text-[#111111]/60">Name</span>
            <input required type="text" className="rounded-xl border border-[#111111]/10 bg-white px-3.5 py-3 outline-none focus:border-[#0C4DD5] transition-colors" placeholder="Your name" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[12.5px] font-medium text-[#111111]/60">Email</span>
            <input required type="email" className="rounded-xl border border-[#111111]/10 bg-white px-3.5 py-3 outline-none focus:border-[#0C4DD5] transition-colors" placeholder="you@example.com" />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-[12.5px] font-medium text-[#111111]/60">Message</span>
          <textarea required rows={4} className="rounded-xl border border-[#111111]/10 bg-white px-3.5 py-3 outline-none focus:border-[#0C4DD5] transition-colors resize-none" placeholder="Tell us a little about what you need." />
        </label>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0C4DD5] px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-[#111111]">
          Send message
          <ArrowUpRight size={16} />
        </button>
      </form>

      {submitted && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#EAF0FE] px-4 py-2 text-[#0C4DD5] text-sm font-medium">
          <CheckCircle2 size={16} />
          Message ready — connect this form to your backend.
        </div>
      )}
    </div>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="relative bg-white px-5 sm:px-8 py-20 sm:py-24 scroll-mt-[68px] sm:scroll-mt-[76px] border-t border-[#111111]/5">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <div className="max-w-xl">
            <p className="font-body text-[13px] tracking-[0.2em] uppercase text-[#0C4DD5]/70 mb-4">Contact Nothing Else</p>
            <h2 className="font-head font-bold text-[#111111] text-[10vw] sm:text-[5.5vw] lg:text-[3.6vw] leading-[1] tracking-[-0.03em] mb-6">
              Good product.
              <br />
              Fair price.
              <br />
              Nothing else.
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="mailto:hello@nothingelse.co.in" className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-4 hover:border-[#0C4DD5]/25 transition-colors">
                <Mail className="text-[#0C4DD5] mb-3" size={17} />
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-[#111111]/40 mb-1">Email</p>
                <p className="font-medium text-[#111111] text-[14px]">hello@nothingelse.co.in</p>
              </a>
              <a href="tel:+911800000000" className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-4 hover:border-[#0C4DD5]/25 transition-colors">
                <Phone className="text-[#0C4DD5] mb-3" size={17} />
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-[#111111]/40 mb-1">Phone</p>
                <p className="font-medium text-[#111111] text-[14px]">1800-000-000</p>
              </a>
              <a href="https://instagram.com/nothing_else" target="_blank" rel="noreferrer" className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-4 hover:border-[#0C4DD5]/25 transition-colors sm:col-span-2">
                <MapPin className="text-[#0C4DD5] mb-3" size={17} />
                <p className="text-[11.5px] uppercase tracking-[0.16em] text-[#111111]/40 mb-1">Visit</p>
                <p className="font-medium text-[#111111] text-[14px]">Nothing Else House, Andheri East, Mumbai 400069</p>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================================
   PAGE ASSEMBLY
   ============================================================================ */
export default function NothingElseLandingPage() {
  return (
    <div className="bg-white font-body overflow-x-clip">
      <Navbar />
      <HomeSection />
      <AboutSection />
      <ProductsSection />
      <SystemSection />
      <PresenceSection />
      <ContactSection />
    </div>
  );
}
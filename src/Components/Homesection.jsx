import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Square } from "lucide-react";
import gsap from "gsap";

const PRODUCT_IMAGES = ["/pdt1.png", "/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];
const PRODUCT_NAMES = ["Shampoo", "Rice", "Dishwash", "Oils", "Tea"];
const PRODUCT_SLUGS = ["shampoo", "rice", "dishwash", "oils", "tea"];

const SHOWCASE_COUNT = PRODUCT_IMAGES.length;
const AUTO_ADVANCE_MS = 7500;
const NAV_LOGO_SELECTOR = 'header a[aria-label="Nothing Else — Home"]';

const INTRO_START_DELAY = 0.1;
const INTRO_HOLD_DURATION = 0.4;
const INTRO_TITLE_DURATION = 0.55;
const INTRO_HANDOFF_DURATION = 0.2;
const INTRO_REVEAL_DURATION = 0.45;
const INTRO_CONTENT_STAGGER = 0.05;

export default function HomeSection() {
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

  const productsRef = useRef([]);
  const shadowsRef = useRef([]);
  const pulsesRef = useRef([]);
  const labelsRef = useRef([]);
  const platformRef = useRef(null);
  const sweepRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // TODO: wire this up to actual routing/navigation logic later
  const handleCategoryClick = (slug) => {
    console.log(`Navigate to "${slug}" category page`);
  };

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!productsRef.current.length || !platformRef.current) return;

      const tl = gsap.timeline();

      gsap.set(productsRef.current, { y: -1000, opacity: 0 }); 
      gsap.set(shadowsRef.current, { scale: 2.2, opacity: 0, filter: "blur(15px)" });
      gsap.set(pulsesRef.current, { scale: 0.2, opacity: 0 });
      gsap.set(labelsRef.current, { y: -15, opacity: 0 });
      gsap.set(platformRef.current, { y: 0 });
      gsap.set(sweepRef.current, { xPercent: -180, opacity: 0 });

      let currentTime = 0;

      productsRef.current.forEach((el, i) => {
        const dropDuration = 0.55;
        const bounceDuration = 0.15;

        tl.to(el, { 
          y: 0, 
          opacity: 1, 
          ease: "power2.out", 
          duration: dropDuration 
        }, currentTime);

        tl.to(shadowsRef.current[i], {
          scale: 1,
          opacity: 0.85,
          filter: "blur(2px)",
          ease: "power2.out",
          duration: dropDuration
        }, currentTime);

        const landTime = currentTime + dropDuration;

        tl.to(platformRef.current, { y: 4, duration: 0.06, ease: "power1.out" }, landTime);
        tl.to(platformRef.current, { y: 0, duration: 0.18, ease: "power2.out" }, landTime + 0.06);

        tl.fromTo(pulsesRef.current[i], 
          { scale: 0.3, opacity: 0.95 },
          { scale: 2.4, opacity: 0, duration: 0.55, ease: "power1.out" }, 
          landTime
        );

        tl.to(el, { y: -12, ease: "power1.out", duration: bounceDuration }, landTime);
        tl.to(shadowsRef.current[i], { 
          scale: 1.25, 
          opacity: 0.45, 
          filter: "blur(6px)", 
          ease: "power1.out", 
          duration: bounceDuration 
        }, landTime);

        tl.to(el, { y: 0, ease: "power1.in", duration: bounceDuration }, landTime + bounceDuration);
        tl.to(shadowsRef.current[i], { 
          scale: 1, 
          opacity: 0.85, 
          filter: "blur(2px)", 
          ease: "power1.in", 
          duration: bounceDuration 
        }, landTime + bounceDuration);

        tl.to(labelsRef.current[i], {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, landTime + 0.1);

        currentTime = landTime + (bounceDuration * 2) + 0.3;
      });

      const sweepStartTime = currentTime + 1.0;
      
      tl.to(sweepRef.current, { opacity: 1, duration: 0.1 }, sweepStartTime);
      tl.to(sweepRef.current, { xPercent: 250, duration: 1.8, ease: "power2.inOut" }, sweepStartTime);
      tl.to(sweepRef.current, { opacity: 0, duration: 0.4 }, sweepStartTime + 1.4);

    }, containerRef);

    return () => ctx.revert();
  }, [activeIndex]);

  useLayoutEffect(() => {
    let ctx = null;
    let observer = null;
    let cancelled = false;

    gsap.set(contentRefs.current, { opacity: 0, y: 30 });
    gsap.set(titleRef.current, {
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%",
      scale: 1,
      transformOrigin: "center center",
      autoAlpha: 1,
    });

    const build = (navLogo) => {
      if (cancelled) return;

      gsap.set(navLogo, { autoAlpha: 0 });

      ctx = gsap.context(() => {
        const getTargetX = () => {
          const rect = navLogo.getBoundingClientRect();
          return rect.left + rect.width / 2 - window.innerWidth / 2;
        };
        const getTargetY = () => {
          const rect = navLogo.getBoundingClientRect();
          return rect.top + rect.height / 2 - window.innerHeight / 2;
        };
        const getTargetScale = () => {
          const rect = navLogo.getBoundingClientRect();
          const baseWidth = titleRef.current.offsetWidth;
          return baseWidth ? rect.width / baseWidth : 1;
        };

        const tl = gsap.timeline({ delay: INTRO_START_DELAY });

        tl.addLabel("hold")
          .addLabel("start", `hold+=${INTRO_HOLD_DURATION}`)
          .to(
            titleRef.current,
            {
              x: getTargetX,
              y: getTargetY,
              scale: getTargetScale,
              duration: INTRO_TITLE_DURATION,
              ease: "power2.inOut",
            },
            "start"
          )
          .addLabel("titleArrives", `start+=${INTRO_TITLE_DURATION}`)
          .to(titleRef.current, { autoAlpha: 0, duration: INTRO_HANDOFF_DURATION, ease: "power1.inOut" }, "titleArrives")
          .to(navLogo, { autoAlpha: 1, duration: INTRO_HANDOFF_DURATION, ease: "power1.inOut" }, "titleArrives")
          .addLabel("heroReveal", `titleArrives+=${INTRO_HANDOFF_DURATION}`)
          .to(overlayRef.current, { opacity: 0, duration: INTRO_REVEAL_DURATION, ease: "power1.out" }, "heroReveal")
          .to(
            contentRefs.current,
            { opacity: 1, y: 0, duration: INTRO_REVEAL_DURATION, stagger: INTRO_CONTENT_STAGGER, ease: "power3.out" },
            "heroReveal"
          );
      }, sectionRef);
    };

    const existingNavLogo = document.querySelector(NAV_LOGO_SELECTOR);
    if (existingNavLogo) {
      build(existingNavLogo);
    } else {
      observer = new MutationObserver(() => {
        const found = document.querySelector(NAV_LOGO_SELECTOR);
        if (found) {
          observer.disconnect();
          observer = null;
          build(found);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (ctx) ctx.revert();
      const navLogo = document.querySelector(NAV_LOGO_SELECTOR);
      if (navLogo) gsap.set(navLogo, { autoAlpha: 1 });
    };
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative bg-[#0A3DAE]">
      <div
        ref={containerRef}
        className="relative h-[100vh] w-full overflow-hidden bg-[#0A3DAE]"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <filter id="waveRibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#111111" floodOpacity="0.35" />
              </filter>
            </defs>

            <path
              d="M0,0 L1440,0 L1440,400
                 C1320,430 1200,500 1080,460
                 C1000,430 900,400 800,440
                 C700,480 650,600 560,580
                 C480,560 420,445 320,460
                 C200,480 120,560 0,640 Z"
              fill="#0A3DAE"
            />

            <path
              d="M0,900 L1440,900 L1440,400
                 C1320,430 1200,500 1080,460
                 C1000,430 900,400 800,440
                 C700,480 650,600 560,580
                 C480,560 420,445 320,460
                 C200,480 120,560 0,640 Z"
              fill="#FFFFFF"
            />

            <path
              d="M0,640
                 C120,560 200,480 320,460
                 C420,445 480,560 560,580
                 C650,600 700,480 800,440
                 C900,400 1000,430 1080,460
                 C1200,500 1320,430 1440,400"
              fill="none"
              stroke="#EDEDED"
              strokeWidth="46"
              strokeLinecap="round"
              filter="url(#waveRibbonShadow)"
            />
          </svg>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[55%] bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(10,61,174,0.08)_0%,rgba(10,61,174,0.03)_35%,transparent_70%)]" />

          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_26%,transparent_50%,rgba(4,16,50,0.35)_100%)]" />
        </div>

        <div
          ref={addToRefs}
          className="absolute inset-0 z-30 flex flex-col justify-center items-start pb-[30vh] pointer-events-none"
        >
          <div className="relative w-full pl-7 sm:pl-14 lg:pl-20 xl:pl-24 pr-6 pointer-events-auto">
            <span className="absolute left-0 sm:left-6 lg:left-11 xl:left-13 top-1 bottom-8 w-[3px] rounded-full bg-gradient-to-b from-[#3B5BDB] via-[#3B5BDB]/40 to-transparent shadow-[0_0_16px_#3B5BDB]" />

            <h2 className="font-head text-white leading-[1.04] text-left">
              <span className="block sm:whitespace-nowrap font-medium italic tracking-normal text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] text-blue-50/75">
                Good everyday products.
              </span>
              <span className="block sm:whitespace-nowrap font-black tracking-[-0.03em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">
                Honest pricing.{" "}
                <span className="whitespace-nowrap">
                  <span className="bg-gradient-to-r from-white via-white to-[#AFC4FF] bg-clip-text text-transparent drop-shadow-[0_4px_26px_rgba(59,91,219,0.5)]">
                    Nothing else
                  </span>
                  <span className="text-[#7C97EE]">.</span>
                </span>
              </span>
            </h2>

            <div className="my-7 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#3B5BDB] via-[#3B5BDB]/70 to-transparent shadow-[0_0_12px_#3B5BDB]" />

            <p className="font-body text-lg sm:text-xl text-blue-50/70 font-light leading-relaxed max-w-md text-left">
              A minimalist FMCG brand built for India first, then GCC and global markets.
            </p>
          </div>
        </div>

        <div ref={addToRefs} className="absolute bottom-[10vh] inset-x-0 z-20 w-full pointer-events-none flex flex-col items-center">
          
          <div className="relative w-[96%] max-w-[1800px] flex flex-col items-center">
            
            <div 
              ref={platformRef} 
              className="relative z-10 w-full h-[12px] rounded-full bg-gradient-to-b from-white/12 via-white/5 to-transparent border-t border-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.7)]"
            >
              <div className="absolute inset-x-3 bottom-0 h-[3px] bg-[#3B5BDB] rounded-full opacity-90 shadow-[0_0_15px_#3B5BDB]" />
              <div className="absolute inset-x-10 -bottom-[12px] h-[16px] bg-[#3B5BDB]/40 blur-[12px]" />
              <div className="absolute inset-x-16 -bottom-[28px] h-[20px] bg-black/60 blur-[18px]" />
            </div>

            <div className="absolute bottom-[12px] inset-x-0 flex justify-center items-end gap-2 md:gap-4 px-[2%] z-20">
              {PRODUCT_IMAGES.map((img, i) => (
                <div key={i} className="relative w-[19%] md:w-[18%] flex flex-col items-center">
                  
                  <div
                    ref={el => pulsesRef.current[i] = el}
                    className="absolute bottom-0 w-32 h-8 bg-gradient-to-r from-[#3B5BDB]/80 to-transparent rounded-full blur-[6px] opacity-0 mix-blend-screen pointer-events-none transform -translate-y-1/2"
                    style={{ transformOrigin: "center center" }}
                  />

                  <div
                    ref={el => shadowsRef.current[i] = el}
                    className="absolute bottom-0 w-[85%] h-[5px] bg-black/95 rounded-full blur-[2px] opacity-0 pointer-events-none transform -translate-y-1/2"
                    style={{ transformOrigin: "center center" }}
                  />

                  <img
                    ref={el => productsRef.current[i] = el}
                    src={img}
                    alt={`Premium FMCG Product ${i+1}`}
                    className="relative z-10 w-full max-h-[240px] sm:max-h-[320px] md:max-h-[420px] lg:max-h-[500px] object-contain origin-bottom will-change-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                  />
                </div>
              ))}
            </div>

            <div className="absolute top-[24px] inset-x-0 flex justify-center items-start gap-2 md:gap-4 px-[2%] z-20 pointer-events-auto">
              {PRODUCT_NAMES.map((name, i) => (
                <div key={i} className="relative w-[19%] md:w-[18%] flex flex-col items-center">
                  <button
                    type="button"
                    ref={el => labelsRef.current[i] = el}
                    onClick={() => handleCategoryClick(PRODUCT_SLUGS[i])}
                    className="cursor-pointer font-display font-semibold text-[10px] sm:text-xs md:text-sm tracking-widest uppercase text-[#0A3DAE]/80 text-center opacity-0 mt-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:bg-[#0A3DAE] hover:text-white hover:border-[#0A3DAE] hover:shadow-[0_6px_18px_rgba(10,61,174,0.35)] hover:-translate-y-0.5"
                  >
                    {name}
                  </button>
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-[12px] top-[-350px] overflow-hidden pointer-events-none z-30">
              <div 
                ref={sweepRef} 
                className="absolute top-0 bottom-0 w-[15%] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent skew-x-[-22deg] blur-sm mix-blend-overlay" 
              />
            </div>

          </div>
        </div>

        <div ref={addToRefs} className="hidden md:flex flex-col gap-6 absolute right-12 top-1/2 -translate-y-1/2 z-40">
          {Array.from({ length: SHOWCASE_COUNT }).map((_, i) => (
            <div key={i} className="group flex items-center justify-center w-4 h-12 relative cursor-pointer pointer-events-auto" onClick={() => setActiveIndex(i)}>
              <span
                className="w-[2px] rounded-full transition-all duration-700 ease-in-out absolute"
                style={{
                  height: i === activeIndex ? "100%" : "25%",
                  background: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.15)",
                  boxShadow: i === activeIndex ? "0 0 20px rgba(255,255,255,0.8)" : "none",
                }}
              />
            </div>
          ))}
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#111111] opacity-100 pointer-events-none z-50"
        />

        <h1
          ref={titleRef}
          className="fixed z-[105] font-display font-extrabold tracking-[-0.02em] whitespace-nowrap pointer-events-none text-white select-none drop-shadow-2xl"
          style={{ fontSize: "min(13vw, 140px)" }}
        >
          nothing <span className="text-white/90">else</span><span className="text-[#3B5BDB]">.</span>
        </h1>
      </div>

      <div className="relative z-10 w-full border-t border-white/[0.04] bg-[#111111] overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-[homeMarquee_20s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="font-display font-bold text-[11px] sm:text-[12px] tracking-[0.3em] uppercase mx-8 flex items-center gap-8 text-white/30"
            >
              Blue first <Square size={5} className="fill-white/20 text-transparent" />
              Product second <Square size={5} className="fill-white/20 text-transparent" />
              Nothing else <Square size={5} className="fill-white/20 text-transparent" />
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
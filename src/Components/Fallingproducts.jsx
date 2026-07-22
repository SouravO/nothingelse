import { useEffect, useRef, useState } from "react";
import { Square } from "lucide-react";
import gsap from "gsap";

const PRODUCT_IMAGES = ["/pdt1.png", "/pdt2.png", "/pdt3.png", "/pdt4.png", "/pdt5.png"];
const PRODUCT_NAMES = ["Shampoo", "Rice", "Dishwash", "Oils", "Tea"];
const PRODUCT_SLUGS = ["shampoo", "rice", "dishwash", "oils", "tea"];

const SHOWCASE_COUNT = PRODUCT_IMAGES.length;
const INTRO_START_DELAY = 0.1;
const SECTION_VISIBLE_THRESHOLD = 0.6;

export default function HomeSection() {
  const sectionRef = useRef(null);
  
  // ---- Desktop Refs ----
  const containerRef = useRef(null);
  const contentRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };
  const productsRef = useRef([]);
  const productInnerRef = useRef([]);
  const shadowsRef = useRef([]);
  const pulsesRef = useRef([]);
  const labelsRef = useRef([]);
  const platformRef = useRef(null);
  const sweepRef = useRef(null);
  const hasPlayedRef = useRef(false);

  // ---- Mobile Refs ----
  const mobileContainerRefs = useRef([]);
  const mobileProductsRef = useRef([]);
  const mobileShadowsRef = useRef([]);
  const mobileLabelsRef = useRef([]);
  const mobilePlatformRef = useRef([]);
  const mobilePulsesRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const markImageError = (i, src) => {
    console.warn(`[HomeSection] Product image failed to load: "${src}"`);
    setImageErrors((prev) => (prev[i] ? prev : { ...prev, [i]: true }));
  };

  useEffect(() => {
    PRODUCT_IMAGES.forEach((src, i) => {
      const img = new Image();
      img.onerror = () => markImageError(i, src);
      img.src = src;
    });
  }, []);

  const handleCategoryClick = (slug) => {
    console.log(`Navigate to "${slug}" category page`);
  };

  // ---- Desktop Hover Shake ----
  const handleProductEnter = (i) => {
    const el = productInnerRef.current[i];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap
      .timeline()
      .to(el, { rotation: -8, y: -10, scale: 1.045, duration: 0.12, ease: "power2.out" })
      .to(el, { rotation: 7, duration: 0.13, ease: "power1.inOut" })
      .to(el, { rotation: -5, duration: 0.13, ease: "power1.inOut" })
      .to(el, { rotation: 3, duration: 0.12, ease: "power1.inOut" })
      .to(el, { rotation: -1.5, duration: 0.12, ease: "power1.inOut" })
      .to(el, { rotation: 0, duration: 0.14, ease: "power1.inOut" });
  };

  const handleProductLeave = (i) => {
    const el = productInnerRef.current[i];
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, { rotation: 0, y: 0, scale: 1, duration: 0.45, ease: "elastic.out(1, 0.55)" });
  };

  // ---- DESKTOP ANIMATION (Untouched) ----
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!productsRef.current.length || !platformRef.current) return;

      gsap.set(productsRef.current, { y: -1000, opacity: 0, rotation: 0, scale: 1 });
      gsap.set(productInnerRef.current, { y: 0, rotation: 0, scale: 1 });
      gsap.set(shadowsRef.current, { scale: 2.2, opacity: 0, filter: "blur(15px)" });
      gsap.set(pulsesRef.current, { scale: 0.2, opacity: 0 });
      gsap.set(labelsRef.current, { y: -15, opacity: 0 });
      gsap.set(platformRef.current, { y: 0 });
      gsap.set(sweepRef.current, { xPercent: -180, opacity: 0 });

      const dropDuration = 0.55;
      const bounceDuration = 0.15;
      const gapBetweenDrops = 0.3;

      const playDropInAnimation = () => {
        const tl = gsap.timeline();
        let currentTime = INTRO_START_DELAY;

        productsRef.current.forEach((el, i) => {
          tl.call(() => setActiveIndex(i), null, currentTime);

          tl.to(el, { y: 0, opacity: 1, ease: "power2.out", duration: dropDuration }, currentTime);
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

          currentTime = landTime + (bounceDuration * 2) + gapBetweenDrops;
        });

        const sweepStartTime = currentTime + 0.3;
        tl.to(sweepRef.current, { opacity: 1, duration: 0.1 }, sweepStartTime);
        tl.to(sweepRef.current, { xPercent: 250, duration: 1.8, ease: "power2.inOut" }, sweepStartTime);
        tl.to(sweepRef.current, { opacity: 0, duration: 0.4 }, sweepStartTime + 1.4);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            playDropInAnimation();
            observer.disconnect();
          }
        },
        { threshold: SECTION_VISIBLE_THRESHOLD }
      );

      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ---- MOBILE ANIMATION (Adjusted shadows/pulses for light background) ----
  useEffect(() => {
    let ctx = gsap.context(() => {
      mobileProductsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { y: -150, opacity: 0 });
        gsap.set(mobileShadowsRef.current[i], { scale: 2, opacity: 0, filter: "blur(10px)" });
        gsap.set(mobileLabelsRef.current[i], { y: -10, opacity: 0 });
        gsap.set(mobilePlatformRef.current[i], { y: 0 });
        gsap.set(mobilePulsesRef.current[i], { scale: 0.2, opacity: 0 });
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const i = Number(entry.target.dataset.index);
              const el = mobileProductsRef.current[i];
              if (!el || el.dataset.played === "true") return;
              el.dataset.played = "true";

              const tl = gsap.timeline();

              // Drop in
              tl.to(el, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
              tl.to(mobileShadowsRef.current[i], { scale: 1, opacity: 0.35, filter: "blur(3px)", duration: 0.5, ease: "power2.out" }, 0);

              // Platform impact & pulse (glow adjusted for light bg)
              tl.to(mobilePlatformRef.current[i], { y: 3, duration: 0.06, ease: "power1.out" }, 0.5);
              tl.to(mobilePlatformRef.current[i], { y: 0, duration: 0.18, ease: "power2.out" }, 0.56);
              tl.fromTo(mobilePulsesRef.current[i], 
                { scale: 0.3, opacity: 0.8 }, 
                { scale: 2.2, opacity: 0, duration: 0.55, ease: "power1.out" }, 
                0.5
              );

              // Bounce up
              tl.to(el, { y: -12, duration: 0.15, ease: "power1.out" }, 0.5);
              tl.to(mobileShadowsRef.current[i], { scale: 1.25, opacity: 0.15, filter: "blur(6px)", duration: 0.15, ease: "power1.out" }, 0.5);

              // Bounce down
              tl.to(el, { y: 0, duration: 0.15, ease: "power1.in" }, 0.65);
              tl.to(mobileShadowsRef.current[i], { scale: 1, opacity: 0.35, filter: "blur(3px)", duration: 0.15, ease: "power1.in" }, 0.65);

              // Label fade in
              tl.to(mobileLabelsRef.current[i], { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 0.7);

              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      mobileContainerRefs.current.forEach((el) => {
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="products-showcase" ref={sectionRef} className="relative bg-[#0A3DAE] w-full">
      
      {/* =========================================================
          DESKTOP / TABLET-LANDSCAPE (lg and up) — UNTOUCHED
          ========================================================= */}
      <div
        ref={containerRef}
        className="hidden lg:block relative h-[100vh] w-full overflow-hidden bg-[#0A3DAE]"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="waveRibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#111111" floodOpacity="0.35" />
              </filter>
            </defs>
            <path d="M0,0 L1440,0 L1440,400 C1320,430 1200,500 1080,460 C1000,430 900,400 800,440 C700,480 650,600 560,580 C480,560 420,445 320,460 C200,480 120,560 0,640 Z" fill="#0A3DAE" />
            <path d="M0,900 L1440,900 L1440,400 C1320,430 1200,500 1080,460 C1000,430 900,400 800,440 C700,480 650,600 560,580 C480,560 420,445 320,460 C200,480 120,560 0,640 Z" fill="#FFFFFF" />
            <path d="M0,640 C120,560 200,480 320,460 C420,445 480,560 560,580 C650,600 700,480 800,440 C900,400 1000,430 1080,460 C1200,500 1320,430 1440,400" fill="none" stroke="#EDEDED" strokeWidth="46" strokeLinecap="round" filter="url(#waveRibbonShadow)" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[55%] bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(10,61,174,0.08)_0%,rgba(10,61,174,0.03)_35%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2)_0_1px,transparent_1px)] bg-[length:18px_18px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_50%_26%,transparent_50%,rgba(4,16,50,0.35)_100%)]" />
        </div>

        <div ref={addToRefs} className="absolute inset-0 z-30 flex flex-col justify-center items-start pb-[12vh] md:pb-[30vh] pointer-events-none">
          <div className="relative w-full pl-7 sm:pl-14 lg:pl-20 xl:pl-24 pr-6 pointer-events-auto">
            <span className="absolute left-0 sm:left-6 lg:left-11 xl:left-13 top-1 bottom-8 w-[3px] rounded-full bg-gradient-to-b from-[#3B5BDB] via-[#3B5BDB]/40 to-transparent shadow-[0_0_16px_#3B5BDB]" />
            <h2 className="font-head text-white leading-[1.04] text-left">
              <span className="block sm:whitespace-nowrap font-medium italic tracking-normal text-lg sm:text-3xl md:text-4xl lg:text-[2.65rem] text-blue-50/75">
                Good everyday products.
              </span>
              <span className="block sm:whitespace-nowrap font-black tracking-[-0.03em] text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-2">
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
          </div>
        </div>

        <div ref={addToRefs} className="absolute bottom-[3vh] md:bottom-[10vh] inset-x-0 z-20 w-full pointer-events-none flex flex-col items-center">
          <div className="relative w-[96%] max-w-[1800px] flex flex-col items-center">
            <div ref={platformRef} className="relative z-10 w-full h-[12px] rounded-full bg-gradient-to-b from-white/12 via-white/5 to-transparent border-t border-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-x-3 bottom-0 h-[3px] bg-[#3B5BDB] rounded-full opacity-90 shadow-[0_0_15px_#3B5BDB]" />
              <div className="absolute inset-x-10 -bottom-[12px] h-[16px] bg-[#3B5BDB]/40 blur-[12px]" />
              <div className="absolute inset-x-16 -bottom-[28px] h-[20px] bg-black/60 blur-[18px]" />
            </div>

            <div className="absolute bottom-[12px] inset-x-0 flex justify-center items-end gap-1.5 md:gap-4 px-[2%] z-20">
              {PRODUCT_IMAGES.map((img, i) => (
                <div key={i} className="relative w-[19%] md:w-[18%] flex flex-col items-center">
                  <div ref={el => pulsesRef.current[i] = el} className="absolute bottom-0 w-32 h-8 bg-gradient-to-r from-[#3B5BDB]/80 to-transparent rounded-full blur-[6px] opacity-0 mix-blend-screen pointer-events-none transform -translate-y-1/2" style={{ transformOrigin: "center center" }} />
                  <div ref={el => shadowsRef.current[i] = el} className="absolute bottom-0 w-[85%] h-[5px] bg-black/95 rounded-full blur-[2px] opacity-0 pointer-events-none transform -translate-y-1/2" style={{ transformOrigin: "center center" }} />
                  <div ref={el => productsRef.current[i] = el} className="relative flex items-end justify-center w-full h-[210px] md:h-[420px] lg:h-[500px] will-change-transform">
                    <img ref={el => productInnerRef.current[i] = el} src={img} alt={`Product ${i+1}`} loading="lazy" decoding="async" onError={() => markImageError(i, img)} onMouseEnter={() => handleProductEnter(i)} onMouseLeave={() => handleProductLeave(i)} className={`relative z-10 w-full max-h-[210px] md:max-h-[420px] lg:max-h-[500px] object-contain origin-bottom will-change-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] pointer-events-auto ${imageErrors[i] ? "invisible" : ""}`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute top-[24px] inset-x-0 flex justify-center items-start gap-1.5 md:gap-4 px-[2%] z-20 pointer-events-auto">
              {PRODUCT_NAMES.map((name, i) => (
                <div key={i} className="relative w-[19%] md:w-[18%] flex flex-col items-center">
                  <button type="button" ref={el => labelsRef.current[i] = el} onClick={() => handleCategoryClick(PRODUCT_SLUGS[i])} className="cursor-pointer font-body font-semibold text-[9px] md:text-sm tracking-normal md:tracking-widest uppercase text-[#0A3DAE]/80 text-center opacity-0 mt-2 w-full truncate px-1.5 py-1 md:px-5 md:py-2.5 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:bg-[#0A3DAE] hover:text-white hover:border-[#0A3DAE] hover:shadow-[0_6px_18px_rgba(10,61,174,0.35)] hover:-translate-y-0.5">
                    {name}
                  </button>
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-[12px] top-[-350px] overflow-hidden pointer-events-none z-[15]">
              <div ref={sweepRef} className="absolute top-0 bottom-0 w-[15%] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent skew-x-[-22deg] blur-sm mix-blend-overlay" />
            </div>
          </div>
        </div>

        <div ref={addToRefs} className="hidden md:flex flex-col gap-6 absolute right-12 top-1/2 -translate-y-1/2 z-40">
          {Array.from({ length: SHOWCASE_COUNT }).map((_, i) => (
            <div key={i} className="group flex items-center justify-center w-4 h-12 relative cursor-pointer pointer-events-auto" onClick={() => setActiveIndex(i)}>
              <span className="w-[2px] rounded-full transition-all duration-700 ease-in-out absolute" style={{ height: i === activeIndex ? "100%" : "25%", background: i === activeIndex ? "#ffffff" : "rgba(255,255,255,0.15)", boxShadow: i === activeIndex ? "0 0 20px rgba(255,255,255,0.8)" : "none" }} />
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          MOBILE / TABLET-PORTRAIT (< lg) — WAVY SPLIT + ZIGZAG
          Mimics the desktop wave, transitioning to a light background.
          ========================================================= */}
      <div className="lg:hidden relative w-full overflow-hidden bg-[#F4F5F8] pb-24">
        
        {/* Top Blue Header Section */}
        <div className="relative w-full bg-[#0A3DAE] pt-16 pb-16 z-0">
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2)_0_1px,transparent_1px)] bg-[length:18px_18px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(4,16,50,0.4)_0%,transparent_100%)]" />
          </div>

          <div className="relative z-10 px-6 sm:px-12">
            <span className="absolute left-6 sm:left-12 top-1 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[#3B5BDB] via-[#3B5BDB]/40 to-transparent shadow-[0_0_16px_#3B5BDB]" />
            <div className="pl-6">
              <h2 className="font-head text-white leading-[1.1]">
                <span className="block font-medium italic text-blue-50/75 text-xl sm:text-2xl mb-1">
                  Good everyday products.
                </span>
                <span className="block font-black tracking-[-0.03em] text-4xl sm:text-5xl">
                  Honest pricing.<br/>
                  <span className="bg-gradient-to-r from-white via-white to-[#AFC4FF] bg-clip-text text-transparent drop-shadow-[0_4px_26px_rgba(59,91,219,0.5)]">
                    Nothing else
                  </span>
                  <span className="text-[#7C97EE]">.</span>
                </span>
              </h2>
              <div className="my-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#3B5BDB] via-[#3B5BDB]/70 to-transparent shadow-[0_0_12px_#3B5BDB]" />
            </div>
          </div>

          {/* Seamless Wave Divider (mimicking desktop) */}
          <div className="absolute left-0 right-0 -bottom-[1px] z-0 w-full h-[80px] sm:h-[120px] overflow-hidden pointer-events-none">
            <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <filter id="mobileWaveShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#001133" floodOpacity="0.12" />
                </filter>
              </defs>
              <path d="M0,0 L0,40 C200,90 350,10 500,50 C650,90 800,20 1000,60 L1000,125 L0,125 Z" fill="#F4F5F8" />
              <path d="M0,40 C200,90 350,10 500,50 C650,90 800,20 1000,60" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" filter="url(#mobileWaveShadow)" />
            </svg>
          </div>
        </div>

        {/* Product Zigzag List (on light greyish-white background) */}
        <div className="relative z-10 flex flex-col gap-14 sm:gap-16 px-8 sm:px-16 w-full max-w-md mx-auto pt-10">
          {PRODUCT_IMAGES.map((img, i) => {
            const isEven = i % 2 === 0;

            return (
              <div 
                key={i} 
                data-index={i}
                ref={(el) => (mobileContainerRefs.current[i] = el)}
                className={`relative w-[70%] sm:w-[60%] flex flex-col items-center ${isEven ? 'self-start' : 'self-end'}`}
              >
                {/* Blue Pulse Glow */}
                <div ref={el => mobilePulsesRef.current[i] = el} className="absolute bottom-[35px] w-24 h-6 bg-[#3B5BDB] rounded-full blur-[8px] opacity-0 pointer-events-none transform -translate-y-1/2" style={{ transformOrigin: "center center" }} />

                {/* Ground Shadow */}
                <div ref={el => mobileShadowsRef.current[i] = el} className="absolute bottom-[35px] w-[85%] h-[4px] bg-black rounded-full blur-[4px] opacity-0 pointer-events-none transform -translate-y-1/2" style={{ transformOrigin: "center center" }} />

                {/* Image */}
                <div ref={el => mobileProductsRef.current[i] = el} className="relative w-full h-[180px] flex items-end justify-center will-change-transform pb-2">
                  <img src={img} alt={`Product ${i+1}`} loading="lazy" decoding="async" className="relative z-20 w-full max-h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.15)]" />
                </div>

                {/* Darker Miniature Platform adapted for light background */}
                <div ref={el => mobilePlatformRef.current[i] = el} className="relative z-10 w-[110%] h-[6px] rounded-full bg-gradient-to-b from-black/[0.08] via-black/[0.03] to-transparent border-t border-black/10 shadow-[0_10px_20px_rgba(0,0,0,0.06)]">
                  <div className="absolute inset-x-2 bottom-0 h-[2px] bg-[#3B5BDB] rounded-full opacity-70 shadow-[0_0_8px_rgba(59,91,219,0.5)]" />
                </div>

                {/* Identical Button Style */}
                <button type="button" ref={el => mobileLabelsRef.current[i] = el} onClick={() => handleCategoryClick(PRODUCT_SLUGS[i])} className="mt-5 cursor-pointer font-body font-semibold text-[10px] tracking-widest uppercase text-[#0A3DAE] text-center w-[90%] truncate px-3 py-2.5 rounded-full border border-black/[0.05] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 transition-transform duration-200">
                  {PRODUCT_NAMES[i]}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marquee Footer (Shared) */}
      <div className="relative z-10 w-full border-t border-white/[0.04] bg-[#111111] overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-[homeMarquee_20s_linear_infinite]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-body font-bold text-[11px] sm:text-[12px] tracking-[0.3em] uppercase mx-8 flex items-center gap-8 text-white/30">
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
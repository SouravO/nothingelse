import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Square } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Brand-book-style line-art pack silhouettes (redrawn locally, kept   */
/* self-contained per file so no extra shared component is created).   */
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
function PackSachet(props) {
  return (
    <svg viewBox="0 0 90 100" fill="none" {...props}>
      <path
        d="M4 10L86 10L78 92L12 92Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="14" y1="28" x2="76" y2="28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

const CATEGORIES = [
  {
    name: "Breakfast & Grains",
    accent: "#0C4DD5",
    products: [
      { name: "Corn Flakes", size: "500 g", shape: PackBox },
      { name: "Rice", size: "1 kg", shape: PackPouch },
      { name: "Basmati Rice", size: "1 kg", shape: PackPouch },
      { name: "Atta", size: "5 kg", shape: PackPouch, desc: "Whole wheat flour" },
      { name: "Penne Pasta", size: "500 g", shape: PackPouch, desc: "Durum wheat" },
    ],
  },
  {
    name: "Beverages",
    accent: "#1450E0",
    products: [
      { name: "Orange Juice", size: "1 L", shape: PackBottle },
      { name: "Black Tea", size: "250 g", shape: PackBox },
      { name: "Green Tea", size: "100 g", shape: PackBox },
      { name: "Classic Coffee", size: "200 g", shape: PackJar },
    ],
  },
  {
    name: "Pantry & Cooking",
    accent: "#0A3FB0",
    products: [
      { name: "Sunflower Oil", size: "1 L", shape: PackBottle },
      { name: "Baked Beans", size: "400 g", shape: PackJar },
      { name: "Biscuits", size: "200 g", shape: PackPouch },
      { name: "Strawberry Jam", size: "300 g", shape: PackJar },
      { name: "Tomato Ketchup", size: "500 g", shape: PackBottle },
      { name: "Potato Chips", size: "150 g", shape: PackPouch },
      { name: "Sugar", size: "1 kg", shape: PackPouch },
      { name: "Salted Peanuts", size: "200 g", shape: PackPouch },
      { name: "Moong Dal", size: "500 g", shape: PackPouch },
      { name: "Toor Dal", size: "500 g", shape: PackPouch },
      { name: "Chana", size: "500 g", shape: PackPouch },
    ],
  },
  {
    name: "Spices & Seasoning",
    accent: "#082F8A",
    products: [
      { name: "Salt", size: "1 kg", shape: PackPouch, desc: "Iodised table salt" },
      { name: "Turmeric Powder", size: "100 g", shape: PackSachet },
      { name: "Red Chilli Powder", size: "100 g", shape: PackSachet },
      { name: "Coriander Seeds", size: "100 g", shape: PackSachet },
      { name: "Cumin Seeds", size: "100 g", shape: PackSachet },
      { name: "Black Pepper", size: "50 g", shape: PackSachet },
      { name: "Curry Powder", size: "100 g", shape: PackSachet },
      { name: "Garlic Powder", size: "100 g", shape: PackSachet },
      { name: "Oregano", size: "25 g", shape: PackSachet },
    ],
  },
  {
    name: "Home Care",
    accent: "#3B6FE0",
    products: [
      { name: "All Purpose Cleaner", size: "500 ml", shape: PackBottle },
      { name: "Dishwash Liquid", size: "500 ml", shape: PackBottle },
      { name: "Floor Cleaner", size: "1 L", shape: PackBottle, desc: "Citrus fresh" },
      { name: "Facial Tissues", size: "2 ply", shape: PackBox },
      { name: "Kitchen Towel", size: "2 rolls", shape: PackBox },
    ],
  },
  {
    name: "Personal Care",
    accent: "#111111",
    products: [
      { name: "Bath Soap", size: "125 g", shape: PackBox },
      { name: "Hand Wash", size: "500 ml", shape: PackBottle, desc: "Fresh clean" },
      { name: "Toothpaste", size: "100 g", shape: PackBottle, desc: "Mint" },
      { name: "Shampoo", size: "180 ml", shape: PackBottle },
      { name: "Conditioner", size: "180 ml", shape: PackBottle },
    ],
  },
];

const ALL = "All Products";
const TABS = [ALL, ...CATEGORIES.map((c) => c.name)];

const AD_CARDS = [
  {
    title: "IT IS JUST TOOTHPASTE.",
    product: "Toothpaste",
    detail: "Mint · 100 g",
  },
  {
    title: "GOOD RICE.",
    price: "₹49",
    product: "White Rice",
    detail: "1 kg",
  },
  {
    title: "WE MADE FLOOR CLEANER.",
    subtitle: "It cleans floors.",
    product: "Floor Cleaner",
    detail: "Citrus Fresh · 1 L",
  },
];

const PRICE_TICKER = ["₹49", "₹35", "₹25", "₹56", "₹79", "₹40", "₹20", "₹99"];

export default function Products() {
  const rootRef = useRef(null);
  const [activeTab, setActiveTab] = useState(ALL);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const visibleGroups =
    activeTab === ALL
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.name === activeTab);

  return (
    <div ref={rootRef} className="bg-white font-body overflow-x-clip">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#0A3FB0] pt-[150px] pb-16 sm:pt-[180px] sm:pb-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 90% at 85% 0%, #1450E0 0%, #0A3FB0 45%, #082F8A 100%)",
          }}
        />
        <span className="pointer-events-none select-none absolute -bottom-[18%] -left-[4%] font-display font-extrabold text-[24vw] leading-none text-white/[0.055] whitespace-nowrap">
          products
        </span>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[13px] tracking-[0.22em] uppercase text-white/55 mb-5"
          >
            The core packaging rule
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-head font-bold text-white text-[10vw] sm:text-[6vw] lg:text-[4.2vw] leading-[1.03] tracking-[-0.02em] uppercase max-w-4xl"
          >
            Blue first. Product second.
            <br />
            Nothing else.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-7 text-white/70 text-[16px] sm:text-[18px] max-w-md"
          >
            One blue system across every product.
          </motion.p>
        </div>

        {/* price ticker */}
        <div className="relative mt-14 border-t border-white/15 overflow-hidden py-3.5">
          <div className="flex whitespace-nowrap animate-[priceTicker_18s_linear_infinite]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-6 mx-6">
                {PRICE_TICKER.map((p) => (
                  <span
                    key={p + i}
                    className="font-display font-extrabold text-[16px] sm:text-[18px] text-white/70 flex items-center gap-6"
                  >
                    {p}
                    <Square size={6} className="fill-white/40 text-white/40" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes priceTicker{ from{transform:translateX(0);} to{transform:translateX(-50%);} }
        `}</style>
      </section>

      {/* ================= CATEGORY FILTER + GRID ================= */}
      <section className="relative bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* tabs */}
          <div className="reveal-up flex flex-wrap gap-2 mb-16 border-b border-[#111111]/8 pb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 rounded-full font-body text-[14px] font-medium transition-colors duration-300 ${
                  activeTab === tab
                    ? "bg-[#0C4DD5] text-white"
                    : "bg-[#FAFBFF] text-[#111111]/60 hover:text-[#111111] border border-[#111111]/8"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {visibleGroups.map((group) => (
                <div key={group.name} className="mb-16 last:mb-0">
                  {activeTab === ALL && (
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="h-2 w-2 rounded-[2px]"
                        style={{ backgroundColor: group.accent }}
                      />
                      <h3 className="font-head font-bold text-[20px] sm:text-[22px] text-[#111111]">
                        {group.name}
                      </h3>
                      <span className="text-[#111111]/35 text-[14px]">
                        {group.products.length} products
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.products.map((p, i) => (
                      <ProductCard
                        key={p.name}
                        product={p}
                        accent={group.accent}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ================= JUST THE PRODUCT DIVIDER ================= */}
      <section className="relative bg-[#EAF0FE] py-10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 flex flex-wrap items-center justify-center gap-3 text-center">
          <Square size={9} className="fill-[#0C4DD5] text-[#0C4DD5]" />
          <p className="font-head font-bold text-[18px] sm:text-[20px] text-[#0C4DD5]">
            Just the product. Nothing else.
          </p>
          <Square size={9} className="fill-[#0C4DD5] text-[#0C4DD5]" />
        </div>
      </section>

      {/* ================= NOTHING ELSE IN THE WILD (ad cards) ================= */}
      <section className="relative bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="reveal-up max-w-2xl mb-14">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
              Digital &amp; social style
            </p>
            <h2 className="font-head font-bold text-[#111111] text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.08] tracking-[-0.02em]">
              Blue Stops the Scroll.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {AD_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="bg-[#0C4DD5] rounded-[26px] p-8 h-[380px] flex flex-col justify-between"
              >
                <div>
                  <p className="font-head font-bold text-white text-[24px] sm:text-[27px] leading-[1.1] uppercase">
                    {card.title}
                  </p>
                  {card.price && (
                    <p className="font-display font-extrabold text-white text-[52px] leading-none mt-2">
                      {card.price}
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-white/75 text-[16px] mt-2">
                      {card.subtitle}
                    </p>
                  )}
                </div>

                <div>
                  <div className="h-px bg-white/20 mb-4" />
                  <p className="text-white/60 text-[13px] mb-1">
                    {card.product} · {card.detail}
                  </p>
                  <p className="font-head font-bold text-white text-[17px]">
                    Nothing else.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative bg-[#FAFBFF] py-24 sm:py-28 border-t border-[#111111]/5">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 text-center">
          <h2 className="reveal-up font-head font-bold text-[#111111] text-[8vw] sm:text-[3.6vw] lg:text-[2.6vw] leading-[1.1] tracking-[-0.02em] mb-8 max-w-2xl mx-auto">
            Want Nothing Else on your shelf?
          </h2>
          <Link
            to="/contact"
            className="reveal-up group inline-flex items-center gap-2 rounded-full bg-[#0C4DD5] text-white px-8 py-4 font-body font-semibold text-[15px] hover:bg-[#111111] transition-colors duration-300"
          >
            Get in touch
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, accent, index }) {
  const Shape = product.shape;
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease: "power3.out" }}
      whileHover={{ y: -6 }}
      className="group relative rounded-[20px] bg-[#FAFBFF] border border-[#111111]/6 p-5 pt-7 overflow-hidden [perspective:900px]"
    >
      {/* price tag flip badge */}
      <div className="absolute top-4 right-4 [transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
        <span
          className="block h-7 w-7 rounded-full [backface-visibility:hidden] flex items-center justify-center"
          style={{ backgroundColor: accent + "1a" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </span>
        <span
          className="absolute inset-0 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          NE
        </span>
      </div>

      <div className="h-[110px] flex items-center justify-center mb-5">
        <Shape
          className="h-full w-auto transition-transform duration-500 group-hover:-translate-y-1.5"
          style={{ color: accent }}
        />
      </div>

      <p className="font-head font-bold text-[#111111] text-[15px] leading-tight mb-1">
        {product.name}
      </p>
      {product.desc && (
        <p className="text-[#111111]/40 text-[12px] mb-1">{product.desc}</p>
      )}
      <p className="text-[#111111]/45 text-[12px]">{product.size}</p>

      <div className="mt-4 pt-3 border-t border-[#111111]/6 flex items-center justify-between">
        <span className="text-[11px] text-[#111111]/35">nothing else.</span>
        <span
          className="text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: accent }}
        >
          Honest price
        </span>
      </div>
    </motion.div>
  );
}
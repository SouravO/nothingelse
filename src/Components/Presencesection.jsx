import { motion } from "framer-motion";
import { Truck, ShieldCheck, BadgeCheck, Wallet, Eye, Star, Tag, CheckCircle2 } from "lucide-react";

/* ============================================================================
   SECTION 5: PRESENCE — shelf, photography, fleet, digital as compact cards
   ============================================================================ */

/* Shared reveal-on-scroll wrapper */
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

export default function PresenceSection() {
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
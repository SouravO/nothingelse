import { motion } from "framer-motion";
import { Truck, Store, Smartphone, Megaphone, ArrowRight } from "lucide-react";

export default function PresenceSection() {
  return (
    <section 
      id="presence" 
      className="relative bg-[#111111] overflow-hidden py-24 sm:py-32 scroll-mt-[68px] sm:scroll-mt-[76px]"
    >
      {/* Background Decorative Element: Huge Subtle Outlined Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] text-white font-head font-extrabold text-[18vw] uppercase tracking-wider leading-none">
        PRESENCE
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 relative z-10">
        
        {/* =========================================
            SECTION HEADER
            ========================================= */}
        <div className="text-center mb-16 sm:mb-24">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6 }}
            className="font-body text-[12px] sm:text-[13px] tracking-[0.25em] uppercase text-[#0C4DD5] font-bold mb-3"
          >
            Omnipresent System
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-head font-bold text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none max-w-2xl mx-auto"
          >
            Built to Be Recognized <span className="text-[#0C4DD5]">Everywhere.</span>
          </motion.h2>
        </div>

        {/* =========================================
            CONVERGING SIDE-SWIPE CARDS
            ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch overflow-visible">
          
          {/* PHYSICAL PRESENCE CARD (Reveals from Left) */}
          <motion.div
            initial={{ opacity: 0, x: -120, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.1 }}
            className="group relative flex flex-col justify-between rounded-3xl bg-white/[0.03] border border-white/10 p-8 sm:p-12 transition-all duration-500 hover:border-white/20"
          >
            <div>
              <div className="flex items-center justify-between mb-10">
                <span className="font-body text-xs tracking-widest text-white/40 uppercase">01 / Physical</span>
                <div className="p-3 bg-white/5 rounded-2xl text-[#0C4DD5]">
                  <Store size={24} strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="font-head font-bold text-white text-3xl sm:text-4xl mb-6">
                The Shelf <br />& The Streets.
              </h3>
              
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                We don't just build standalone products; we establish a visual system. 
                Our signature blue block commands attention instantly on retail shelves, 
                while our hyper-recognized fleet handles delivery with clean, bold execution.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-4 grid grid-cols-2 gap-6">
              <div className="flex gap-3 items-start">
                <Store size={18} className="text-[#0C4DD5] mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm font-head mb-1">Shelf Domination</h4>
                  <p className="text-white/40 text-xs leading-normal">Unmissable single-color blocking layout.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Truck size={18} className="text-[#0C4DD5] mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm font-head mb-1">The Active Fleet</h4>
                  <p className="text-white/40 text-xs leading-normal">Highly recognizable street presence daily.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DIGITAL PRESENCE CARD (Reveals from Right) */}
          <motion.div
            initial={{ opacity: 0, x: 120, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 45, damping: 15, delay: 0.15 }}
            className="group relative flex flex-col justify-between rounded-3xl bg-[#0C4DD5] p-8 sm:p-12 shadow-2xl shadow-[#0C4DD5]/10"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <span className="font-body text-xs tracking-widest text-white/60 uppercase">02 / Digital</span>
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                  <Smartphone size={24} strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="font-head font-bold text-white text-3xl sm:text-4xl mb-6">
                Frictionless <br />& Connected.
              </h3>
              
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                No decorative visual noise, no confusing interfaces. Our digital ecosystem 
                unifies social presence and lightning-fast web Ordering into one direct-to-consumer 
                pipeline. One focused product, one direct message.
              </p>
            </div>

            <div className="relative z-10 border-t border-white/20 pt-8 mt-4 grid grid-cols-2 gap-6">
              <div className="flex gap-3 items-start">
                <Smartphone size={18} className="text-white mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm font-head mb-1">Zero-Noise UI</h4>
                  <p className="text-white/70 text-xs leading-normal">Ultra-optimized checkout interfaces.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Megaphone size={18} className="text-white mt-1 shrink-0" />
                <div>
                  <h4 className="text-white font-bold text-sm font-head mb-1">Social Clarity</h4>
                  <p className="text-white/70 text-xs leading-normal">High-impact typography campaigns.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* =========================================
            BOTTOM CALL-TO-ACTION (Reveals on Scroll)
            ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.9 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 sm:mt-24 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-[#0C4DD5] hover:bg-[#093ca8] text-white font-head font-bold text-sm tracking-wider uppercase px-8 py-5 rounded-full transition-all duration-300 transform hover:scale-[1.03] group"
          >
            Explore the ecosystem
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
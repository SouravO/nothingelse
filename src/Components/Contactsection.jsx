import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

/* ============================================================================
   SECTION 6: CONTACT
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

export default function ContactSection() {
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
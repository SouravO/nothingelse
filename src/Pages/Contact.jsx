import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";

function Reveal({ children, direction = "up", delay = 0 }) {
  const offset = direction === "left" ? -24 : direction === "right" ? 24 : 18;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "up" ? 0 : offset, y: direction === "up" ? offset : 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-[28px] border border-[#111111]/8 bg-[#FAFBFF] p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(17,17,17,0.18)]">
      <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-4">
        Reach out
      </p>
      <h2 className="font-head font-bold text-[#111111] text-[28px] sm:text-[34px] leading-[1.08] tracking-[-0.02em] mb-3">
        Start a conversation.
      </h2>
      <p className="text-[#111111]/60 text-[16px] leading-relaxed mb-8 max-w-xl">
        For retail partnerships, product enquiries, or general questions, send us a note and we’ll get back to you.
      </p>

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-[13px] font-medium text-[#111111]/65">Name</span>
            <input
              required
              type="text"
              className="rounded-2xl border border-[#111111]/10 bg-white px-4 py-3.5 outline-none focus:border-[#0C4DD5] transition-colors"
              placeholder="Your name"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[13px] font-medium text-[#111111]/65">Email</span>
            <input
              required
              type="email"
              className="rounded-2xl border border-[#111111]/10 bg-white px-4 py-3.5 outline-none focus:border-[#0C4DD5] transition-colors"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-[13px] font-medium text-[#111111]/65">Message</span>
          <textarea
            required
            rows={5}
            className="rounded-2xl border border-[#111111]/10 bg-white px-4 py-3.5 outline-none focus:border-[#0C4DD5] transition-colors resize-none"
            placeholder="Tell us a little about what you need."
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0C4DD5] px-6 py-3.5 font-body font-semibold text-white transition-colors hover:bg-[#111111]"
        >
          Send message
          <ArrowUpRight size={16} />
        </button>
      </form>

      {submitted && (
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#EAF0FE] px-4 py-2 text-[#0C4DD5] text-sm font-medium">
          <CheckCircle2 size={16} />
          Message ready to send. Hook this form to your backend when you are ready.
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal direction="left">
          <div className="max-w-xl">
            <p className="font-body text-[13px] tracking-[0.22em] uppercase text-[#0C4DD5]/70 mb-5">
              Contact Nothing Else
            </p>
            <h1 className="font-head font-bold text-[#111111] text-[12vw] sm:text-[7vw] lg:text-[4.8vw] leading-[0.98] tracking-[-0.03em]">
              Good product.
              <br />
              Fair price.
              <br />
              Nothing else.
            </h1>
            <div className="my-8 h-[3px] w-20 bg-[#0C4DD5]" />
            <p className="max-w-lg text-[17px] sm:text-[18px] text-[#111111]/65 leading-relaxed">
              Own the shelf through consistency, not clutter. Reach out for stocking, retail partnerships, or general enquiries.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:hello@nothingelse.co.in"
                className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-5 hover:border-[#0C4DD5]/25 transition-colors"
              >
                <Mail className="text-[#0C4DD5] mb-4" size={18} />
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#111111]/40 mb-1">Email</p>
                <p className="font-medium text-[#111111]">hello@nothingelse.co.in</p>
              </a>
              <a
                href="tel:+911800000000"
                className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-5 hover:border-[#0C4DD5]/25 transition-colors"
              >
                <Phone className="text-[#0C4DD5] mb-4" size={18} />
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#111111]/40 mb-1">Phone</p>
                <p className="font-medium text-[#111111]">1800-000-000</p>
              </a>
              <a
                href="https://instagram.com/nothing_else"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-[#111111]/8 bg-[#FAFBFF] p-5 hover:border-[#0C4DD5]/25 transition-colors sm:col-span-2"
              >
                <MapPin className="text-[#0C4DD5] mb-4" size={18} />
                <p className="text-[13px] uppercase tracking-[0.18em] text-[#111111]/40 mb-1">Visit</p>
                <p className="font-medium text-[#111111]">
                  Nothing Else House, Andheri East, Mumbai 400069
                </p>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";

/* Shared reveal-on-scroll wrapper */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const SERVICES = [
  "Beauty & Personal Care",
  "Home & Kitchen Essentials",
  "Food & Beverages",
  "Health & Wellness",
  "Bulk / Wholesale Orders",
  "Distributor Partnership",
  "General Inquiry",
];

/* Custom dropdown, matches the floating-label input style */
function ServiceDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const labelUp = Boolean(value) || open;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`peer w-full flex items-center justify-between gap-3 bg-black/[0.03] border rounded-2xl px-5 py-4 text-sm text-left outline-none transition-all ${
          open ? "border-[#0C4DD5]" : "border-black/10"
        } ${value ? "text-[#111111]" : "text-black/40"}`}
      >
        <span className="truncate">{value || " "}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-black/40 transition-transform duration-300 ${
            open ? "rotate-180 text-[#0C4DD5]" : ""
          }`}
        />
      </button>

      <label
        className={`absolute left-5 pointer-events-none transition-all px-2 bg-[#F5F3EF] ${
          labelUp
            ? "-top-2.5 text-[11px] text-[#0C4DD5]"
            : "top-4 text-sm text-black/40"
        }`}
      >
        I&apos;m Interested In
      </label>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 mt-2 w-full rounded-2xl border border-black/10 bg-[#F5F3EF] shadow-lg shadow-black/5 overflow-hidden py-2"
          >
            {SERVICES.map((service) => (
              <li key={service}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(service);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                    value === service
                      ? "text-[#0C4DD5] bg-[#0C4DD5]/5 font-semibold"
                      : "text-[#111111] hover:bg-black/[0.03]"
                  }`}
                >
                  {service}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative rounded-3xl border border-black/10 bg-black/[0.02] backdrop-blur-md p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form-fields"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-body text-[12px] tracking-[0.25em] uppercase text-[#0C4DD5] font-semibold mb-3">
              Get in Touch
            </p>
            <h3 className="font-head font-bold text-[#111111] text-2xl sm:text-3xl tracking-tight mb-8">
              Start a conversation.
            </h3>

            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full bg-black/[0.03] border border-black/10 rounded-2xl px-5 py-4 text-[#111111] text-sm outline-none focus:border-[#0C4DD5] transition-all placeholder-transparent"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-5 top-4 text-black/40 text-sm pointer-events-none transition-all 
                    peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 
                    peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:text-[#0C4DD5] peer-focus:bg-[#F5F3EF] peer-focus:px-2
                    not-placeholder-shown:-top-2.5 not-placeholder-shown:text-[11px] not-placeholder-shown:text-black/40 not-placeholder-shown:bg-[#F5F3EF] not-placeholder-shown:px-2"
                  >
                    Your Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <input
                    required
                    type="email"
                    id="email"
                    placeholder=" "
                    className="peer w-full bg-black/[0.03] border border-black/10 rounded-2xl px-5 py-4 text-[#111111] text-sm outline-none focus:border-[#0C4DD5] transition-all placeholder-transparent"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-5 top-4 text-black/40 text-sm pointer-events-none transition-all 
                    peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 
                    peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:text-[#0C4DD5] peer-focus:bg-[#F5F3EF] peer-focus:px-2
                    not-placeholder-shown:-top-2.5 not-placeholder-shown:text-[11px] not-placeholder-shown:text-black/40 not-placeholder-shown:bg-[#F5F3EF] not-placeholder-shown:px-2"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              {/* Service Dropdown */}
              <ServiceDropdown value={service} onChange={setService} />

              {/* Message Input */}
              <div className="relative">
                <textarea
                  required
                  id="message"
                  rows={4}
                  placeholder=" "
                  className="peer w-full bg-black/[0.03] border border-black/10 rounded-2xl px-5 py-4 text-[#111111] text-sm outline-none focus:border-[#0C4DD5] transition-all placeholder-transparent resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-5 top-4 text-black/40 text-sm pointer-events-none transition-all 
                  peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 
                  peer-focus:-top-2.5 peer-focus:text-[11px] peer-focus:text-[#0C4DD5] peer-focus:bg-[#F5F3EF] peer-focus:px-2
                  not-placeholder-shown:-top-2.5 not-placeholder-shown:text-[11px] not-placeholder-shown:text-black/40 not-placeholder-shown:bg-[#F5F3EF] not-placeholder-shown:px-2"
                >
                  How can we help you?
                </label>
              </div>

              {/* Styled Submit Button */}
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#0C4DD5] px-8 py-4 font-head font-bold text-sm tracking-wider uppercase text-white overflow-hidden transition-all duration-300 hover:bg-[#093ca8] active:scale-95"
              >
                Send Message
                <Send size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </motion.div>
        ) : (
          /* Smooth Success Morph */
          <motion.div
            key="form-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 bg-[#0C4DD5]/10 text-[#0C4DD5] rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-[#111111] text-2xl font-bold font-head mb-3">
              Message Sent!
            </h4>
            <p className="text-black/60 text-sm max-w-xs leading-relaxed">
              Thank you for reaching out. A representative from Nothing Else will connect with you shortly.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactSection() {
  return (
    <section 
      id="contact" 
      className="section-paint-lazy relative bg-[#F5F3EF] overflow-hidden pt-24 pb-12 scroll-mt-[68px] sm:scroll-mt-[76px] border-t border-black/5"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0C4DD5]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0C4DD5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 relative z-10">
        <div className="grid gap-16 lg:grid-cols-2 items-start lg:gap-20 pb-20 border-b border-black/10">
          
          {/* Left Side branding + cards */}
          <Reveal className="flex flex-col justify-between h-full">
            <div>
              <p className="font-body text-[12px] tracking-[0.25em] uppercase text-[#0C4DD5] font-semibold mb-4">
                Connect
              </p>
              <h2 className="font-head font-bold text-[#111111] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-8">
                Good product. <br />
                Fair price. <br />
                <span className="text-[#0C4DD5]">Nothing else.</span>
              </h2>
            </div>

            {/* Quick Contact Info Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <a 
                href="mailto:hello@nothingelse.co.in" 
                className="group rounded-2xl border border-black/10 bg-black/[0.02] p-5 hover:border-[#0C4DD5]/40 hover:bg-black/[0.04] transition-all duration-300"
              >
                <div className="p-2.5 bg-black/5 rounded-xl text-[#0C4DD5] w-fit mb-4 group-hover:bg-[#0C4DD5] group-hover:text-white transition-all duration-300">
                  <Mail size={16} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/40 mb-1">Email</p>
                <p className="font-semibold text-[#111111] text-sm">hello@nothingelse.co.in</p>
              </a>

              <a 
                href="tel:+911800000000" 
                className="group rounded-2xl border border-black/10 bg-black/[0.02] p-5 hover:border-[#0C4DD5]/40 hover:bg-black/[0.04] transition-all duration-300"
              >
                <div className="p-2.5 bg-black/5 rounded-xl text-[#0C4DD5] w-fit mb-4 group-hover:bg-[#0C4DD5] group-hover:text-white transition-all duration-300">
                  <Phone size={16} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/40 mb-1">Phone</p>
                <p className="font-semibold text-[#111111] text-sm">1800-000-000</p>
              </a>

              <a 
                href="https://instagram.com/nothing_else" 
                target="_blank" 
                rel="noreferrer" 
                className="group rounded-2xl border border-black/10 bg-black/[0.02] p-5 hover:border-[#0C4DD5]/40 hover:bg-black/[0.04] transition-all duration-300 sm:col-span-2"
              >
                <div className="p-2.5 bg-black/5 rounded-xl text-[#0C4DD5] w-fit mb-4 group-hover:bg-[#0C4DD5] group-hover:text-white transition-all duration-300">
                  <MapPin size={16} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/40 mb-1">Visit Us</p>
                <p className="font-semibold text-[#111111] text-sm leading-relaxed">
                  Nothing Else House, Andheri East, Mumbai 400069
                </p>
              </a>
            </div>
          </Reveal>

          {/* Right Side Form */}
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>

      </div>
    </section>
  );
}
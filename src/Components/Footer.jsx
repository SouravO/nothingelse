import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

/* lucide-react v1.0 removed all brand/logo icons (GitHub, Instagram,
   LinkedIn, etc.) — these are small inline replacements so we don't
   need to add another dependency for three icons. */
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.5 8.25h4.31v2.02h.06c.6-1.13 2.06-2.32 4.24-2.32 4.53 0 5.37 2.98 5.37 6.86V23h-4.5v-6.62c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23H8.5V8.25z" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.08.78 2.18v3.23c0 .3.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export default function Footer() {
  const socials = [
    { icon: InstagramIcon, href: "https://instagram.com/nothingelse", label: "Instagram" },
    { icon: LinkedinIcon, href: "https://linkedin.com/company/nothingelse", label: "LinkedIn" },
    { icon: GithubIcon, href: "https://github.com/nothingelse", label: "GitHub" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0C4DD5]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="mb-3 font-head text-2xl font-extrabold tracking-tight text-white">
              NOTHING ELSE<span className="text-white/60">.</span>
            </p>
            <p className="max-w-[240px] text-sm leading-relaxed text-white/50">
              Building things that don&apos;t need anything else.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a
                  href="mailto:hello@nothingelse.com"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail size={14} className="text-white/40" />
                  hello@nothingelse.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone size={14} className="text-white/40" />
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-white/40" />
                Bengaluru, Karnataka, India
              </li>
            </ul>
          </div>

          {/* Explore — site navigation, mirrors the sections/routes in App.jsx */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              Explore
            </p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="#about" className="transition-colors hover:text-white">
                  About
                </a>
              </li>
              
              <li>
                <a href="#system" className="transition-colors hover:text-white">
                  System
                </a>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/products" className="transition-colors hover:text-white">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
              Follow
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:bg-white hover:text-[#0C4DD5]"
                >
                  <Icon width={15} height={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} Nothing Else Private Limited. All rights reserved.</p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 py-2 transition-colors hover:text-white"
          >
            Back to top
            <ArrowUpRight
              size={14}
              className="transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
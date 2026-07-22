import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

/* Official brand icon SVGs styled to inherit currentColor */
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Footer() {
  const socials = [
    {
      icon: InstagramIcon,
      href: "https://instagram.com/nothingelse",
      label: "Instagram",
      // Official Instagram gradient (matches the app icon)
      style: {
        background:
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)",
      },
      shadowClass: "hover:shadow-[0_0_20px_rgba(214,36,159,0.55)]",
    },
    {
      icon: FacebookIcon,
      href: "https://facebook.com/nothingelse",
      label: "Facebook",
      style: { backgroundColor: "#1877F2" },
      shadowClass: "hover:shadow-[0_0_20px_rgba(24,119,242,0.55)]",
    },
    {
      icon: LinkedinIcon,
      href: "https://linkedin.com/company/nothingelse",
      label: "LinkedIn",
      style: { backgroundColor: "#0A66C2" },
      shadowClass: "hover:shadow-[0_0_20px_rgba(10,102,194,0.55)]",
    },
    {
      icon: GithubIcon,
      href: "https://github.com/nothingelse",
      label: "GitHub",
      style: { backgroundColor: "#181717" },
      shadowClass: "hover:shadow-[0_0_20px_rgba(0,0,0,0.45)]",
    },
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

          {/* Explore */}
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
              {socials.map(({ icon: Icon, href, label, style, shadowClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={style}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm transition-all duration-300 hover:scale-110 ${shadowClass}`}
                >
                  <Icon width={16} height={16} />
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
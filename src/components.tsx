import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { contact, navigation, socialLinks } from "./content";

export type IconName =
  | "arrow"
  | "chart"
  | "check"
  | "clock"
  | "code"
  | "layers"
  | "location"
  | "megaphone"
  | "menu"
  | "message"
  | "people"
  | "phone"
  | "play"
  | "spark"
  | "support"
  | "target"
  | "ticket";

export function Icon({
  name,
  size = 22,
}: {
  name: IconName;
  size?: number;
}) {
  const paths = {
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    chart: (
      <>
        <path d="M4 19V5m0 14h17" />
        <path d="m7 15 4-4 3 2 6-7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    code: (
      <>
        <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    megaphone: (
      <>
        <path d="m3 11 15-6v14L3 13v-2Z" />
        <path d="m7 14 2 6h4l-2-4m7-8h2a2 2 0 0 1 0 6h-2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.5-3A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    phone: (
      <path d="M6.6 3.5 9 3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L16 13l5 2-.5 2.4a3 3 0 0 1-3.3 2.4A17.5 17.5 0 0 1 4.2 6.8a3 3 0 0 1 2.4-3.3Z" />
    ),
    play: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" />
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
      </>
    ),
    support: (
      <>
        <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 13h3v6H6a2 2 0 0 1-2-2v-4Zm16 0h-3v6h1a2 2 0 0 0 2-2v-4Zm-8 7h2" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 8a2 2 0 0 0 0 4 2 2 0 0 0 0 4h18a2 2 0 0 0 0-4 2 2 0 0 0 0-4H3Z" />
        <path d="M13 8v2m0 3v1m0 3v1" />
      </>
    ),
  } satisfies Record<IconName, ReactNode>;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [hash, pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            className="brand"
            to="/"
            aria-label="AE Turns (Pvt) Ltd home"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/aeturns-logo.png" alt="AE Turns" />
            <span className="brand-legal">(Pvt) Ltd</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name="menu" size={24} />
          </button>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              className="nav-cta"
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              Get in Touch <Icon name="arrow" size={17} />
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" key={pathname}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main section-wrap">
        <div className="footer-brand-block">
          <Link className="footer-brand" to="/" aria-label="AE Turns home">
            <img src="/aeturns-logo.png" alt="AE Turns" />
          </Link>
          <p>Innovative digital solutions<br />for a smarter future.</p>
        </div>
        <div className="footer-column">
          <h2>Quick links</h2>
          {navigation.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </div>
        <div className="footer-column">
          <h2>Solutions</h2>
          <Link to="/solutions">Explore our solutions</Link>
          <Link to="/solutions#bulk-sms-whatsapp-solutions">Bulk SMS & WhatsApp</Link>
          <Link to="/solutions#web-it-solutions">Web & IT Solutions</Link>
        </div>
        <div className="footer-column footer-contact">
          <h2>Contact</h2>
          <span>{contact.address}</span>
          <a href={`tel:${contact.phoneLink}`}>{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div className="footer-column footer-social">
          <h2>Follow along</h2>
          {socialLinks.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
              {social.label}<span aria-hidden="true"> ↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom section-wrap">
        <span>© 2026 AE Turns (Pvt) Ltd. All Rights Reserved.</span>
        <div className="legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <section className={compact ? "page-hero page-hero-compact" : "page-hero"}>
      <div className="section-wrap page-hero-inner">
        <p className="eyebrow"><span />{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-hero-description">{description}</p>}
      </div>
    </section>
  );
}

export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div className="intro-label">
      <span className="section-index">{number}</span>
      <span className="eyebrow">{children}</span>
    </div>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band section-wrap">
      <div>
        <span className="eyebrow">Ready when you are</span>
        <h2>Let’s find your <em>next turn.</em></h2>
        <p>Tell us what you’re looking to achieve. We’d love to hear from you.</p>
      </div>
      <Link className="button button-light" to="/contact">
        Contact Us <Icon name="arrow" size={18} />
      </Link>
    </section>
  );
}

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className="breadcrumbs section-wrap" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function EmailForm({
  kind,
  position,
}: {
  kind: "contact" | "career";
  position?: string;
}) {
  const [status, setStatus] = useState("");
  const isContactForm = kind === "contact";

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const subject = isContactForm
      ? String(formData.get("subject") ?? "Website enquiry")
      : `CV application: ${String(formData.get("position") ?? position ?? "")}`;
    const fields = isContactForm
      ? ["name", "email", "phone", "company", "subject", "message"]
      : ["name", "email", "phone", "position", "message"];
    const cv = formData.get("cv");
    if (!isContactForm && cv instanceof File && cv.size > 10 * 1024 * 1024) {
      setStatus("The selected CV is larger than 10 MB. Choose a smaller file and try again.");
      return;
    }
    if (
      !isContactForm &&
      cv instanceof File &&
      !/\.(pdf|doc|docx)$/i.test(cv.name)
    ) {
      setStatus("Choose a PDF or Word document for your CV.");
      return;
    }
    const body = fields
      .map((field) => {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        return `${label}: ${String(formData.get(field) ?? "").trim()}`;
      })
      .join("\n");
    const attachmentNote =
      !isContactForm && cv instanceof File
        ? `\nCV file selected: ${cv.name}\n\nPlease attach this CV file to the email before sending.`
        : "";

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(
      `${body}${attachmentNote}\n\nReply to: ${email}`,
    )}`;
    setStatus(
      `Your email app should open with your ${isContactForm ? "message" : "application"} prepared. Review it and press Send to contact AE Turns. The website does not send or store this form.`,
    );
  }

  return (
    <form className="form-card" onSubmit={submitForm}>
      <div className="form-grid">
        <label>
          Full Name <span>*</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email Address <span>*</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone Number <span>*</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        {isContactForm ? (
          <>
            <label>
              Company
              <input name="company" autoComplete="organization" />
            </label>
            <label className="form-full">
              Subject <span>*</span>
              <input name="subject" required />
            </label>
          </>
        ) : (
          <>
            <label>
              Position <span>*</span>
              <input name="position" defaultValue={position} required />
            </label>
            <label className="form-full">
              CV Upload <span>*</span>
              <input
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                aria-describedby="cv-note"
              />
              <small id="cv-note">Attach the selected CV to your email before sending. PDF or Word, up to 10 MB.</small>
            </label>
          </>
        )}
        <label className="form-full">
          {isContactForm ? "Message" : "Cover Letter / Message"} <span>*</span>
          <textarea name="message" rows={5} required />
        </label>
      </div>
      <p className="form-note">
        {isContactForm
          ? "Submit opens your default email app. Your details are not sent or stored on this website."
          : "Applications are prepared in your default email app. Please attach your CV to the email before sending."}
      </p>
      <button className="button button-dark" type="submit">
        {isContactForm ? "Prepare email" : "Prepare application"}
        <Icon name="arrow" size={18} />
      </button>
      <p className="form-status" role="status">{status}</p>
    </form>
  );
}

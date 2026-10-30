import { useEffect, useState, type ReactNode } from "react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Why AE Turns", href: "#why-aeturns" },
];

type IconName =
  | "arrow"
  | "chart"
  | "check"
  | "code"
  | "layers"
  | "menu"
  | "message"
  | "phone"
  | "spark"
  | "support"
  | "target"
  | "ticket";

type Service = {
  number: string;
  icon: IconName;
  title: string;
  description: string;
  label: string;
};

type Strength = {
  icon: IconName;
  title: string;
  description: string;
};

const services = [
  {
    number: "01",
    icon: "message",
    title: "Bulk messaging",
    description:
      "Reach the right people at the right moment with high-deliverability SMS and WhatsApp communication.",
    label: "SMS & WhatsApp",
  },
  {
    number: "02",
    icon: "spark",
    title: "Interactive experiences",
    description:
      "Turn audiences into active participants with engaging quizzes, games and AI-powered experiences.",
    label: "Engagement",
  },
  {
    number: "03",
    icon: "ticket",
    title: "Lottery & gaming",
    description:
      "Bring your ideas to life with secure, scalable digital lottery platforms and seamless integrations.",
    label: "Digital platforms",
  },
  {
    number: "04",
    icon: "layers",
    title: "VAS product development",
    description:
      "Create value-added services that deepen engagement and open new opportunities across mobile.",
    label: "Product development",
  },
  {
    number: "05",
    icon: "code",
    title: "Web & IT solutions",
    description:
      "Build high-performance websites and enterprise technology designed to grow with your business.",
    label: "Web & technology",
  },
] satisfies Service[];

const strengths = [
  {
    icon: "spark",
    title: "Innovation that moves you forward",
    description:
      "We bring emerging technology and thoughtful ideas together to create meaningful digital experiences.",
  },
  {
    icon: "target",
    title: "Made for your business",
    description:
      "No one-size-fits-all playbooks. Every solution is shaped around your goals, audience and ambitions.",
  },
  {
    icon: "chart",
    title: "Built around real outcomes",
    description:
      "We focus on measurable impact, combining smart execution with a clear view of what success looks like.",
  },
  {
    icon: "support",
    title: "With you at every turn",
    description:
      "From the first conversation to ongoing optimisation, our team is here to help you keep moving.",
  },
 ] satisfies Strength[];

function Icon({
  name,
  size = 22,
}: {
  name: IconName;
  size?: number;
}) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    chart: (
      <>
        <path d="M4 19V5m0 14h17" />
        <path d="m7 15 4-4 3 2 6-7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
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
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.5-3A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </>
    ),
    phone: (
      <path d="M6.6 3.5 9 3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L16 13l5 2-.5 2.4a3 3 0 0 1-3.3 2.4A17.5 17.5 0 0 1 4.2 6.8a3 3 0 0 1 2.4-3.3Z" />
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
  };

  return <svg {...shared}>{paths[name]}</svg>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#home"
            aria-label="AE Turns home"
            onClick={closeMenu}
          >
            <img src="/aeturns-logo.png" alt="AE Turns" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name="menu" size={25} />
          </button>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
            {navigation.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <a className="nav-cta" href="#contact" onClick={closeMenu}>
              Let’s talk <Icon name="arrow" size={17} />
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span /> Innovative digital solutions</p>
              <h1>
                A smarter future
                <br />
                starts <span>here.</span>
              </h1>
              <p className="hero-description">
                We turn ambitious ideas into digital experiences that move
                businesses and people forward.
              </p>
              <div className="hero-actions">
                <a className="button button-dark" href="#services">
                  Discover what we do <Icon name="arrow" size={18} />
                </a>
                <a className="text-link" href="#about">
                  Get to know us
                </a>
              </div>
              <div className="hero-proof">
                <div className="proof-avatars" aria-hidden="true">
                  <span>A</span><span>E</span><span>T</span>
                </div>
                <p>
                  Thoughtful technology.
                  <br />
                  <strong>Human-first by design.</strong>
                </p>
              </div>
            </div>

            <div className="hero-art" aria-label="Digital solutions illustration">
              <div className="art-glow" />
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="orbit orbit-three" />
              <div className="art-center">
                <div className="center-mark">ae</div>
                <span>ideas in motion</span>
              </div>
              <div className="float-card card-message">
                <span className="float-icon teal"><Icon name="message" size={19} /></span>
                <span><strong>Connect</strong><small>Every conversation counts</small></span>
                <span className="signal-dot" />
              </div>
              <div className="float-card card-growth">
                <span className="float-icon coral"><Icon name="chart" size={19} /></span>
                <span><strong>Grow</strong><small>Make every move matter</small></span>
                <span className="growth-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
              </div>
              <div className="float-tag tag-top">Built around people <span>✳</span></div>
              <div className="float-tag tag-bottom">Made for what’s next <span>↗</span></div>
            </div>
          </div>
          <a className="scroll-cue" href="#about">
            <span /> Scroll to explore
          </a>
        </section>

        <section className="intro-section section-wrap reveal" id="about">
          <div className="intro-label">
            <span className="section-index">01</span>
            <span className="eyebrow">A little about us</span>
          </div>
          <div className="intro-content">
            <h2>
              AE Turns isn’t just a company—it’s a <em>movement of innovation.</em>
            </h2>
            <div className="intro-bottom">
              <p>
                From humble beginnings to industry pioneers, we redefine
                communication, engagement and digital transformation. We
                combine creative thinking with technology to help businesses
                take their next turn.
              </p>
              <a className="round-link" href="#why-aeturns" aria-label="Discover why AE Turns">
                <Icon name="arrow" size={21} />
              </a>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-wrap">
            <div className="section-heading reveal">
              <div>
                <div className="intro-label">
                  <span className="section-index">02</span>
                  <span className="eyebrow">What we do</span>
                </div>
                <h2>Big ideas. <em>Built to work.</em></h2>
              </div>
              <p>
                From the first spark to the final launch, we create digital
                solutions that bring people and possibility together.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card reveal" key={service.number}>
                  <div className="service-card-top">
                    <span className="service-number">{service.number}</span>
                    <span className="service-icon"><Icon name={service.icon} size={23} /></span>
                  </div>
                  <p className="service-label">{service.label}</p>
                  <h3>{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <a href="#contact" className="service-link" aria-label={`Ask us about ${service.title}`}>
                    <Icon name="arrow" size={19} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="why-section" id="why-aeturns">
          <div className="why-wrap section-wrap">
            <div className="why-lead reveal">
              <div className="intro-label">
                <span className="section-index">03</span>
                <span className="eyebrow">The AE Turns difference</span>
              </div>
              <h2>
                Your next big thing deserves <em>a better partner.</em>
              </h2>
              <p>
                The right technology is only the beginning. We bring curiosity,
                care and commitment to every turn of your journey.
              </p>
              <a className="button button-light" href="#contact">
                Let’s build something <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="strength-list">
              {strengths.map((strength, index) => (
                <article className="strength-item reveal" key={strength.title}>
                  <span className="strength-icon"><Icon name={strength.icon} size={21} /></span>
                  <div>
                    <span className="strength-number">0{index + 1}</span>
                    <h3>{strength.title}</h3>
                    <p>{strength.description}</p>
                  </div>
                  <Icon name="arrow" size={18} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-wrap reveal" id="contact">
          <div className="contact-card">
            <div className="contact-shape shape-one" />
            <div className="contact-shape shape-two" />
            <div className="contact-copy">
              <span className="eyebrow">Ready when you are</span>
              <h2>Let’s make your next turn <em>your best one.</em></h2>
              <p>Tell us what you’re imagining. We’d love to help you get there.</p>
              <a className="button button-light" href="mailto:info@aeturns.com">
                Start a conversation <Icon name="arrow" size={18} />
              </a>
            </div>
            <div className="contact-details">
              <a href="tel:+94704157587">
                <span className="contact-icon"><Icon name="phone" size={18} /></span>
                <span><small>Give us a call</small><strong>+94 70 415 7587</strong></span>
              </a>
              <a href="mailto:info@aeturns.com">
                <span className="contact-icon"><Icon name="message" size={18} /></span>
                <span><small>Drop us a note</small><strong>info@aeturns.com</strong></span>
              </a>
              <div className="contact-location">
                <span className="contact-icon"><Icon name="target" size={18} /></span>
                <span><small>Find us</small><strong>Wijerama Road, Nugegoda</strong></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main section-wrap">
          <a className="footer-brand" href="#home" aria-label="AE Turns home">
            <img src="/aeturns-logo.png" alt="AE Turns" />
          </a>
          <p>Innovative digital solutions<br />for a smarter future.</p>
          <div className="footer-links">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </div>
          <a className="back-top" href="#home">Back to top ↑</a>
        </div>
        <div className="footer-bottom section-wrap">
          <span>© {new Date().getFullYear()} AE Turns. All rights reserved.</span>
          <span>Made for what’s next.</span>
        </div>
      </footer>
    </>
  );
}

export default App;

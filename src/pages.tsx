import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumbs,
  ContactBand,
  EmailForm,
  Icon,
  PageHero,
  SectionLabel,
} from "./components";
import {
  contact,
  operatingAreas,
  partners,
  services,
  solutions,
  socialLinks,
  strengths,
  vacancies,
} from "./content";

function solutionId(title: string) {
  return title.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
}

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | AE Turns (Pvt) Ltd`;
    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription?.setAttribute("content", description);
  }, [description, title]);
}

export function HomePage() {
  usePageMeta(
    "Innovative Digital Solutions for a Smarter Future",
    "AE Turns delivers innovative technology and digital solutions to improve business operations, customer engagement and digital experiences.",
  );

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> AE Turns (Pvt) Ltd</p>
            <h1>Innovative Digital Solutions for a <em>Smarter Future</em></h1>
            <p className="hero-description">
              AE Turns delivers innovative technology and digital solutions
              designed to help businesses improve their operations, customer
              engagement and digital experiences.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/solutions">
                Explore Our Solutions <Icon name="arrow" size={18} />
              </Link>
              <Link className="text-link" to="/contact">Contact Us</Link>
            </div>
            <div className="hero-proof">
              <span className="proof-star" aria-hidden="true">✳</span>
              <p>Technology with purpose.<br /><strong>Solutions made for business.</strong></p>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-glow" />
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="art-center">
              <span className="center-mark">ae</span>
              <span>ideas in motion</span>
            </div>
            <div className="float-card card-message">
              <span className="float-icon teal"><Icon name="message" size={19} /></span>
              <span><strong>Connect</strong><small>Communication that reaches</small></span>
            </div>
            <div className="float-card card-growth">
              <span className="float-icon coral"><Icon name="spark" size={19} /></span>
              <span><strong>Transform</strong><small>Digital solutions that work</small></span>
            </div>
            <span className="float-tag tag-top">Built around people <span>✳</span></span>
            <span className="float-tag tag-bottom">Made for what’s next <span>↗</span></span>
          </div>
        </div>
        <Link className="scroll-cue" to="/about"><span /> Discover AE Turns</Link>
      </section>

      <section className="highlights-section section-wrap">
        <div className="section-heading reveal">
          <div>
            <SectionLabel number="01">A growing journey</SectionLabel>
            <h2>Experience since <em>2021.</em></h2>
          </div>
          <p>Our story began in 2021. Project, customer and solution figures will be shared when confirmed by the AE Turns Administration.</p>
        </div>
        <div className="highlights-grid">
          <article className="highlight-card highlight-established reveal">
            <span className="highlight-mark"><Icon name="clock" size={21} /></span>
            <strong>2021</strong>
            <span>Established</span>
          </article>
          <article className="highlight-card reveal">
            <span className="highlight-mark"><Icon name="chart" size={21} /></span>
            <strong>To be confirmed</strong>
            <span>Successful projects</span>
          </article>
          <article className="highlight-card reveal">
            <span className="highlight-mark"><Icon name="people" size={21} /></span>
            <strong>To be confirmed</strong>
            <span>Customers & clients</span>
          </article>
          <article className="highlight-card reveal">
            <span className="highlight-mark"><Icon name="layers" size={21} /></span>
            <strong>To be confirmed</strong>
            <span>Solutions delivered</span>
          </article>
        </div>
      </section>

      <section className="services-section">
        <div className="section-wrap">
          <div className="section-heading reveal">
            <div>
              <SectionLabel number="02">Our solutions</SectionLabel>
              <h2>Technology for <em>what’s next.</em></h2>
            </div>
            <p>Practical digital solutions that help businesses communicate, engage and transform.</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card reveal" key={service.title}>
                <div className="service-card-top">
                  <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="service-icon"><Icon name={service.icon} size={22} /></span>
                </div>
                <p className="service-label">{service.category}</p>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <Link
                  className="service-link"
                  to={`/solutions#${solutionId(service.title)}`}
                  aria-label={`Learn about ${service.title}`}
                >
                  <span>Learn more</span><Icon name="arrow" size={18} />
                </Link>
              </article>
            ))}
          </div>
          <div className="center-action">
            <Link className="button button-outline" to="/solutions">
              View all solutions <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseSection />

      <section className="customers-section section-wrap reveal">
        <div className="customers-intro">
          <SectionLabel number="04">Our customers</SectionLabel>
          <h2>Built on <em>trusted relationships.</em></h2>
          <p>Customer names and logos will be added after approval by the AE Turns Administration.</p>
        </div>
        <div className="customers-pending">
          <span className="pending-spark" aria-hidden="true">✳</span>
          <span>Customer stories are on their way</span>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

function WhyChooseSection() {
  return (
    <section className="why-section">
      <div className="why-wrap section-wrap">
        <div className="why-lead reveal">
          <SectionLabel number="03">Why choose AE Turns?</SectionLabel>
          <h2>A thoughtful partner for <em>every turn.</em></h2>
          <p>We work alongside our clients to understand what they need and deliver technology solutions that create value.</p>
          <Link className="button button-light" to="/about">
            Get to know us <Icon name="arrow" size={18} />
          </Link>
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
  );
}

export function AboutPage() {
  usePageMeta(
    "About Us",
    "Learn about AE Turns (Pvt) Ltd, our story, vision, mission, operating areas and approved partners.",
  );

  return (
    <>
      <PageHero
        eyebrow="About AE Turns"
        title="Technology with purpose. Progress with people."
        description="A technology and digital solutions company focused on helping businesses improve communication, engagement and digital operations."
      />
      <Breadcrumbs current="About Us" />
      <section className="story-section section-wrap reveal">
        <div className="story-aside">
          <SectionLabel number="01">Our story</SectionLabel>
          <div className="established-stamp"><span>Established</span><strong>2021</strong></div>
        </div>
        <div className="story-content">
          <h2>We help businesses take their <em>next turn.</em></h2>
          <p>
            AE Turns is a technology and digital solutions company focused on
            delivering innovative solutions that help businesses improve
            communication, engagement and digital operations.
          </p>
          <p>
            Established in 2021, AE Turns (Pvt) Ltd brings together a range of
            digital services—from messaging and interactive platforms to web
            systems and value-added services.
          </p>
        </div>
      </section>

      <section className="purpose-section">
        <div className="purpose-grid section-wrap">
          <article className="purpose-card reveal">
            <span className="purpose-number">02 / OUR VISION</span>
            <span className="purpose-icon"><Icon name="spark" size={22} /></span>
            <h2>A trusted partner for a <em>lasting impact.</em></h2>
            <p>
              To become a trusted technology partner delivering innovative
              digital solutions that create lasting value for businesses and
              their customers.
            </p>
          </article>
          <article className="purpose-card purpose-card-dark reveal">
            <span className="purpose-number">03 / OUR MISSION</span>
            <span className="purpose-icon"><Icon name="target" size={22} /></span>
            <h2>Real solutions for <em>real challenges.</em></h2>
            <p>
              To provide reliable, innovative and customer-focused technology
              solutions that address real business challenges and support
              sustainable digital growth.
            </p>
          </article>
        </div>
      </section>

      <section className="areas-section section-wrap">
        <div className="section-heading reveal">
          <div>
            <SectionLabel number="04">Our industries</SectionLabel>
            <h2>Where we <em>create value.</em></h2>
          </div>
          <p>Our work spans the digital products and services at the heart of customer communication and engagement.</p>
        </div>
        <div className="area-list">
          {operatingAreas.map((area, index) => (
            <div className="area-item reveal" key={area}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{area}</h3>
              <Icon name="arrow" size={18} />
            </div>
          ))}
        </div>
      </section>

      <section className="partners-section">
        <div className="section-wrap">
          <div className="section-heading reveal">
            <div>
              <SectionLabel number="05">Key partners</SectionLabel>
              <h2>Better, <em>together.</em></h2>
            </div>
            <p>Our partners include the organisations listed below. Official partner logos can be added when supplied by the Administration.</p>
          </div>
          <div className="partner-list">
            {partners.map((partner, index) => (
              <div className="partner-name reveal" key={partner}>
                <span>0{index + 1}</span>
                <strong>{partner}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactBand />
    </>
  );
}

export function SolutionsPage() {
  usePageMeta(
    "Solutions",
    "Explore AE Turns services: messaging, lottery and gaming platforms, VAS product development, interactive platforms, digital marketing and web systems.",
  );

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Digital solutions that move business forward."
        description="Explore AE Turns services across messaging, digital platforms, interactive experiences and web technology."
      />
      <Breadcrumbs current="Solutions" />
      <section className="solutions-intro section-wrap reveal">
        <SectionLabel number="01">What we offer</SectionLabel>
        <div>
          <h2>One partner for your <em>digital ambitions.</em></h2>
          <p>
            AE Turns provides technology and digital services to help businesses
            communicate with customers, build engaging experiences and support
            their digital operations.
          </p>
        </div>
      </section>
      <section className="solutions-list section-wrap">
        {solutions.map((solution) => (
          <article className="solution-detail reveal" id={solutionId(solution.title)} key={solution.title}>
            <div className="solution-number">{solution.number}</div>
            <div className="solution-detail-icon">
              <Icon name={solution.icon} size={25} />
            </div>
            <div className="solution-detail-copy">
              <span className="service-label">{solution.category}</span>
              <h2>{solution.title}</h2>
              <p>{solution.description}</p>
              <Link to="/contact" className="text-link">Discuss this solution</Link>
            </div>
          </article>
        ))}
      </section>
      <ContactBand />
    </>
  );
}

export function CareersPage() {
  usePageMeta(
    "Careers",
    "Explore careers at AE Turns. We provide opportunities to work with modern technologies and contribute to real-world projects.",
  );

  return (
    <>
      <PageHero
        eyebrow="Careers at AE Turns"
        title="Build what’s next. Grow along the way."
        description="Join a collaborative environment where you can work with modern technologies and contribute to real-world projects."
      />
      <Breadcrumbs current="Careers" />
      <section className="careers-section section-wrap">
        <div className="careers-copy reveal">
          <SectionLabel number="01">Why join AE Turns?</SectionLabel>
          <h2>Bring your ideas. <em>Make a difference.</em></h2>
          <p>
            AE Turns provides opportunities for individuals to work with
            modern technologies, contribute to real-world projects and develop
            their professional skills in a collaborative environment.
          </p>
          <Link className="text-link" to="/contact">Get in touch with our team</Link>
        </div>
        <div className="careers-illustration reveal" aria-hidden="true">
          <div className="careers-orbit careers-orbit-one" />
          <div className="careers-orbit careers-orbit-two" />
          <div className="careers-center"><span>ae</span><small>your next turn</small></div>
          <span className="careers-star careers-star-one">✳</span>
          <span className="careers-star careers-star-two">✳</span>
        </div>
      </section>
      <section className="vacancies-section">
        <div className="section-wrap vacancy-list">
          {vacancies.length === 0 ? (
            <div className="vacancy-card reveal">
              <span className="vacancy-icon"><Icon name="people" size={24} /></span>
              <div>
                <span className="eyebrow">Current vacancies</span>
                <h2>No Current Vacancies</h2>
                <p>There are no open positions at this time. Please check back for future opportunities.</p>
              </div>
            </div>
          ) : (
            vacancies.map((vacancy) => (
              <article className="vacancy-detail reveal" key={vacancy.id}>
                <div className="vacancy-heading">
                  <span className="eyebrow">Current opportunity</span>
                  <h2>{vacancy.title}</h2>
                  <div className="vacancy-meta">
                    <span>{vacancy.department}</span>
                    <span>{vacancy.location}</span>
                    <span>{vacancy.employmentType}</span>
                  </div>
                </div>
                <div className="vacancy-columns">
                  <div>
                    <h3>Responsibilities</h3>
                    <ul>{vacancy.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h3>Requirements</h3>
                    <ul>{vacancy.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
                <div className="vacancy-application">
                  <div>
                    <h3>Apply for this position</h3>
                    <p>Prepare an email to {contact.email}; attach your CV before sending.</p>
                  </div>
                  <EmailForm kind="career" position={vacancy.title} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      <ContactBand />
    </>
  );
}

export function ContactPage() {
  usePageMeta(
    "Contact Us",
    "Contact AE Turns (Pvt) Ltd in Nugegoda by phone, email or online enquiry.",
  );

  return (
    <>
      <PageHero
        eyebrow="Contact AE Turns"
        title="Let’s start a conversation."
        description="Tell us what you’re looking to achieve. We’ll be happy to hear from you."
      />
      <Breadcrumbs current="Contact Us" />
      <section className="contact-page section-wrap">
        <div className="contact-information reveal">
          <SectionLabel number="01">Get in touch</SectionLabel>
          <h2>We’re here to <em>help you move forward.</em></h2>
          <p>Contact our team for information about our company and solutions.</p>
          <div className="contact-facts">
            <a className="contact-fact" href={`tel:${contact.phoneLink}`}>
              <span className="contact-fact-icon"><Icon name="phone" size={19} /></span>
              <span><small>Telephone</small><strong>{contact.phone}</strong></span>
            </a>
            <a className="contact-fact" href={`mailto:${contact.email}`}>
              <span className="contact-fact-icon"><Icon name="message" size={19} /></span>
              <span><small>Email</small><strong>{contact.email}</strong></span>
            </a>
            <div className="contact-fact">
              <span className="contact-fact-icon"><Icon name="location" size={19} /></span>
              <span><small>Contact address</small><strong>{contact.address}</strong></span>
            </div>
            <div className="contact-fact">
              <span className="contact-fact-icon"><Icon name="clock" size={19} /></span>
              <span><small>Business hours</small><strong>{contact.hours}</strong></span>
            </div>
          </div>
          <div className="contact-socials">
            <span>Follow AE Turns</span>
            <div>
              {socialLinks.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer" aria-label={social.label}>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="contact-form-wrap reveal">
          <span className="eyebrow">Send us a message</span>
          <h2>How can we <em>help?</em></h2>
          <EmailForm kind="contact" />
        </div>
      </section>
      <section className="location-section">
        <div className="location-card section-wrap reveal">
          <div className="location-copy">
            <SectionLabel number="02">Our location</SectionLabel>
            <h2>Find us in <em>Colombo.</em></h2>
            <p>{contact.officeAddress}</p>
            <a className="button button-dark" href={contact.mapUrl} target="_blank" rel="noreferrer">
              Open in Google Maps <Icon name="arrow" size={18} />
            </a>
          </div>
          <a className="map-preview" href={contact.mapUrl} target="_blank" rel="noreferrer" aria-label="Open the supplied AE Turns location in Google Maps">
            <span className="map-grid" aria-hidden="true" />
            <span className="map-road road-one" aria-hidden="true" />
            <span className="map-road road-two" aria-hidden="true" />
            <span className="map-road road-three" aria-hidden="true" />
            <span className="map-link-card">
              <span className="map-marker"><Icon name="location" size={22} /></span>
              <span><strong>AE Turns (Pvt) Ltd</strong><small>{contact.officeAddress}</small></span>
              <span className="map-open">Open the supplied Google Maps location ↗</span>
            </span>
          </a>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  usePageMeta("Privacy Policy", "Privacy information for the AE Turns website.");

  return (
    <LegalPage
      title="Privacy Policy"
      intro="This website provides information about AE Turns (Pvt) Ltd and its services."
      sections={[
        {
          title: "Information you provide",
          text: "The contact form prepares a message in your device’s default email application. This website does not transmit or store form details. If you send an email, AE Turns receives the information included in that email.",
        },
        {
          title: "CV applications",
          text: "There are no current vacancies listed on this website. If vacancies are announced in the future, application instructions will be provided with each opening.",
        },
        {
          title: "External links",
          text: "This website links to third-party services, including social networks and Google Maps. Those services have their own privacy policies and data practices.",
        },
        {
          title: "Contact",
          text: `For privacy questions, contact ${contact.email}.`,
        },
      ]}
    />
  );
}

export function TermsPage() {
  usePageMeta("Terms & Conditions", "Terms and conditions for the AE Turns website.");

  return (
    <LegalPage
      title="Terms & Conditions"
      intro="By using this website, you agree to the following terms."
      sections={[
        {
          title: "Website content",
          text: "The information on this website is provided for general information about AE Turns (Pvt) Ltd and its services. Service availability and details may change.",
        },
        {
          title: "Enquiries",
          text: "Contact forms prepare messages in your email application. An enquiry is sent only when you choose to send the prepared email. Sending an enquiry does not establish a business agreement.",
        },
        {
          title: "External links",
          text: "Links to third-party websites are provided for convenience. AE Turns is not responsible for the content or operation of those websites.",
        },
        {
          title: "Contact",
          text: `For questions about these terms, contact ${contact.email}.`,
        },
      ]}
    />
  );
}

function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <>
      <PageHero eyebrow="AE Turns" title={title} compact />
      <Breadcrumbs current={title} />
      <article className="legal-page section-wrap">
        <p className="legal-intro">{intro}</p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <p className="legal-updated">AE Turns (Pvt) Ltd · 2026</p>
      </article>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="not-found section-wrap">
      <span className="eyebrow">404 · Page not found</span>
      <h1>This page took <em>a different turn.</em></h1>
      <p>The page you’re looking for isn’t here. Head back to the AE Turns home page.</p>
      <Link to="/" className="button button-dark">Back to Home <Icon name="arrow" size={18} /></Link>
    </section>
  );
}

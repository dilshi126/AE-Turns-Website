import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "../components";
import type { ManagedSiteContent } from "../site-content";

type AdminSession = {
  authenticated: boolean;
  username?: string;
  setupAvailable?: boolean;
};

const sections = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "company", label: "Company & pages", icon: "layers" },
  { id: "solutions", label: "Solutions", icon: "spark" },
  { id: "about", label: "About & partners", icon: "people" },
  { id: "content", label: "Stats & customers", icon: "target" },
  { id: "careers", label: "Careers", icon: "people" },
  { id: "social", label: "Social links", icon: "message" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  return fetch(path, {
    ...options,
    headers: {
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
      ...options?.headers,
    },
  }).then(async (response) => {
    const body = (await response.json().catch(() => ({}))) as T & {
      error?: string;
    };
    if (!response.ok) {
      throw new Error(body.error ?? `Request failed (${response.status}).`);
    }
    return body;
  });
}

function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [content, setContent] = useState<ManagedSiteContent | null>(null);
  const [section, setSection] = useState<SectionId>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest<AdminSession>("/api/admin/status")
      .then(async (status) => {
        if (!active) return;
        setSession(status);
        if (status.authenticated) {
          const result = await apiRequest<{ content: ManagedSiteContent }>(
            "/api/content",
          );
          if (active) setContent(result.content);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Could not connect to the content server.");
          setSession({ authenticated: false });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const fields = new FormData(event.currentTarget);
    try {
      const signedIn = await apiRequest<AdminSession>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          username: fields.get("username"),
          password: fields.get("password"),
        }),
      });
      setSession(signedIn);
      const result = await apiRequest<{ content: ManagedSiteContent }>(
        "/api/content",
      );
      setContent(result.content);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign in.");
    }
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const fields = new FormData(event.currentTarget);
    try {
      await apiRequest("/api/admin/setup", {
        method: "POST",
        body: JSON.stringify({
          setupKey: fields.get("setupKey"),
          username: fields.get("username"),
          password: fields.get("password"),
        }),
      });
      setMessage("Admin account created. You can sign in now.");
      setSession({ authenticated: false, setupAvailable: false });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the account.");
    }
  }

  async function saveContent() {
    if (!content) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest<{ content: ManagedSiteContent }>(
        "/api/admin/content",
        { method: "PUT", body: JSON.stringify(content) },
      );
      setContent(result.content);
      setMessage("Published successfully. The public website will update automatically.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Changes could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    try {
      await apiRequest("/api/admin/logout", { method: "POST", body: "{}" });
      setContent(null);
      setSession({ authenticated: false });
      setSection("overview");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not sign out.");
    }
  }

  function updateContent(updater: (value: ManagedSiteContent) => ManagedSiteContent) {
    setContent((current) => (current ? updater(current) : current));
  }

  if (loading) {
    return <div className="admin-loading"><span className="loading-mark">ae</span><p>Connecting to AE Turns content manager…</p></div>;
  }

  if (!session?.authenticated || !content) {
    return (
      <AuthScreen
        setupAvailable={session?.setupAvailable === true}
        message={message}
        error={error}
        onLogin={signIn}
        onSetup={createAccount}
      />
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" target="_blank" rel="noreferrer">
          <img src="/aeturns-logo.png" alt="AE Turns" />
          <span>CONTENT STUDIO<small>Website administration</small></span>
        </a>
        <span className="sidebar-label">WORKSPACE</span>
        <nav className="admin-nav" aria-label="Admin sections">
          {sections.map((item) => (
            <button
              className={section === item.id ? "is-active" : ""}
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                setError("");
                setMessage("");
              }}
            >
              <span className="admin-nav-icon"><Icon name={item.icon} size={18} /></span>
              {item.label}
              {section === item.id && <span className="nav-active-mark" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="admin-avatar">{session.username?.slice(0, 1).toUpperCase()}</span>
          <span className="admin-identity"><strong>{session.username}</strong><small>Administrator</small></span>
          <button className="sign-out-button" type="button" onClick={signOut} aria-label="Sign out">↗</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>AE TURNS</span><span>/</span><strong>{sections.find((item) => item.id === section)?.label}</strong></div>
          <div className="admin-top-actions">
            <a href="/" target="_blank" rel="noreferrer" className="preview-link">View website <span>↗</span></a>
            <button className="publish-button" type="button" onClick={saveContent} disabled={saving}>
              <span>{saving ? "Saving…" : "Publish changes"}</span><Icon name="arrow" size={16} />
            </button>
          </div>
        </header>
        <div className="admin-content">
          {error && <div className="admin-alert alert-error" role="alert">{error}</div>}
          {message && <div className="admin-alert alert-success" role="status">{message}</div>}
          {section === "overview" && <Overview content={content} setSection={setSection} />}
          {section === "company" && <CompanyEditor content={content} setContent={updateContent} />}
          {section === "solutions" && <SolutionsEditor content={content} setContent={updateContent} />}
          {section === "about" && <AboutEditor content={content} setContent={updateContent} />}
          {section === "content" && <ContentEditor content={content} setContent={updateContent} />}
          {section === "careers" && <CareersEditor content={content} setContent={updateContent} />}
          {section === "social" && <SocialEditor content={content} setContent={updateContent} />}
          <div className="admin-mobile-save">
            <button className="publish-button" type="button" onClick={saveContent} disabled={saving}>
              {saving ? "Saving…" : "Publish changes"} <Icon name="arrow" size={16} />
            </button>
          </div>
          <p className="admin-save-hint">Changes are saved to the content database and sync to the public website automatically.</p>
        </div>
      </main>
    </div>
  );
}

function AuthScreen({
  setupAvailable,
  message,
  error,
  onLogin,
  onSetup,
}: {
  setupAvailable: boolean;
  message: string;
  error: string;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onSetup: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!setupAvailable) setShowSetup(false);
  }, [setupAvailable]);

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <a className="auth-logo" href="/"><img src="/aeturns-logo.png" alt="AE Turns" /></a>
        <div className="auth-brand-copy">
          <span className="eyebrow">AE TURNS · CONTENT STUDIO</span>
          <h1>Good ideas deserve <em>great turns.</em></h1>
          <p>One calm place to shape what the world sees on your website.</p>
        </div>
        <span className="auth-copyright">AE Turns (Pvt) Ltd · 2026</span>
        <div className="auth-decoration auth-decoration-one" />
        <div className="auth-decoration auth-decoration-two" />
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <span className="auth-lock">✳</span>
          <p className="auth-overline">{showSetup ? "FIRST-TIME SETUP" : "ADMINISTRATOR ACCESS"}</p>
          <h2>{showSetup ? "Create your admin account" : "Welcome back."}</h2>
          <p className="auth-intro">{showSetup ? "Create your administrator account to start managing website content." : "Sign in to manage the AE Turns website."}</p>
          {message && <div className="admin-alert alert-success" role="status">{message}</div>}
          {error && <div className="admin-alert alert-error" role="alert">{error}</div>}
          {showSetup ? (
            <form className="auth-form" onSubmit={onSetup}>
              <label>One-time setup key<input name="setupKey" autoComplete="one-time-code" required /></label>
              <label>Admin username<input name="username" minLength={3} autoComplete="username" required /></label>
              <label>Strong password<input name="password" type="password" minLength={12} autoComplete="new-password" required /><small>Use at least 12 characters.</small></label>
              <button className="publish-button auth-submit" type="submit">Create admin account <Icon name="arrow" size={16} /></button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={onLogin}>
              <label>Username<input name="username" autoComplete="username" autoFocus required /></label>
              <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
              <button className="publish-button auth-submit" type="submit">Sign in <Icon name="arrow" size={16} /></button>
            </form>
          )}
          {setupAvailable && (
            <button className="setup-toggle" type="button" onClick={() => setShowSetup(!showSetup)}>
              {showSetup ? "Back to sign in" : "Set up the first administrator"}
            </button>
          )}
          <a className="auth-back-link" href="/">← Back to the public website</a>
        </div>
      </section>
    </main>
  );
}

function PageTitle({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="admin-page-heading">
      <span className="heading-icon">{icon}</span>
      <div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="editor-panel">
      <div className="panel-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div></div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="editor-field editor-field-full">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Overview({
  content,
  setSection,
}: {
  content: ManagedSiteContent;
  setSection: (section: SectionId) => void;
}) {
  return (
    <>
      <div className="welcome-strip"><div><span className="welcome-kicker">CONTENT OVERVIEW</span><h1>Your website, at a glance.</h1><p>Manage the content that appears across the AE Turns website.</p></div><span className="welcome-logo">ae</span></div>
      <div className="overview-stats">
        <div><span>LIVE SOLUTIONS</span><strong>{content.services.length.toString().padStart(2, "0")}</strong><small>Shown across the website</small></div>
        <div><span>PARTNERS</span><strong>{content.partners.length.toString().padStart(2, "0")}</strong><small>On the About page</small></div>
        <div><span>CUSTOMERS</span><strong>{content.customers.length.toString().padStart(2, "0")}</strong><small>Approved profiles</small></div>
        <div><span>OPEN VACANCIES</span><strong>{content.vacancies.length.toString().padStart(2, "0")}</strong><small>Shown on Careers</small></div>
      </div>
      <div className="overview-columns">
        <Panel title="Quick edits" description="Jump straight to a content section.">
          <div className="quick-edit-list">
            {sections.filter((item) => item.id !== "overview").map((item) => (
              <button key={item.id} type="button" onClick={() => setSection(item.id)}>
                <span>{item.label}</span><Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Publishing notes" description="A few details to keep your site accurate.">
          <div className="admin-notes">
            <p><span>01</span> Unconfirmed project and customer figures are clearly marked on the public site.</p>
            <p><span>02</span> Only add customer logos and details approved for publication.</p>
            <p><span>03</span> The public site checks for new content automatically after publishing.</p>
          </div>
        </Panel>
      </div>
    </>
  );
}

function CompanyEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  const companyField = (field: keyof ManagedSiteContent["company"], value: string) =>
    setContent((current) => ({ ...current, company: { ...current.company, [field]: value } }));
  const heroField = (field: keyof ManagedSiteContent["hero"], value: string) =>
    setContent((current) => ({ ...current, hero: { ...current.hero, [field]: value } }));

  return (
    <>
      <PageTitle eyebrow="BRAND & CONTACT" title="Company & pages" description="Edit the home page introduction, company details and public contact information." icon="01" />
      <Panel title="Home page introduction" description="This copy appears in the hero at the top of the public homepage.">
        <div className="editor-grid">
          <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => heroField("eyebrow", value)} />
          <Field label="Headline" value={content.hero.headline} onChange={(value) => heroField("headline", value)} />
          <TextArea label="Introduction" value={content.hero.introduction} onChange={(value) => heroField("introduction", value)} rows={3} />
        </div>
      </Panel>
      <Panel title="Company details" description="Used in the header, contact page and website footer.">
        <div className="editor-grid">
          <Field label="Company name" value={content.company.name} onChange={(value) => companyField("name", value)} />
          <Field label="Established year" value={content.company.establishedYear} onChange={(value) => companyField("establishedYear", value)} />
          <Field label="Email address" type="email" value={content.company.email} onChange={(value) => companyField("email", value)} />
          <Field label="Telephone" value={content.company.phone} onChange={(value) => companyField("phone", value)} />
          <Field label="Telephone link" value={content.company.phoneLink} onChange={(value) => companyField("phoneLink", value)} hint="Include the country code for the click-to-call link." />
          <Field label="Business hours" value={content.company.businessHours} onChange={(value) => companyField("businessHours", value)} />
          <Field label="Contact address" value={content.company.address} onChange={(value) => companyField("address", value)} />
          <Field label="Office location address" value={content.company.officeAddress} onChange={(value) => companyField("officeAddress", value)} />
          <Field label="Google Maps link" value={content.company.mapUrl} onChange={(value) => companyField("mapUrl", value)} />
        </div>
      </Panel>
    </>
  );
}

function SolutionsEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  return (
    <>
      <PageTitle eyebrow="PRODUCTS & SERVICES" title="Solutions" description="Manage the service cards shown on the homepage and Solutions page." icon="02" />
      {content.services.map((service, index) => (
        <Panel key={`${service.title}-${index}`} title={`${String(index + 1).padStart(2, "0")} · ${service.title}`}>
          <div className="editor-grid">
            <Field label="Service title" value={service.title} onChange={(value) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} />
            <Field label="Category" value={service.category} onChange={(value) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, category: value } : item) }))} />
            <label className="editor-field"><span>Icon</span><select value={service.icon} onChange={(event) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value as ManagedSiteContent["services"][number]["icon"] } : item) }))}>{["message", "ticket", "layers", "spark", "code", "megaphone", "play"].map((icon) => <option key={icon}>{icon}</option>)}</select></label>
            <TextArea label="Description" value={service.description} onChange={(value) => setContent((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex === index ? { ...item, description: value } : item) }))} rows={3} />
          </div>
          <button className="remove-button" type="button" onClick={() => setContent((current) => ({ ...current, services: current.services.filter((_, itemIndex) => itemIndex !== index) }))}>Remove solution</button>
        </Panel>
      ))}
      <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, services: [...current.services, { title: "New solution", category: "Category", description: "Add an approved solution description.", icon: "spark" }] }))}>＋ Add a solution</button>
    </>
  );
}

function AboutEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  const updateAbout = (field: keyof ManagedSiteContent["about"], value: string) =>
    setContent((current) => ({ ...current, about: { ...current.about, [field]: value } }));

  return (
    <>
      <PageTitle eyebrow="COMPANY STORY" title="About & partners" description="Manage your company story, purpose, industries and partners." icon="03" />
      <Panel title="Our story, vision & mission">
        <div className="editor-grid">
          <TextArea label="Our story" value={content.about.story} onChange={(value) => updateAbout("story", value)} rows={4} />
          <TextArea label="Vision" value={content.about.vision} onChange={(value) => updateAbout("vision", value)} rows={3} />
          <TextArea label="Mission" value={content.about.mission} onChange={(value) => updateAbout("mission", value)} rows={3} />
        </div>
      </Panel>
      <StrengthEditor content={content} setContent={setContent} />
      <StringListEditor title="Operating areas" items={content.operatingAreas} onChange={(items) => setContent((current) => ({ ...current, operatingAreas: items }))} />
      <StringListEditor title="Key partners" items={content.partners} onChange={(items) => setContent((current) => ({ ...current, partners: items }))} />
    </>
  );
}

function StrengthEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  return (
    <Panel title="Why choose AE Turns?" description="Edit the five strengths shown on the homepage.">
      {content.strengths.map((strength, index) => (
        <div className="strength-editor-row" key={`${index}-${strength.title}`}>
          <Field label="Title" value={strength.title} onChange={(value) => setContent((current) => ({ ...current, strengths: current.strengths.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} />
          <TextArea label="Description" value={strength.description} onChange={(value) => setContent((current) => ({ ...current, strengths: current.strengths.map((item, itemIndex) => itemIndex === index ? { ...item, description: value } : item) }))} rows={2} />
          <label className="editor-field"><span>Icon</span><select value={strength.icon} onChange={(event) => setContent((current) => ({ ...current, strengths: current.strengths.map((item, itemIndex) => itemIndex === index ? { ...item, icon: event.target.value as ManagedSiteContent["strengths"][number]["icon"] } : item) }))}>{["spark", "target", "chart", "support", "people"].map((icon) => <option key={icon}>{icon}</option>)}</select></label>
          <button className="icon-remove" type="button" aria-label={`Remove ${strength.title}`} onClick={() => setContent((current) => ({ ...current, strengths: current.strengths.filter((_, itemIndex) => itemIndex !== index) }))}>×</button>
        </div>
      ))}
      <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, strengths: [...current.strengths, { title: "New strength", description: "Add an approved description.", icon: "spark" }] }))}>＋ Add a strength</button>
    </Panel>
  );
}

function StringListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <Panel title={title} description="These names appear on the public About page.">
      <div className="string-list-editor">
        {items.map((item, index) => (
          <div className="string-list-row" key={`${index}-${item}`}>
            <span className="list-index">{String(index + 1).padStart(2, "0")}</span>
            <input aria-label={`${title} ${index + 1}`} value={item} onChange={(event) => onChange(items.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))} />
            <button type="button" aria-label={`Remove ${item}`} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>×</button>
          </div>
        ))}
        <button className="add-item-button" type="button" onClick={() => onChange([...items, "New item"])}>＋ Add item</button>
      </div>
    </Panel>
  );
}

function ContentEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  return (
    <>
      <PageTitle eyebrow="APPROVED PUBLIC CONTENT" title="Stats & customers" description="Update homepage statistics and customer names or logo URLs. Publish only approved figures and customer branding." icon="04" />
      <Panel title="Homepage statistics" description="Use the administration-approved figures. A value can stay as “To be confirmed” until approved.">
        <div className="editable-records">
          {content.statistics.map((statistic, index) => (
            <div className="statistic-row" key={`${index}-${statistic.label}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Field label="Label" value={statistic.label} onChange={(value) => setContent((current) => ({ ...current, statistics: current.statistics.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) }))} />
              <Field label="Value" value={statistic.value} onChange={(value) => setContent((current) => ({ ...current, statistics: current.statistics.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) }))} />
              <button className="icon-remove" type="button" aria-label={`Remove ${statistic.label}`} onClick={() => setContent((current) => ({ ...current, statistics: current.statistics.filter((_, itemIndex) => itemIndex !== index) }))}>×</button>
            </div>
          ))}
        </div>
        <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, statistics: [...current.statistics, { label: "New statistic", value: "To be confirmed" }] }))}>＋ Add statistic</button>
      </Panel>
      <Panel title="Approved customers" description="Add customer names and optional public logo image URLs.">
        {content.customers.map((customer, index) => (
          <div className="customer-editor-row" key={`${index}-${customer.name}`}>
            <Field label="Customer name" value={customer.name} onChange={(value) => setContent((current) => ({ ...current, customers: current.customers.map((item, itemIndex) => itemIndex === index ? { ...item, name: value } : item) }))} />
            <Field label="Public logo URL (optional)" value={customer.logoUrl} onChange={(value) => setContent((current) => ({ ...current, customers: current.customers.map((item, itemIndex) => itemIndex === index ? { ...item, logoUrl: value } : item) }))} hint="Use an approved image on a trusted HTTPS host." />
            <button className="icon-remove" type="button" aria-label={`Remove ${customer.name}`} onClick={() => setContent((current) => ({ ...current, customers: current.customers.filter((_, itemIndex) => itemIndex !== index) }))}>×</button>
          </div>
        ))}
        <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, customers: [...current.customers, { name: "Customer name", logoUrl: "" }] }))}>＋ Add approved customer</button>
      </Panel>
    </>
  );
}

function CareersEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  return (
    <>
      <PageTitle eyebrow="JOIN THE TEAM" title="Careers" description="Manage active job openings. The public page shows “No Current Vacancies” when there are no open roles." icon="05" />
      {content.vacancies.map((vacancy, index) => (
        <Panel key={vacancy.id} title={vacancy.title || `Vacancy ${index + 1}`}>
          <div className="editor-grid">
            <Field label="Job title" value={vacancy.title} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} />
            <Field label="Department" value={vacancy.department} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, department: value } : item) }))} />
            <Field label="Location" value={vacancy.location} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, location: value } : item) }))} />
            <Field label="Employment type" value={vacancy.employmentType} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, employmentType: value } : item) }))} />
            <TextArea label="Responsibilities (one per line)" value={vacancy.responsibilities.join("\n")} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, responsibilities: value.split("\n").filter((line) => line.trim()) } : item) }))} rows={4} />
            <TextArea label="Requirements (one per line)" value={vacancy.requirements.join("\n")} onChange={(value) => setContent((current) => ({ ...current, vacancies: current.vacancies.map((item, itemIndex) => itemIndex === index ? { ...item, requirements: value.split("\n").filter((line) => line.trim()) } : item) }))} rows={4} />
          </div>
          <button className="remove-button" type="button" onClick={() => setContent((current) => ({ ...current, vacancies: current.vacancies.filter((_, itemIndex) => itemIndex !== index) }))}>Close this vacancy</button>
        </Panel>
      ))}
      <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, vacancies: [...current.vacancies, { id: crypto.randomUUID(), title: "New role", department: "Department", location: "Nugegoda", employmentType: "Full-time", responsibilities: ["Add a responsibility"], requirements: ["Add a requirement"] }] }))}>＋ Add a vacancy</button>
    </>
  );
}

function SocialEditor({
  content,
  setContent,
}: {
  content: ManagedSiteContent;
  setContent: (updater: (value: ManagedSiteContent) => ManagedSiteContent) => void;
}) {
  return (
    <>
      <PageTitle eyebrow="FOLLOW AE TURNS" title="Social links" description="Edit the social accounts displayed on the Contact page and in the website footer." icon="06" />
      <Panel title="Social media accounts" description="Add complete HTTPS links to approved company accounts.">
        {content.socialLinks.map((social, index) => (
          <div className="social-editor-row" key={`${index}-${social.label}`}>
            <Field label="Platform" value={social.label} onChange={(value) => setContent((current) => ({ ...current, socialLinks: current.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) }))} />
            <Field label="Profile URL" type="url" value={social.url} onChange={(value) => setContent((current) => ({ ...current, socialLinks: current.socialLinks.map((item, itemIndex) => itemIndex === index ? { ...item, url: value } : item) }))} />
            <button className="icon-remove" type="button" aria-label={`Remove ${social.label}`} onClick={() => setContent((current) => ({ ...current, socialLinks: current.socialLinks.filter((_, itemIndex) => itemIndex !== index) }))}>×</button>
          </div>
        ))}
        <button className="add-item-button" type="button" onClick={() => setContent((current) => ({ ...current, socialLinks: [...current.socialLinks, { label: "New platform", url: "https://" }] }))}>＋ Add social link</button>
      </Panel>
    </>
  );
}

export default AdminApp;

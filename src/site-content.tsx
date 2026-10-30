import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  contact as fallbackContact,
  operatingAreas as fallbackAreas,
  partners as fallbackPartners,
  services as fallbackServices,
  socialLinks as fallbackSocialLinks,
  strengths as fallbackStrengths,
  vacancies as fallbackVacancies,
  type IconName,
} from "./content";

export type ManagedSiteContent = {
  company: {
    name: string;
    establishedYear: string;
    email: string;
    phone: string;
    phoneLink: string;
    address: string;
    officeAddress: string;
    businessHours: string;
    mapUrl: string;
  };
  hero: { eyebrow: string; headline: string; introduction: string };
  about: { story: string; vision: string; mission: string };
  statistics: { label: string; value: string }[];
  services: {
    title: string;
    category: string;
    description: string;
    icon: IconName;
  }[];
  strengths: { title: string; description: string; icon: IconName }[];
  operatingAreas: string[];
  partners: string[];
  customers: { name: string; logoUrl: string }[];
  vacancies: {
    id: string;
    title: string;
    department: string;
    location: string;
    employmentType: string;
    responsibilities: string[];
    requirements: string[];
  }[];
  socialLinks: { label: string; url: string }[];
};

const initialContent: ManagedSiteContent = {
  company: {
    name: fallbackContact.company,
    establishedYear: "2021",
    email: fallbackContact.email,
    phone: fallbackContact.phone,
    phoneLink: fallbackContact.phoneLink,
    address: fallbackContact.address,
    officeAddress: fallbackContact.officeAddress,
    businessHours: fallbackContact.hours,
    mapUrl: fallbackContact.mapUrl,
  },
  hero: {
    eyebrow: "AE Turns (Pvt) Ltd",
    headline: "Innovative Digital Solutions for a Smarter Future",
    introduction:
      "AE Turns delivers innovative technology and digital solutions designed to help businesses improve their operations, customer engagement and digital experiences.",
  },
  about: {
    story:
      "AE Turns is a technology and digital solutions company focused on delivering innovative solutions that help businesses improve communication, engagement and digital operations.",
    vision:
      "To become a trusted technology partner delivering innovative digital solutions that create lasting value for businesses and their customers.",
    mission:
      "To provide reliable, innovative and customer-focused technology solutions that address real business challenges and support sustainable digital growth.",
  },
  statistics: [
    { label: "Established", value: "2021" },
    { label: "Successful projects", value: "To be confirmed" },
    { label: "Customers & clients", value: "To be confirmed" },
    { label: "Solutions delivered", value: "To be confirmed" },
  ],
  services: [...fallbackServices],
  strengths: [...fallbackStrengths],
  operatingAreas: [...fallbackAreas],
  partners: [...fallbackPartners],
  customers: [],
  vacancies: [...fallbackVacancies],
  socialLinks: [...fallbackSocialLinks],
};

const SiteContentContext = createContext<{
  content: ManagedSiteContent;
  apiAvailable: boolean;
}>({ content: initialContent, apiAvailable: true });

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(initialContent);
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    let active = true;
    let lastUpdatedAt = "";
    let request: AbortController | undefined;

    async function refresh() {
      request?.abort();
      request = new AbortController();
      try {
        const response = await fetch("/api/content", { signal: request.signal });
        if (!response.ok) {
          throw new Error(`Content API returned ${response.status}.`);
        }
        const result = (await response.json()) as {
          content: ManagedSiteContent;
          updatedAt: string;
        };
        if (active && result.updatedAt !== lastUpdatedAt) {
          lastUpdatedAt = result.updatedAt;
          setContent(result.content);
        }
        if (active) setApiAvailable(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (active) setApiAvailable(false);
        console.error("Unable to load current website content from the API.", error);
      }
    }

    void refresh();
    const interval = window.setInterval(() => void refresh(), 2500);
    return () => {
      active = false;
      window.clearInterval(interval);
      request?.abort();
    };
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, apiAvailable }}>
      {!apiAvailable && (
        <div className="api-warning" role="status">
          Showing built-in content while the content server is unavailable.
        </div>
      )}
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}

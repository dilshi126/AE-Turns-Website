import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(1000),
  icon: z.enum([
    "message",
    "ticket",
    "layers",
    "spark",
    "code",
    "megaphone",
    "play",
  ]),
});

const strengthSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  icon: z.enum(["spark", "target", "chart", "support", "people"]),
});

const vacancySchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  department: z.string().trim().min(1).max(120),
  location: z.string().trim().min(1).max(120),
  employmentType: z.string().trim().min(1).max(80),
  responsibilities: z.array(z.string().trim().min(1).max(400)).min(1).max(20),
  requirements: z.array(z.string().trim().min(1).max(400)).min(1).max(20),
});

const externalUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "URLs must use HTTPS.");

export const siteContentSchema = z.object({
  company: z.object({
    name: z.string().trim().min(1).max(120),
    establishedYear: z.string().trim().min(4).max(4),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(1).max(40),
    phoneLink: z.string().trim().regex(/^\+?[0-9\s()-]{7,25}$/),
    address: z.string().trim().min(1).max(240),
    officeAddress: z.string().trim().min(1).max(240),
    businessHours: z.string().trim().min(1).max(120),
    mapUrl: externalUrlSchema,
  }),
  hero: z.object({
    eyebrow: z.string().trim().min(1).max(100),
    headline: z.string().trim().min(1).max(180),
    introduction: z.string().trim().min(1).max(1000),
  }),
  about: z.object({
    story: z.string().trim().min(1).max(2000),
    vision: z.string().trim().min(1).max(1200),
    mission: z.string().trim().min(1).max(1200),
  }),
  statistics: z.array(z.object({
    label: z.string().trim().min(1).max(80),
    value: z.string().trim().min(1).max(40),
  })).max(12),
  services: z.array(serviceSchema).max(30),
  strengths: z.array(strengthSchema).max(20),
  operatingAreas: z.array(z.string().trim().min(1).max(120)).max(30),
  partners: z.array(z.string().trim().min(1).max(120)).max(30),
  customers: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    logoUrl: z.string().trim().max(1000),
  })).max(100),
  vacancies: z.array(vacancySchema).max(50),
  socialLinks: z.array(z.object({
    label: z.string().trim().min(1).max(40),
    url: externalUrlSchema,
  })).max(20),
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const defaultContent: SiteContent = {
  company: {
    name: "AE Turns (Pvt) Ltd",
    establishedYear: "2021",
    email: "info@aeturns.com",
    phone: "071 294 6950",
    phoneLink: "+94712946950",
    address: "No 66/A, Udahamulla Road, Nugegoda",
    officeAddress: "No 242, Devika Gardens, Colombo 05",
    businessHours: "Weekdays, 9 am to 5 pm",
    mapUrl: "https://maps.app.goo.gl/BTsPSot6C9ULFh4D7",
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
  services: [
    {
      title: "Bulk SMS & WhatsApp Solutions",
      category: "Business communication",
      description:
        "Reliable messaging solutions that help businesses communicate with their customers quickly and effectively through SMS and WhatsApp.",
      icon: "message",
    },
    {
      title: "Online Lottery & Gaming Solutions",
      category: "Digital platforms",
      description:
        "Secure and scalable digital lottery and gaming platforms designed to provide seamless user experiences and efficient operations.",
      icon: "ticket",
    },
    {
      title: "VAS Product Development",
      category: "Value-added services",
      description:
        "Development of innovative Value-Added Services that enhance customer engagement and create new digital opportunities.",
      icon: "layers",
    },
    {
      title: "Interactive Platform Development",
      category: "Interactive experiences",
      description:
        "Custom interactive platforms, games and digital experiences designed to increase customer engagement and user retention.",
      icon: "spark",
    },
    {
      title: "Web & IT Solutions",
      category: "Web systems",
      description:
        "Modern, secure and scalable websites and IT solutions designed to support business operations and digital transformation.",
      icon: "code",
    },
    {
      title: "Digital Marketing",
      category: "Digital experiences",
      description:
        "Digital marketing is included in our proposed service offering. Further approved service details will be added when confirmed.",
      icon: "megaphone",
    },
    {
      title: "Interactive Video Platform",
      category: "Interactive experiences",
      description:
        "An interactive video platform is included in our proposed service offering. Further approved details will be added when confirmed.",
      icon: "play",
    },
  ],
  strengths: [
    {
      title: "Innovative Technology",
      description:
        "We use modern technologies and innovative approaches to create effective digital solutions.",
      icon: "spark",
    },
    {
      title: "Customized Solutions",
      description:
        "Our solutions are designed according to the specific requirements and objectives of each client.",
      icon: "target",
    },
    {
      title: "Industry Experience",
      description:
        "Our experienced team understands business requirements and delivers practical technology solutions.",
      icon: "chart",
    },
    {
      title: "End-to-End Support",
      description:
        "We provide continuous support throughout the implementation and operation of our solutions.",
      icon: "support",
    },
    {
      title: "Customer-Focused Approach",
      description:
        "We work closely with our clients to understand their needs and deliver solutions that create value.",
      icon: "people",
    },
  ],
  operatingAreas: [
    "Bulk SMS & WhatsApp",
    "Digital Marketing",
    "Interactive Platforms",
    "Web Systems",
    "VAS Products & Aggregator",
    "Online Lottery",
  ],
  partners: ["Winner Digital (PVT) LTD", "Dialog", "Mobitel", "Hutch"],
  customers: [],
  vacancies: [],
  socialLinks: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/aeturnspvtltd/",
    },
    { label: "Facebook", url: "https://www.facebook.com/aeturns" },
    { label: "Instagram", url: "https://www.instagram.com/ae_turns/" },
    { label: "YouTube", url: "https://www.youtube.com/@AeTurns" },
    { label: "TikTok", url: "https://www.tiktok.com/@aeturns_lk" },
  ],
};

export function parseContent(serialized: string | undefined): SiteContent {
  if (!serialized) return defaultContent;
  try {
    return siteContentSchema.parse(JSON.parse(serialized));
  } catch (error) {
    console.error("Stored website content is invalid; using built-in defaults.", error);
    return defaultContent;
  }
}

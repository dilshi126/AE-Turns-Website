export const navigation = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Solutions", to: "/solutions" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
] as const;

export const contact = {
  company: "AE Turns (Pvt) Ltd",
  address: "No 66/A, Udahamulla Road, Nugegoda",
  phone: "071 294 6950",
  phoneLink: "+94712946950",
  email: "info@aeturns.com",
  hours: "Weekdays, 9 am to 5 pm",
  officeAddress: "No 242, Devika Gardens, Colombo 05",
  mapUrl: "https://maps.app.goo.gl/BTsPSot6C9ULFh4D7",
} as const;

export const socialLinks = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/aeturnspvtltd/",
  },
  { label: "Facebook", url: "https://www.facebook.com/aeturns" },
  { label: "Instagram", url: "https://www.instagram.com/ae_turns/" },
  { label: "YouTube", url: "https://www.youtube.com/@AeTurns" },
  { label: "TikTok", url: "https://www.tiktok.com/@aeturns_lk" },
] as const;

export const services = [
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
] as const;

export const strengths = [
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
] as const;

export const operatingAreas = [
  "Bulk SMS & WhatsApp",
  "Digital Marketing",
  "Interactive Platforms",
  "Web Systems",
  "VAS Products & Aggregator",
  "Online Lottery",
] as const;

export const partners = [
  "Winner Digital (PVT) LTD",
  "Dialog",
  "Mobitel",
  "Hutch",
] as const;

export type Vacancy = {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  responsibilities: string[];
  requirements: string[];
};

export const vacancies: Vacancy[] = [];

export const solutions = services.map((service, index) => ({
  ...service,
  number: `0${index + 1}`,
}));

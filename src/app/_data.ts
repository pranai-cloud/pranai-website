import {
  Clock,
  Globe,
  IndianRupee,
  Users,
  Upload,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const roles = [
  "Customer Support Representative",
  "Business Development Representative",
  "Front Desk Receptionist",
  "Technical Support",
  "Lead Qualifier",
] as const;

export const indianLanguages = [
  "বাংলা", // Bengali
  "ગુજરાતી", // Gujarati
  "हिंदी", // Hindi
  "ಕನ್ನಡ", // Kannada
  "മലയാളം", // Malayalam
  "मराठी", // Marathi
  "ਪੰਜਾਬੀ", // Punjabi
  "தமிழ்", // Tamil
  "తెలుగు", // Telugu
] as const;

export const globalLanguages = [
  "العربية", // Arabic
  "Български", // Bulgarian
  "中文", // Chinese
  "Hrvatski", // Croatian
  "Čeština", // Czech
  "Dansk", // Danish
  "Nederlands", // Dutch
  "English", // English
  "Suomi", // Finnish
  "Français", // French
  "ქართული", // Georgian
  "Deutsch", // German
  "Ελληνικά", // Greek
  "עברית", // Hebrew
  "Magyar", // Hungarian
  "Bahasa Indonesia", // Indonesian
  "Italiano", // Italian
  "日本語", // Japanese
  "한국어", // Korean
  "Bahasa Melayu", // Malay
  "Norsk", // Norwegian
  "Polski", // Polish
  "Português", // Portuguese
  "Română", // Romanian
  "Русский", // Russian
  "Slovenčina", // Slovak
  "Español", // Spanish
  "Svenska", // Swedish
  "Tagalog", // Tagalog
  "ไทย", // Thai
  "Türkçe", // Turkish
  "Українська", // Ukrainian
  "Tiếng Việt", // Vietnamese
] as const;

export const languages = [...indianLanguages, "English"];

export interface PainPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const painPoints: PainPoint[] = [
  {
    icon: Clock,
    title: "After-hours black hole",
    description:
      "68% of Indian businesses miss customer calls outside 9-to-5. Every unanswered ring is revenue walking out the door.",
  },
  {
    icon: Globe,
    title: "Language barrier, lost trust",
    description:
      "Hiring multilingual agents for 7+ regional languages is nearly impossible. Customers abandon brands that can't speak their tongue.",
  },
  {
    icon: IndianRupee,
    title: "Scaling costs explode",
    description:
      "A single multilingual rep costs ₹4–6L/year. Scaling a 24/7 team across languages quickly becomes your biggest line item.",
  },
];

export const metrics = [
  { value: "0.0s", label: "Lead Leakage" },
  { value: "7+", label: "Native Languages Supported" },
  { value: "<500ms", label: "Voice Latency" },
  { value: "24/7/365", label: "Uptime" },
] as const;

export interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    number: "01",
    icon: Users,
    title: "Select Role",
    description:
      "Choose Customer Support or SDR. Each role comes pre-configured with industry-specific conversation patterns.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Train on Your Data",
    description:
      "Upload your FAQs, website URLs, or product catalogs. Our models learn your business in minutes, not weeks.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Go Live",
    description:
      "We give you a dedicated phone number and a web widget. Your AI agent is instantly hired and ready to work.",
  },
];

export interface FAQ {
  q: string;
  a: string;
}

export const faqs: FAQ[] = [
  {
    q: "Does it sound like a robot?",
    a: "No. Pran.ai uses state-of-the-art regional voice models that sound indistinguishable from a native speaker. We fine-tune on real conversational data so intonation, pauses, and fillers feel completely natural.",
  },
  {
    q: "What if the AI doesn't know the answer?",
    a: "It gracefully escalates the call or chat to your human team with a full transcript and context summary—so your agents pick up right where the AI left off, with zero repetition for the customer.",
  },
  {
    q: "How do we integrate it?",
    a: "Zero coding required. We provide a drop-in phone number and a lightweight JavaScript widget for your website. Most teams go live the same day.",
  },
];

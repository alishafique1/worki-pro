import type { ReactNode } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Hammer,
  Home,
  KeyRound,
  Layers,
  Leaf,
  Bell,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
  ShowerHead,
  Wifi,
} from "lucide-react";

export const painPoints = [
  {
    icon: <Clock3 className="size-5" />,
    title: "Calling 5 pros and getting 2 callbacks",
    description: "Half the pros you call do not answer. The other half ghost after the quote.",
  },
  {
    icon: <ClipboardList className="size-5" />,
    title: "Same job, explained 3 times",
    description: "Text, then call, then email. The details get lost between channels.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "Pro does not show up",
    description: "You blocked the afternoon. The pro cancels 30 minutes before. Day wasted.",
  },
  {
    icon: <MessageSquareText className="size-5" />,
    title: "Details scattered everywhere",
    description: "Photos on WhatsApp, voice notes on iMessage, quote in your email. None of it connects.",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Not sure which pro to call",
    description: "Is it plumbing or handyman? HVAC or electrical? The job does not fit one category.",
  },
  {
    icon: <BellIcon />,
    title: "No follow-up after the job",
    description: "You pay, they leave, and there is no record of the work or who to call if something breaks.",
  },
];

function BellIcon() {
  return <Bell className="size-5" />;
}

export const solutionSteps = [
  {
    icon: <Search className="size-5" />,
    title: "Submit",
    description: "Tell us what's broken. Add photos if needed. Takes under 2 minutes. 100% free for homeowners.",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Match",
    description:
      "We connect you with a verified local pro who's available today. No calling around.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "Book",
    description: "Pick a time that works. Same-day service available for urgent jobs like a broken AC or a leak. No-shows are rare.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Done",
    description: "Job complete. Leave a review. Earn 6,000 pts on your first completed job (≈ $60 in gift cards). Redeemable once you hit 10,000 pts.",
  },
];

export const categoryImages: Record<string, string> = {
  handyman: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  hvac: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
  plumbing: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
  "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
};

export interface Category {
  icon: ReactNode;
  name: string;
  slug: string;
  description: string;
  href?: string;
  imageUrl?: string;
  live?: boolean;
  comingSoon?: boolean;
}

export const categories: Category[] = [
  {
    icon: <Hammer className="size-5" />,
    name: "Handyman",
    slug: "handyman",
    description: "Repairs, mounting, assembly, small projects, and punch lists.",
    href: "/services/handyman",
    imageUrl: categoryImages.handyman,
    live: true,
  },
  {
    icon: <ShowerHead className="size-5" />,
    name: "HVAC",
    slug: "hvac",
    description: "Heating, cooling, furnace, AC repair, and air quality.",
    href: "/services/hvac",
    imageUrl: categoryImages.hvac,
    live: true,
  },
  {
    icon: <Wifi className="size-5" />,
    name: "Plumbing",
    slug: "plumbing",
    description: "Leaks, fixtures, drains, water heaters, and urgent repairs.",
    href: "/services/plumbing",
    imageUrl: categoryImages.plumbing,
    live: true,
  },
  {
    icon: <Home className="size-5" />,
    name: "Smart Home",
    slug: "smart-home",
    description: "Cameras, thermostats, locks, sensors, and connected devices.",
    href: "/services/smart-home",
    imageUrl: categoryImages["smart-home"],
    live: true,
  },
  {
    icon: <CalendarCheck className="size-5" />,
    name: "Event Management",
    slug: "event-management",
    description: "Event planning, setup, coordination, and day-of management. Coming Q1 2026.",
    comingSoon: true,
  },
  {
    icon: <Layers className="size-5" />,
    name: "IT Services",
    slug: "it-services",
    description: "AI solutions, website design, and digital tools for your business. Coming Q1 2026.",
    comingSoon: true,
  },
  {
    icon: <KeyRound className="size-5" />,
    name: "Rental Services",
    slug: "rental-services",
    description: "Shisha, event equipment, and party rentals. Coming Q1 2026.",
    comingSoon: true,
  },
];

export const customerSteps = [
  {
    step: "01",
    title: "Submit your request",
    description:
      "Takes under 2 minutes. Tell us what's broken. 100% free, no credit card needed.",
  },
  {
    step: "02",
    title: "Get matched fast",
    description: "A verified local pro responds quickly. No calling around.",
  },
  {
    step: "03",
    title: "Book a time that works",
    description: "Same-day for urgent jobs like a broken AC or a leak. Or schedule a window that fits your week.",
  },
  {
    step: "04",
    title: "Job done. Earn rewards.",
    description: "6,000 pts on your first completed job (≈ $60 in gift cards). Redeemable once you hit 10,000 pts.",
  },
];

export const providerSteps = [
  {
    step: "01",
    title: "Create your profile",
    description: "Show your services, areas, credentials, and availability.",
  },
  {
    step: "02",
    title: "Receive qualified leads",
    description: "Receive requests for supported categories and service areas.",
  },
  {
    step: "03",
    title: "Schedule the job",
    description: "Confirm the appointment and keep the customer updated.",
  },
  {
    step: "04",
    title: "Manage the work",
    description: "Keep accepted requests, appointments, and updates organized.",
  },
];

export const internalFeatures = [
  {
    icon: <ClipboardList className="size-5" />,
    title: "Structured intake",
    description: "The live form captures the essentials before a request is sent.",
  },
  {
    icon: <Search className="size-5" />,
    title: "Category clarity",
    description: "Supported service types mirror the request form categories.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Service-area context",
    description:
      "Postal code and category details help The Helper understand where coverage is needed.",
  },
  {
    icon: <Clock3 className="size-5" />,
    title: "Future internal assistance",
    description:
      "Automation may support internal request triage later, but it is not presented as a customer-facing promise.",
  },
];

export const trustFeatures = [
  {
    icon: <ShieldCheck className="size-5" />,
    title: "Verified providers",
    description:
      "Profiles can include business details, service categories, service areas, and approval status.",
  },
  {
    icon: <ClipboardList className="size-5" />,
    title: "Service records",
    description:
      "Request and appointment history can stay tied to the customer account.",
  },
  {
    icon: <MessageSquareText className="size-5" />,
    title: "Clear communication",
    description:
      "Booking details, messages, and status updates stay connected to the job.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Local-first marketplace",
    description:
      "The Helper starts city by city, building supply quality before scaling.",
  },
];

export const providerBenefits = [
  {
    title: "Leads that are ready to book",
    description: "Every lead comes from a homeowner who submitted a specific request. No cold calls. No tyre-kickers.",
  },
  {
    title: "Only jobs that fit your business",
    description: "Set your service categories and coverage area. You only receive requests that match.",
  },
  {
    title: "Less admin, more jobs",
    description:
      "Requests, scheduling, messages, and follow-ups in one dashboard. Stop managing five apps.",
  },
  {
    title: "Reviews that build your business",
    description:
      "Every completed job can generate a verified review. Builds trust and helps you rank higher over time.",
  },
];

export const faqs = [
  {
    question: "Is The Helper free for homeowners?",
    answer:
      "Yes. Submitting a request and getting matched costs nothing. You pay the pro directly for the work. No platform fee, no hidden charges, no subscription.",
  },
  {
    question: "How fast will I get matched?",
    answer:
      "Most homeowners get matched with a verified local pro within the hour of submitting. For urgent jobs like a broken AC or a leak, same-day service is often available. The system notifies nearby pros as soon as your request comes in.",
  },
  {
    question: "How do I know the pro is actually verified?",
    answer:
      "Every pro goes through a review before they can accept jobs. We check business credentials, insurance status, and service area. Only approved pros appear on the platform. Reviews only post after a job is completed and confirmed.",
  },
  {
    question: "Where is The Helper available?",
    answer:
      "We currently serve Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton. More GTA cities are being added. Enter your postal code on the request form to confirm coverage in your area.",
  },
  {
    question: "What if the pro does not show up or the work is not done right?",
    answer:
      "Contact our support team. We will help you get a resolution, including re-matching you with another verified pro at no extra cost. Every job is tracked so there is a clear record of what was booked and agreed.",
  },
  {
    question: "How do the rewards work?",
    answer:
      "You earn points automatically at each step. 500 pts when you submit a request. 500 pts when you book. 5,000 pts when your first job is completed. Refer a friend and both of you earn 500 pts when they submit their first request. Redeem as gift cards once you hit 10,000 pts (≈ $100).",
  },
  {
    question: "I already have a guy I call. Why use The Helper?",
    answer:
      "Your regular pro is great when they are available. The Helper fills the gaps: when your usual contact is booked, when you need a second opinion on a quote, or when you need a service category they do not cover. No commitment required.",
  },
];

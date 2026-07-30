import type { ReactNode } from "react";
import {
  BadgeCheck,
  Bot,
  CalendarCheck,
  Car,
  Clapperboard,
  ClipboardList,
  Clock3,
  Code,
  Flame,
  Globe,
  Hammer,
  Home,
  KeyRound,
  Layers,
  Leaf,
  Bell,
  MapPin,
  Megaphone,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  ShowerHead,
  Thermometer,
  UtensilsCrossed,
  Wifi,
  Zap,
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
      "We connect you with a verified local pro who is available today. Often within 15 minutes. No calling around.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "Book",
    description: "Pick a time that works. Same-day service available for urgent jobs like a broken AC or a leak. No-shows are rare.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Done",
    description: "Job complete. Leave a review. Earn $60+ cash back on your first completed job. Redeemable as gift cards.",
  },
];

// Unsplash image URLs for each service category
export const categoryImages: Record<string, string> = {
  hvac: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=300&fit=crop",
  electrical: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  handyman: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop",
  plumbing: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
  "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
  events: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop",
  "food-catering": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  "shisha-lounge": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
  "ai-services": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=300&fit=crop",
  "website-design": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
  "digital-marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  "software-development": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
  "video-editing": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
  "driving-school": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
};

export interface Category {
  icon: ReactNode;
  name: string;
  slug: string;
  description: string;
  href: string;
  imageUrl?: string;
  live?: boolean;
  comingSoon?: boolean;
}

export const categories: Category[] = [
  {
    icon: <Thermometer className="size-5" />,
    name: "HVAC",
    slug: "hvac",
    description: "AC repair, furnace service, and emergency heat calls. Describe the issue and postal code. Most requests answered and booked within 24 hours.",
    href: "/services/hvac",
    imageUrl: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&h=300&fit=crop",
    live: true,
  },
  {
    icon: <Zap className="size-5" />,
    name: "Electrical",
    slug: "electrical",
    description: "Panels, outlets, fixtures, and safety upgrades. Licensed electricians only. Submit your job and get a response within 24 hours.",
    href: "/services/electrical",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    live: true,
  },
  {
    icon: <Hammer className="size-5" />,
    name: "Handyman",
    slug: "handyman",
    description: "Mounting, repairs, assembly, and small jobs. Tell us what needs fixing. Most requests answered and booked within 24 hours.",
    href: "/services/handyman",
    imageUrl: categoryImages.handyman,
    live: true,
  },
  {
    icon: <ShowerHead className="size-5" />,
    name: "Plumbing",
    slug: "plumbing",
    description: "Active leaks, drain clogs, fixture installs, and hot water repairs. Describe the problem and get matched with a local plumber.",
    href: "/services/plumbing",
    imageUrl: categoryImages.plumbing,
    live: true,
  },
  {
    icon: <Wifi className="size-5" />,
    name: "Smart Home",
    slug: "smart-home",
    description: "Cameras, thermostats, locks, and connected devices. Tell us what you are installing and a certified tech will confirm your setup.",
    href: "/services/smart-home",
    imageUrl: categoryImages["smart-home"],
    live: true,
  },
  {
    icon: <CalendarCheck className="size-5" />,
    name: "Events",
    slug: "events",
    description: "Planning, setup, and day-of coordination. Share your event size and date and get proposals from local event pros.",
    href: "/services/events",
    imageUrl: categoryImages.events,
    live: true,
  },
  {
    icon: <UtensilsCrossed className="size-5" />,
    name: "Food Catering",
    slug: "food-catering",
    description: "Private dining, food trucks, and custom menus. Share your guest count and date and caterers respond with packages.",
    href: "/services/food-catering",
    imageUrl: categoryImages["food-catering"],
    live: true,
  },
  {
    icon: <Flame className="size-5" />,
    name: "Shisha Lounge",
    slug: "shisha-lounge",
    description: "Shisha setup and rental for events and private gatherings. Tell us your event date and location. Setup handled from delivery to teardown.",
    href: "/services/shisha-lounge",
    imageUrl: categoryImages["shisha-lounge"],
    live: true,
  },
  {
    icon: <Bot className="size-5" />,
    name: "AI Services",
    slug: "ai-services",
    description: "Chatbots, automations, and workflow tools. Describe your business process and get matched with an AI specialist.",
    href: "/services/ai-services",
    imageUrl: categoryImages["ai-services"],
    live: true,
  },
  {
    icon: <Globe className="size-5" />,
    name: "Website Design",
    slug: "website-design",
    description: "Custom sites, landing pages, and brand design. Share your vision and designers respond with portfolios and quotes.",
    href: "/services/website-design",
    imageUrl: categoryImages["website-design"],
    live: true,
  },
  {
    icon: <Megaphone className="size-5" />,
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, paid ads, and social growth. Describe your goals and budget and get matched with a specialist who knows your market.",
    href: "/services/digital-marketing",
    imageUrl: categoryImages["digital-marketing"],
    live: true,
  },
  {
    icon: <Code className="size-5" />,
    name: "Software Development",
    slug: "software-development",
    description: "Web apps, integrations, and custom tools. Describe what you want to build and a developer will scope it before any commitment.",
    href: "/services/software-development",
    imageUrl: categoryImages["software-development"],
    live: true,
  },
  {
    icon: <Clapperboard className="size-5" />,
    name: "Video Editing",
    slug: "video-editing",
    description: "Reels, promos, and short-form content. Share your raw footage or brief and an editor confirms turnaround before starting.",
    href: "/services/video-editing",
    imageUrl: categoryImages["video-editing"],
    live: true,
  },
  {
    icon: <Car className="size-5" />,
    name: "Driving School",
    slug: "driving-school",
    description: "Licensed in-car lessons and beginner driver courses. Tell us your availability and get matched with a certified instructor.",
    href: "/services/driving-school",
    imageUrl: categoryImages["driving-school"],
    live: true,
  },
  {
    icon: <Plus className="size-5" />,
    name: "More",
    slug: "more",
    description: "More services coming soon. Submit any request to get started.",
    href: "/get-quotes",
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
    description: "We review your request and contact verified pros who cover your area. Most requests are answered and booked within 24 hours.",
  },
  {
    step: "03",
    title: "Book a time that works",
    description: "Same-day for urgent jobs like a broken AC or a leak. Or schedule a window that fits your week.",
  },
  {
    step: "04",
    title: "Job done. Earn rewards.",
    description: "$60+ cash back on your first completed job. Redeemable as gift cards at $100.",
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
      "Most homeowners get matched with a verified local pro within 15 minutes of submitting. For urgent jobs like a broken AC or a leak, same-day service is often available. The system notifies nearby pros as soon as your request comes in.",
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
      "You earn points automatically at each step. $5 when you submit a request. $5 when you book. $50 when your first job is completed. Refer a friend and both of you earn $5 when they submit their first request. Redeem as gift cards once you hit $100.",
  },
  {
    question: "I already have a guy I call. Why use The Helper?",
    answer:
      "Your regular pro is great when they are available. The Helper fills the gaps: when your usual contact is booked, when you need a second opinion on a quote, or when you need a service category they do not cover. No commitment required.",
  },
];

import {
  AirVent,
  BadgeCheck,
  Brush,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Droplets,
  Hammer,
  Home,
  KeyRound,
  Layers,
  Leaf,
  Bell,
  MapPin,
  MessageSquareText,
  MoveRight,
  Package,
  PartyPopper,
  PlugZap,
  Plus,
  Search,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Trash2,
  TreePine,
  WashingMachine,
  Wind,
  Wrench,
} from "lucide-react";

export const painPoints = [
  {
    icon: <Clock3 className="size-5" />,
    title: "Missed calls",
    description: "You explain the same job again and again.",
  },
  {
    icon: <ClipboardList className="size-5" />,
    title: "Incomplete details",
    description: "Important job context gets missed in calls and texts.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "No-shows",
    description: "Your day gets blocked, then the provider disappears.",
  },
  {
    icon: <MessageSquareText className="size-5" />,
    title: "Scattered messages",
    description: "Details live across texts, calls, WhatsApp, and email.",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Unclear fit",
    description: "It is not always obvious which service category to request.",
  },
  {
    icon: <BellIcon />,
    title: "Poor follow-up",
    description: "You are left chasing updates after requesting help.",
  },
];

function BellIcon() {
  return <Bell className="size-5" />;
}

export const solutionSteps = [
  {
    icon: <Search className="size-5" />,
    title: "Submit",
    description: "Tell us what you need in under 2 minutes. 100% free for homeowners.",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Match",
    description:
      "We connect you with a verified local pro, often within 15 minutes.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "Book",
    description: "Pick a time that works. Same-day service available for urgent jobs.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Done",
    description: "Job complete. Leave a review and earn reward points automatically.",
  },
];

// Unsplash image URLs for each service category
export const categoryImages: Record<string, string> = {
  hvac: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop",
  plumbing: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
  electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
  "appliance-repair": "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop",
  handyman: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=300&fit=crop",
  "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
  painting: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
  flooring: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&h=300&fit=crop",
  roofing: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=400&h=300&fit=crop",
  landscaping: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400&h=300&fit=crop",
  "snow-removal": "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=300&fit=crop",
  "tree-services": "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=300&fit=crop",
  locksmith: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "window-cleaning": "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=400&h=300&fit=crop",
  moving: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop",
  "garage-door": "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=400&h=300&fit=crop",
  "junk-removal": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop",
  events: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
};

export const categories = [
  {
    icon: <AirVent className="size-5" />,
    name: "HVAC",
    slug: "hvac",
    description: "Repairs, tune-ups, installs, and seasonal maintenance.",
    href: "/services/hvac",
    imageUrl: categoryImages.hvac,
    live: true,
  },
  {
    icon: <ShowerHead className="size-5" />,
    name: "Plumbing",
    slug: "plumbing",
    description: "Leaks, fixtures, drains, water heaters, and urgent repairs.",
    href: "/services/plumbing",
    imageUrl: categoryImages.plumbing,
    live: true,
  },
  {
    icon: <PlugZap className="size-5" />,
    name: "Electrical",
    slug: "electrical",
    description: "Panels, outlets, fixtures, safety checks, and installations.",
    href: "/services/electrical",
    imageUrl: categoryImages.electrical,
    live: true,
  },
  {
    icon: <WashingMachine className="size-5" />,
    name: "Appliance Repair",
    slug: "appliance-repair",
    description: "Kitchen, laundry, diagnosis, repair, and replacement support.",
    href: "/services/appliance-repair",
    imageUrl: categoryImages["appliance-repair"],
    live: true,
  },
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
    icon: <Wrench className="size-5" />,
    name: "Smart Home",
    slug: "smart-home",
    description: "Cameras, thermostats, locks, sensors, and connected devices.",
    href: "/services/smart-home",
    imageUrl: categoryImages["smart-home"],
    live: true,
  },
  {
    icon: <Sparkles className="size-5" />,
    name: "Cleaning",
    slug: "cleaning",
    description: "Regular, deep clean, move-in/out, and post-reno cleans.",
    href: "/services/cleaning",
    imageUrl: categoryImages.cleaning,
    comingSoon: true,
  },
  {
    icon: <Brush className="size-5" />,
    name: "Painting",
    slug: "painting",
    description: "Interior and exterior painting, colour consultation, touch-ups.",
    href: "/services/painting",
    imageUrl: categoryImages.painting,
    comingSoon: true,
  },
  {
    icon: <Layers className="size-5" />,
    name: "Flooring",
    slug: "flooring",
    description: "Hardwood, tile, laminate, vinyl plank, and carpet install.",
    href: "/services/flooring",
    imageUrl: categoryImages.flooring,
    comingSoon: true,
  },
  {
    icon: <Home className="size-5" />,
    name: "Roofing",
    slug: "roofing",
    description: "Shingle repair, full replacement, flat roofs, and inspections.",
    href: "/services/roofing",
    imageUrl: categoryImages.roofing,
    comingSoon: true,
  },
  {
    icon: <Leaf className="size-5" />,
    name: "Landscaping",
    slug: "landscaping",
    description: "Lawn care, garden beds, interlocking, and spring/fall cleanup.",
    href: "/services/landscaping",
    imageUrl: categoryImages.landscaping,
    comingSoon: true,
  },
  {
    icon: <Wind className="size-5" />,
    name: "Snow Removal",
    slug: "snow-removal",
    description: "Driveway and walkway clearing, salting, and seasonal contracts.",
    href: "/services/snow-removal",
    imageUrl: categoryImages["snow-removal"],
    comingSoon: true,
  },
  {
    icon: <TreePine className="size-5" />,
    name: "Tree Services",
    slug: "tree-services",
    description: "Trimming, removal, stump grinding, and emergency tree work.",
    href: "/services/tree-services",
    imageUrl: categoryImages["tree-services"],
    comingSoon: true,
  },
  {
    icon: <KeyRound className="size-5" />,
    name: "Locksmith",
    slug: "locksmith",
    description: "Lock changes, emergency entry, rekeying, and deadbolt install.",
    href: "/services/locksmith",
    imageUrl: categoryImages.locksmith,
    comingSoon: true,
  },
  {
    icon: <Droplets className="size-5" />,
    name: "Window Cleaning",
    slug: "window-cleaning",
    description: "Interior and exterior window washing, screens, and tracks.",
    href: "/services/window-cleaning",
    imageUrl: categoryImages["window-cleaning"],
    comingSoon: true,
  },
  {
    icon: <MoveRight className="size-5" />,
    name: "Moving",
    slug: "moving",
    description: "Local moves, packing, furniture assembly, and junk removal.",
    href: "/services/moving",
    imageUrl: categoryImages.moving,
    comingSoon: true,
  },
  {
    icon: <Package className="size-5" />,
    name: "Garage Door",
    slug: "garage-door",
    description: "Spring repair, opener install, panel replacement, and tune-up.",
    href: "/services/garage-door",
    imageUrl: categoryImages["garage-door"],
    comingSoon: true,
  },
  {
    icon: <Trash2 className="size-5" />,
    name: "Junk Removal",
    slug: "junk-removal",
    description: "Furniture, appliances, renovation debris, and estate cleanouts.",
    href: "/services/junk-removal",
    imageUrl: categoryImages["junk-removal"],
    comingSoon: true,
  },
  {
    icon: <PartyPopper className="size-5" />,
    name: "Events",
    slug: "events",
    description: "Event setup, rentals, photography, and day-of coordination.",
    href: "/services/events",
    imageUrl: categoryImages.events,
    comingSoon: true,
  },
  {
    icon: <Plus className="size-5" />,
    name: "More",
    slug: "more",
    description: "Pest control, renovation, pool, waterproofing, and more.",
    href: "/request-service",
  },
];

export const customerSteps = [
  {
    step: "01",
    title: "Submit your request",
    description:
      "Takes under 2 minutes. 100% free, no credit card needed.",
  },
  {
    step: "02",
    title: "Get matched fast",
    description: "A verified local pro responds, typically within 15 minutes.",
  },
  {
    step: "03",
    title: "Book same-day or later",
    description: "Pick a time that works. Urgent? Same-day service available.",
  },
  {
    step: "04",
    title: "Job done. Get rewarded.",
    description: "Earn $60+ back on your first completed job. No extra steps.",
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
    title: "Receive service requests",
    description: "Connect with homeowners who submit supported request types.",
  },
  {
    title: "Category and area fit",
    description: "Apply for the services and locations your business supports.",
  },
  {
    title: "Reduce admin",
    description:
      "Keep requests, appointments, messages, and follow-ups organized in one flow.",
  },
  {
    title: "Build local visibility",
    description:
      "Use a clear profile and accepted jobs to build marketplace presence.",
  },
];

export const faqs = [
  {
    question: "Is The Helper free for homeowners?",
    answer:
      "Yes! Submitting requests and getting matched is 100% free for homeowners. You only pay the pro for the actual work, with no platform fees or hidden charges.",
  },
  {
    question: "How fast can I get help?",
    answer:
      "Most homeowners get matched with a verified pro within 15 minutes. For urgent jobs, same-day service is often available.",
  },
  {
    question: "How are providers verified?",
    answer:
      "Every pro is vetted before joining. We verify business credentials, insurance, service areas, and customer reviews. Only approved pros appear on the platform.",
  },
  {
    question: "Where is The Helper available?",
    answer:
      "We currently serve the Greater Toronto Area: Milton, Oakville, Burlington, Mississauga, Brampton, and Hamilton. Enter your postal code to check coverage.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "Your satisfaction matters. If something goes wrong, contact our support team and we'll help make it right, including re-matching you with another pro if needed.",
  },
  {
    question: "How do rewards work?",
    answer:
      "Earn points automatically: $5 when you submit, $5 when you book, and $50+ when your first job completes. Redeem for gift cards or service credits at $100.",
  },
];

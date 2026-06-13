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
  return <MessageSquareText className="size-5" />;
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
    description: "A verified local pro responds, typically within 15 minutes. No calling around.",
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

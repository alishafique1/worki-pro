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
  return <MessageSquareText className="size-5" />;
}

export const solutionSteps = [
  {
    icon: <Search className="size-5" />,
    title: "Choose",
    description: "Choose the service you need and describe the job.",
  },
  {
    icon: <BadgeCheck className="size-5" />,
    title: "Submit",
    description:
      "Send the request with your location, schedule, urgency, and contact details.",
  },
  {
    icon: <CalendarCheck className="size-5" />,
    title: "Coordinate",
    description: "The Helper captures the details needed to coordinate next steps.",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Track",
    description: "Follow request status and appointment details from your account.",
  },
];

export const categories = [
  {
    icon: <AirVent className="size-5" />,
    name: "HVAC",
    description: "Repairs, tune-ups, installs, and seasonal maintenance.",
    href: "/hvac",
  },
  {
    icon: <ShowerHead className="size-5" />,
    name: "Plumbing",
    description: "Leaks, fixtures, drains, water heaters, and urgent repairs.",
    href: "/plumbing",
  },
  {
    icon: <PlugZap className="size-5" />,
    name: "Electrical",
    description: "Panels, outlets, fixtures, safety checks, and installations.",
    href: "/electrical",
  },
  {
    icon: <WashingMachine className="size-5" />,
    name: "Appliance Repair",
    description: "Kitchen, laundry, diagnosis, repair, and replacement support.",
    href: "/appliance-repair",
  },
  {
    icon: <Hammer className="size-5" />,
    name: "Handyman",
    description: "Repairs, mounting, assembly, small projects, and punch lists.",
    href: "/handyman",
  },
  {
    icon: <Wrench className="size-5" />,
    name: "Smart Home",
    description: "Cameras, thermostats, locks, sensors, and connected devices.",
    href: "/smart-home",
  },
  {
    icon: <Sparkles className="size-5" />,
    name: "Cleaning",
    description: "Regular, deep clean, move-in/out, and post-reno cleans.",
    href: "/request-service",
  },
  {
    icon: <Brush className="size-5" />,
    name: "Painting",
    description: "Interior and exterior painting, colour consultation, touch-ups.",
    href: "/request-service",
  },
  {
    icon: <Layers className="size-5" />,
    name: "Flooring",
    description: "Hardwood, tile, laminate, vinyl plank, and carpet install.",
    href: "/request-service",
  },
  {
    icon: <Home className="size-5" />,
    name: "Roofing",
    description: "Shingle repair, full replacement, flat roofs, and inspections.",
    href: "/request-service",
  },
  {
    icon: <Leaf className="size-5" />,
    name: "Landscaping",
    description: "Lawn care, garden beds, interlocking, and spring/fall cleanup.",
    href: "/request-service",
  },
  {
    icon: <Wind className="size-5" />,
    name: "Snow Removal",
    description: "Driveway and walkway clearing, salting, and seasonal contracts.",
    href: "/request-service",
  },
  {
    icon: <TreePine className="size-5" />,
    name: "Tree Services",
    description: "Trimming, removal, stump grinding, and emergency tree work.",
    href: "/request-service",
  },
  {
    icon: <KeyRound className="size-5" />,
    name: "Locksmith",
    description: "Lock changes, emergency entry, rekeying, and deadbolt install.",
    href: "/request-service",
  },
  {
    icon: <Droplets className="size-5" />,
    name: "Window Cleaning",
    description: "Interior and exterior window washing, screens, and tracks.",
    href: "/request-service",
  },
  {
    icon: <MoveRight className="size-5" />,
    name: "Moving",
    description: "Local moves, packing, furniture assembly, and junk removal.",
    href: "/request-service",
  },
  {
    icon: <Package className="size-5" />,
    name: "Garage Door",
    description: "Spring repair, opener install, panel replacement, and tune-up.",
    href: "/request-service",
  },
  {
    icon: <Trash2 className="size-5" />,
    name: "Junk Removal",
    description: "Furniture, appliances, renovation debris, and estate cleanouts.",
    href: "/request-service",
  },
  {
    icon: <PartyPopper className="size-5" />,
    name: "Events",
    description: "Event setup, rentals, photography, and day-of coordination.",
    href: "/request-service",
  },
  {
    icon: <Plus className="size-5" />,
    name: "More",
    description: "Pest control, renovation, pool, waterproofing, and more.",
    href: "/request-service",
  },
];

export const customerSteps = [
  {
    step: "01",
    title: "Describe the job",
    description:
      "Tell us what you need, where you are, and when you're available.",
  },
  {
    step: "02",
    title: "Get matched",
    description: "We surface the right verified pro for your category and location.",
  },
  {
    step: "03",
    title: "Confirm & book",
    description: "Schedule the appointment and track everything from your dashboard.",
  },
  {
    step: "04",
    title: "Job done. Earn rewards.",
    description: "Rate your pro — and earn points toward your next service. 🏆",
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
    question: "Is The Helper free to use?",
    answer:
      "Submitting a service request is available through the live request form. Provider pricing and service fees may vary by job.",
  },
  {
    question: "How are providers verified?",
    answer:
      "Provider applications can include business details, service categories, service areas, and credentials before approval.",
  },
  {
    question: "Where is The Helper available?",
    answer:
      "Availability depends on service area and provider coverage. Submit a request with your postal code so The Helper has the right location context.",
  },
  {
    question: "Can providers join now?",
    answer:
      "Yes. Providers can apply to be considered for supported service areas.",
  },
  {
    question: "Does The Helper use automation?",
    answer:
      "Any automation is treated as future or internal support for operations. The live customer experience is the service request form.",
  },
  {
    question: "How do bookings work?",
    answer:
      "Customers submit a request, a provider can accept it, schedule the appointment, update repair status, and message the customer in the app.",
  },
];

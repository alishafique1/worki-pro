import { BriefcaseBusiness, CalendarCheck, Clock3, Home, Layers, Lock, MessageSquareText, Rocket, ShieldCheck, TrendingUp } from "lucide-react";
export const features = [
    {
        name: "Verified local pros",
        description: "Every provider is license-checked, insured, and WSIB-cleared before they can see a single request.",
        icon: <ShieldCheck className="size-8 text-[#2563EB]"/>,
        href: "/how-it-works",
        size: "small",
    },
    {
        name: "One request, multiple matches",
        description: "Submit once. We route your job to the right pros in your service area automatically.",
        icon: <Lock className="size-8 text-[#2563EB]"/>,
        href: "/get-quotes",
        size: "small",
    },
    {
        name: "All comms in one place",
        description: "Messages, scheduling, and job updates stay tied to the request — no scattered texts or emails.",
        icon: <MessageSquareText className="size-8 text-[#2563EB]"/>,
        href: "/how-it-works",
        size: "medium",
    },
    {
        name: "Earn rewards on every job",
        description: "6,000 pts on your first completed job (≈ $60 in gift cards). Redeem for Amazon, Starbucks, or service credits.",
        icon: <TrendingUp className="size-8 text-[#2563EB]"/>,
        href: "/how-rewards-work",
        size: "large",
    },
    {
        name: "For pros: leads that close",
        description: "Every lead comes from a homeowner who submitted a specific request. No cold calls. No bidding wars.",
        icon: <BriefcaseBusiness className="size-8 text-[#2563EB]"/>,
        href: "/providers",
        size: "large",
    },
    {
        name: "Same-day service",
        description: "Urgent jobs like a broken AC or a leak get same-day matching when pros are available.",
        icon: <Clock3 className="size-8 text-[#2563EB]"/>,
        href: "/get-quotes",
        size: "small",
    },
    {
        name: "GTA built, GTA focused",
        description: "Milton, Oakville, Burlington, Mississauga, Brampton — local supply built before we scale.",
        icon: <Home className="size-8 text-[#2563EB]"/>,
        href: "/discover",
        size: "small",
    },
    {
        name: "Booking that actually sticks",
        description: "Appointment confirmed by the pro before it counts. No ghost bookings.",
        icon: <CalendarCheck className="size-8 text-[#2563EB]"/>,
        href: "/how-it-works",
        size: "medium",
    },
    {
        name: "Grow your pro business",
        description: "Verified reviews from completed jobs build your ranking over time. No paid placement.",
        icon: <Rocket className="size-8 text-[#2563EB]"/>,
        href: "/providers",
        size: "medium",
    },
    {
        name: "Transparent categories",
        description: "HVAC, plumbing, electrical, handyman, smart home, and more — clear buckets so your job goes to the right pro.",
        icon: <Layers className="size-8 text-[#2563EB]"/>,
        href: "/services",
        size: "medium",
    },
];
export const testimonials = [
    {
        name: "Jennifer M.",
        role: "Homeowner · Scott, Milton",
        avatarSrc: "",
        socialUrl: "",
        quote: "Our new build's AC stopped working during the heat wave. The Helper matched us with a pro who came same-day and fixed the issue. As new Milton residents, we didn't know who to call — this made it easy.",
    },
    {
        name: "Robert C.",
        role: "Homeowner · Glen Abbey, Oakville",
        avatarSrc: "",
        socialUrl: "",
        quote: "We needed a full AC replacement before summer. The matched contractor handled the permit, arrived when promised, and the install was flawless. Professional from start to finish.",
    },
    {
        name: "Priya S.",
        role: "Homeowner · Willmott, Milton",
        avatarSrc: "",
        socialUrl: "",
        quote: "Just moved from Toronto and wanted cameras and a smart doorbell installed. Pro arrived on time, clean work, explained everything. Already referred two neighbours.",
    },
];
export const faqs = [
    {
        id: 1,
        question: "Is it free for homeowners?",
        answer: "Yes — submitting a request and getting matched is 100% free. You pay the pro directly for the work. No platform fee, no hidden charges.",
        href: "/how-it-works",
    },
    {
        id: 2,
        question: "How fast will I get matched?",
        answer: "Most homeowners get their first response within the hour. For urgent jobs like a broken AC or a leak, same-day service is often available.",
        href: "/how-it-works",
    },
    {
        id: 3,
        question: "How do I know the pro is actually verified?",
        answer: "Every pro is license-checked (TSSA / ESA / trade), insurance-verified, and WSIB-cleared before they can accept a single job.",
        href: "/how-it-works",
    },
];
export const footerNavigation = {
    app: [
        { name: "Discover Pros", href: "/discover" },
        { name: "Get Help", href: "/get-quotes" },
        { name: "How it Works", href: "/how-it-works" },
        { name: "Rewards", href: "/how-rewards-work" },
        { name: "For Pros", href: "/providers" },
        { name: "Contact", href: "/contact" },
    ],
    company: [
        { name: "Home", href: "/" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
    ],
};
// examples export kept for backwards-compat — not rendered anywhere currently.
// Use the real DiscoveryPage (/discover) to showcase live providers.
export const examples = [];
//# sourceMappingURL=contentSections.jsx.map
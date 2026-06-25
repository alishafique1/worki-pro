// providerProfileData.ts
// Researched profile data for 5 real VERIFIED providers.
// Fields marked // REVIEW: were not publicly available and require human confirmation before going live.

export type RealProviderSeed = {
  email: string;         // login + contact email
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  businessName: string;
  contactName: string;
  website: string;
  slug: string;
  bio: string;
  serviceAreas: string[];
  categorySlugs: string[];
  ratingInternal?: number;
};

export const REAL_PROVIDERS: RealProviderSeed[] = [
  // ─── 1. Shisha Chauffeurs ─────────────────────────────────────────────────
  {
    email: "hello@shishachauffeurs.com", // REVIEW: public email not found on site; confirm with owner
    firstName: "Shisha",                  // REVIEW: no individual contact name found on site
    lastName: "Chauffeurs",               // REVIEW: placeholder last name; replace with owner's real name
    phone: "",                            // REVIEW: no public phone number found on site
    postalCode: "L5B 1M4",               // REVIEW: Mississauga-area postal code placeholder; confirm with owner
    businessName: "Shisha Chauffeurs",
    contactName: "Shisha Chauffeurs",     // REVIEW: no individual contact name found; replace with owner's name
    website: "https://shishachauffeurs.com",
    slug: "shisha-chauffeurs",
    bio: "Luxury mobile shisha catering brought directly to your event. Shisha Chauffeurs delivers premium hookah setups for private parties, corporate events, and gatherings across Milton, Oakville, Burlington, Mississauga, and Brampton. Professional setup and takedown included — all you need to do is enjoy.", // REVIEW: bio drafted from site headline; owner should review for accuracy
    serviceAreas: ["Milton", "Oakville", "Burlington", "Mississauga", "Brampton"],
    categorySlugs: ["shisha-lounge"],
    ratingInternal: undefined,
  },

  // ─── 2. Aura Celebrations ─────────────────────────────────────────────────
  {
    email: "hello@auracelebrations.ca",   // REVIEW: auracelebrations.ca did not respond (ECONNREFUSED); email is a best-guess — confirm with owner
    firstName: "Aura",                    // REVIEW: no individual contact name found; replace with owner's name
    lastName: "Celebrations",             // REVIEW: placeholder last name; replace with owner's real name
    phone: "",                            // REVIEW: no public phone found; confirm with owner
    postalCode: "L9T 0A1",               // REVIEW: Milton postal code placeholder; confirm with owner
    businessName: "Aura Celebrations",
    contactName: "Aura Celebrations",     // REVIEW: no individual contact name found; replace with owner's name
    website: "https://auracelebrations.ca",
    slug: "aura-celebrations",
    bio: "Aura Celebrations is a Milton-based event planning and decor company specializing in weddings, birthdays, baby showers, and corporate events across the GTA. From concept to cleanup, we handle every detail so you can focus on the moments that matter.", // REVIEW: bio drafted from business description; owner should review for accuracy
    serviceAreas: ["Milton", "Oakville", "Burlington", "Mississauga", "Brampton", "GTA"],
    categorySlugs: ["events"],
    ratingInternal: undefined,
  },

  // ─── 3. Social Dots ───────────────────────────────────────────────────────
  {
    email: "ali@socialdots.ca",           // confirmed from site
    firstName: "Ali",
    lastName: "Shafique",
    phone: "+14165566961",                // confirmed from site: +1 (416) 556-6961
    postalCode: "M5V 2T6",               // REVIEW: Toronto postal code placeholder; confirm with owner
    businessName: "Social Dots",
    contactName: "Ali Shafique",
    website: "https://socialdots.ca",
    slug: "socialdots",
    bio: "Social Dots is a GTA-based growth agency helping appointment-based service businesses stop losing leads. We install the systems — AI reception, missed-call recovery, website design, CRM automation, and social media management — that keep your calendar full and your customers coming back. Month-to-month, no long-term contracts, and results within 48–72 hours.",
    serviceAreas: ["Toronto", "Mississauga", "Brampton", "Milton", "Hamilton", "GTA"],
    categorySlugs: ["website-design", "ai-services", "digital-marketing", "software-development"],
    ratingInternal: undefined,
  },

  // ─── 4. Shock Media ──────────────────────────────────────────────────────
  {
    email: "hello@shockmedia.ca",         // confirmed from site
    firstName: "Shock",                   // REVIEW: no individual contact name found on site; replace with owner's name
    lastName: "Media",                    // REVIEW: placeholder last name; replace with owner's real name
    phone: "",                            // REVIEW: no public phone number found on site
    postalCode: "M5A 1A1",               // REVIEW: Toronto postal code placeholder; confirm with owner
    businessName: "Shock Media",
    contactName: "Shock Media",           // REVIEW: no individual contact name found; replace with owner's name
    website: "https://shockmedia.ca",
    slug: "shock-media",
    bio: "Shock Media is a Toronto-based short-form video production agency helping local businesses get noticed online. We create scroll-stopping Reels, TikToks, and YouTube Shorts — plus brand films and testimonial videos — with a human-first approach and no bloated retainers. Great content, consistent delivery, real results.",
    serviceAreas: ["Toronto", "GTA"],
    categorySlugs: ["video-editing"],
    ratingInternal: undefined,
  },

  // ─── 5. Sam's Driving School ──────────────────────────────────────────────
  {
    email: "info@samsdriving.ca",         // confirmed from site
    firstName: "Sam",                     // confirmed from site (instructor referenced as "Sam")
    lastName: "Driving",                  // REVIEW: full surname not publicly listed; replace with owner's real surname
    phone: "6478891708",                  // confirmed from site: 647-889-1708
    postalCode: "L9T 2X5",               // REVIEW: Milton postal code placeholder; confirm with owner
    businessName: "Sam's Driving School",
    contactName: "Sam",                   // REVIEW: full name not listed publicly; replace with owner's full name
    website: "https://samsdriving.ca",
    slug: "sams-driving",
    bio: "Sam's Driving School has been training GTA drivers since 2005. We offer MTO-approved beginner driver education (BDE), G2 and G road test preparation, and defensive driving courses — with flexible scheduling and free pickup and drop-off within 10 km. Our experienced, patient instructors and high first-time pass rate have helped thousands of students hit the road with confidence.",
    serviceAreas: ["Milton", "Burlington", "Oakville"],
    categorySlugs: ["driving-school"],
    ratingInternal: undefined,
  },
];

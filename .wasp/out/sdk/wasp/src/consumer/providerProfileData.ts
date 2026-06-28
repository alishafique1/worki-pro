// providerProfileData.ts
// Profile data for 5 real VERIFIED providers, verified via public-website research
// (June 2026). Remaining gaps are genuinely not public and are noted inline.

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
    email: "shishachauffeurs@gmail.com",  // confirmed (site footer/contact)
    firstName: "Shisha",                   // owner name not public; uses business name
    lastName: "Chauffeurs",
    phone: "647-879-3637",                 // confirmed (site footer/contact)
    postalCode: "M5V 2T6",                // Toronto area (mobile service, no fixed address)
    businessName: "Shisha Chauffeurs",
    contactName: "Shisha Chauffeurs",      // no individual contact named publicly
    website: "https://shishachauffeurs.com",
    slug: "shisha-chauffeurs",
    bio: "Shisha Chauffeurs is a premium mobile shisha and mocktail catering service based in Toronto, serving private events across the GTA. They handle full setup, professional attendants, flavour service, and teardown for parties, weddings, and corporate gatherings — with rentals and a monthly membership option.",
    serviceAreas: ["Toronto", "Mississauga", "Brampton", "Oakville", "Burlington", "Milton"],
    categorySlugs: ["shisha-lounge"],
    ratingInternal: undefined,
  },

  // ─── 2. Aura Celebrations ─────────────────────────────────────────────────
  {
    email: "aura-celebrations@thehelper.ca", // no public email — bookings via Instagram DM; platform placeholder login
    firstName: "Aura",                        // owner name not public
    lastName: "Celebrations",
    phone: "",                                // no public phone (Instagram DM only)
    postalCode: "L9T 0A1",                   // Milton area
    businessName: "Aura Celebrations",
    contactName: "Aura Celebrations",
    website: "https://www.instagram.com/auracelebration.ca/", // Instagram-only presence; .ca website is dead
    slug: "aura-celebrations",
    bio: "Aura Celebrations is a Milton-based event planning and decor studio creating bespoke setups for weddings, engagements, birthdays, baby showers, mehndi ceremonies, and corporate events across the GTA. From floral stages and custom backdrops to balloon installations and themed decor — 'Your Story, Beautifully Arranged.'",
    serviceAreas: ["Milton", "Hamilton", "Oakville", "Burlington", "Toronto"],
    categorySlugs: ["events"],
    ratingInternal: undefined,
  },

  // ─── 3. Social Dots ───────────────────────────────────────────────────────
  {
    email: "ali@socialdots.ca",            // confirmed (founder direct); business email is hello@socialdots.ca
    firstName: "Ali",
    lastName: "Shafique",
    phone: "+14165566961",                 // confirmed (WhatsApp + site)
    postalCode: "M5V 2T6",                // Toronto area (no public office address)
    businessName: "Social Dots",
    contactName: "Ali Shafique",
    website: "https://socialdots.ca",
    slug: "socialdots",
    bio: "Social Dots is a Toronto-based growth agency that helps GTA service businesses close the gap between first contact and booked appointment — review generation, missed-call recovery, follow-up automation, AI reception, CRM setup, and web design. Founded by Ali Shafique. Month-to-month, with focused systems live in 48–72 hours.",
    serviceAreas: ["Toronto", "Mississauga", "Milton", "Brampton", "Hamilton", "Oakville", "Burlington"],
    categorySlugs: ["website-design", "ai-services", "digital-marketing", "software-development"],
    ratingInternal: undefined,
  },

  // ─── 4. Shock Media ──────────────────────────────────────────────────────
  {
    email: "hello@shockmedia.ca",          // confirmed (site footer/contact)
    firstName: "Shock",                    // owner name not public
    lastName: "Media",
    phone: "",                             // no public phone
    postalCode: "M5V 2T6",                // Toronto area
    businessName: "Shock Media",
    contactName: "Shock Media",
    website: "https://shockmedia.ca",
    slug: "shock-media",
    bio: "Shock Media is a Toronto-based video content agency specializing in short-form video — Instagram Reels, TikToks, and YouTube Shorts — plus brand films and testimonials for local GTA businesses. Strategy-led, consistent delivery, and results over vanity metrics.",
    serviceAreas: ["Toronto", "Mississauga", "Brampton", "Oakville", "Burlington", "Milton"],
    categorySlugs: ["video-editing"],
    ratingInternal: undefined,
  },

  // ─── 5. Sam's Driving School ──────────────────────────────────────────────
  {
    email: "info@samsdriving.ca",          // confirmed (site)
    firstName: "Saima",                    // confirmed: instructor/owner Saima Amir
    lastName: "Amir",
    phone: "647-889-1708",                 // confirmed (site)
    postalCode: "L7R 4B6",                // confirmed: 23-460 Brant Street, Burlington
    businessName: "Sam's Driving School",
    contactName: "Saima Amir",
    website: "https://samsdriving.ca",
    slug: "sams-driving",
    bio: "Sam's Driving School is an MTO-approved driving school established in 2005, serving Burlington, Milton, and the GTA. Led by instructor Saima Amir, they offer Beginner Driver Education (30h theory + 10h in-car), G2 and G road-test prep, and defensive driving — with dual-control vehicles, flexible scheduling, and free pickup and drop-off within 10 km.",
    serviceAreas: ["Burlington", "Milton", "Oakville"],
    categorySlugs: ["driving-school"],
    ratingInternal: undefined,
  },
];

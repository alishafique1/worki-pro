/**
 * Qualifier questions by category slug.
 * Used in the RequestServicePage wizard to collect job-specific details.
 */

export interface QualifierQuestion {
  id: string;
  label: string;
  options: string[];
  isOptional?: boolean;
}

export interface CategoryQualifierConfig {
  q1: QualifierQuestion;
  q2?: QualifierQuestion;
  detailChips?: string[];
  detailChipsLabel?: string;
}

export const CATEGORY_QUALIFIERS: Record<string, CategoryQualifierConfig> = {
  hvac: {
    q1: {
      id: "type",
      label: "Is this a repair or maintenance?",
      options: ["Repair", "Maintenance"],
    },
    q2: {
      id: "system",
      label: "What type of system?",
      options: ["Furnace", "AC", "Both", "Heat Pump", "Boiler"],
    },
    detailChips: [
      "Not heating / cooling",
      "Strange noise or smell",
      "Annual tune-up",
      "System replacement",
      "Something else",
    ],
    detailChipsLabel: "What best describes the issue?",
  },

  plumbing: {
    q1: {
      id: "leak",
      label: "Is water actively leaking?",
      options: ["Yes, leaking now", "No active leak"],
    },
    q2: {
      id: "location",
      label: "Where is the issue?",
      options: ["Kitchen", "Bathroom", "Basement", "Outside", "Multiple areas"],
    },
    detailChips: [
      "Leaky faucet",
      "Clogged drain",
      "Running toilet",
      "Pipe burst / leak",
      "Water heater",
      "Low water pressure",
      "Something else",
    ],
    detailChipsLabel: "What best describes the problem?",
  },

  electrical: {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Outage / not working", "New install", "Safety concern"],
    },
    q2: {
      id: "area",
      label: "Which area?",
      options: ["Whole home", "Single room", "Outdoor", "Garage"],
    },
    detailChips: [
      "Outlet not working",
      "Tripping breaker",
      "Light fixture install",
      "Panel upgrade",
      "EV charger install",
      "Smoke detector",
      "Something else",
    ],
    detailChipsLabel: "What needs attention?",
  },

  "appliance-repair": {
    q1: {
      id: "appliance",
      label: "Which appliance?",
      options: ["Fridge", "Washer", "Dryer", "Dishwasher", "Oven/Stove", "Microwave", "Other"],
    },
    q2: {
      id: "brand",
      label: "Brand (optional)",
      options: ["Samsung", "LG", "Whirlpool", "GE", "Bosch", "Other", "Not sure"],
      isOptional: true,
    },
  },

  handyman: {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Repair", "Install / mount", "Assembly", "Other"],
    },
    q2: {
      id: "timing",
      label: "How soon do you need this done?",
      options: ["Same-day", "This week", "Flexible"],
    },
    detailChips: [
      "TV mounting",
      "Furniture assembly",
      "Drywall repair",
      "Door / lock",
      "Painting",
      "Shelving",
      "Caulking / sealing",
      "Something else",
    ],
    detailChipsLabel: "What needs to be done?",
  },

  "smart-home": {
    q1: {
      id: "type",
      label: "Install or troubleshoot?",
      options: ["New install", "Troubleshoot existing"],
    },
    q2: {
      id: "device",
      label: "What type of device?",
      options: ["Thermostat", "Camera / doorbell", "Locks", "Lighting", "Wi-Fi / networking", "Other"],
    },
    detailChips: [
      "Smart thermostat",
      "Security cameras",
      "Smart doorbell",
      "Smart locks",
      "Wi-Fi / networking",
      "Smart lighting",
      "Something else",
    ],
    detailChipsLabel: "What would you like set up?",
  },

  cleaning: {
    q1: {
      id: "type",
      label: "What type of cleaning?",
      options: ["Regular", "Deep clean", "Move-in/out", "Post-construction", "One-time"],
    },
    q2: {
      id: "frequency",
      label: "How often?",
      options: ["One-time", "Weekly", "Bi-weekly", "Monthly"],
      isOptional: true,
    },
  },

  painting: {
    q1: {
      id: "type",
      label: "Interior or exterior?",
      options: ["Interior", "Exterior", "Both"],
    },
    q2: {
      id: "rooms",
      label: "How many rooms / areas?",
      options: ["1 room", "2-3 rooms", "4+ rooms", "Whole house"],
    },
  },

  flooring: {
    q1: {
      id: "type",
      label: "What type of flooring?",
      options: ["Hardwood", "Laminate", "Tile", "Vinyl plank", "Carpet", "Not sure"],
    },
    q2: {
      id: "work",
      label: "What work is needed?",
      options: ["New install", "Replacement", "Repair", "Refinishing"],
    },
  },

  roofing: {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Repair", "Full replacement", "Inspection", "Emergency leak"],
    },
    q2: {
      id: "roofType",
      label: "What type of roof?",
      options: ["Shingles", "Flat roof", "Metal", "Tile", "Not sure"],
    },
  },

  landscaping: {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Lawn care", "Garden design", "Interlocking", "Tree/shrub work", "Cleanup"],
    },
    q2: {
      id: "frequency",
      label: "One-time or ongoing?",
      options: ["One-time", "Weekly", "Bi-weekly", "Seasonal"],
    },
  },

  "snow-removal": {
    q1: {
      id: "type",
      label: "What needs clearing?",
      options: ["Driveway", "Walkway", "Both", "Parking lot"],
    },
    q2: {
      id: "frequency",
      label: "Service type?",
      options: ["Per visit", "Seasonal contract", "On-call"],
    },
  },

  "tree-services": {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Trimming", "Removal", "Stump grinding", "Emergency"],
    },
    q2: {
      id: "size",
      label: "Tree size?",
      options: ["Small (under 15ft)", "Medium (15-30ft)", "Large (30ft+)", "Multiple trees"],
    },
  },

  locksmith: {
    q1: {
      id: "type",
      label: "What do you need?",
      options: ["Lock change", "Emergency entry", "Rekey", "New install"],
    },
    q2: {
      id: "urgency",
      label: "How urgent?",
      options: ["Emergency (locked out)", "Same-day", "Can schedule ahead"],
    },
  },

  "window-cleaning": {
    q1: {
      id: "type",
      label: "Interior, exterior, or both?",
      options: ["Interior only", "Exterior only", "Both"],
    },
    q2: {
      id: "floors",
      label: "How many floors?",
      options: ["Single story", "2 stories", "3+ stories"],
    },
  },

  moving: {
    q1: {
      id: "type",
      label: "What type of move?",
      options: ["Local move", "Long distance", "Packing only", "Labor only"],
    },
    q2: {
      id: "size",
      label: "Home size?",
      options: ["Studio / 1BR", "2BR", "3BR", "4BR+", "Just a few items"],
    },
  },

  "garage-door": {
    q1: {
      id: "type",
      label: "What type of work?",
      options: ["Repair", "New install", "Opener issue", "Spring replacement"],
    },
    q2: {
      id: "doors",
      label: "How many doors?",
      options: ["1 door", "2 doors", "3+ doors"],
    },
  },

  "junk-removal": {
    q1: {
      id: "type",
      label: "What needs removal?",
      options: ["Furniture", "Appliances", "Renovation debris", "Estate cleanout", "Mixed"],
    },
    q2: {
      id: "volume",
      label: "How much?",
      options: ["A few items", "Half truck", "Full truck", "Multiple loads"],
    },
  },
};

/**
 * Get qualifier config for a category slug.
 * Returns undefined if no qualifiers are defined.
 */
export function getQualifiersForCategory(slug: string): CategoryQualifierConfig | undefined {
  return CATEGORY_QUALIFIERS[slug];
}

/**
 * Live service categories that appear in the request flow.
 * These are the primary 6 categories with full support.
 */
export const LIVE_CATEGORY_SLUGS = [
  "hvac",
  "plumbing",
  "electrical",
  "appliance-repair",
  "handyman",
  "smart-home",
];

/**
 * Check if a category is live (fully supported in request flow).
 */
export function isLiveCategory(slug: string): boolean {
  return LIVE_CATEGORY_SLUGS.includes(slug);
}

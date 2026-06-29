import * as z from 'zod';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@wasp.sh/lib-auth/node';

const colors = {
  red: "\x1B[31m",
  yellow: "\x1B[33m"
};
const resetColor = "\x1B[0m";
function getColorizedConsoleFormatString(colorKey) {
  const color = colors[colorKey];
  return `${color}%s${resetColor}`;
}

const redColorFormatString = getColorizedConsoleFormatString("red");
function ensureEnvSchema(data, schema) {
  const result = getValidatedEnvOrError(data, schema);
  if (result.success) {
    return result.data;
  } else {
    console.error(`${redColorFormatString}${formatZodEnvErrors(result.error.issues)}`);
    throw new Error("Error parsing environment variables");
  }
}
function getValidatedEnvOrError(env, schema) {
  return schema.safeParse(env);
}
function formatZodEnvErrors(issues) {
  const errorOutput = ["", "\u2550\u2550 Env vars validation failed \u2550\u2550", ""];
  for (const error of issues) {
    errorOutput.push(` - ${error.message}`);
  }
  errorOutput.push("");
  errorOutput.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
  return errorOutput.join("\n");
}

const userServerEnvSchema = z.object({});
const waspServerCommonSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string({
    required_error: "DATABASE_URL is required"
  }),
  PG_BOSS_NEW_OPTIONS: z.string().optional(),
  MAILGUN_API_KEY: z.string({
    required_error: getRequiredEnvVarErrorMessage("Mailgun email sender", "MAILGUN_API_KEY")
  }),
  MAILGUN_DOMAIN: z.string({
    required_error: getRequiredEnvVarErrorMessage("Mailgun email sender", "MAILGUN_DOMAIN")
  }),
  MAILGUN_API_URL: z.string().optional(),
  SKIP_EMAIL_VERIFICATION_IN_DEV: z.enum(["true", "false"], {
    message: 'SKIP_EMAIL_VERIFICATION_IN_DEV must be either "true" or "false"'
  }).transform((value) => value === "true").default("false")
});
const serverUrlSchema = z.string({
  required_error: "WASP_SERVER_URL is required"
}).url({
  message: "WASP_SERVER_URL must be a valid URL"
});
const clientUrlSchema = z.string({
  required_error: "WASP_WEB_CLIENT_URL is required"
}).url({
  message: "WASP_WEB_CLIENT_URL must be a valid URL"
});
const jwtTokenSchema = z.string({
  required_error: "JWT_SECRET is required"
});
const serverDevSchema = z.object({
  NODE_ENV: z.literal("development"),
  "WASP_SERVER_URL": serverUrlSchema.default("http://localhost:3001"),
  "WASP_WEB_CLIENT_URL": clientUrlSchema.default("http://localhost:3000/"),
  "JWT_SECRET": jwtTokenSchema.default("DEVJWTSECRET")
});
const serverProdSchema = z.object({
  NODE_ENV: z.literal("production"),
  "WASP_SERVER_URL": serverUrlSchema,
  "WASP_WEB_CLIENT_URL": clientUrlSchema,
  "JWT_SECRET": jwtTokenSchema
});
const serverCommonSchema = userServerEnvSchema.merge(waspServerCommonSchema);
const serverEnvSchema = z.discriminatedUnion("NODE_ENV", [
  serverDevSchema.merge(serverCommonSchema),
  serverProdSchema.merge(serverCommonSchema)
]);
const defaultNodeEnvValue = serverDevSchema.shape.NODE_ENV.value;
const { NODE_ENV: inputNodeEnvValue, ...restEnv } = process.env;
const env = ensureEnvSchema({
  NODE_ENV: inputNodeEnvValue ?? defaultNodeEnvValue,
  ...restEnv
}, serverEnvSchema);
function getRequiredEnvVarErrorMessage(featureName, envVarName) {
  return `${envVarName} is required when using ${featureName}`;
}

function stripTrailingSlash(url) {
  return url?.replace(/\/$/, "");
}
function getOrigin(url) {
  return new URL(url).origin;
}

const frontendUrl = stripTrailingSlash(env["WASP_WEB_CLIENT_URL"]);
stripTrailingSlash(env["WASP_SERVER_URL"]);
const allowedCORSOriginsPerEnv = {
  development: [/.*/],
  production: [getOrigin(frontendUrl)]
};
allowedCORSOriginsPerEnv[env.NODE_ENV];
({
  env: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === "development",
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  auth: {
    jwtSecret: env["JWT_SECRET"]
  }
});

function createDbClient() {
  return new PrismaClient();
}
const dbClient = createDbClient();

({
  entities: {
    User: dbClient.user
  }
});
function createProviderId(providerName, providerUserId) {
  return {
    providerName,
    providerUserId: normalizeProviderUserId(providerName, providerUserId)
  };
}
function normalizeProviderUserId(providerName, providerUserId) {
  switch (providerName) {
    case "email":
    case "username":
      return providerUserId.toLowerCase();
    case "google":
    case "github":
    case "discord":
    case "keycloak":
    case "slack":
    case "microsoft":
      return providerUserId;
    /*
          Why the default case?
          In case users add a new auth provider in the user-land.
          Users can't extend this function because it is private.
          If there is an unknown `providerName` in runtime, we'll
          return the `providerUserId` as is.
    
          We want to still have explicit OAuth providers listed
          so that we get a type error if we forget to add a new provider
          to the switch statement.
        */
    default:
      return providerUserId;
  }
}
async function sanitizeAndSerializeProviderData(providerData) {
  return serializeProviderData(await ensurePasswordIsHashed(providerData));
}
function serializeProviderData(providerData) {
  return JSON.stringify(providerData);
}
async function ensurePasswordIsHashed(providerData) {
  const data = {
    ...providerData
  };
  if (providerDataHasPasswordField(data)) {
    data.hashedPassword = await hashPassword(data.hashedPassword);
  }
  return data;
}
function providerDataHasPasswordField(providerData) {
  return "hashedPassword" in providerData;
}

const LEGACY_TEST_PASSWORD = "Password123!";
const QA_TEST_PASSWORD = "HelperQA123";
const TEST_PASSWORD = "HelperTest123";
async function ensureEmailAuthIdentity$1(prisma, email, password) {
  const providerId = createProviderId("email", email);
  const existingIdentity = await prisma.authIdentity.findUnique({
    where: { providerName_providerUserId: providerId }
  });
  if (existingIdentity) return;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`Cannot create auth identity: user ${email} not found`);
  }
  const providerData = await sanitizeAndSerializeProviderData({
    hashedPassword: password,
    isEmailVerified: true,
    emailVerificationSentAt: null,
    passwordResetSentAt: null
  });
  await prisma.auth.create({
    data: {
      userId: user.id,
      identities: {
        create: {
          providerName: providerId.providerName,
          providerUserId: providerId.providerUserId,
          providerData
        }
      }
    }
  });
}
const DEFAULT_VENDOR_CATEGORIES = [
  {
    name: "Handyman",
    slug: "handyman",
    description: "General repairs, mounting, assembly, painting, and home maintenance",
    icon: "Hammer",
    imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=600&fit=crop"
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    description: "Pipes, drains, water heaters, toilets, and fixture repairs",
    icon: "ShowerHead",
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop"
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    description: "Smart thermostats, cameras, locks, sensors, and home automation",
    icon: "Wifi",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop"
  },
  {
    name: "Events",
    slug: "events",
    description: "Event planning, setup, coordination, and day-of management for any occasion",
    icon: "CalendarCheck",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=600&fit=crop"
  },
  {
    name: "Food Catering",
    slug: "food-catering",
    description: "Full catering, food trucks, private dining, and custom menus for events",
    icon: "UtensilsCrossed",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
  },
  {
    name: "Shisha Lounge",
    slug: "shisha-lounge",
    description: "Shisha setup and rental for events, private gatherings, and lounges",
    icon: "Flame",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop"
  },
  {
    name: "AI Services",
    slug: "ai-services",
    description: "AI automation, chatbots, workflow tools, and digital assistants for your business",
    icon: "Bot",
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=600&fit=crop"
  },
  {
    name: "Website Design",
    slug: "website-design",
    description: "Custom websites, landing pages, e-commerce stores, and brand design",
    icon: "Globe",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop"
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "SEO, paid ads, social media management, and growth marketing for local businesses",
    icon: "Megaphone",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  },
  {
    name: "Software Development",
    slug: "software-development",
    description: "Custom software, web apps, integrations, and automation built for your business",
    icon: "Code",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop"
  },
  {
    name: "Video Editing",
    slug: "video-editing",
    description: "Short-form video, reels, promos, and professional video editing and production",
    icon: "Clapperboard",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop"
  },
  {
    name: "Driving School",
    slug: "driving-school",
    description: "Licensed driving instruction, in-car lessons, and MTO-approved beginner courses",
    icon: "Car",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop"
  }
];
async function seedVendorCategories(prisma) {
  console.log("Seeding vendor service categories...");
  for (const cat of DEFAULT_VENDOR_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        icon: cat.icon,
        imageUrl: cat.imageUrl
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        imageUrl: cat.imageUrl,
        active: true
      }
    });
  }
  console.log(`Seeded ${DEFAULT_VENDOR_CATEGORIES.length} vendor categories.`);
}
async function seedMockUsers(prisma) {
  console.log("Seeding The Helper Sample Data...");
  await seedVendorCategories(prisma);
  const GTA_SERVICE_AREAS = ["L9T", "L6J", "L7R", "Milton", "Oakville", "Burlington"];
  let adminUser = await prisma.user.findUnique({ where: { email: "admin@thehelper.ca" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@thehelper.ca",
        username: "admin@thehelper.ca",
        firstName: "Admin",
        lastName: "TheHelper",
        role: "ADMIN",
        isAdmin: true,
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "admin@thehelper.ca", TEST_PASSWORD);
  let sarahUser = await prisma.user.findUnique({ where: { email: "consumer@thehelper.ca" } });
  if (!sarahUser) {
    sarahUser = await prisma.user.create({
      data: {
        email: "consumer@thehelper.ca",
        username: "consumer@thehelper.ca",
        firstName: "Sarah",
        lastName: "Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        role: "CONSUMER",
        status: "ACTIVE",
        smsConsent: true,
        emailConsent: true
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "consumer@thehelper.ca", TEST_PASSWORD);
  let jamesUser = await prisma.user.findUnique({ where: { email: "consumer2@thehelper.ca" } });
  if (!jamesUser) {
    jamesUser = await prisma.user.create({
      data: {
        email: "consumer2@thehelper.ca",
        username: "consumer2@thehelper.ca",
        firstName: "James",
        lastName: "Kowalski",
        phone: "905-338-7712",
        postalCode: "L6J 2X8",
        role: "CONSUMER",
        status: "ACTIVE",
        smsConsent: true,
        emailConsent: true
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "consumer2@thehelper.ca", TEST_PASSWORD);
  let mikeProviderUser = await prisma.user.findUnique({ where: { email: "hvac@thehelper.ca" } });
  if (!mikeProviderUser) {
    mikeProviderUser = await prisma.user.create({
      data: {
        email: "hvac@thehelper.ca",
        username: "hvac@thehelper.ca",
        firstName: "Mike",
        lastName: "Torres",
        phone: "905-878-1155",
        postalCode: "L9T 0A1",
        role: "PROVIDER",
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "hvac@thehelper.ca", TEST_PASSWORD);
  let mikeProvider = await prisma.provider.findFirst({ where: { userId: mikeProviderUser.id } });
  if (!mikeProvider) {
    mikeProvider = await prisma.provider.create({
      data: {
        userId: mikeProviderUser.id,
        businessName: "Comfort Zone Handyman",
        contactName: "Mike Torres",
        phone: "905-878-1155",
        email: "hvac@thehelper.ca",
        slug: "comfort-zone-handyman",
        bio: "Family-run handyman service covering Milton, Oakville, and Burlington since 2009. We handle everything from drywall and door repairs to furniture assembly, TV mounting, caulking, and general maintenance. Fully insured, upfront pricing, same-day service available.",
        serviceAreas: GTA_SERVICE_AREAS,
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE",
        ratingInternal: 4.9,
        responseTimeMins: 30,
        insuranceStatus: true,
        referencesChecked: true,
        onboardingCallDone: true
      }
    });
  }
  const handymanCategory = await prisma.serviceCategory.findFirst({ where: { slug: "handyman" } });
  if (handymanCategory) {
    const existingHandymanLink = await prisma.providerCategory.findFirst({
      where: { providerId: mikeProvider.id, serviceCategoryId: handymanCategory.id }
    });
    if (!existingHandymanLink) {
      await prisma.providerCategory.create({
        data: { providerId: mikeProvider.id, serviceCategoryId: handymanCategory.id }
      });
    }
  }
  const mikeFee = await prisma.providerFee.findFirst({
    where: { providerId: mikeProvider.id, feeType: "QUALIFIED_LEAD" }
  });
  if (!mikeFee) {
    await prisma.providerFee.create({
      data: {
        providerId: mikeProvider.id,
        feeType: "QUALIFIED_LEAD",
        amount: 5,
        status: "PAID"
      }
    });
  }
  let davePlumberUser = await prisma.user.findUnique({ where: { email: "plumber@thehelper.ca" } });
  if (!davePlumberUser) {
    davePlumberUser = await prisma.user.create({
      data: {
        email: "plumber@thehelper.ca",
        username: "plumber@thehelper.ca",
        firstName: "Dave",
        lastName: "Singh",
        phone: "905-338-4490",
        postalCode: "L6J 0B3",
        role: "PROVIDER",
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "plumber@thehelper.ca", TEST_PASSWORD);
  let daveProvider = await prisma.provider.findFirst({ where: { userId: davePlumberUser.id } });
  if (!daveProvider) {
    daveProvider = await prisma.provider.create({
      data: {
        userId: davePlumberUser.id,
        businessName: "Singh Plumbing Co.",
        contactName: "Dave Singh",
        phone: "905-338-4490",
        email: "plumber@thehelper.ca",
        slug: "singh-plumbing-co",
        bio: "Licensed master plumber with 15+ years serving the Halton Region. We handle everything from emergency leak repairs and drain clearing to full bathroom renovations and water heater installations. Upfront pricing, no hidden fees. Available 7 days a week.",
        serviceAreas: GTA_SERVICE_AREAS,
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE",
        ratingInternal: 4.8,
        responseTimeMins: 45,
        insuranceStatus: true,
        referencesChecked: true,
        onboardingCallDone: true
      }
    });
  }
  const plumbingCategory = await prisma.serviceCategory.findFirst({ where: { slug: "plumbing" } });
  if (plumbingCategory) {
    const existingPlumbingLink = await prisma.providerCategory.findFirst({
      where: { providerId: daveProvider.id, serviceCategoryId: plumbingCategory.id }
    });
    if (!existingPlumbingLink) {
      await prisma.providerCategory.create({
        data: { providerId: daveProvider.id, serviceCategoryId: plumbingCategory.id }
      });
    }
  }
  const daveFee = await prisma.providerFee.findFirst({
    where: { providerId: daveProvider.id, feeType: "QUALIFIED_LEAD" }
  });
  if (!daveFee) {
    await prisma.providerFee.create({
      data: {
        providerId: daveProvider.id,
        feeType: "QUALIFIED_LEAD",
        amount: 5,
        status: "PAID"
      }
    });
  }
  const sarahRewardAcct = await prisma.rewardAccount.findUnique({ where: { consumerId: sarahUser.id } });
  if (!sarahRewardAcct) {
    await prisma.rewardAccount.create({
      data: {
        consumerId: sarahUser.id,
        pointsBalance: 1250,
        level: "SMART_MAINTAINER",
        lifetimePoints: 3750
      }
    });
  }
  let handymanReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "COMPLETED" }
  });
  if (!handymanReq) {
    handymanReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "TV mounting and shelving \u2014 65 inch TV, need 3 floating shelves in living room",
        urgency: "STANDARD",
        status: "COMPLETED",
        assignedProviderId: mikeProvider.id,
        completedAt: new Date(Date.now() - 7 * 864e5)
      }
    });
  }
  let plumbingReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "NEW" }
  });
  if (!plumbingReq) {
    plumbingReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "Leaky kitchen faucet, dripping constantly for 2 days",
        urgency: "STANDARD",
        status: "NEW"
      }
    });
  }
  let smartHomeReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "ASSIGNED" }
  });
  if (!smartHomeReq) {
    smartHomeReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "Install 3 smart cameras and a video doorbell, existing Wi-Fi available",
        urgency: "PLANNED",
        status: "ASSIGNED",
        assignedProviderId: mikeProvider.id
      }
    });
  }
  const existingTxCount = await prisma.rewardTransaction.count({ where: { consumerId: sarahUser.id } });
  if (existingTxCount === 0) {
    await prisma.rewardTransaction.createMany({
      data: [
        {
          consumerId: sarahUser.id,
          serviceRequestId: handymanReq.id,
          type: "SERVICE_REQUEST",
          points: 500,
          status: "APPROVED",
          reason: "Submitted handyman request"
        },
        {
          consumerId: sarahUser.id,
          serviceRequestId: handymanReq.id,
          type: "COMPLETED_SERVICE",
          points: 5e3,
          status: "APPROVED",
          reason: "TV mounting and shelving job completed"
        },
        {
          consumerId: sarahUser.id,
          serviceRequestId: plumbingReq.id,
          type: "SERVICE_REQUEST",
          points: 500,
          status: "APPROVED",
          reason: "Submitted plumbing request"
        }
      ]
    });
  }
  const existingAppt = await prisma.appointment.findFirst({
    where: { serviceRequestId: handymanReq.id, providerId: mikeProvider.id }
  });
  if (!existingAppt) {
    await prisma.appointment.create({
      data: {
        serviceRequestId: handymanReq.id,
        providerId: mikeProvider.id,
        consumerId: sarahUser.id,
        status: "COMPLETED",
        scheduledAt: new Date(Date.now() - 7 * 864e5),
        completedAt: new Date(Date.now() - 7 * 864e5)
      }
    });
  }
  const existingReview = await prisma.review.findFirst({
    where: { providerId: mikeProvider.id, consumerId: sarahUser.id, serviceRequestId: handymanReq.id }
  });
  if (!existingReview) {
    await prisma.review.create({
      data: {
        providerId: mikeProvider.id,
        consumerId: sarahUser.id,
        serviceRequestId: handymanReq.id,
        rating: 5,
        body: "Mike mounted the TV perfectly and built the shelves exactly how I wanted. Showed up on time, cleaned up after, very professional.",
        status: "PUBLISHED"
      }
    });
    await prisma.provider.update({
      where: { id: mikeProvider.id },
      data: { ratingInternal: 4.9 }
    });
  }
  const existingLogs = await prisma.communicationLog.count({
    where: { serviceRequestId: smartHomeReq.id }
  });
  if (existingLogs === 0) {
    await prisma.communicationLog.createMany({
      data: [
        {
          userId: sarahUser.id,
          serviceRequestId: smartHomeReq.id,
          channel: "INTERNAL_NOTE",
          direction: "OUTBOUND",
          from: sarahUser.email ?? "consumer@thehelper.ca",
          to: mikeProviderUser.email ?? "hvac@thehelper.ca",
          body: "Hi, when can you come by to install the cameras and doorbell?"
        },
        {
          userId: mikeProviderUser.id,
          serviceRequestId: smartHomeReq.id,
          providerId: mikeProvider.id,
          channel: "INTERNAL_NOTE",
          direction: "OUTBOUND",
          from: mikeProviderUser.email ?? "hvac@thehelper.ca",
          to: sarahUser.email ?? "consumer@thehelper.ca",
          body: "I can do Thursday afternoon between 2\u20134pm. Does that work?"
        }
      ]
    });
  }
  console.log("\u2713 GTA test accounts and sample data seeded successfully.");
  console.log("  consumer@thehelper.ca  / HelperTest123  (Sarah Chen, Milton)");
  console.log("  consumer2@thehelper.ca / HelperTest123  (James Kowalski, Oakville)");
  console.log("  hvac@thehelper.ca      / HelperTest123  (Mike Torres, Comfort Zone Handyman)");
  console.log("  plumber@thehelper.ca   / HelperTest123  (Dave Singh, Singh Plumbing Co.)");
  console.log("  admin@thehelper.ca     / HelperTest123  (Admin)");
  let consumer = await prisma.user.findUnique({ where: { username: "test@thehelper.ca" } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: "test@thehelper.ca",
        username: "test@thehelper.ca",
        firstName: "Test",
        lastName: "Consumer",
        role: "CONSUMER",
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "test@thehelper.ca", LEGACY_TEST_PASSWORD);
  let qaConsumer = await prisma.user.findUnique({ where: { username: "consumer.test@thehelper.ca" } });
  if (!qaConsumer) {
    qaConsumer = await prisma.user.create({
      data: {
        email: "consumer.test@thehelper.ca",
        username: "consumer.test@thehelper.ca",
        firstName: "Consumer",
        lastName: "Tester",
        role: "CONSUMER",
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "consumer.test@thehelper.ca", QA_TEST_PASSWORD);
  const rewardAcct = await prisma.rewardAccount.findUnique({ where: { consumerId: consumer.id } });
  if (!rewardAcct) {
    await prisma.rewardAccount.create({
      data: {
        consumerId: consumer.id,
        pointsBalance: 1250,
        level: "SMART_MAINTAINER",
        lifetimePoints: 1250
      }
    });
  }
  let providerUser = await prisma.user.findUnique({ where: { username: "pro.test@thehelper.ca" } });
  if (!providerUser) {
    providerUser = await prisma.user.create({
      data: {
        email: "pro.test@thehelper.ca",
        username: "pro.test@thehelper.ca",
        firstName: "Pro",
        lastName: "Worker",
        role: "PROVIDER",
        status: "ACTIVE"
      }
    });
  }
  await ensureEmailAuthIdentity$1(prisma, "pro.test@thehelper.ca", QA_TEST_PASSWORD);
  let provider = await prisma.provider.findFirst({ where: { userId: providerUser.id } });
  if (!provider) {
    provider = await prisma.provider.create({
      data: {
        userId: providerUser.id,
        businessName: "Elite Home Services",
        phone: "555-0199",
        serviceAreas: ["L9T", "L6J", "L7R", "Milton", "Oakville", "Burlington"],
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE"
      }
    });
  }
  console.log("Seeding complete! Check your Consumer and Provider Dashboards.");
}

const REAL_PROVIDERS = [
  // ─── 1. Shisha Chauffeurs ─────────────────────────────────────────────────
  {
    email: "shishachauffeurs@gmail.com",
    // confirmed (site footer/contact)
    firstName: "Shisha",
    // owner name not public; uses business name
    lastName: "Chauffeurs",
    phone: "647-879-3637",
    // confirmed (site footer/contact)
    postalCode: "M5V 2T6",
    // Toronto area (mobile service, no fixed address)
    businessName: "Shisha Chauffeurs",
    contactName: "Shisha Chauffeurs",
    // no individual contact named publicly
    website: "https://shishachauffeurs.com",
    slug: "shisha-chauffeurs",
    bio: "Shisha Chauffeurs is a premium mobile shisha and mocktail catering service based in Toronto, serving private events across the GTA. They handle full setup, professional attendants, flavour service, and teardown for parties, weddings, and corporate gatherings \u2014 with rentals and a monthly membership option.",
    serviceAreas: ["Toronto", "Mississauga", "Brampton", "Oakville", "Burlington", "Milton"],
    categorySlugs: ["shisha-lounge"],
    ratingInternal: void 0
  },
  // ─── 2. Aura Celebrations ─────────────────────────────────────────────────
  {
    email: "aura-celebrations@thehelper.ca",
    // no public email — bookings via Instagram DM; platform placeholder login
    firstName: "Aura",
    // owner name not public
    lastName: "Celebrations",
    phone: "",
    // no public phone (Instagram DM only)
    postalCode: "L9T 0A1",
    // Milton area
    businessName: "Aura Celebrations",
    contactName: "Aura Celebrations",
    website: "https://www.instagram.com/auracelebration.ca/",
    // Instagram-only presence; .ca website is dead
    slug: "aura-celebrations",
    bio: "Aura Celebrations is a Milton-based event planning and decor studio creating bespoke setups for weddings, engagements, birthdays, baby showers, mehndi ceremonies, and corporate events across the GTA. From floral stages and custom backdrops to balloon installations and themed decor \u2014 'Your Story, Beautifully Arranged.'",
    serviceAreas: ["Milton", "Hamilton", "Oakville", "Burlington", "Toronto"],
    categorySlugs: ["events"],
    ratingInternal: void 0
  },
  // ─── 3. Social Dots ───────────────────────────────────────────────────────
  {
    email: "ali@socialdots.ca",
    // confirmed (founder direct); business email is hello@socialdots.ca
    firstName: "Ali",
    lastName: "Shafique",
    phone: "+14165566961",
    // confirmed (WhatsApp + site)
    postalCode: "M5V 2T6",
    // Toronto area (no public office address)
    businessName: "Social Dots",
    contactName: "Ali Shafique",
    website: "https://socialdots.ca",
    slug: "socialdots",
    bio: "Social Dots is a Toronto-based growth agency that helps GTA service businesses close the gap between first contact and booked appointment \u2014 review generation, missed-call recovery, follow-up automation, AI reception, CRM setup, and web design. Founded by Ali Shafique. Month-to-month, with focused systems live in 48\u201372 hours.",
    serviceAreas: ["Toronto", "Mississauga", "Milton", "Brampton", "Hamilton", "Oakville", "Burlington"],
    categorySlugs: ["website-design", "ai-services", "digital-marketing", "software-development"],
    ratingInternal: void 0
  },
  // ─── 4. Shock Media ──────────────────────────────────────────────────────
  {
    email: "hello@shockmedia.ca",
    // confirmed (site footer/contact)
    firstName: "Shock",
    // owner name not public
    lastName: "Media",
    phone: "",
    // no public phone
    postalCode: "M5V 2T6",
    // Toronto area
    businessName: "Shock Media",
    contactName: "Shock Media",
    website: "https://shockmedia.ca",
    slug: "shock-media",
    bio: "Shock Media is a Toronto-based video content agency specializing in short-form video \u2014 Instagram Reels, TikToks, and YouTube Shorts \u2014 plus brand films and testimonials for local GTA businesses. Strategy-led, consistent delivery, and results over vanity metrics.",
    serviceAreas: ["Toronto", "Mississauga", "Brampton", "Oakville", "Burlington", "Milton"],
    categorySlugs: ["video-editing"],
    ratingInternal: void 0
  },
  // ─── 5. Sam's Driving School ──────────────────────────────────────────────
  {
    email: "info@samsdriving.ca",
    // confirmed (site)
    firstName: "Saima",
    // confirmed: instructor/owner Saima Amir
    lastName: "Amir",
    phone: "647-889-1708",
    // confirmed (site)
    postalCode: "L7R 4B6",
    // confirmed: 23-460 Brant Street, Burlington
    businessName: "Sam's Driving School",
    contactName: "Saima Amir",
    website: "https://samsdriving.ca",
    slug: "sams-driving",
    bio: "Sam's Driving School is an MTO-approved driving school established in 2005, serving Burlington, Milton, and the GTA. Led by instructor Saima Amir, they offer Beginner Driver Education (30h theory + 10h in-car), G2 and G road-test prep, and defensive driving \u2014 with dual-control vehicles, flexible scheduling, and free pickup and drop-off within 10 km.",
    serviceAreas: ["Burlington", "Milton", "Oakville"],
    categorySlugs: ["driving-school"],
    ratingInternal: void 0
  }
];

const SEED_PASSWORD = "ChangeMe123";
async function ensureEmailAuthIdentity(prisma, email, password) {
  const providerId = createProviderId("email", email);
  const existingIdentity = await prisma.authIdentity.findUnique({
    where: { providerName_providerUserId: providerId }
  });
  if (existingIdentity) return;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`Cannot create auth identity: user ${email} not found`);
  }
  const providerData = await sanitizeAndSerializeProviderData({
    hashedPassword: password,
    isEmailVerified: true,
    emailVerificationSentAt: null,
    passwordResetSentAt: null
  });
  await prisma.auth.create({
    data: {
      userId: user.id,
      identities: {
        create: {
          providerName: providerId.providerName,
          providerUserId: providerId.providerUserId,
          providerData
        }
      }
    }
  });
}
async function seedRealProviders(prisma) {
  console.log("Seeding real providers...");
  await seedVendorCategories(prisma);
  for (const p of REAL_PROVIDERS) {
    let user = await prisma.user.findUnique({ where: { email: p.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: p.email,
          username: p.email,
          firstName: p.firstName,
          lastName: p.lastName,
          phone: p.phone || null,
          postalCode: p.postalCode,
          role: "PROVIDER",
          status: "ACTIVE"
        }
      });
    }
    await ensureEmailAuthIdentity(prisma, p.email, SEED_PASSWORD);
    let provider = await prisma.provider.findFirst({ where: { userId: user.id } });
    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          userId: user.id,
          businessName: p.businessName,
          contactName: p.contactName,
          phone: p.phone || "",
          email: p.email,
          website: p.website,
          slug: p.slug,
          bio: p.bio,
          serviceAreas: p.serviceAreas,
          verificationStatus: "VERIFIED",
          active: true,
          ratingInternal: p.ratingInternal ?? null,
          insuranceStatus: true,
          referencesChecked: true,
          onboardingCallDone: true
        }
      });
    }
    for (const slug of p.categorySlugs) {
      const cat = await prisma.serviceCategory.findFirst({ where: { slug } });
      if (!cat) {
        console.warn(`  \u26A0 category slug "${slug}" not found in DB \u2014 skipping for ${p.businessName}`);
        continue;
      }
      const existingLink = await prisma.providerCategory.findFirst({
        where: { providerId: provider.id, serviceCategoryId: cat.id }
      });
      if (!existingLink) {
        await prisma.providerCategory.create({
          data: { providerId: provider.id, serviceCategoryId: cat.id }
        });
      }
    }
    console.log(`  \u2713 ${p.businessName} (${p.slug})`);
  }
  console.log(`Seeded ${REAL_PROVIDERS.length} real providers.`);
}

const seeds = {
  seedMockUsers,
  seedRealProviders
};
async function main() {
  const nameOfSeedToRun = process.env.WASP_DB_SEED_NAME;
  if (nameOfSeedToRun) {
    console.log(`Running seed: ${nameOfSeedToRun}`);
  } else {
    console.error("Name of the seed to run not specified!");
  }
  await seeds[nameOfSeedToRun](dbClient);
}
main().then(async () => {
  await dbClient.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await dbClient.$disconnect();
  process.exit(1);
});
//# sourceMappingURL=dbSeed.js.map

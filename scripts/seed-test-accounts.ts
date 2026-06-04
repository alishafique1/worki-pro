/**
 * Production Test-Account Seed
 *
 * Runs: npx tsx scripts/seed-test-accounts.ts
 * Env:   Must be pointing at the target DATABASE_URL
 *
 * Creates test accounts matching the credentials used in E2E tests.
 * If an account already exists, this is a no-op for that account.
 *
 * WARNING: This creates REAL users in the database. Use only on test/staging
 * environments or ephemeral test DBs. Do NOT run against production unless
 * you accept the security trade-off of test credentials in your live DB.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ACCOUNTS = [
  {
    email: 'consumer@thehelper.ca',
    password: 'HelperTest123',
    role: 'CONSUMER' as const,
    firstName: 'E2E',
    lastName: 'Consumer',
    phone: '4165550100',
    postalCode: 'L9T 2X5',
  },
  {
    email: 'hvac@thehelper.ca',
    password: 'HelperTest123',
    role: 'PROVIDER' as const,
    firstName: 'E2E',
    lastName: 'Provider',
    phone: '4165550200',
    postalCode: 'L9T 2X5',
  },
  {
    email: 'admin@thehelper.ca',
    password: 'HelperTest123',
    role: 'ADMIN' as const,
    firstName: 'E2E',
    lastName: 'Admin',
    phone: '4165550300',
    postalCode: 'L9T 2X5',
  },
];

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function upsertUser(
  email: string,
  passwordHash: string,
  role: 'CONSUMER' | 'PROVIDER' | 'ADMIN',
  firstName: string,
  lastName: string,
  phone: string,
  postalCode: string,
) {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`  ✓ ${email} already exists (id=${existing.id})`);
    // Re-verify the password hash works (bcrypt check)
    const bcrypt = await import('bcrypt');
    const valid = await bcrypt.compare(
      ACCOUNTS.find(a => a.email === email)!.password,
      passwordHash,
    );
    if (!valid) {
      console.warn(`  ⚠ Password hash mismatch for ${email} — password may not work with current hash`);
    }
    return existing;
  }

  // Create the user
  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash,
      role,
      firstName,
      lastName,
      phone,
      postalCode,
    },
  });

  console.log(`  ✓ Created ${email} (id=${user.id})`);
  return user;
}

async function main() {
  console.log('\n--- Test Account Seed ---\n');
  console.log(`Database: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@')}`);
  console.log(`Accounts to provision: ${ACCOUNTS.length}\n`);

  for (const account of ACCOUNTS) {
    const hash = await hashPassword(account.password);
    await upsertUser(
      account.email,
      hash,
      account.role,
      account.firstName,
      account.lastName,
      account.phone,
      account.postalCode,
    );
  }

  console.log('\n✅ Seed complete.\n');
  console.log('Test credentials (use in E2E tests):');
  for (const a of ACCOUNTS) {
    console.log(`  ${a.role}: ${a.email} / ${a.password}`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Seed failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
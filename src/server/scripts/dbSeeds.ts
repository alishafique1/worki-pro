import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { type User } from "wasp/entities";

export async function seedMockUsers(prisma: PrismaClient) {
  console.log("Seeding Worki Sample Data...");

  // 1. Ensure test consumer exists
  let consumer = await prisma.user.findUnique({ where: { username: "test@worki.ai" } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: "test@worki.ai",
        username: "test@worki.ai",
        firstName: "Test",
        lastName: "Consumer",
        role: "CONSUMER",
        status: "ACTIVE",
      }
    });
  }

  // Ensure consumer has a reward account
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

  // 2. Ensure test provider exists
  let providerUser = await prisma.user.findUnique({ where: { username: "pro@worki.ai" } });
  if (!providerUser) {
    providerUser = await prisma.user.create({
      data: {
        email: "pro@worki.ai",
        username: "pro@worki.ai",
        firstName: "Pro",
        lastName: "Worker",
        role: "PROVIDER",
        status: "ACTIVE",
      }
    });
  }

  let provider = await prisma.provider.findFirst({ where: { userId: providerUser.id } });
  if (!provider) {
    provider = await prisma.provider.create({
      data: {
        userId: providerUser.id,
        businessName: "Elite Home Services",
        phone: "555-0199",
        serviceAreas: ["10001", "New York"],
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE"
      }
    });
  }

  // 3. Create Sample Service Requests
  console.log("Creating Sample Requests...");
  
  // A NEW request (waiting to be accepted)
  await prisma.serviceRequest.create({
    data: {
      consumerId: consumer.id,
      name: consumer.firstName || 'Customer',
      phone: "555-1234",
      postalCode: "10001",
      city: "New York",
      description: "Leaking pipe under the kitchen sink, need help ASAP.",
      urgency: "EMERGENCY",
      status: "NEW"
    }
  });

  // An ASSIGNED request (accepted by provider)
  const assignedReq = await prisma.serviceRequest.create({
    data: {
      consumerId: consumer.id,
      name: consumer.firstName || 'Customer',
      phone: "555-5678",
      postalCode: "10001",
      city: "New York",
      description: "Install 2 ceiling fans in bedrooms.",
      urgency: "STANDARD",
      status: "ASSIGNED",
      assignedProviderId: provider.id
    }
  });

  // Create an appointment for the assigned request
  await prisma.appointment.create({
    data: {
      serviceRequestId: assignedReq.id,
      providerId: provider.id,
      consumerId: consumer.id,
      status: "CONFIRMED",
      scheduledAt: new Date(Date.now() + 86400000) // Tomorrow
    }
  });

  console.log("Seeding complete! Check your Consumer and Provider Dashboards.");
}

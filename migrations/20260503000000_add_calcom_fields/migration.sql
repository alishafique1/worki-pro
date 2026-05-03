-- Cal.com integration fields
ALTER TABLE "Provider" ADD COLUMN "calComUsername" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "calComBookingUid" TEXT;

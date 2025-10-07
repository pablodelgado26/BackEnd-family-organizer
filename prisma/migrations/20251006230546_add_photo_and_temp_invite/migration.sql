-- AlterTable
ALTER TABLE "family_groups" ADD COLUMN "tempCodeExpiresAt" DATETIME;
ALTER TABLE "family_groups" ADD COLUMN "tempInviteCode" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "photoUrl" TEXT;

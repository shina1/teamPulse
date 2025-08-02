-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "averageSentiment" TEXT NOT NULL DEFAULT 'neutral',
ADD COLUMN     "memberCount" INTEGER NOT NULL DEFAULT 0;

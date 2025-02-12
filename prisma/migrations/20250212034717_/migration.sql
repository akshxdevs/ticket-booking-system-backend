/*
  Warnings:

  - The values [CANCELLED] on the enum `TICKETSTATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `totalTickets` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VENUE" AS ENUM ('VIP', 'REGULAR', 'BALCONY');

-- AlterEnum
BEGIN;
CREATE TYPE "TICKETSTATUS_new" AS ENUM ('AVAILABLE', 'BOOKED', 'RESERVED');
ALTER TYPE "TICKETSTATUS" RENAME TO "TICKETSTATUS_old";
ALTER TYPE "TICKETSTATUS_new" RENAME TO "TICKETSTATUS";
DROP TYPE "TICKETSTATUS_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "totalTickets";

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "venue" "VENUE" NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `availableTickets` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalTickets` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TICKETSTATUS" AS ENUM ('AVAILABLE', 'BOOKED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "availableTickets" INTEGER NOT NULL,
ADD COLUMN     "totalTickets" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" "TICKETSTATUS" NOT NULL DEFAULT 'AVAILABLE';

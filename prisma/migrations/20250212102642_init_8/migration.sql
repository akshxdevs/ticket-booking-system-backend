/*
  Warnings:

  - You are about to drop the column `seatNumber` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_seatNumber_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "seatNumber";

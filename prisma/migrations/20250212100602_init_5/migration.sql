/*
  Warnings:

  - You are about to drop the column `seatId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `seatNumber` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_seatId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "seatId",
ADD COLUMN     "seatNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seatNumber_fkey" FOREIGN KEY ("seatNumber") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

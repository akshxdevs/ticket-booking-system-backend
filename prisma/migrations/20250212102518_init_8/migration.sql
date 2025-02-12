-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_seatNumber_fkey";

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_seatNumber_fkey" FOREIGN KEY ("seatNumber") REFERENCES "Seat"("seatNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

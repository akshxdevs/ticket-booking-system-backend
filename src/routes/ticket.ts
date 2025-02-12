import express from "express";
import Redis from "ioredis";
import { prismaClient } from "../lib/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateJWT } from "../middleware";
dotenv.config();
const TICKET_SECRET = process.env.TICKET_SECRET as string
export const ticketRouter = express.Router();
const redisClient = new Redis()

async function lockSeat(eventId:string,seatNumber:string,userId:string) {
    
    const checkSeatAvailablity = await prismaClient.seat.findFirst({
        where:{
            seatNumber:seatNumber,
            eventId:eventId
        }
    })
    if (checkSeatAvailablity) {
        return {message:"Seat already reserved!!"}
    }else{
        const lockey = `event:${eventId}:seat:${seatNumber}`;
        const existingLock = await redisClient.get(lockey);
        if (existingLock) {
            return {success:false,message:"Seat already locked by another user"}
        }
        await redisClient.set(lockey,userId,"EX",30);
        return {success:true,message:"Seat locked successfully complete booking within 5 min"}
    }
}
async function confirmBooking(eventId: string, seatNumber: string, userId: string) {
    const lockKey = `event:${eventId}:seat:${seatNumber}`;

    const lockedBy = await redisClient.get(lockKey);
    console.log(lockedBy);
    console.log(seatNumber);
    
    try {
        const ticket = await prismaClient.ticket.create({
            data:{
                userId:userId,
                eventId:eventId,
                price:100,
                seatNumber:seatNumber
            }
        })
        const ticketToken = jwt.sign({
            ticketToken:ticket.id
        },TICKET_SECRET)
        await prismaClient.seat.create({
            data: {
                eventId: eventId,
                userId: userId,
                seatNumber: seatNumber,
                venue:"VIP",
                ticketId:ticket.id
            }
        });
        await prismaClient.event.update({
            where: { id: eventId },
            data: { availableTickets: { decrement: 1 }}
    
        })
        await redisClient.del(lockKey);
        return { success: true, ticketToken, message: "Booking confirmed!" };
    } catch (error) {
        console.error("Error in confirming booking:", error);
        return { success: false, message: "An error occurred while confirming the booking." };
    }
 
}

ticketRouter.post("/lockseat",authenticateJWT,async (req, res) => {
    const { eventId, seatNumber, userId } = req.body;    
    const result = await lockSeat(eventId, seatNumber, userId);
    res.json(result);
});

ticketRouter.post("/confirmbooking",authenticateJWT, async (req, res) => {
    const { eventId, seatNumber, userId } = req.body;
    const result = await confirmBooking(eventId, seatNumber, userId);
    res.json(result);
});




//**ALTERNATIVE METHORD **


// ticketRouter.post("/bookticket/:eventId", authenticateJWT, async (req, res) => {
//     try {
//         const { eventId } = req.params;
//         const userId = req.body.userId;
//         const noOfTickets: number = parseInt(req.body.noOfTickets, 10);

//         // Validate the number of tickets
//         if (isNaN(noOfTickets) || noOfTickets <= 0) {
//             return res.status(400).send({ message: "Invalid number of tickets" });
//         }

//         // Check if there are enough tickets available
//         const event = await prismaClient.event.findUnique({
//             where: { id: eventId },
//             select: { availableTickets: true }
//         });

//         if (!event || event.availableTickets < noOfTickets) {
//             return res.status(400).send({ message: "Not enough tickets available" });
//         }

//         // Start a transaction to ensure atomicity
//         const ticket = await prismaClient.$transaction(async (prisma) => {
//             const newTicket = await prisma.ticket.create({
//                 data: {
//                     userId: userId,
//                     eventId: eventId,
//                     price: 100
//                 }
//             });

//             await prisma.event.update({
//                 where: { id: eventId },
//                 data: { availableTickets: { decrement: noOfTickets }}
//             });

//             return newTicket;
//         });

//         // JWT token creation
//         if (!process.env.TICKET_SECRET) {
//             return res.status(500).send({ message: "Ticket secret not set" });
//         }

//         const ticketToken = await jwt.sign(
//             { ticket: ticket.id },
//             TICKET_SECRET
//         );

//         res.json({
//             ticketToken,
//             message: "Ticket Booked Successfully"
//         });
//     } catch (error) {
//         console.error("Error booking ticket:", error);
//         res.status(500).send({ message: "Something went wrong!" });
//     }
// });


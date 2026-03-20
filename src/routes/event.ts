import express from "express";
import { z } from "zod";
import { prismaClient } from "../lib/db";
import { authenticateJWT } from "../middleware";
export const eventRouter = express.Router();

const eventSchema = z.object({
    eventName:z.string().min(1,"Event name field required"),
    eventDetail:z.string().min(1,"Event name field required"),
    availableTickets:z.number().min(1, "Total tickets must be at least 1")

})
eventRouter.post("/addevent",authenticateJWT,async(req,res)=>{
    try {
        const body = eventSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({message:"Invalid Input",error:body.error.errors})
        }
        const {eventName,eventDetail,availableTickets} = body.data
        await prismaClient.event.create({
            data:{
                eventName:eventName,
                eventDetail:eventDetail,
                availableTickets:availableTickets
            }
        })
        res.json({
            message:"Event Created Successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})
eventRouter.get("/getallevents",async(req,res)=>{
    try {    
        const getAllEvents = await prismaClient.event.findMany({
            where:{
                availableTickets:{gt:0}
            },
            orderBy:{
                eventName:"asc"
            }
        })
        res.json({
            message:"All Events Fetched Successfully",
            events:getAllEvents
        })
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})

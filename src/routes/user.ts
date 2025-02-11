import express, { Request, Response } from "express";
import { z } from "zod";
import { prismaClient } from "../lib/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config()

const SECRET = process.env.USER_SECRET as string;
export const userRouter = express.Router()

const UserSchema = z.object({
    email:z.string().email().min(1,"Email field required"),
    password:z.string().min(1,"Password field required")
    
})

userRouter.post("/signup",async(req:Request,res:Response)=>{
    try {
        const body = UserSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({message:"Invalid Input",error:body.error.errors})
        }
        const existingUser = await prismaClient.user.findFirst({
            where:{
                email:req.body.email
            }
        })
        if (existingUser){
            res.status(402).send({message:"User already exist"})
        }
        const username = "user" + String(Math.floor(Math.random()*1000000)).padStart(6,"0");
        const password = await bcrypt.hash(req.body.password,10)
        await prismaClient.user.create({
            data:{
                username:username,
                email:req.body.email,
                password:password
            }
        })
        res.json({
            message:"User Created Sucessfully"
        })
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})

userRouter.post("/signin",async(req:Request,res:Response)=>{
    try {
        const body = UserSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({message:"Invalid Input",error:body.error.errors})
        }
        const {email,password} = body.data
        const user = await prismaClient.user.findUnique({
            where:{
                email:email,
            }
        })
        if (!user) {
            return res.status(401).send({message:"Invalid Email Or Password!"})
        }
        const passwordValidation = await bcrypt.compare(password,user.password);
        if (!passwordValidation) {
            return res.status(401).send({message:"Password Mismatch!"}) 
        }
        const token = jwt.sign({
            id:user.id
        },SECRET,{expiresIn:"1h"})
        res.json({
            token,
            message:"User Login Sucessfully"
        })  
    } catch (error) {
        console.error(error);
        res.status(403).send({message:"Something went wrong!"})
    }
})

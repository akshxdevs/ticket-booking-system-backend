import { NextFunction, Response } from "express";
import { string } from "zod";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import jwt, { JwtPayload } from "jsonwebtoken"
  
  
export function authenticateJWT(req:Request,res:Response,next:NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token,JWT_SECRET as string);
    if (verified) {
        req.id = verified.id;
        next();
    }else{
        res.status(403).json({
            message:"Not authorized"
        })
    }
}
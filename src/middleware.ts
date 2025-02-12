import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

interface AuthRequest extends Request {
    id?: string
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authenticateJWT(req:AuthRequest,res:Response,next:NextFunction) {
    const token = req.headers["authorization"] as unknown as string;
    const verified:any = jwt.verify(token,JWT_SECRET) as {id:string};
    if (verified) {
        req.id = verified.id;
        next();
    }else{
        res.status(403).json({
            message:"Not authorized"
        })
    }
}
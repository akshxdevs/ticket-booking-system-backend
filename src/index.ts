import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes/user";
import { eventRouter } from "./routes/event";

dotenv.config();

const app = express()
const PORT = process.env.PORT

app.use(express.json());
app.use(cors())

app.use("/api/auth/s1/user",userRouter);
app.use("/api/events",eventRouter);

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})
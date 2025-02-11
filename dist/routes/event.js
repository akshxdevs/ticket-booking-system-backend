"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("../lib/db");
exports.eventRouter = express_1.default.Router();
const eventSchema = zod_1.z.object({
    eventName: zod_1.z.string().min(1, "Event name field required"),
    eventDetail: zod_1.z.string().min(1, "Event name field required"),
    totalTickets: zod_1.z.number().min(1, "Total tickets must be at least 1")
});
exports.eventRouter.post("/addevent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = eventSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({ message: "Invalid Input", error: body.error.errors });
        }
        const { eventName, eventDetail, totalTickets } = body.data;
        yield db_1.prismaClient.event.create({
            data: {
                eventName: eventName,
                eventDetail: eventDetail,
                totalTickets: totalTickets || 100,
                availableTickets: totalTickets
            }
        });
        res.json({
            message: "Event Created Successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));
exports.eventRouter.get("/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllEvents = yield db_1.prismaClient.event.findMany({
            where: {
                availableTickets: { gt: 0 }
            },
            orderBy: {
                eventName: "asc"
            }
        });
        res.json({
            message: "All Events Fetched Successfully",
            evnts: getAllEvents
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));

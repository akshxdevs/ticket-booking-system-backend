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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const db_1 = require("../lib/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const SECRET = process.env.USER_SECRET;
exports.userRouter = express_1.default.Router();
const UserSchema = zod_1.z.object({
    email: zod_1.z.string().email().min(1, "Email field required"),
    password: zod_1.z.string().min(1, "Password field required")
});
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = UserSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({ message: "Invalid Input", error: body.error.errors });
        }
        const existingUser = yield db_1.prismaClient.user.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            res.status(402).send({ message: "User already exist" });
        }
        const username = "user" + String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
        const password = yield bcrypt_1.default.hash(req.body.password, 10);
        yield db_1.prismaClient.user.create({
            data: {
                username: username,
                email: req.body.email,
                password: password
            }
        });
        res.json({
            message: "User Created Sucessfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = UserSchema.safeParse(req.body);
        if (!body.success) {
            return res.status(400).json({ message: "Invalid Input", error: body.error.errors });
        }
        const { email, password } = body.data;
        const user = yield db_1.prismaClient.user.findUnique({
            where: {
                email: email,
            }
        });
        if (!user) {
            return res.status(401).send({ message: "Invalid Email Or Password!" });
        }
        const passwordValidation = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordValidation) {
            return res.status(401).send({ message: "Password Mismatch!" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id
        }, SECRET, { expiresIn: "1h" });
        res.json({
            token,
            message: "User Login Sucessfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).send({ message: "Something went wrong!" });
    }
}));

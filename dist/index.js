"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const event_1 = require("./routes/event");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth/s1/user", user_1.userRouter);
app.use("/api/events", event_1.eventRouter);
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

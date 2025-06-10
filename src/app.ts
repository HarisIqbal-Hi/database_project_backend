import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/authRoutes";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", userRouter);
export default app;
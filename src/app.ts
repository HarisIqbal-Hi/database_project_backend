import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import placeRoutes from "./routes/placeRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import reviewRoutes from "./routes/reviewRoutes";
import achievementRoutes from "./routes/achievementRoutes";

const app = express();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/reviews", reviewRoutes);
app.use("/api/achievements", achievementRoutes);
app.get("/api/hello", (req:any, res:any) => res.send("hello!"));
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);
export default app;

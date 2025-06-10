import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import placeRoutes from "./routes/placeRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import testRoutes from "./routes/testRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSpec from "./swagger";

const app = express();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/hello", (req:any, res:any) => res.send("hello!"));
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api/test", testRoutes);
app.use(errorHandler);
export default app;

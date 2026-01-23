import express, { type Request, type Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import authRouter from "./routes/authRoute";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import teachersRouter from "./routes/teachersRoute";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet({ crossOriginResourcePolicy: false }));

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.use("/api/auth", authRouter);
app.use("/api/teacher", teachersRouter);

// global error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

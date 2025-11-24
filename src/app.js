import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Load ENV
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------- PARSERS -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- CORS -------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",

];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ------------------- SECURITY -------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
);

// ------------------- LOGGING -------------------
app.use(morgan("dev"));

// ------------------- RATE LIMIT -------------------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests — slow down.",
  })
);

// ------------------- HEALTH CHECK -------------------
app.get("/", (req, res) => {
  res.send("🔥 Backend Running...");
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

export default app;

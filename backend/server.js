// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import courseRoutes from "./routes/courseRoutes.js";
// import progressRoutes from "./routes/progressRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();

// // Allow any localhost / 127.0.0.1 port (Vite may pick 5174, 5175... if 5173 is busy)
// ///^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
// const allowedOrigin = [
// "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5175",
//   "https://dynamic-learning-path-recommondation-2.onrender.com"];

// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin || allowedOrigin.test(origin) || origin === process.env.CLIENT_URL) {
//       return cb(null, true);
//     }
//     cb(new Error("Not allowed by CORS"));
//   },
//   credentials: true
// }));
// app.use(express.json()); 

// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/progress", progressRoutes);

// app.get("/", (req, res) => {
//   res.send("API is running");
// });

// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// server.on("error", (err) => {
//   if (err.code === "EADDRINUSE") {
//     console.error(`\n Port ${PORT} is already in use.`);
//     console.error("   (On macOS, port 5000 is used by AirPlay Receiver - change PORT in backend/.env, e.g. PORT=5001,");
//     console.error("    and set VITE_API_URL=http://localhost:5001/api in frontend/.env)\n");
//     process.exit(1);
//   }
//   throw err;
// });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "https://dynamic-learning-path-recommondation-2.onrender.com"
];

// CORS configuration
app.use(
  cors({
    origin: (origin, cb) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin === process.env.CLIENT_URL
      ) {
        return cb(null, true);
      }

      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Parse incoming JSON requests
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Server error handling
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error(
      "Change PORT in backend/.env for local development if necessary."
    );
    process.exit(1);
  }

  throw err;
});

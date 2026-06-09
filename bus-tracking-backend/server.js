require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const logger = require("./utils/logger");

const socketHandler =
  require("./sockets/socketHandler");

const routeRoutes =
  require("./routes/routeRoutes");

const routeDetails =
  require("./routes/routeDetails");



const app = express();

const server =
  http.createServer(app);

// MIDDLEWARE
app.use(helmet());
app.use(cors());

app.use(express.json());

// REQUEST LOGGING
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // allow 200 requests per 15 minutes per IP
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// DATABASE
connectDB();

// ROUTES
app.use("/api/routes", routeRoutes);

app.use(
  "/api/route-details",
  routeDetails
);



const etaRoutes =
  require("./routes/etaRoutes");
app.use("/api/eta", etaRoutes);

const stopRoutes =
  require("./routes/stopRoutes");
app.use("/api/stops", stopRoutes);


// TEST ROUTE
app.get("/", (req, res) => {

  res.send("Bus Tracking API running");

});

//transfer routes
const transferRoutes =
  require("./routes/transferRoutes");

app.use(
  "/api/transfers",
  transferRoutes
);
console.log("Transfer Routes Loaded");

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
    mongo: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// SOCKET
socketHandler(server);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  logger.error("Express App Error", err, { url: req.url, method: req.method });
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// SERVER
const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
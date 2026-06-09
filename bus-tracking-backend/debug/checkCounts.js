require("dotenv").config();
const mongoose = require("mongoose");

const Stop = require("../models/Stops");
const Route = require("../models/Route");
const RouteStop = require("../models/RouteStop");

async function checkCounts() {

  await mongoose.connect(process.env.MONGO_URI);

  const stopCount =
    await Stop.countDocuments();

  const routeCount =
    await Route.countDocuments();

  const routeStopCount =
    await RouteStop.countDocuments();

  console.log("Stops:", stopCount);
  console.log("Routes:", routeCount);
  console.log("RouteStops:", routeStopCount);

  process.exit();
}

checkCounts();
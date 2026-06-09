require("dotenv").config();

const mongoose = require("mongoose");


const Stop = require("../models/Stops");
const Route = require("../models/Route");
const RouteStop = require("../models/RouteStop");

mongoose.connect(process.env.MONGO_URI);

async function showRoute() {

  const routeStops = await RouteStop.find()
    .populate("stopId")
    .sort({ stopSequence: 1 });

  routeStops.forEach((rs) => {

    console.log(
      rs.stopSequence,
      rs.stopId.stopName,
      rs.stopId.location.coordinates
    );

  });

  mongoose.connection.close();
}

showRoute();
require("dotenv").config();

const mongoose = require("mongoose");

const Stop = require("../models/Stops");

mongoose.connect(process.env.MONGO_URI);

async function listStops() {

  const stops = await Stop.find()
    .limit(100);

  console.log("TOTAL STOPS:", stops.length);

  stops.forEach((stop) => {

    console.log(stop.stopName);

  });

  mongoose.connection.close();
}

listStops();
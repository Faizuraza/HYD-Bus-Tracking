require("dotenv").config();

const mongoose = require("mongoose");

const Bus = require("../models/Bus");
const Route = require("../models/Route");

mongoose.connect(process.env.MONGO_URI);

async function importBuses() {

  await Bus.deleteMany();

  const route216 = await Route.findOne({
    routeNumber: "216"
  });

  const buses = [

    {
      busNumber: "TS09-1001",
      routeId: route216._id
    },

    {
      busNumber: "TS09-1002",
      routeId: route216._id
    }

  ];

  await Bus.insertMany(buses);

  console.log("Buses imported");

  mongoose.connection.close();
}

importBuses();
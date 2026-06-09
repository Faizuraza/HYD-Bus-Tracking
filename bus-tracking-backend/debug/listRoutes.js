require("dotenv").config();
const mongoose = require("mongoose");
const Route = require("../models/Route");

mongoose.connect(process.env.MONGO_URI);

async function run() {
  const routes = await Route.find().sort({
    routeNumber: 1
  });

  console.table(
    routes.map(r => ({
      routeNumber: r.routeNumber
    }))
  );

  process.exit();
}

run();
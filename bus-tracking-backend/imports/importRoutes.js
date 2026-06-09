require("dotenv").config();

const fs = require("fs");

const mongoose =
  require("mongoose");

const Route =
  require("../models/Route");

mongoose.connect(
  process.env.MONGO_URI
);

async function importRoutes() {

  try {

    await Route.deleteMany();

    // NORMAL ROUTES

    const normalRoutes =
      fs.readFileSync(

        "./data/route_ids.txt",

        "utf-8"
      );

    const normalLines =
      normalRoutes.split("\n");

    // VOLVO ROUTES

    const volvoRoutes =
      fs.readFileSync(

        "./data/routes_volvo_ids.txt",

        "utf-8"
      );

    const volvoLines =
      volvoRoutes.split("\n");

    // IMPORT NORMAL ROUTES

    for (
      let i = 1;
      i < normalLines.length;
      i++
    ) {

      const line =
        normalLines[i].trim();

      if (!line)
        continue;

      const [
        routeNumber,
        routeId,
        originDestination
      ] = line.split(",");

      const [
        origin,
        destination
      ] =
        originDestination.split(" TO ");

      await Route.create({

        routeNumber,

        routeId:
          Number(routeId),

        origin:
          origin?.trim(),

        destination:
          destination?.trim(),

        isVolvo: false

      });

    }

    // IMPORT VOLVO ROUTES

    for (
      let i = 1;
      i < volvoLines.length;
      i++
    ) {

      const line =
        volvoLines[i].trim();

      if (!line)
        continue;

      const [
        routeNumber,
        routeId,
        originDestination
      ] = line.split(",");

      const [
        origin,
        destination
      ] =
        originDestination.split(" TO ");

      await Route.create({

        routeNumber,

        routeId:
          Number(routeId),

        origin:
          origin?.trim(),

        destination:
          destination?.trim(),

        isVolvo: true

      });

    }

    console.log(
      "Routes imported successfully"
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

importRoutes();
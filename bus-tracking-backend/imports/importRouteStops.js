require("dotenv").config();

const fs = require("fs");

const mongoose =
  require("mongoose");

const Stop =
  require("../models/Stops");

const Route =
  require("../models/Route");

const RouteStop =
  require("../models/RouteStop");

mongoose.connect(
  process.env.MONGO_URI
);

// NORMALIZE

function normalizeName(name) {

  return name
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/\s+/g, "")
    .trim();

}

async function importRouteStops() {

  try {

    // CLEAR OLD GRAPH

    await RouteStop.deleteMany();

    const raw =
      fs.readFileSync(

        "./data/route_stops_order.txt",

        "utf-8"
      );

    const lines =
      raw.split("\n");

    // TRACK SEQUENCE
    const routeSequenceMap =
      {};

    let importedCount = 0;

    for (
      let i = 0;
      i < lines.length;
      i++
    ) {

      const line =
        lines[i].trim();

      if (!line)
        continue;

      const [
        stopId,
        lat,
        lng,
        stopName,
        routeNumber
      ] = line.split(",");

      // FIND ROUTE

      const route =
        await Route.findOne({

          routeNumber:
            routeNumber.trim()

        });

      if (!route) {

        console.log(
          `Route not found: ${routeNumber}`
        );

        continue;

      }

      // FIND STOP

      const stop =
        await Stop.findOne({

          normalizedName:
            normalizeName(stopName)

        });

      if (!stop) {

        console.log(
          `Stop not found: ${stopName}`
        );

        continue;

      }

      // MAINTAIN SEQUENCE

      if (
        !routeSequenceMap[
          routeNumber
        ]
      ) {

        routeSequenceMap[
          routeNumber
        ] = 1;

      }

      const stopSequence =
        routeSequenceMap[
          routeNumber
        ];

      // CREATE GRAPH EDGE

      await RouteStop.create({

        routeId:
          route._id,

        stopId:
          stop._id,

        stopSequence

      });

      routeSequenceMap[
        routeNumber
      ]++;

      importedCount++;

    }

    console.log(
      `Imported ${importedCount} RouteStops`
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

importRouteStops();
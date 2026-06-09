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

// ======================================
// NORMALIZE
// ======================================

function normalizeName(name) {

  if (!name)
    return "";

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

}

// ======================================
// IMPORT TRANSIT DATA
// ======================================

async function importTransitData() {

  try {

    console.log(
      "Starting transit import..."
    );

    // CLEAR DATABASE

    await Stop.deleteMany();

    await Route.deleteMany();

    await RouteStop.deleteMany();

    // READ FILE

    const raw =
      fs.readFileSync(

        "./data/route_stops_order.txt",

        "utf-8"

      );

    const lines =
      raw
        .split("\n")
        .filter(Boolean);

    // CACHE

    const stopMap =
      new Map();

    const routeMap =
      new Map();

    // GROUP ROUTES

    const groupedRoutes =
      {};

    // ======================================
    // GROUP ALL ROUTE STOPS
    // ======================================

    for (const line of lines) {

      let [

        stopId,

        lat,

        lng,

        stopName,

        routeNumber

      ] = line.split(",");

      // CLEAN VALUES

      stopId =
        stopId?.trim();

      lat =
        lat?.trim();

      lng =
        lng?.trim();

      stopName =
        stopName?.trim();

      routeNumber =
        routeNumber?.trim();

      // VALIDATION

      if (

        !stopId ||
        !lat ||
        !lng ||
        !stopName ||
        !routeNumber

      ) {
        continue;
      }

      // CREATE ROUTE GROUP

      if (
        !groupedRoutes[
          routeNumber
        ]
      ) {

        groupedRoutes[
          routeNumber
        ] = [];

      }

      groupedRoutes[
        routeNumber
      ].push({

        stopId,
        lat,
        lng,
        stopName

      });

    }

    // ======================================
    // PROCESS EACH ROUTE
    // ======================================

    for (
      const routeNumber
      in groupedRoutes
    ) {

      console.log(
        `Processing Route ${routeNumber}`
      );

      // CREATE ROUTE

      const route =
        await Route.create({

          routeNumber,

          isVolvo: false

        });

      routeMap.set(
        routeNumber,
        route
      );

      const routeStops =
        groupedRoutes[
          routeNumber
        ];

      // PROCESS STOPS

      for (
        let i = 0;
        i < routeStops.length;
        i++
      ) {

        const stopData =
          routeStops[i];

        const uniqueKey =

          normalizeName(
            stopData.stopName
          );

        // FIND EXISTING STOP

        let stop =
          stopMap.get(
            uniqueKey
          );

        // CREATE STOP IF NOT EXISTS

        if (!stop) {

          stop =
            await Stop.create({

              stopId:
                Number(
                  stopData.stopId
                ),

              stopName:
                stopData.stopName,

              normalizedName:

                normalizeName(
                  stopData.stopName
                ),

              location: {

                type: "Point",

                coordinates: [

                  Number(
                    stopData.lng
                  ),

                  Number(
                    stopData.lat
                  )

                ]

              }

            });

          stopMap.set(
            uniqueKey,
            stop
          );

        }

        // CREATE ROUTE STOP

        await RouteStop.create({

          routeId:
            route._id,

          stopId:
            stop._id,

          stopSequence:
            i + 1

        });

      }

    }

    console.log(
      "\nTransit import completed"
    );

    console.log(
      `Stops Imported: ${stopMap.size}`
    );

    console.log(
      `Routes Imported: ${routeMap.size}`
    );

    process.exit();

  } catch (error) {

    console.error(error);

    process.exit(1);

  }

}

importTransitData();
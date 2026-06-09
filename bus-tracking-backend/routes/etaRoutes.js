const express =
  require("express");

const router =
  express.Router();

const Stop =
  require("../models/Stops");

const Route =
  require("../models/Route");

const RouteStop =
  require("../models/RouteStop");

const { z } = require("zod");
const validate = require("../utils/validate");

const nearestBusSchema = z.object({
  query: z.object({
    stopName: z.string().trim().min(1, "stopName is required"),
    routeNumber: z.string().trim().min(1, "routeNumber is required"),
  }),
});

const busEngine =
  require(
    "../services/busEngine"
  );

const {

  findNearestBus

} = require(
  "../utils/calculateETA"
);

// =====================================
// NORMALIZE
// =====================================

function normalizeName(name) {

  if (!name)
    return "";

  return name

    .toLowerCase()

    .replace(/[^a-z0-9]/g, "")

    .trim();

}

// =====================================
// ETA API
// =====================================

router.get(
  "/nearest-bus",
  validate(nearestBusSchema),
  async (req, res) => {

    try {

      const {

        stopName,

        routeNumber

      } = req.query;

      // FIND STOP

      const stop =
        await Stop.findOne({

          normalizedName:
            normalizeName(
              stopName
            )

        });

      if (!stop) {

        return res
          .status(404)
          .json({

            message:
              "Stop not found"

          });

      }

      // FIND ROUTE

      const route =
        await Route.findOne({

          routeNumber

        });

      if (!route) {

        return res
          .status(404)
          .json({

            message:
              "Route not found"

          });

      }

      // VERIFY STOP EXISTS ON ROUTE

      const routeStop =
        await RouteStop.findOne({

          routeId:
            route._id,

          stopId:
            stop._id

        });

      if (!routeStop) {

        return res
          .status(404)
          .json({

            message:
              "Stop not on route"

          });

      }

      // DEBUG

      console.log(
  "BUS COUNT:",
  busEngine.buses.length
);

console.log(
  busEngine.buses[0]
);

      // FILTER ROUTE BUSES

      const routeBuses =
        busEngine.buses.filter(

          (bus) =>

            bus.routeNumber ===
            routeNumber

        );

      if (
        routeBuses.length === 0
      ) {

        return res.json({

          routeNumber,

          stopName,

          message:
            "No live buses available"

        });

      }

      // FIND NEAREST BUS

      const result =
        findNearestBus(

          routeBuses,

          stop.location
          .coordinates,

          routeNumber

        );

      // RESPONSE

      res.json({

        success: true,

        routeNumber,

        stopName,

        nearestBus:

          result.nearestBus
          ?.busNumber,

        distance:
          result.distance,

        eta:
          `${result.eta} mins`,

        liveBusCount:
          routeBuses.length

      });

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .json({

          message:
            "Server Error"

        });

    }

  }
);

module.exports = router;
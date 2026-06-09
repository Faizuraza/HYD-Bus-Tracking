const express = require("express");
const router = express.Router();

const Stop = require("../models/Stops");
const RouteStop = require("../models/RouteStop");
const { z } = require("zod");
const validate = require("../utils/validate");

const journeySchema = z.object({
  query: z.object({
    from: z.string().trim().min(2, "From location must be at least 2 characters"),
    to: z.string().trim().min(2, "To location must be at least 2 characters"),
  }),
});

// ======================================
// NORMALIZE FUNCTION
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
// JOURNEY PLANNER
// ======================================

router.get(
  "/journey",
  validate(journeySchema),
  async (req, res) => {

    try {

      const { from, to } = req.query;

      // ==============================
      // FIND SOURCE & DESTINATION
      // ==============================

      const fromStop =
        await Stop.findOne({

          normalizedName:
            normalizeName(from)

        });

      const toStop =
        await Stop.findOne({

          normalizedName:
            normalizeName(to)

        });

      if (!fromStop || !toStop) {

        return res.status(404).json({
          message: "Stops not found"
        });

      }

      // ==============================
      // FIND ROUTES CONTAINING SOURCE
      // ==============================

      const sourceRoutes =
        await RouteStop.find({

          stopId: fromStop._id

        }).populate("routeId");

      // ==============================
      // FIND ROUTES CONTAINING DEST
      // ==============================

      const destinationRoutes =
        await RouteStop.find({

          stopId: toStop._id

        }).populate("routeId");

      if (sourceRoutes.length === 0 || destinationRoutes.length === 0) {
        return res.json({
          success: true,
          transferFound: false,
          message: "No transfer route found"
        });
      }

      // ==============================
      // BATCH FETCH ALL ROUTE STOPS (FIX N+1 PROBLEM)
      // ==============================
      const sourceRouteIds = sourceRoutes.map(sr => sr.routeId._id);
      const destRouteIds = destinationRoutes.map(dr => dr.routeId._id);
      const uniqueRouteIds = Array.from(new Set([...sourceRouteIds, ...destRouteIds]));

      const allRouteStops = await RouteStop.find({
        routeId: { $in: uniqueRouteIds }
      }).populate("stopId");

      // Group in memory
      const stopsByRoute = {};
      for (const rs of allRouteStops) {
        if (!rs.routeId || !rs.stopId) continue;
        const rId = rs.routeId.toString();
        if (!stopsByRoute[rId]) {
          stopsByRoute[rId] = [];
        }
        stopsByRoute[rId].push(rs);
      }

      // Sort by sequence in memory
      for (const rId in stopsByRoute) {
        stopsByRoute[rId].sort((a, b) => a.stopSequence - b.stopSequence);
      }

      // ==============================
      // SEARCH FOR COMMON TRANSFER STOP IN MEMORY
      // ==============================

      for (const sourceRoute of sourceRoutes) {
        if (!sourceRoute.routeId) continue;
        const sourceStops = stopsByRoute[sourceRoute.routeId._id.toString()] || [];

        for (const destinationRoute of destinationRoutes) {
          if (!destinationRoute.routeId) continue;
          const destinationStops = stopsByRoute[destinationRoute.routeId._id.toString()] || [];

          // ==========================
          // CHECK COMMON STOP
          // ==========================

          for (const stopA of sourceStops) {

            const commonStop =
              destinationStops.find(

                stopB =>

                  stopB.stopId._id.toString() ===
                  stopA.stopId._id.toString()

              );

            if (commonStop) {

              // ======================
              // ETA CALCULATION
              // ======================

              const firstLegStops =
                sourceStops.length;

              const secondLegStops =
                destinationStops.length;

              const totalStops =

                firstLegStops +
                secondLegStops;

              const estimatedTime =
                Math.floor(
                  totalStops * 1.2
                ) + " mins";

              // ======================
              // RETURN JOURNEY PLAN
              // ======================

              return res.json({

                success: true,

                transferFound: true,

                journeyType:
                  "transfer",

                recommended: true,

                from:
                  fromStop.stopName,

                to:
                  toStop.stopName,

                transferStop:
                  stopA.stopId.stopName,

                estimatedTime,

                totalStops,

                steps: [

                  {

                    type: "bus",

                    route:
                      sourceRoute
                      .routeId
                      .routeNumber,

                    boardAt:
                      fromStop.stopName

                  },

                  {

                    type: "transfer",

                    stop:
                      stopA.stopId.stopName

                  },

                  {

                    type: "bus",

                    route:
                      destinationRoute
                      .routeId
                      .routeNumber,

                    destination:
                      toStop.stopName

                  }

                ]

              });

            }

          }

        }

      }

      // ==============================
      // NO TRANSFER FOUND
      // ==============================

      return res.json({

        success: true,

        transferFound: false,

        message:
          "No transfer route found"

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message: "Server Error"

      });

    }

  }
);

module.exports = router;
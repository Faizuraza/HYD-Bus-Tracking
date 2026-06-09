const express = require("express");

const router = express.Router();

const Stop = require("../models/Stops");
const Route = require("../models/Route");
const RouteStop = require("../models/RouteStop");
const { z } = require("zod");
const validate = require("../utils/validate");

const searchSchema = z.object({
  query: z.object({
    from: z.string().trim().min(2, "From location must be at least 2 characters"),
    to: z.string().trim().min(2, "To location must be at least 2 characters"),
  }),
});

const routeNumberParamsSchema = z.object({
  params: z.object({
    routeNumber: z.string().trim().min(1, "Route number is required"),
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
// SEARCH ROUTES SUMMARY
// ======================================

router.get(
  "/search",
  validate(searchSchema),
  async (req, res) => {

    try {

      const { from, to } =
        req.query;

      // FIND FROM STOP

      const fromStop =
        await Stop.findOne({

          normalizedName:
            normalizeName(from)

        });

      // FIND TO STOP

      const toStop =
        await Stop.findOne({

          normalizedName:
            normalizeName(to)

        });

      if (!fromStop || !toStop) {

        return res.status(404).json({
          message:
            "Stops not found"
        });

      }

      // FIND ROUTE STOPS

      const fromRouteStops =
        await RouteStop.find({

          stopId:
            fromStop._id

        });

      const toRouteStops =
        await RouteStop.find({

          stopId:
            toStop._id

        });

      const matchedRoutes = [];
      const matchedPairs = [];
      const matchedRouteIds = new Set();

      // MATCH ROUTES

      for (const fromRS of fromRouteStops) {

        for (const toRS of toRouteStops) {

          // SAME ROUTE

          if (

            fromRS.routeId.toString() ===
            toRS.routeId.toString()

          ) {

            const isForward =

              fromRS.stopSequence <
              toRS.stopSequence;

            const isReverse =

              fromRS.stopSequence >
              toRS.stopSequence;

            // ALLOW BOTH DIRECTIONS

            if (
              isForward ||
              isReverse
            ) {

              matchedPairs.push({ fromRS, toRS, isForward });
              matchedRouteIds.add(fromRS.routeId.toString());

            }

          }

        }

      }

      // BATCH FETCH ALL MATCHED ROUTES (FIX N+1 PROBLEM)
      const routesList = await Route.find({ _id: { $in: Array.from(matchedRouteIds) } });
      const routeMap = new Map(routesList.map(r => [r._id.toString(), r]));

      for (const pair of matchedPairs) {
        const route = routeMap.get(pair.fromRS.routeId.toString());
        if (!route) continue;

        const stopCount =
          Math.abs(

            pair.toRS.stopSequence -
            pair.fromRS.stopSequence

          );

        matchedRoutes.push({

          routeNumber:
            route.routeNumber,

          routeId:
            route._id,

          stopCount,

          from:
            fromStop.stopName,

          to:
            toStop.stopName,

          direction:

            pair.isForward
              ? "forward"
              : "reverse",

          estimatedTime:

            Math.floor(
              stopCount * 1.5
            ) + " mins"

        });
      }

      // REMOVE DUPLICATES

      // REMOVE DUPLICATES

const uniqueRoutes =
  matchedRoutes.filter(
    (route, index, self) =>
      index ===
      self.findIndex(
        (r) =>
          r.routeNumber ===
          route.routeNumber
      )
  );

// SORT BY ETA

uniqueRoutes.sort(
  (a, b) =>
    parseInt(a.estimatedTime) -
    parseInt(b.estimatedTime)
);

// ADD RANKING

const rankedRoutes =
  uniqueRoutes.map(
    (route, index) => ({

      ...route,

      rank: index + 1,

      recommended:
        index === 0

    })
  );

res.json(rankedRoutes);

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  }
);

// ======================================
// FULL ROUTE DETAILS
// ======================================

router.get(
  "/:routeNumber",
  validate(routeNumberParamsSchema),
  async (req, res) => {

    try {

      const { routeNumber } =
        req.params;

      const route =
        await Route.findOne({

          routeNumber

        });

      if (!route) {

        return res.status(404).json({

          message:
            "Route not found"

        });

      }

      const routeStops =
        await RouteStop.find({

          routeId:
            route._id

        })

        .sort({

          stopSequence: 1

        })

        .populate("stopId");

      res.json({

        routeNumber:
          route.routeNumber,

        stops:
          routeStops.map(
            (rs) => ({

              stopName:
                rs.stopId.stopName,

              coordinates:
                rs.stopId
                .location
                .coordinates

            })
          )

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

  }
);

module.exports = router;
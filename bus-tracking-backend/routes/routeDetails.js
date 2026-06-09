const express = require("express");

const router = express.Router();

const Route = require("../models/Route");
const RouteStop = require("../models/RouteStop");

router.get("/:routeNumber", async (req, res) => {

  try {

    const route =
      await Route.findOne({
        routeNumber:
          req.params.routeNumber
      });

    if (!route) {

      return res.status(404).json({
        message: "Route not found"
      });

    }

    const routeStops =
      await RouteStop.find({
        routeId: route._id
      })
      .sort({ stopSequence: 1 })
      .populate("stopId");

    const formattedStops =
      routeStops.map((rs) => ({

        stopName:
          rs.stopId.stopName,

        coordinates:
          rs.stopId.location.coordinates

      }));

    res.json({
      routeNumber:
        route.routeNumber,

      routeName:
        route.routeName,

      stops:
        formattedStops
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;
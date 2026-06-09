const mongoose = require("mongoose");

const routeStopSchema =
  new mongoose.Schema({

    routeId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Route"

    },

    stopId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Stop"

    },

    stopSequence: Number

  });

routeStopSchema.index({ routeId: 1, stopSequence: 1 });
routeStopSchema.index({ stopId: 1 });

module.exports =
  mongoose.model(
    "RouteStop",
    routeStopSchema
  );
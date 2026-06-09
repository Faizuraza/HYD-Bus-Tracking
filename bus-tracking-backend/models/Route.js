const mongoose = require("mongoose");

const routeSchema =
  new mongoose.Schema({

    routeNumber: {
      type: String,
      index: true
    },

    routeId: Number,

    origin: String,

    destination: String,

    isVolvo: {
      type: Boolean,
      default: false
    }

  });

routeSchema.index({ routeNumber: 1 });

module.exports =
  mongoose.model(
    "Route",
    routeSchema
  );
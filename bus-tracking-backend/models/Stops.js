const mongoose = require("mongoose");

const stopSchema =
  new mongoose.Schema({

    stopId: Number,

    stopName: String,

    normalizedName: {
      type: String,
      index: true
    },

    location: {

      type: {
        type: String,
        default: "Point"
      },

      coordinates: [Number]

    }

  });

stopSchema.index({
  location: "2dsphere"
});

module.exports =
  mongoose.model(
    "Stop",
    stopSchema
  );
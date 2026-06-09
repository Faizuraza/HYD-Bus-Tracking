const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({

  busNumber: String,

  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route"
  },

  currentStopIndex: {
    type: Number,
    default: 0
  },

  location: {

    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },

    coordinates: [Number]

  },

  status: {
    type: String,
    default: "Running"
  }

});

module.exports = mongoose.model("Bus", busSchema);
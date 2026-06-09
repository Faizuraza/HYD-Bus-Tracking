const mongoose = require("mongoose");

const stopTimeSchema = new mongoose.Schema({

  tripId: {
    type: String,
    required: true
  },

  stopId: {
    type: String,
    required: true
  },

  normalizedName: {
    type: String,
  },

  stopSequence: Number,

  arrivalTime: String,

  departureTime: String

});

module.exports = mongoose.model("StopTime", stopTimeSchema);
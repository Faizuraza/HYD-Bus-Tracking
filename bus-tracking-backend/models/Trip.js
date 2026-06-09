const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({

  routeId: {
    type: String,
    required: true
  },

  serviceId: String,

  tripId: {
    type: String,
    required: true,
    unique: true
  },

  headsign: String

});

module.exports = mongoose.model("Trip", tripSchema);
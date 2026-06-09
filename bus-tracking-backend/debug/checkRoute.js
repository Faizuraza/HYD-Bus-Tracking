require("dotenv").config();

const mongoose =
  require("mongoose");

const Stop =
  require("../models/Stops");

const RouteStop =
  require("../models/RouteStop");

mongoose.connect(
  process.env.MONGO_URI
);

function normalizeName(name) {

  if (!name)
    return "";

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

}

async function check() {

  const from =
    "lb nagar";

  const to =
    "uppal x road";

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

  console.log(
    "\nFROM STOP:"
  );

  console.log(fromStop);

  console.log(
    "\nTO STOP:"
  );

  console.log(toStop);

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

  console.log(
    "\nFROM ROUTE STOPS:"
  );

  console.log(fromRouteStops);

  console.log(
    "\nTO ROUTE STOPS:"
  );

  console.log(toRouteStops);

  process.exit();

}

check();
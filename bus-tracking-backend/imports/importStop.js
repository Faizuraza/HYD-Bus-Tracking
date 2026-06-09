require("dotenv").config();

const fs = require("fs");

const mongoose =
  require("mongoose");

const Stop =
  require("../models/Stops");

mongoose.connect(
  process.env.MONGO_URI
);

function normalizeName(name) {

  return name
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/\s+/g, "")
    .trim();

}

async function importStops() {

  const raw =
    fs.readFileSync(
      "./data/stops_id.txt",
      "utf-8"
    );

  const lines =
    raw.split("\n");

  await Stop.deleteMany();

  for (
    let i = 1;
    i < lines.length;
    i++
  ) {

    const line =
      lines[i].trim();

    if (!line)
      continue;

    const [
      stopId,
      stopName,
      lat,
      lng
    ] = line.split(",");

    await Stop.create({

      stopId:
        Number(stopId),

      stopName,

      normalizedName:
        normalizeName(stopName),

      location: {

        type: "Point",

        coordinates: [
          Number(lng),
          Number(lat)
        ]

      }

    });

  }

  console.log(
    "Stops imported"
  );

  process.exit();

}

importStops();
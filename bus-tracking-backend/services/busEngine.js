const Route =
  require("../models/Route");

const RouteStop =
  require("../models/RouteStop");

let buses = [];

async function initializeBuses() {

  const routes =
    await Route.find();

  for (const route of routes) {

    const stops =
      await RouteStop.find({

        routeId:
          route._id

      })

      .sort({
        stopSequence: 1
      })

      .populate("stopId");

    if (stops.length < 2)
      continue;

    // CREATE 2 BUSES PER ROUTE

    for (let i = 0; i < 2; i++) {

      buses.push({
        

        busNumber:
          `${route.routeNumber}-${i + 1}`,

        routeNumber:
          route.routeNumber,

        stops,

        currentStopIndex:
          i,

        progress: 0,

        direction:
          1,

        coordinates:

          stops[i]
          .stopId
          .location
          .coordinates

      });
      console.log(
  "BUS CREATED:",
  route.routeNumber
);

    }

  }

}

// ========================================
// MOVE BUSES
// ========================================

function moveBuses() {

  buses.forEach((bus) => {

    const stops =
      bus.stops;

    const current =
      stops[
        bus.currentStopIndex
      ];

    const next =
      stops[
        bus.currentStopIndex +
        bus.direction
      ];

    if (!current || !next)
      return;

    const currentCoords =
      current.stopId.location
      .coordinates;

    const nextCoords =
      next.stopId.location
      .coordinates;

    // INCREASE PROGRESS

    bus.progress += 0.02;

    // INTERPOLATE

    const lng =

      currentCoords[0] +

      (
        nextCoords[0] -
        currentCoords[0]
      ) * bus.progress;

    const lat =

      currentCoords[1] +

      (
        nextCoords[1] -
        currentCoords[1]
      ) * bus.progress;

    bus.coordinates = [
      lng,
      lat
    ];

    // REACHED NEXT STOP

    if (bus.progress >= 1) {

      bus.progress = 0;

      bus.currentStopIndex +=
        bus.direction;

      // REVERSE AT END

      if (

        bus.currentStopIndex ===
        stops.length - 1

      ) {

        bus.direction = -1;

      }

      // REVERSE AT START

      if (

        bus.currentStopIndex === 0

      ) {

        bus.direction = 1;

      }

    }

  });

}

module.exports = {

  get buses(){
    return buses;
  },

  initializeBuses,

  moveBuses

};
setTimeout(() => {

  console.log(
    "LIVE BUSES:",
    buses.length
  );

  console.log(
    buses.slice(0, 5)
  );

}, 5000);
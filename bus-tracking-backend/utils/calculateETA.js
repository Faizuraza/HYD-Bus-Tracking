function calculateDistance(
  lat1,
  lng1,
  lat2,
  lng2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI / 180;

  const dLng =
    (lng2 - lng1) *
    Math.PI / 180;

  const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(
      lat1 * Math.PI / 180
    ) *

    Math.cos(
      lat2 * Math.PI / 180
    ) *

    Math.sin(dLng / 2) *

    Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}

// =====================================
// FIND NEAREST BUS
// =====================================

function findNearestBus(

  buses,

  userStopCoords,

  routeNumber

) {

  const filteredBuses =
    buses.filter(

      (bus) =>

        bus.routeNumber ===
        routeNumber

    );

  let nearestBus = null;

  let minDistance =
    Infinity;

  filteredBuses.forEach((bus) => {

    const distance =
      calculateDistance(

        userStopCoords[1],
        userStopCoords[0],

        bus.coordinates[1],
        bus.coordinates[0]

      );

    if (
      distance < minDistance
    ) {

      minDistance =
        distance;

      nearestBus = bus;

    }

  });

  // ASSUME 25 KM/H AVG SPEED

  const etaMinutes =

    Math.max(

      1,

      Math.floor(
        (minDistance / 25) * 60
      )

    );

  return {

    nearestBus,

    distance:
      minDistance.toFixed(2),

    eta:
      etaMinutes

  };

}

module.exports = {

  calculateDistance,

  findNearestBus

};
const {

  buses,

  initializeBuses,

  moveBuses

} = require(
  "./services/busEngine"
);

module.exports = async (io) => {

  // =====================================
  // INITIALIZE BUSES FIRST
  // =====================================

  await initializeBuses();

  console.log(
    "LIVE BUSES:",
    buses.length
  );

  // =====================================
  // SOCKET CONNECTION
  // =====================================

  io.on(
    "connection",
    (socket) => {

      console.log(
        "Client connected:",
        socket.id
      );

      socket.on(
        "disconnect",
        () => {

          console.log(
            "Client disconnected:",
            socket.id
          );

        }
      );

    }
  );

  // =====================================
  // LIVE MOVEMENT LOOP
  // =====================================

  setInterval(() => {

    moveBuses();

    buses.forEach((bus) => {

      io.emit(

        "busLocationUpdated",

        {

          busNumber:
            bus.busNumber,

          routeNumber:
            bus.routeNumber,

          coordinates:
            bus.coordinates

        }

      );

    });

  }, 1000);

};
const { Server } =
  require("socket.io");

const {
  buses,
  initializeBuses,
  moveBuses
} = require(
  "../services/busEngine"
);

const socketHandler =
  (server) => {

    const io =
      new Server(server, {

        cors: {
          origin: "*"
        }

      });

    io.on(
      "connection",
      (socket) => {

        console.log(

          "Client connected:",

          socket.id

        );

        // Join a specific route room to get only that route's updates
        socket.on("joinRoute", (routeNumber) => {
          if (routeNumber) {
            socket.join(`route:${routeNumber}`);
            console.log(`Socket ${socket.id} joined route: ${routeNumber}`);
          }
        });

        // Leave a route room when no longer viewing
        socket.on("leaveRoute", (routeNumber) => {
          if (routeNumber) {
            socket.leave(`route:${routeNumber}`);
            console.log(`Socket ${socket.id} left route: ${routeNumber}`);
          }
        });

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

    // START LIVE BUS ENGINE
(async () => {

  await initializeBuses();

  console.log(
    "Initialized buses:",
    buses.length
  );

  setInterval(() => {

    moveBuses();

    buses.forEach((bus) => {

      // Send optimized, minimal tracking payload to specific route room
      const payload = {
        busNumber: bus.busNumber,
        routeNumber: bus.routeNumber,
        coordinates: bus.coordinates,
        progress: bus.progress,
        direction: bus.direction
      };

      io.to(`route:${bus.routeNumber}`).emit(
        "busLocationUpdated",
        payload
      );

    });

  }, 1000);

})();

  };

module.exports =
  socketHandler;
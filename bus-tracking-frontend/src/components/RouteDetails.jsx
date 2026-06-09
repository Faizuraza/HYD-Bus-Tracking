function RouteDetails({ routeDetails }) {

  if (!routeDetails) return null;

  return (

    <div className="mt-8 bg-gray-100 p-5 rounded-2xl shadow-sm">

      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
        Route Details
      </h2>

      <p className="mb-2">
        <span className="font-semibold">
          Route Number:
        </span>
        {" "}
        {routeDetails.routeNumber}
      </p>

      <p className="mb-4">
        <span className="font-semibold">
          Route Name:
        </span>
        {" "}
        {routeDetails.routeName}
      </p>

      <div><h3 className="font-bold mb-2 text-lg">
          Stops
        </h3>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">

          {
            routeDetails.stops.map((stop, index) => (

              <div
                key={index}
                className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                {index + 1}. {stop.stopName}
              </div>

            ))
          }

        </div>

      </div>

    </div>
  );
}

export default RouteDetails;
function RouteResults({

  routes,

  onSelectRoute,

  selectedRoute

}) {

  if (!routes.length) {

    return (

      <div className="mt-8 flex flex-col items-center justify-center p-6 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
        <span className="text-4xl mb-2">🔍</span>
        <h3 className="font-bold text-gray-700">No Direct Routes</h3>
        <p className="text-sm text-gray-500 max-w-xs mt-1">
          No direct buses match these locations. We've automatically planned transfer journeys for you below.
        </p>
      </div>

    );

  }

  return (

    <div className="mt-6 space-y-4">

      <h2 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
        <span>Available Routes</span>
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {routes.length} found
        </span>
      </h2>

      {

        routes.map((route) => {
          const isSelected = selectedRoute?.routeNumber === route.routeNumber;
          return (

            <div

              key={route.routeId}

              onClick={() =>

                onSelectRoute(route)

              }

              className={`
                relative
                p-5
                rounded-2xl
                cursor-pointer
                transition-all
                duration-300
                border
                transform hover:-translate-y-0.5
                ${

                  isSelected

                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg shadow-blue-500/20"

                    : "bg-white hover:bg-gray-50 hover:shadow-md border-gray-100 shadow-sm"

                }

              `}
            >
              {/* RANK BADGES */}
              {route.recommended ? (
                <div className={`absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                  isSelected 
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-emerald-300"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400"
                }`}>
                  ✨ recommended
                </div>
              ) : (
                <div className={`absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider border shadow-sm ${
                  isSelected
                    ? "bg-blue-700 text-blue-100 border-blue-500"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}>
                  #{route.rank} fastest
                </div>
              )}

              {/* TOP */}

              <div className="flex justify-between items-start pt-1">

                <div>

                  <h3 className="text-xl font-black tracking-tight flex items-center gap-2">

                    <span className="text-lg">🚌</span>
                    <span>{route.routeNumber}</span>

                  </h3>

                  <p className={`text-xs mt-1 font-medium ${isSelected ? "text-blue-100" : "text-gray-500"}`}>

                    {route.from}
                    {" → "}
                    {route.to}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-xl font-extrabold tracking-tight">

                    {route.estimatedTime}

                  </p>

                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-200" : "text-gray-400"}`}>

                    ETA

                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isSelected ? "bg-white/10" : "bg-gray-50"}`}>

                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-200" : "text-gray-400"}`}>

                    Stops

                  </p>

                  <p className="font-extrabold text-base">

                    {route.stopCount} stops

                  </p>

                </div>

                <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isSelected ? "bg-white/10" : "bg-gray-50"}`}>

                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-blue-200" : "text-gray-400"}`}>

                    Direction

                  </p>

                  <p className="font-extrabold text-base capitalize">

                    {route.direction}

                  </p>

                </div>

              </div>

            </div>

          );
        })

      }

    </div>

  );

}

export default RouteResults;
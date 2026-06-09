function LiveBuses({ buses }) {

  return (

    <div className="mt-8">

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Live Buses
      </h2>

      <div className="space-y-3">

        {
          Object.values(buses).map((bus) => (

            <div
              key={bus.busNumber}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition"
            >

              <div className="flex justify-between items-center">

                <p className="font-bold text-lg text-blue-700">
                  {bus.busNumber}
                </p>

                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

              </div>

              <p className="text-sm text-gray-600 mt-1">
                Status: Running
              </p>

            </div>

          ))
        }

      </div>

    </div>

    );

}

export default LiveBuses;
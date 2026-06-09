function LiveETA({

  etaData

}) {

  if (!etaData)
    return null;

  return (

    <div className="mt-5 bg-green-600 text-white p-5 rounded-2xl shadow-xl">

      <h2 className="text-2xl font-bold mb-3">

        🚍 Live ETA

      </h2>

      <div className="space-y-2">

        <p>

          <span className="font-semibold">

            Bus:

          </span>

          {" "}

          {etaData.busNumber}

        </p>

        <p>

          <span className="font-semibold">

            Distance:

          </span>

          {" "}

          {etaData.distance} km

        </p>

        <p>

          <span className="font-semibold">

            ETA:

          </span>

          {" "}

          {etaData.eta} mins

        </p>

      </div>

    </div>

  );

}

export default LiveETA;
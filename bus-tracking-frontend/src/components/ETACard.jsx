import {
  useEffect,
  useState
} from "react";

function ETACard({

  selectedStop,

  selectedRoute

}) {

  const [etaData,
    setEtaData] =
    useState(null);

  useEffect(() => {

    if (
      !selectedStop ||
      !selectedRoute
    )
      return;

    const fetchETA =
      async () => {

        try {

          const response =
            await fetch(

              `http://localhost:5000/api/eta?stopName=${selectedStop}&routeNumber=${selectedRoute.routeNumber}`

            );

          const data =
            await response.json();

          setEtaData(data);

        } catch (error) {

          console.error(error);

        }

      };

    fetchETA();

  }, [

    selectedStop,

    selectedRoute

  ]);

  if (!etaData)
    return null;

  return (

    <div className="bg-white p-5 rounded-2xl shadow-lg mt-5">

      <h2 className="text-xl font-bold mb-4">

        Live ETA

      </h2>

      <div className="space-y-3">

        <div>

          <p className="text-sm text-gray-500">

            Route

          </p>

          <p className="font-bold text-lg">

            {etaData.routeNumber}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Stop

          </p>

          <p className="font-bold text-lg">

            {etaData.stopName}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            ETA

          </p>

          <p className="font-bold text-2xl text-blue-600">

            {etaData.eta}

          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">

            Nearest Bus

          </p>

          <p className="font-bold text-lg">

            🚌 {etaData.nearestBus}

          </p>

        </div>

      </div>

    </div>

  );

}

export default ETACard;
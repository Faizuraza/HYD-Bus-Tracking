import { InfoWindow } from "@react-google-maps/api";

function BusInfoWindow({ selectedBus, setSelectedBus }) {

  if (!selectedBus) return null;

  return (

    <InfoWindow
      position={{
        lat: selectedBus.coordinates[1],
        lng: selectedBus.coordinates[0]
      }}
      onCloseClick={() => setSelectedBus(null)}
    >

      <div className="p-2 min-w-[180px]">

        <h2 className="font-bold text-lg text-blue-700">
          {selectedBus.busNumber}
        </h2>

        <div className="mt-2 space-y-1 text-sm">

          <p>
            Live Tracking Enabled
          </p>

          <p>
            Status: Running
          </p>

          <p>
            Speed: 32 km/h
          </p>

        </div>

      </div>

    </InfoWindow>
  );
}

export default BusInfoWindow;
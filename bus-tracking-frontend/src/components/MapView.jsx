import {
  GoogleMap,
  Polyline
} from "@react-google-maps/api";

import BusInfoWindow from "./BusInfoWindow";
import SmoothMarker from "./SmoothMarker";

const mapContainerStyle = {
  width: "100%",
  height: "100dvh"
};

const center = {
  lat: 17.4375,
  lng: 78.4483
};

function MapView({
  routePath,
  buses,
  selectedBus,
  setSelectedBus,
  mapRef
}) {

  return (

    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
        <div className="absolute bottom-6 right-6 bg-white shadow-2xl rounded-2xl px-5 py-4 z-10">

  <div className="flex items-center gap-3">

    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>

    <div>

      <p className="font-bold">
        Live Tracking Active
      </p>

      <p className="text-sm text-gray-500">
        Real-time buses updating
      </p>

    </div>

  </div>

</div>
      <Polyline
        path={routePath}
        options={{ strokeColor: "#2563EB",
          strokeOpacity: 1,
          strokeWeight: 6
        }}
      />

      {
  Object.values(buses).map((bus) => (

    <SmoothMarker

      key={bus.busNumber}
      
      bus={bus}
      label={bus.busNumber}
      onClick={() => {

        setSelectedBus(bus);

      }}

    />

  ))
}

      <BusInfoWindow
        selectedBus={selectedBus}
        setSelectedBus={setSelectedBus}
      />

    </GoogleMap>
  );
}

export default MapView;
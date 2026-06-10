import React, {

  useEffect,
  useState,
  useRef

} from "react";

import {

  useLoadScript

} from "@react-google-maps/api";

import socket from "./services/socket";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import LoadingScreen from "./components/LoadingScreen";
import { fetchRouteDetails, fetchNearestBusETA } from "./services/apiService";

function App() {

  // ======================
  // STATES
  // ======================

  const [buses, setBuses] =
    useState({});

  const [routePath, setRoutePath] =
    useState([]);

  const [routeDetails, setRouteDetails] =
    useState(null);

  const [selectedBus, setSelectedBus] =
    useState(null);

  const [selectedStop, setSelectedStop] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [selectedRoute, setSelectedRoute] =
    useState(null);

  const [routes, setRoutes] =
    useState([]);
  const [etaData,setEtaData] =useState(null);

  const [transferResult, setTransferResult] =
  useState(null);

  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const mapRef = useRef(null);

  // ======================
  // GOOGLE MAPS
  // ======================

  const { isLoaded } =
    useLoadScript({

      googleMapsApiKey:
        process.env
          .REACT_APP_GOOGLE_MAPS_API_KEY

    });

  // ======================
  // SOCKET LISTENER & ROOM SUBSCRIPTION
  // ======================

  useEffect(() => {

    socket.on(

      "busLocationUpdated",

      (data) => {

        setBuses((prev) => ({

          ...prev,

          [data.busNumber]: data

        }));

      }

    );

    return () => {

      socket.off(
        "busLocationUpdated"
      );

    };

  }, []);

  // Manage room subscription when selected route changes
  useEffect(() => {
    if (!selectedRoute?.routeNumber) return;

    const currentRouteNum = selectedRoute.routeNumber;
    setBuses({}); // Clear previous route's buses instantly
    socket.emit("joinRoute", currentRouteNum);

    return () => {
      socket.emit("leaveRoute", currentRouteNum);
    };
  }, [selectedRoute?.routeNumber]);

  // ======================
  // ROUTE SELECTION
  // ======================

  const handleSelectRoute =
  async (route) => {

    try {
      setLoadingDetails(true);
      setErrorMsg(""); // Clear previous errors

      // FETCH FULL ROUTE DETAILS
      const data = await fetchRouteDetails(route.routeNumber);

      // SET SELECTED ROUTE

      setSelectedRoute({

        ...route,

        stops: data.stops

      });

      // =====================================
      // FETCH LIVE ETA
      // =====================================
      const eta = await fetchNearestBusETA(route.from, route.routeNumber);

      console.log("ETA DATA:", eta);
      // SAVE ETA DATA

      setEtaData(eta);

    } catch (error) {

      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred while fetching route details.");

    } finally {
      setLoadingDetails(false);
    }

  };

  // ======================
  // UPDATE ROUTE PATH
  // ======================

  useEffect(() => {

  if (
    !selectedRoute ||
    !selectedRoute.stops ||
    selectedRoute.stops.length === 0
  ) {
    setRoutePath([]);
    return;
  }

  const path =
    selectedRoute.stops
      .filter(
        stop =>
          stop &&
          stop.coordinates &&
          stop.coordinates.length === 2
      )
      .map(stop => ({
        lat: Number(stop.coordinates[1]),
        lng: Number(stop.coordinates[0])
      }));

  setRoutePath(path);

  setRouteDetails(selectedRoute);

}, [selectedRoute]);

  // ======================
  // FIT MAP TO ROUTE
  // ======================

  useEffect(() => {

    if (

      routePath.length > 0 &&
      mapRef.current &&
      window.google

    ) {

      const bounds =
        new window.google
          .maps
          .LatLngBounds();

      routePath.forEach(
        (point) => {

          bounds.extend(point);

        }
      );

      mapRef.current
        .fitBounds(bounds);

    }

  }, [routePath]);

  // ======================
  // FILTER ROUTE BUSES
  // ======================

  const filteredBuses =
    Object.values(buses).filter(

      (bus) =>

        bus.routeNumber ===
        selectedRoute?.routeNumber

    );

  // ======================
  // LOADING SCREEN
  // ======================

  if (!isLoaded) {

    return <LoadingScreen />;

  }

  // ======================
  // UI
  // ======================

  return (

    <div className="flex h-screen bg-[#F5F7FB]">

      {/* SIDEBAR */}

      <Sidebar

  routeDetails={routeDetails}
  buses={filteredBuses}
  selectedStop={selectedStop}
  setSelectedStop={setSelectedStop}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  setSelectedRoute={setSelectedRoute}
  routes={routes}
  selectedRoute={selectedRoute}
  handleSelectRoute={handleSelectRoute}
  setRoutes={setRoutes}
  setTransferResult={setTransferResult}
  transferResult={transferResult}
  etaData={etaData}
  loadingRoutes={loadingRoutes}
  setLoadingRoutes={setLoadingRoutes}
  loadingDetails={loadingDetails}
  errorMsg={errorMsg}
  setErrorMsg={setErrorMsg}

/>

      {/* <ETACard

  selectedStop={
    selectedStop
  }

  selectedRoute={
    selectedRoute
  }

/> */}

      {/* MOBILE OVERLAY */}

      {

        sidebarOpen && (

          <div

            className="fixed inset-0 bg-black/40 z-40 lg:hidden"

            onClick={() =>
              setSidebarOpen(false)
            }

          />

        )

      }

      {/* MOBILE MENU */}

      <button

        onClick={() =>

          setSidebarOpen(
            !sidebarOpen
          )

        }

        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg"

      >

        ☰ Menu

      </button>

      {/* MAP */}

      <div className="flex-1">

        <MapView

          routePath={
            routePath
          }

          buses={
            filteredBuses
          }

          selectedBus={
            selectedBus
          }

          setSelectedBus={
            setSelectedBus
          }

          mapRef={mapRef}

        />

      </div>

    </div>

  );

}

export default App;
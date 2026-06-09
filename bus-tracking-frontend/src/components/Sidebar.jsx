import SearchPanel from "./SearchPanel";
import RouteResults from "./RoutesResults";
import RouteDetails from "./RouteDetails";
import LiveBuses from "./LiveBuses";
import ETACard from "./ETACard";
import LiveETA from "./LiveETA";
import JourneyPlanner from "./JourneyPlanner";  
import { SkeletonRouteCard, SkeletonRouteDetails } from "./SkeletonLoader";

function Sidebar({

  routeDetails,
  buses,
  selectedStop,
  setSelectedStop,
  sidebarOpen,
  setSidebarOpen,
  setSelectedRoute,
  routes,
  selectedRoute,
  handleSelectRoute,
  setRoutes,
  setTransferResult,
  transferResult,
  etaData,
  loadingRoutes,
  setLoadingRoutes,
  loadingDetails,
  errorMsg,
  setErrorMsg

}) 
{
  return (

    <div  className={`

    fixed lg:relative z-50

    h-screen

    w-[320px] sm:w-[350px]

    bg-white

    shadow-2xl

    p-6

    overflow-y-auto

    border-r border-gray-200

    transition-transform duration-300

    ${sidebarOpen
      ? "translate-x-0"
      : "-translate-x-full lg:translate-x-0"
    }

  `}
>

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
          H
        </div>

        <div>

          <h1 className="text-3xl tracking-tight font-bold text-blue-700">
            Hyderabad Bus Tracker
          </h1>

          <p className="text-sm text-gray-500">
            Real-Time Public Transport
          </p>

        </div>

      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 relative animate-pulse-subtle">
          <span className="text-red-500 text-lg">⚠️</span>
          <div className="flex-1 pr-4">
            <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-wider">System Alert</h4>
            <p className="text-xs text-red-600 mt-0.5 leading-relaxed font-medium">{errorMsg}</p>
          </div>
          <button 
            onClick={() => setErrorMsg("")} 
            className="text-red-400 hover:text-red-700 transition text-xs font-bold absolute top-3 right-3 p-1"
          >
            ✕
          </button>
        </div>
      )}
        <SearchPanel
  setSelectedStop={setSelectedStop}
  setSelectedRoute={setSelectedRoute}
  setRoutes={setRoutes}
  setTransferResult={setTransferResult}
  setLoadingRoutes={setLoadingRoutes}
  setErrorMsg={setErrorMsg}
/>

{loadingRoutes ? (
  <div className="mt-6 space-y-4">
    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
    <SkeletonRouteCard />
    <SkeletonRouteCard />
  </div>
) : (
  <RouteResults
    routes={routes}
    selectedRoute={selectedRoute}
    onSelectRoute={handleSelectRoute}
  />
)}

<JourneyPlanner
  transferResult={transferResult}
/>
<LiveETA etaData={etaData} />
        <ETACard selectedStop={selectedStop} />

{loadingDetails ? (
  <div className="mt-8">
    <SkeletonRouteDetails />
  </div>
) : (
  <RouteDetails routeDetails={routeDetails} />
)}

      <LiveBuses buses={buses} />

    </div>
  );
}

export default Sidebar;




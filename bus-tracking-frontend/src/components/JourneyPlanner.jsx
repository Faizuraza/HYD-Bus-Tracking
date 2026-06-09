import React from "react";

function JourneyPlanner({ transferResult }) {

  if (
    !transferResult ||
    !transferResult.transferFound
  ) {
    return null;
  }

  return (

    <div className="mt-8 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100/80 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-5">

        <div className="flex items-center justify-between">

          <div>
            <span className="text-[10px] bg-white/20 text-white font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full">
              Recommended Route
            </span>
            <h2 className="text-xl font-black tracking-tight mt-1 flex items-center gap-1.5">
              <span>⭐</span> Smart Transfer
            </h2>
          </div>

          <div className="text-right">
            <span className="text-lg font-black bg-white/20 px-3.5 py-1.5 rounded-2xl block backdrop-blur-sm">
              {transferResult.estimatedTime}
            </span>
            <span className="text-[10px] opacity-80 mt-1 block uppercase font-bold tracking-wider">
              Total Duration
            </span>
          </div>

        </div>

      </div>

      {/* JOURNEY STEPS */}

      <div className="p-6">

        <div className="relative pl-6 border-l-2 border-dashed border-gray-200 space-y-8 my-2">

          {/* STEP 1 */}

          <div className="relative">

            {/* Icon Dot */}
            <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-blue-600 border-4 border-white text-white flex items-center justify-center text-xs font-bold shadow-md shadow-blue-500/30">
              🚌
            </div>

            <div>
              <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                First Bus
              </span>

              <h3 className="font-extrabold text-gray-800 text-lg mt-1">
                Route {transferResult.steps[0].route}
              </h3>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-medium">Board at</span>
                <span className="font-bold text-gray-700 text-sm">
                  {transferResult.steps[0].boardAt}
                </span>
              </div>

            </div>

          </div>

          {/* STEP 2 */}

          <div className="relative">

            {/* Icon Dot */}
            <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-amber-500 border-4 border-white text-white flex items-center justify-center text-xs font-bold shadow-md shadow-amber-500/30">
              🔄
            </div>

            <div>
              <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full">
                Connection Stop
              </span>

              <h3 className="font-extrabold text-gray-800 text-lg mt-1">
                Transfer Point
              </h3>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-medium">Switch at</span>
                <span className="font-bold text-gray-700 text-sm">
                  {transferResult.steps[1].stop}
                </span>
              </div>

            </div>

          </div>

          {/* STEP 3 */}

          <div className="relative">

            {/* Icon Dot */}
            <div className="absolute -left-[37px] top-0 w-8 h-8 rounded-full bg-emerald-600 border-4 border-white text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-500/30">
              🚌
            </div>

            <div>
              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                Second Bus
              </span>

              <h3 className="font-extrabold text-gray-800 text-lg mt-1">
                Route {transferResult.steps[2].route}
              </h3>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xs text-gray-400 font-medium">Arrive at</span>
                <span className="font-bold text-gray-700 text-sm">
                  {transferResult.steps[2].destination}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* METRICS */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold">
          <span>Stops Count: {transferResult.totalStops}</span>
          <span className="text-amber-500">1 transfer required</span>
        </div>

      </div>

    </div>

  );

}

export default JourneyPlanner;
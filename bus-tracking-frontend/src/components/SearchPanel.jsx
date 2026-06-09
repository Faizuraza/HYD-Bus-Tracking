import {
  useState,
  useEffect
} from "react";

import {
  searchStops,
  searchRoutes,
  fetchTransferJourney
} from "../services/apiService";

function SearchPanel({

  setSelectedStop,
  setSelectedRoute,
  setRoutes,
  setTransferResult,
  setLoadingRoutes

}) {

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [
    fromSuggestions,
    setFromSuggestions
  ] = useState([]);

  const [
    toSuggestions,
    setToSuggestions
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    errorMsg,
    setErrorMsg
  ] = useState("");

  // ============================
  // FROM SUGGESTIONS
  // ============================

  useEffect(() => {

    const fetchSuggestions =
      async () => {

        try {

          if (from.length < 2) {

            setFromSuggestions([]);
            return;

          }

          const data =
            await searchStops(from);

          setFromSuggestions(data);

        } catch (error) {

          console.error(error);

          setFromSuggestions([]);

        }

      };

    fetchSuggestions();

  }, [from]);

  // ============================
  // TO SUGGESTIONS
  // ============================

  useEffect(() => {

    const fetchSuggestions =
      async () => {

        try {

          if (to.length < 2) {

            setToSuggestions([]);
            return;

          }

          const data =
            await searchStops(to);

          setToSuggestions(data);

        } catch (error) {

          console.error(error);

          setToSuggestions([]);

        }

      };

    fetchSuggestions();

  }, [to]);

  // ============================
  // SEARCH
  // ============================

  const handleSearch =
    async () => {

      try {

        if (!from || !to) {

          setErrorMsg(
            "Please select both From and To stops."
          );

          return;

        }

        setLoading(true);

        setLoadingRoutes(true);

        setErrorMsg("");

        // ------------------------
        // DIRECT ROUTE SEARCH
        // ------------------------

        const data =
          await searchRoutes(
            from,
            to
          );

        console.log(
          "DIRECT ROUTES:",
          data
        );

        if (

          Array.isArray(data) &&
          data.length > 0

        ) {

          setRoutes(data);

          setTransferResult(null);

          return;

        }

        // ------------------------
        // TRANSFER SEARCH
        // ------------------------

        const transferData =
          await fetchTransferJourney(
            from,
            to
          );

        console.log(
          "TRANSFER DATA:",
          transferData
        );

        if (

          transferData &&
          transferData.transferFound

        ) {

          setTransferResult(
            transferData
          );

          setRoutes([]);

        } else {

          setTransferResult(null);

          setRoutes([]);

          setErrorMsg(
            "No direct or transfer routes found."
          );

        }

      } catch (error) {

        console.error(
          "Search Error:",
          error
        );

        setErrorMsg(

          error.message ||

          "Unable to search routes. Please try again."

        );

      } finally {

        setLoading(false);

        setLoadingRoutes(false);

      }

    };

  return (

    <div className="space-y-4">

      {/* FROM */}

      <div className="relative">

        <input

          type="text"

          placeholder="From"

          value={from}

          onChange={(e) =>
            setFrom(e.target.value)
          }

          className="
            w-full
            border
            border-gray-300
            p-3
            rounded-xl
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "

        />

        {

          fromSuggestions.length > 0 && (

            <div className="
              absolute
              w-full
              bg-white
              border
              border-gray-200
              rounded-xl
              mt-1
              shadow-lg
              z-20
              max-h-60
              overflow-y-auto
            ">

              {

                fromSuggestions.map(
                  (stop) => (

                    <div

                      key={stop._id}

                      className="
                        p-3
                        hover:bg-blue-50
                        cursor-pointer
                      "

                      onClick={() => {

                        setFrom(
                          stop.stopName
                        );

                        setSelectedStop(
                          stop.stopName
                        );

                        setFromSuggestions([]);

                      }}

                    >

                      {stop.stopName}

                    </div>

                  )
                )

              }

            </div>

          )

        }

      </div>

      {/* TO */}

      <div className="relative">

        <input

          type="text"

          placeholder="To"

          value={to}

          onChange={(e) =>
            setTo(e.target.value)
          }

          className="
            w-full
            border
            border-gray-300
            p-3
            rounded-xl
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "

        />

        {

          toSuggestions.length > 0 && (

            <div className="
              absolute
              w-full
              bg-white
              border
              border-gray-200
              rounded-xl
              mt-1
              shadow-lg
              z-20
              max-h-60
              overflow-y-auto
            ">

              {

                toSuggestions.map(
                  (stop) => (

                    <div

                      key={stop._id}

                      className="
                        p-3
                        hover:bg-blue-50
                        cursor-pointer
                      "

                      onClick={() => {

                        setTo(
                          stop.stopName
                        );

                        setSelectedStop(
                          stop.stopName
                        );

                        setToSuggestions([]);

                      }}

                    >

                      {stop.stopName}

                    </div>

                  )
                )

              }

            </div>

          )

        }

      </div>

      {/* SEARCH BUTTON */}

      <button

        onClick={handleSearch}

        disabled={loading}

        className={`
          w-full
          p-3
          rounded-xl
          font-semibold
          transition-all

          ${loading

            ? "bg-gray-400 cursor-not-allowed"

            : "bg-blue-600 hover:bg-blue-700 text-white"
          }
        `}

      >

        {

          loading

            ? "Searching..."

            : "Search Route"

        }

      </button>

      {/* ERROR MESSAGE */}

      {

        errorMsg && (

          <div className="
            bg-red-50
            border
            border-red-200
            text-red-700
            p-3
            rounded-xl
          ">

            {errorMsg}

          </div>

        )

      }

    </div>

  );

}

export default SearchPanel;
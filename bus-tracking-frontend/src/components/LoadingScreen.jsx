function LoadingScreen() {

  return (

    <div className="h-screen flex items-center justify-center bg-gray-100">

      <div className="text-center">

        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        <h1 className="text-2xl font-bold text-gray-700">
          Loading Hyderabad Bus Tracker...
        </h1>

      </div>

    </div>
  );
}

export default LoadingScreen;
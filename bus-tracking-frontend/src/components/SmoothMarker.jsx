import {
  Marker
} from "@react-google-maps/api";

import {
  useEffect,
  useState,
  useRef
} from "react";

function SmoothMarker({

  bus,

  onClick

}) {

  const [position, setPosition] =
  useState(() => ({

    lat: bus.coordinates[1],

    lng: bus.coordinates[0]

  }));

  const animationRef =
    useRef(null);

  useEffect(() => {

  setPosition(prevPosition => {

    const start = {

      ...prevPosition

    };

    const newPosition = {

      lat: bus.coordinates[1],

      lng: bus.coordinates[0]

    };

    const duration = 4000;

    const startTime =
      performance.now();

    function animate(
      currentTime
    ) {

      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const lat =
        start.lat +

        (
          newPosition.lat -
          start.lat
        ) * progress;

      const lng =
        start.lng +

        (
          newPosition.lng -
          start.lng
        ) * progress;

      setPosition({
        lat,
        lng
      });

      if (progress < 1) {

        animationRef.current =
          requestAnimationFrame(
            animate
          );

      }

    }

    animationRef.current =
      requestAnimationFrame(
        animate
      );

    return prevPosition;

  });

  return () => {

    cancelAnimationFrame(
      animationRef.current
    );

  };

}, [bus.coordinates]);
  return (

    <Marker

      position={position}

      label={bus.busNumber}

      onClick={onClick}

    />

  );
}

export default SmoothMarker;
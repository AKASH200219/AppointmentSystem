
// import React, { useEffect, useState } from "react";
// import { Button, Card, Container } from "react-bootstrap";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//   autoConnect: false,
// });

// function CompanionGPSTracker({
//   requestId,
//   destinationLat,
//   destinationLng,
//   destinationType = "Patient Home",
// }) {
//   const [tracking, setTracking] = useState(false);
//   const [message, setMessage] = useState("GPS tracking is stopped.");
//   const [distance, setDistance] = useState(null);
//   const [position, setPosition] = useState(null);

//   useEffect(() => {
//     socket.connect();

//     socket.on("connect", () => {
//       socket.emit("joinTracking", { requestId });
//     });

//     return () => {
//       socket.off("connect");
//       socket.disconnect();
//     };
//   }, [requestId]);

//   const calculateDistance = (lat1, lng1, lat2, lng2) => {
//     const toRadians = (value) => (value * Math.PI) / 180;
//     const earthRadius = 6371000;

//     const dLat = toRadians(lat2 - lat1);
//     const dLng = toRadians(lng2 - lng1);

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRadians(lat1)) *
//         Math.cos(toRadians(lat2)) *
//         Math.sin(dLng / 2) ** 2;

//     return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   };

//   const startTracking = () => {
//     if (!navigator.geolocation) {
//       setMessage("GPS is not supported by this browser.");
//       return;
//     }

//     if (
//       destinationLat == null ||
//       destinationLng == null ||
//       !Number.isFinite(Number(destinationLat)) ||
//       !Number.isFinite(Number(destinationLng))
//     ) {
//       setMessage("Destination GPS coordinates are missing.");
//       return;
//     }

//     setTracking(true);
//     setMessage("Waiting for GPS location...");

//     const watchId = navigator.geolocation.watchPosition(
//       (location) => {
//         const latitude = location.coords.latitude;
//         const longitude = location.coords.longitude;

//         setPosition({ latitude, longitude });

//         socket.emit("companionLocation", {
//           requestId,
//           latitude,
//           longitude,
//         });

//         const remainingDistance = calculateDistance(
//           latitude,
//           longitude,
//           Number(destinationLat),
//           Number(destinationLng)
//         );

//         setDistance(remainingDistance);

//         if (remainingDistance <= 50) {
//           setMessage("You are near the destination. Confirm arrival.");
//         } else {
//           setMessage(
//             `Live GPS tracking active. ${(
//               remainingDistance / 1000
//             ).toFixed(2)} km remaining in straight-line distance.`
//           );
//         }
//       },
//       (error) => {
//         setTracking(false);
//         setMessage(
//           error.code === 1
//             ? "Please allow location permission in your browser."
//             : "Unable to get GPS location. Check your device GPS."
//         );
//       },
//       {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 15000,
//       }
//     );

//     // Keep the active watcher ID so Stop Tracking can clear it.
//     window.companionGpsWatchId = watchId;
//   };

//   const stopTracking = () => {
//     if (window.companionGpsWatchId !== undefined) {
//       navigator.geolocation.clearWatch(window.companionGpsWatchId);
//       window.companionGpsWatchId = undefined;
//     }

//     setTracking(false);
//     setMessage("GPS tracking stopped.");
//   };

//   const confirmArrival = () => {
//     if (distance === null || distance > 50) {
//       setMessage("You must be within 50 metres to confirm arrival.");
//       return;
//     }

//     socket.emit("confirmArrival", {
//       requestId,
//       status:
//         destinationType === "Hospital"
//           ? "Reached Hospital"
//           : "Reached Patient Home",
//     });

//     setMessage("Arrival confirmation sent.");
//   };

//   return (
//     <Container className="my-4">
//       <Card className="p-4 shadow-sm">
//         <h4>Companion Live GPS Tracking</h4>

//         <p>
//           <strong>Destination:</strong> {destinationType}
//         </p>

//         <p>{message}</p>

//         {position && (
//           <>
//             <p>
//               <strong>Latitude:</strong> {position.latitude}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {position.longitude}
//             </p>
//           </>
//         )}

//         {distance !== null && (
//           <p>
//             <strong>Distance to destination:</strong>{" "}
//             {distance >= 1000
//               ? `${(distance / 1000).toFixed(2)} km`
//               : `${Math.round(distance)} metres`}
//           </p>
//         )}

//         {!tracking ? (
//           <Button onClick={startTracking}>
//             Start GPS Tracking
//           </Button>
//         ) : (
//           <Button variant="danger" onClick={stopTracking}>
//             Stop GPS Tracking
//           </Button>
//         )}

//         {tracking && distance !== null && distance <= 50 && (
//           <Button
//             className="mt-3"
//             variant="success"
//             onClick={confirmArrival}
//           >
//             Confirm Arrival
//           </Button>
//         )}
//       </Card>
//     </Container>
//   );
// }

// export default CompanionGPSTracker;

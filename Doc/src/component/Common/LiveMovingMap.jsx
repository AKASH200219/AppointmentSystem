
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap
} from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const socket = io("http://localhost:5000", {
  autoConnect: false
});

const patientIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const companionIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function distanceKm(a, b) {
  const rad = (value) => value * Math.PI / 180;

  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const lat1 = rad(a[0]);
  const lat2 = rad(b[0]);

  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng / 2) ** 2;

  return 6371 * 2 * Math.atan2(
    Math.sqrt(value),
    Math.sqrt(1 - value)
  );
}

function FollowMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.panTo(position);
    }
  }, [position, map]);

  return null;
}

function LiveMovingMap({
  requestId,
  patientLat,
  patientLng,
  companionLat,
  companionLng,
  patientName,
  companionName,
  height = "360px"
}) {
  const patientPosition = [
    Number(patientLat),
    Number(patientLng)
  ];

  const [currentPosition, setCurrentPosition] = useState(
    Number.isFinite(Number(companionLat)) &&
    Number.isFinite(Number(companionLng))
      ? [Number(companionLat), Number(companionLng)]
      : null
  );

  const [route, setRoute] = useState([]);
  const [arrivalStatus, setArrivalStatus] = useState("");

  useEffect(() => {
    if (!requestId) return;

    socket.connect();
    socket.emit("joinTracking", { requestId });

    const handleLocation = (data) => {
      if (data.requestId !== requestId) return;

      const next = [
        Number(data.latitude),
        Number(data.longitude)
      ];

      if (!next.every(Number.isFinite)) return;

      setCurrentPosition(next);

      setRoute((previous) => {
        const last = previous[previous.length - 1];

        if (
          last &&
          last[0] === next[0] &&
          last[1] === next[1]
        ) {
          return previous;
        }

        return [...previous, next];
      });
    };

    const handleArrival = (data) => {
      if (data.requestId !== requestId) return;
      setArrivalStatus(data.status);
    };

    socket.on("locationUpdated", handleLocation);
    socket.on("arrivalConfirmed", handleArrival);

    return () => {
      socket.off("locationUpdated", handleLocation);
      socket.off("arrivalConfirmed", handleArrival);
      socket.emit("leaveTracking", { requestId });
    };
  }, [requestId]);

  if (
    !patientPosition.every(Number.isFinite) ||
    Math.abs(patientPosition[0]) > 90 ||
    Math.abs(patientPosition[1]) > 180
  ) {
    return <p>Patient GPS coordinates are unavailable.</p>;
  }

  let travelled = 0;

  for (let i = 1; i < route.length; i++) {
    travelled += distanceKm(route[i - 1], route[i]);
  }

  const remaining = currentPosition
    ? distanceKm(currentPosition, patientPosition)
    : null;

  return (
    <div>
      <div className="d-flex gap-3 flex-wrap mb-3">
        <div className="border rounded p-2">
          <small>Distance travelled</small>
          <h5>{travelled.toFixed(2)} km</h5>
        </div>

        <div className="border rounded p-2">
          <small>Distance to patient</small>
          <h5>
            {remaining === null
              ? "Waiting for GPS"
              : `${(remaining * 1000).toFixed(0)} m`}
          </h5>
        </div>
      </div>

      {arrivalStatus && (
        <div className="alert alert-success">
          Companion status: {arrivalStatus}
        </div>
      )}

      <MapContainer
        center={patientPosition}
        zoom={15}
        style={{
          height,
          width: "100%",
          borderRadius: "10px"
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={patientPosition} icon={patientIcon}>
          <Popup>Patient: {patientName}</Popup>
        </Marker>

        {currentPosition && (
          <Marker position={currentPosition} icon={companionIcon}>
            <Popup>Companion: {companionName}</Popup>
          </Marker>
        )}

        {currentPosition && (
          <Polyline
            positions={[patientPosition, currentPosition]}
            pathOptions={{
              color: "red",
              weight: 4,
              dashArray: "8, 8"
            }}
          />
        )}

        {route.length > 1 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "blue",
              weight: 5
            }}
          />
        )}

        {currentPosition && (
          <FollowMarker position={currentPosition} />
        )}
      </MapContainer>

      <small className="text-muted d-block mt-2">
        Red dashed line: direct distance to the patient.
        Blue line: recorded GPS route during this session.
      </small>
    </div>
  );
}

export default LiveMovingMap;

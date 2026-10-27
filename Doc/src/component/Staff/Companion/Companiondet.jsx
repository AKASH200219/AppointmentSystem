
import React, { useEffect, useRef, useState } from "react";
import StaffNav from "../StaffNav";
import {
  Card,
  Col,
  Container,
  Row,
  Table,
  Badge,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import LiveMovingMap from "../../Common/LiveMovingMap";
import API from "../../../api/axiosConfig";

// const API = "http://localhost:5000/api/companion";

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function hasCoordinates(lat, lng) {
  return (
    lat !== null &&
    lat !== undefined &&
    lng !== null &&
    lng !== undefined &&
    lat !== "" &&
    lng !== "" &&
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lng))
  );
}

function CompanionDet() {
  const [companions, setCompanions] = useState([]);
  const [staffInfo, setStaffInfo] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState(null);

  const [assignedLocation, setAssignedLocation] = useState("");
  const [companionLatitude, setCompanionLatitude] = useState("");
  const [companionLongitude, setCompanionLongitude] = useState("");
  const [status, setStatus] = useState("Accepted");

  const [isLiveSharing, setIsLiveSharing] = useState(false);
  const [distanceToPatient, setDistanceToPatient] = useState(null);
  const [gpsError, setGpsError] = useState("");

  const watchIdRef = useRef(null);
  const lastGpsUpdateRef = useRef(0);

  const companionId = localStorage.getItem("staff");

  // Fetch companion requests
  const companionDetails = async () => {
    try {
      // const result = await axios.get( `${API}/companioncare/${companionId}`);
      const result = await API.get( `/companioncare/${companionId}`);

      setCompanions(result.data?.companions || []);

      if (result.data?.companion) {
        setStaffInfo(result.data.companion);
      }
    } catch (error) {
      console.error("Error fetching companion details:", error);
      setCompanions([]);
    }
  };

  useEffect(() => {
    companionDetails();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Stop GPS sharing
  const stopLiveLocationSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsLiveSharing(false);
  };

  const totalPatient = companions.length;

  const pendingApproval = companions.filter(
    (item) => item.status?.toLowerCase() === "pending"
  ).length;

  const inProgressCount = companions.filter((item) =>
    [
      "accepted",
      "reached patient home",
      "reached hospital",
    ].includes(item.status?.toLowerCase())
  ).length;

  const completedCount = companions.filter((item) =>
    [
      "reached home / service completed",
      "completed",
    ].includes(item.status?.toLowerCase())
  ).length;

  // Open patient map
  const handleOpenLocationModal = (item) => {
    setSelectedCompanion(item);
    setShowLocationModal(true);
  };

  // Open GPS and status update modal
  const handleOpenUpdateModal = (item) => {
    setSelectedCompanion(item);
    setAssignedLocation(item.assignedLocation || item.Address || "");
    setCompanionLatitude(item.companionLatitude ?? "");
    setCompanionLongitude(item.companionLongitude ?? "");
    setStatus(item.status || "Accepted");
    setDistanceToPatient(null);
    setGpsError("");
    setShowUpdateModal(true);
  };

  // Update service status
  const updateStatus = async (item, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
      };

      if (staffInfo && !item.assignedCompanionName) {
        updateData.assignedCompanionName = staffInfo.name;

        if (staffInfo.phone) {
          updateData.assignedCompanionPhone = String(staffInfo.phone);
        }
      }

      // await axios.put(`${API}/updateStatus/${item._id}`,updateData);
      await API.put(`/updateStatus/${item._id}`,updateData);

      await companionDetails();
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Failed to update status.");
    }
  };

  // Detect one GPS location
  const getStaffLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCompanionLatitude(lat);
        setCompanionLongitude(lng);
        setGpsError("");

        setSelectedCompanion((previous) =>
          previous
            ? {
                ...previous,
                companionLatitude: lat,
                companionLongitude: lng,
              }
            : previous
        );

        alert("GPS location detected successfully.");
      },
      (error) => {
        setGpsError(error.message);
        alert(
          "Unable to get current location. Please check GPS permission."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  // Start or stop automatic GPS sharing
  const toggleLiveLocationSharing = () => {
    if (isLiveSharing) {
      stopLiveLocationSharing();
      alert("Live location sharing stopped.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    if (!selectedCompanion) {
      alert("Please select a patient request first.");
      return;
    }

    const requestId = selectedCompanion._id;
    const patientLat = Number(selectedCompanion.latitude);
    const patientLng = Number(selectedCompanion.longitude);

    setGpsError("");
    setDistanceToPatient(null);
    lastGpsUpdateRef.current = 0;

    setIsLiveSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCompanionLatitude(lat);
        setCompanionLongitude(lng);
        setGpsError("");

        // Calculate distance to patient's saved location
        if (
          hasCoordinates(patientLat, patientLng)
        ) {
          const distance = getDistanceMeters(
            lat,
            lng,
            patientLat,
            patientLng
          );

          setDistanceToPatient(distance);
        }

        // Refresh companion marker on the map
        setSelectedCompanion((previous) =>
          previous && previous._id === requestId
            ? {
                ...previous,
                companionLatitude: lat,
                companionLongitude: lng,
              }
            : previous
        );

        setCompanions((previous) =>
          previous.map((item) =>
            item._id === requestId
              ? {
                  ...item,
                  companionLatitude: lat,
                  companionLongitude: lng,
                }
              : item
          )
        );

        // Save GPS coordinates to the existing backend.
        // Send an update at most once every 5 seconds.
        const now = Date.now();

        if (now - lastGpsUpdateRef.current < 5000) {
          return;
        }

        lastGpsUpdateRef.current = now;

        try {
          // await axios.put(`${API}/updateStatus/${requestId}`,
          await API.put(`/updateStatus/${requestId}`,
            {
              companionLatitude: lat,
              companionLongitude: lng,
            }
          );
        } catch (error) {
          console.error("Live GPS update failed:", error);
          setGpsError("Could not save the latest GPS location.");
        }
      },
      (error) => {
        console.error("GPS tracking error:", error);

        stopLiveLocationSharing();

        if (error.code === 1) {
          setGpsError(
            "Location permission denied. Allow location access in your browser."
          );
        } else {
          setGpsError(
            "Unable to get GPS location. Check your device GPS and try again."
          );
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    alert("Live GPS tracking started.");
  };

  // Save manually entered location and status
  const handleSaveStaffLocation = async (e) => {
    e.preventDefault();

    if (!selectedCompanion) {
      return;
    }

    try {
      const updateData = {
        assignedLocation,
        status,
      };

      if (companionLatitude !== "") {
        updateData.companionLatitude = Number(companionLatitude);
      }

      if (companionLongitude !== "") {
        updateData.companionLongitude = Number(companionLongitude);
      }

      if (!selectedCompanion.assignedCompanionName && staffInfo) {
        updateData.assignedCompanionName = staffInfo.name;

        if (staffInfo.phone) {
          updateData.assignedCompanionPhone = String(staffInfo.phone);
        }
      }

      // await axios.put(`${API}/updateStatus/${selectedCompanion._id}`,updateData);
      await API.put(`/updateStatus/${selectedCompanion._id}`,updateData);

      setSelectedCompanion((previous) =>
        previous
          ? {
              ...previous,
              ...updateData,
            }
          : previous
      );

      setShowUpdateModal(false);
      await companionDetails();
    } catch (error) {
      console.error("Failed to update location:", error);
      alert("Failed to update staff location details.");
    }
  };

  // Status badge
  const getStatusBadge = (currentStatus) => {
    if (!currentStatus) {
      return <Badge bg="secondary">Pending</Badge>;
    }

    switch (currentStatus.trim().toLowerCase()) {
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Pending Request
          </Badge>
        );

      case "accepted":
        return <Badge bg="success">Accepted</Badge>;

      case "reached patient home":
        return <Badge bg="info">Reached Patient Home</Badge>;

      case "reached hospital":
        return <Badge bg="primary">Reached Hospital</Badge>;

      case "reached home / service completed":
      case "completed":
        return (
          <Badge bg="dark">
            Reached Home / Service Completed
          </Badge>
        );

      case "rejected":
      case "cancelled":
        return <Badge bg="danger">{currentStatus}</Badge>;

      default:
        return <Badge bg="secondary">{currentStatus}</Badge>;
    }
  };

  return (
    <>
      <StaffNav />

      <Container>
        {/* Dashboard cards */}
        <Row className="g-3 mb-4 mt-4 justify-content-center">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 rounded-3">
              <Card.Body>
                <p className="text-muted mb-1 fw-semibold">
                  Total Requests
                </p>
                <h3 className="fw-bold text-primary mb-0">
                  {totalPatient}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 rounded-3">
              <Card.Body>
                <p className="text-muted mb-1 fw-semibold">
                  Pending Requests
                </p>
                <h3 className="fw-bold text-warning mb-0">
                  {pendingApproval}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 rounded-3">
              <Card.Body>
                <p className="text-muted mb-1 fw-semibold">
                  Active Service
                </p>
                <h3 className="fw-bold text-info mb-0">
                  {inProgressCount}
                </h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 rounded-3">
              <Card.Body>
                <p className="text-muted mb-1 fw-semibold">
                  Completed
                </p>
                <h3 className="fw-bold text-success mb-0">
                  {completedCount}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Companion request table */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <Card.Header className="bg-primary text-white py-3">
            <h5 className="mb-0 fw-bold">
              Companion Service Dashboard
            </h5>
          </Card.Header>

          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0 text-center">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Date & Time</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Assigned Companion</th>
                    <th>Patient Map</th>
                    <th>Status</th>
                    <th>Update Service Status</th>
                  </tr>
                </thead>

                <tbody>
                  {companions.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-muted py-4">
                        No companion requests found
                      </td>
                    </tr>
                  ) : (
                    companions.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{item.patientName || "N/A"}</strong>
                          <div className="small text-muted">
                            {item.Age} yrs ({item.Gender})
                          </div>
                        </td>

                        <td>
                          {item.PreferredDate}
                          <div className="small text-muted">
                            {item.PreferredTime}
                          </div>
                        </td>

                        <td>{item.phone || "N/A"}</td>
                        <td>{item.Address || "N/A"}</td>

                        <td>
                          {item.assignedCompanionName ? (
                            <div>
                              <strong className="text-primary">
                                {item.assignedCompanionName}
                              </strong>

                              {item.assignedCompanionPhone && (
                                <div>
                                  <small className="text-muted">
                                    {item.assignedCompanionPhone}
                                  </small>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted small">
                              Not Assigned
                            </span>
                          )}
                        </td>

                        <td>
                          {hasCoordinates(
                            item.latitude,
                            item.longitude
                          ) ? (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() =>
                                handleOpenLocationModal(item)
                              }
                            >
                              📍 View Map
                            </Button>
                          ) : (
                            "N/A"
                          )}
                        </td>

                        <td>{getStatusBadge(item.status)}</td>

                        <td>
                          <div className="d-flex flex-column gap-1 align-items-center">
                            {(
                              !item.status ||
                              item.status.toLowerCase() === "pending"
                            ) && (
                              <Button
                                size="sm"
                                variant="success"
                                className="w-100"
                                onClick={() =>
                                  updateStatus(item, "Accepted")
                                }
                              >
                                Accept Service Request
                              </Button>
                            )}

                            {item.status === "Accepted" && (
                              <Button
                                size="sm"
                                variant="info"
                                className="w-100 text-white fw-semibold"
                                onClick={() =>
                                  updateStatus(
                                    item,
                                    "Reached Patient Home"
                                  )
                                }
                              >
                                Reached Patient Home
                              </Button>
                            )}

                            {item.status === "Reached Patient Home" && (
                              <Button
                                size="sm"
                                variant="primary"
                                className="w-100 fw-semibold"
                                onClick={() =>
                                  updateStatus(item, "Reached Hospital")
                                }
                              >
                                Reached Hospital
                              </Button>
                            )}

                            {item.status === "Reached Hospital" && (
                              <Button
                                size="sm"
                                variant="dark"
                                className="w-100 fw-semibold"
                                onClick={() =>
                                  updateStatus(
                                    item,
                                    "Reached Home / Service Completed"
                                  )
                                }
                              >
                                Reached Home / Service Completed
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="w-100 mt-1"
                              onClick={() =>
                                handleOpenUpdateModal(item)
                              }
                            >
                              Update GPS & Status
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* Patient and companion map modal */}
      <Modal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold">
            Companion Care Location
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedCompanion && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Patient Name:</strong>{" "}
                    {selectedCompanion.patientName}
                  </p>

                  <p className="mb-1">
                    <strong>Age / Gender:</strong>{" "}
                    {selectedCompanion.Age} yrs /{" "}
                    {selectedCompanion.Gender}
                  </p>

                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedCompanion.phone}
                  </p>

                  <p className="mb-1">
                    <strong>Address:</strong> {selectedCompanion.Address}
                  </p>
                </Col>

                <Col md={6}>
                  <p className="mb-1">
                    <strong>Assigned Companion:</strong>{" "}
                    {selectedCompanion.assignedCompanionName ||
                      "Not Assigned"}
                  </p>

                  <p className="mb-1">
                    <strong>Companion Contact:</strong>{" "}
                    {selectedCompanion.assignedCompanionPhone || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    {getStatusBadge(selectedCompanion.status)}
                  </p>
                </Col>
              </Row>

              {hasCoordinates(
                selectedCompanion.latitude,
                selectedCompanion.longitude
              ) ? (
                <div className="mt-3">
                  <h6 className="fw-bold mb-2">
                    🗺 Companion & Patient Live Map
                  </h6>

                  <LiveMovingMap
                    patientLat={Number(selectedCompanion.latitude)}
                    patientLng={Number(selectedCompanion.longitude)}
                    companionLat={
                      hasCoordinates(
                        selectedCompanion.companionLatitude,
                        selectedCompanion.companionLongitude
                      )
                        ? Number(selectedCompanion.companionLatitude)
                        : Number(selectedCompanion.latitude)
                    }
                    companionLng={
                      hasCoordinates(
                        selectedCompanion.companionLatitude,
                        selectedCompanion.companionLongitude
                      )
                        ? Number(selectedCompanion.companionLongitude)
                        : Number(selectedCompanion.longitude)
                    }
                    patientName={selectedCompanion.patientName}
                    companionName={
                      selectedCompanion.assignedCompanionName ||
                      "Companion"
                    }
                    status={selectedCompanion.status}
                    height="350px"
                  />
                </div>
              ) : (
                <div className="alert alert-warning mt-3">
                  No patient GPS coordinates are available.
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLocationModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* GPS and service status update modal */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold">
            Companion Status & Live GPS
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSaveStaffLocation}>
          <Modal.Body>
            {selectedCompanion && (
              <div className="mb-3 p-3 bg-light rounded border">
                <small className="text-muted d-block fw-semibold">
                  Patient Information
                </small>

                <strong>{selectedCompanion.patientName}</strong>
                {" "}({selectedCompanion.Age} yrs)

                <div>
                  Address: <strong>{selectedCompanion.Address}</strong>
                </div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Select Service Status
              </Form.Label>

              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Accepted">1. Accepted</option>
                <option value="Reached Patient Home">
                  2. Reached Patient Home
                </option>
                <option value="Reached Hospital">
                  3. Reached Hospital
                </option>
                <option value="Reached Home / Service Completed">
                  4. Reached Home / Service Completed
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Current Location / Note
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Example: On the way to hospital"
                value={assignedLocation}
                onChange={(e) =>
                  setAssignedLocation(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Companion GPS Coordinates
              </Form.Label>

              <Row className="g-2">
                <Col md={4}>
                  <Form.Control
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={companionLatitude}
                    onChange={(e) =>
                      setCompanionLatitude(e.target.value)
                    }
                  />
                </Col>

                <Col md={4}>
                  <Form.Control
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={companionLongitude}
                    onChange={(e) =>
                      setCompanionLongitude(e.target.value)
                    }
                  />
                </Col>

                <Col md={4}>
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="w-100"
                    onClick={getStaffLocation}
                  >
                    Detect GPS
                  </Button>
                </Col>
              </Row>

              <div className="mt-2">
                <Button
                  type="button"
                  variant={isLiveSharing ? "danger" : "success"}
                  className="w-100"
                  onClick={toggleLiveLocationSharing}
                >
                  {isLiveSharing
                    ? "Stop Auto GPS Sharing"
                    : "Start Auto GPS Live Sharing"}
                </Button>
              </div>

              {isLiveSharing && (
                <div className="alert alert-success mt-3 mb-2">
                  Live GPS sharing is active.
                </div>
              )}

              {distanceToPatient !== null && (
                <div className="alert alert-info mt-3 mb-2">
                  <strong>Distance to patient home:</strong>{" "}
                  {distanceToPatient >= 1000
                    ? `${(distanceToPatient / 1000).toFixed(2)} km`
                    : `${Math.round(distanceToPatient)} metres`}

                  {distanceToPatient <= 50 && (
                    <div className="mt-2 text-success fw-bold">
                      You are within 50 metres of the patient's
                      saved location. Please confirm arrival using
                      the service status.
                    </div>
                  )}
                </div>
              )}

              {gpsError && (
                <div className="alert alert-warning mt-3 mb-2">
                  {gpsError}
                </div>
              )}

              <small className="text-muted">
                Keep this page open while sharing GPS. Distance is
                calculated in a straight line, not along roads.
              </small>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>

            <Button variant="primary" type="submit">
              Update Status & Location
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CompanionDet;


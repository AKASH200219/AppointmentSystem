import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Row,
  Col,
  Badge,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import UserNav from "./UserNav";
import LiveMovingMap from "../Common/LiveMovingMap";
import API from "../../api/axiosConfig";

function CompanionStatus() {
  const [companion, setCompanion] = useState([]);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("user");

  // Get companion details from backend
  const getCompanion = async () => {
    try {
      // const result = await axios.get(`http://localhost:5000/api/companion/companionStatus/${userId}`);
      const result = await API.get(`/api/companion/companionStatus/${userId}`);

      const list = result.data.Companionresult || [];
      setCompanion(list);

      // Update selected companion during refresh
      setSelectedCompanion((old) => {
        if (!old) return null;

        const updated = list.find((item) => item._id === old._id);
        return updated || old;
      });
    } catch (error) {
      console.log("Error getting companion details", error);
    }
  };

  // Load and refresh data every 5 seconds
  useEffect(() => {
    if (!userId) return;

    getCompanion();

    const interval = setInterval(getCompanion, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  // Open tracking modal
  const openModal = (item) => {
    setSelectedCompanion(item);
    setShowModal(true);
  };

  // Display status
  const showStatus = (status) => {
    if (status === "Accepted") {
      return <Badge bg="success">Accepted</Badge>;
    }

    if (status === "Reached Patient Home") {
      return <Badge bg="info">Reached Patient Home</Badge>;
    }

    if (status === "Reached Hospital") {
      return <Badge bg="primary">Reached Hospital</Badge>;
    }

    if (
      status === "Completed" ||
      status === "Reached Home / Service Completed"
    ) {
      return <Badge bg="dark">Completed</Badge>;
    }

    if (status === "Rejected" || status === "Cancelled") {
      return <Badge bg="danger">{status}</Badge>;
    }

    return <Badge bg="warning" text="dark">Pending</Badge>;
  };

  // Calculate progress
  let progress = 20;
  const status = selectedCompanion?.status;

  if (status === "Accepted") progress = 40;
  if (status === "Reached Patient Home") progress = 60;
  if (status === "Reached Hospital") progress = 80;

  if (
    status === "Completed" ||
    status === "Reached Home / Service Completed"
  ) {
    progress = 100;
  }

  return (
    <>
      <UserNav />

      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Companion Care Status</h5>
          </Card.Header>

          <Card.Body>
            <p className="text-muted">
              View your companion service details and live location.
            </p>

            {companion.length === 0 ? (
              <p className="text-center">
                No companion requests found.
              </p>
            ) : (
              <Table bordered responsive hover>
                <thead className="table-light">
                  <tr>
                    <th>Patient</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Address</th>
                    <th>Companion</th>
                    <th>Status</th>
                    <th>Tracking</th>
                  </tr>
                </thead>

                <tbody>
                  {companion.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.patientName}</strong>
                        <br />
                        <small>
                          {item.Age} years / {item.Gender}
                        </small>
                      </td>

                      <td>{item.selectService}</td>

                      <td>
                        {item.PreferredDate}
                        <br />
                        <small>{item.PreferredTime}</small>
                      </td>

                      <td>{item.Address}</td>

                      <td>
                        {item.assignedCompanionName || "Not Assigned"}
                        <br />
                        <small>
                          {item.assignedCompanionPhone || ""}
                        </small>
                      </td>

                      <td>{showStatus(item.status)}</td>

                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openModal(item)}
                        >
                          Track Location
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Companion tracking modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Companion Live Tracking</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedCompanion && (
            <>
              <h6>Service Progress</h6>

              <ProgressBar
                now={progress}
                label={`${progress}%`}
                className="mb-3"
                variant={progress === 100 ? "success" : "primary"}
              />

              {/* <p>1. Booked</p>
              <p>2. Accepted</p>
              <p>3. Reached Patient Home</p>
              <p>4. Reached Hospital</p>
              <p>5. Service Completed</p> */}

              <hr />

              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Body>
                      <h6 className="text-primary">Patient Details</h6>

                      <p>Name: {selectedCompanion.patientName}</p>
                      <p>Age: {selectedCompanion.Age}</p>
                      <p>Gender: {selectedCompanion.Gender}</p>
                      <p>Service: {selectedCompanion.selectService}</p>
                      <p>Phone: {selectedCompanion.phone}</p>
                      <p>Address: {selectedCompanion.Address}</p>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Body>
                      <h6 className="text-success">Companion Details</h6>

                      <p>
                        Name:{" "}
                        {selectedCompanion.assignedCompanionName ||
                          "Not Assigned"}
                      </p>

                      <p>
                        Phone:{" "}
                        {selectedCompanion.assignedCompanionPhone ||
                          "N/A"}
                      </p>

                      <p>
                        Status: {showStatus(selectedCompanion.status)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Service status messages */}
              {selectedCompanion.status === "Accepted" && (
                <Alert variant="info">
                  Request accepted. The companion will arrive soon.
                </Alert>
              )}

              {selectedCompanion.status === "Reached Patient Home" && (
                <Alert variant="primary">
                  The companion has reached the patient's home.
                </Alert>
              )}

              {selectedCompanion.status === "Reached Hospital" && (
                <Alert variant="success">
                  The companion has reached the hospital.
                </Alert>
              )}

              {(selectedCompanion.status === "Completed" ||
                selectedCompanion.status ===
                  "Reached Home / Service Completed") && (
                <Alert variant="success">
                  The patient has returned home. Service completed.
                </Alert>
              )}

              {(selectedCompanion.status === "Rejected" ||
                selectedCompanion.status === "Cancelled") && (
                <Alert variant="danger">
                  This companion request has been cancelled or rejected.
                </Alert>
              )}

              <hr />

              <h6 className="text-primary">Live Moving Map</h6>

              {selectedCompanion.latitude != null &&
              selectedCompanion.longitude != null ? (
                <LiveMovingMap
                  patientLat={selectedCompanion.latitude}
                  patientLng={selectedCompanion.longitude}
                  companionLat={
                    selectedCompanion.companionLatitude ??
                    selectedCompanion.latitude
                  }
                  companionLng={
                    selectedCompanion.companionLongitude ??
                    selectedCompanion.longitude
                  }
                  patientName={selectedCompanion.patientName}
                  companionName={
                    selectedCompanion.assignedCompanionName ||
                    "Companion"
                  }
                  status={selectedCompanion.status}
                  height="360px"
                />
              ) : (
                <Alert variant="warning">
                  GPS coordinates are not available for this request.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CompanionStatus;

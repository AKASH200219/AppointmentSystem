import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Table, Modal, Form, Row, Col } from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import socket from "../../socket";
import LiveMovingMap from "../Common/LiveMovingMap";
import API from "../../api/axiosConfig";

function CompanionCare() {
  const [companions, setCompanions] = useState([]);
  const [careAssistants, setCareAssistants] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState(null);

  const [assignedCompanionName, setAssignedCompanionName] = useState("");
  const [assignedCompanionPhone, setAssignedCompanionPhone] = useState("");
  // const [assignedLocation, setAssignedLocation] = useState("");
  const [companionLatitude, setCompanionLatitude] = useState("");
  const [companionLongitude, setCompanionLongitude] = useState("");
  const [status, setStatus] = useState("Accepted");

  const getCompanions = async () => {
    try {
      // const result = await axios.get("http://localhost:5000/api/companion/allDetails");
      const result = await API.get("/api/companion/allDetails");
      console.log("Companion Requests:", result.data);
      setCompanions(result.data.companions || []);
    } catch (error) {
      console.log("Can't get companion requests", error);
    }
  };

  const getCareAssistants = async () => {
    try {
      // const result = await axios.get("http://localhost:5000/api/staff/viewStaff");
      const result = await API.get("/api/staff/viewStaff");
      console.log("All staff :",result)
      const allStaff = result.data.result || [];
      const filtered = allStaff.filter(
        (staff) => staff.staffType && staff.staffType.trim().toLowerCase() === "care assistant"
      );
      console.log("Care Assistants:", filtered);
      setCareAssistants(filtered);
    } catch (error) {
      console.log("Can't get care assistant staff list", error);
    }
  };

  useEffect(() => {
    getCompanions();
    getCareAssistants();

    socket.on("companionRequestReceived", (data) => {
      console.log("New Companion Request:", data);
      setCompanions((oldData) => [data, ...oldData]);
    });

    return () => {
      socket.off("companionRequestReceived");
    };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      // await axios.put(`http://localhost:5000/api/companion/updateStatus/${id}`, { status: newStatus });
      await API.put(`/api/companion/updateStatus/${id}`, { status: newStatus });
      getCompanions();
    } catch (error) {
      console.log("Status update failed", error);
    }
  };

  const handleOpenLocationModal = (companion) => {
    setSelectedCompanion(companion);
    setShowLocationModal(true);
  };

  const handleOpenAssignModal = (companion) => {
    setSelectedCompanion(companion);
    setAssignedCompanionName(companion.assignedCompanionName || "");
    setAssignedCompanionPhone(companion.assignedCompanionPhone || "");
    // setAssignedLocation(companion.assignedLocation || companion.Address || "");
    setCompanionLatitude(companion.companionLatitude || companion.latitude || "");
    setCompanionLongitude(companion.companionLongitude || companion.longitude || "");
    setStatus(companion.status || "Accepted");

    const matched = careAssistants.find(
      (s) =>
        (companion.assignedCompanionName && s.name.toLowerCase() === companion.assignedCompanionName.toLowerCase()) ||
        (companion.assignedCompanionPhone && String(s.phone) === String(companion.assignedCompanionPhone))
    );
    setSelectedStaffId(matched ? matched._id : "");

    setShowAssignModal(true);
  };

  const handleCareAssistantSelect = (e) => {
    const staffId = e.target.value;
    setSelectedStaffId(staffId);
    const selectedStaff = careAssistants.find((s) => s._id === staffId);
    if (selectedStaff) {
      setAssignedCompanionName(selectedStaff.name);
      setAssignedCompanionPhone(String(selectedStaff.phone));
    }
  };

  
  const handleSaveAssignCompanion = async (e) => {
    e.preventDefault();
    if (!selectedCompanion) return;

    try {
      // await axios.put(`http://localhost:5000/api/companion/assignCompanion/${selectedCompanion._id}`, {
      await API.put(`/api/companion/assignCompanion/${selectedCompanion._id}`, {
        assignedCompanionName,
        assignedCompanionPhone,
        // assignedLocation,
        companionLatitude: companionLatitude ? Number(companionLatitude) : undefined,
        companionLongitude: companionLongitude ? Number(companionLongitude) : undefined,
        status,
      });
      setShowAssignModal(false);
      getCompanions();
    } catch (error) {
      console.error("Failed to assign companion:", error);
      alert(error.response?.data?.message || "Failed to assign companion details");
    }
  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">
        <h2 className="fw-bold">Companion Care Services</h2>
        <p className="text-muted">Manage patient companion care requests & assign companion present location</p>

        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">Companion Care Requests</h5>

            <Table hover bordered responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Age/Gender</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Address</th>
                  <th>Assigned Companion & Present Location</th>
                  <th>Map Modal</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {companions.map((companion, index) => (
                  <tr key={companion._id}>
                    <td><strong>#{index + 1}</strong></td>
                    <td><strong>{companion.patientName}</strong></td>
                    <td>{companion.Age} yrs / {companion.Gender}</td>
                    <td>{companion.selectService}</td>
                    <td>{companion.PreferredDate} <br /><small className="text-muted">{companion.PreferredTime}</small></td>
                    <td>{companion.Address}</td>
                    <td>
                      {companion.assignedCompanionName ? (
                        <div>
                          <strong className="text-primary">{companion.assignedCompanionName}</strong>
                          {companion.assignedCompanionPhone && (
                            <div><small className="text-muted"> {companion.assignedCompanionPhone}</small></div>
                          )}
                          {/* {companion.assignedLocation && (
                            <div><small className="text-success"> {companion.assignedLocation}</small></div>
                          )} */}
                        </div>
                      ) : (
                        <span className="text-muted small">Not Assigned</span>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleOpenLocationModal(companion)}
                      >
                         View Modal
                      </Button>
                    </td>
                    <td>
                      {(!companion.status || companion.status.toLowerCase() === "pending") && <Badge bg="warning" text="dark">Pending</Badge>}
                      {companion.status === "Accepted" && <Badge bg="success">Accepted</Badge>}
                      {companion.status === "Reached Patient Home" && <Badge bg="info">Reached Patient Home</Badge>}
                      {companion.status === "Reached Hospital" && <Badge bg="primary">Reached Hospital</Badge>}
                      {(companion.status === "Reached Home / Service Completed" || companion.status === "Completed") && <Badge bg="dark">Reached Home / Service Completed</Badge>}
                      {companion.status === "Rejected" && <Badge bg="danger">Rejected</Badge>}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenAssignModal(companion)}
                        >
                          Assign Companion
                        </Button>

                        {companion.status === "Pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => updateStatus(companion._id, "Accepted")}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => updateStatus(companion._id, "Rejected")}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateStatus(companion._id, "Pending")}
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Location Modal */}
      <Modal show={showLocationModal} onHide={() => setShowLocationModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold">
            Companion & Patient Location Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompanion && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="p-3 bg-light rounded border h-100">
                    <h6 className="fw-bold text-primary mb-2">🏥 Patient / Grandpa Details</h6>
                    <p className="mb-1"><strong>Name:</strong> {selectedCompanion.patientName}</p>
                    <p className="mb-1"><strong>Age / Gender:</strong> {selectedCompanion.Age} yrs / {selectedCompanion.Gender}</p>
                    <p className="mb-1"><strong>Phone:</strong> {selectedCompanion.phone}</p>
                    <p className="mb-1"><strong>Service Required:</strong> {selectedCompanion.selectService}</p>
                    <p className="mb-1"><strong>Address:</strong> {selectedCompanion.Address}</p>
                    <p className="mb-0"><strong>Preferred Date:</strong> {selectedCompanion.PreferredDate} ({selectedCompanion.PreferredTime})</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded border h-100">
                    <h6 className="fw-bold text-success mb-2"> Companion Present Details & Location</h6>
                    {selectedCompanion.assignedCompanionName ? (
                      <>
                        <p className="mb-1"><strong>Name:</strong> {selectedCompanion.assignedCompanionName}</p>
                        <p className="mb-1"><strong>Contact Phone:</strong> {selectedCompanion.assignedCompanionPhone || "N/A"}</p>
                        <p className="mb-1"><strong>Present Location:</strong> {selectedCompanion.assignedLocation || selectedCompanion.Address}</p>
                        <p className="mb-0">
                          <strong>Status:</strong>{" "}
                          <Badge bg={selectedCompanion.status === "Accepted" ? "success" : "warning"}>
                            {selectedCompanion.status}
                          </Badge>
                        </p>
                      </>
                    ) : (
                      <div className="alert alert-info mb-0">
                        Companion has not been assigned yet.
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="mt-3">
                <h6 className="fw-bold mb-2 text-primary">🗺 Companion & Patient Live Moving Map:</h6>
                {selectedCompanion.latitude && selectedCompanion.longitude ? (
                  <LiveMovingMap
                    patientLat={selectedCompanion.latitude}
                    patientLng={selectedCompanion.longitude}
                    companionLat={selectedCompanion.companionLatitude || selectedCompanion.latitude}
                    companionLng={selectedCompanion.companionLongitude || selectedCompanion.longitude}
                    patientName={selectedCompanion.patientName}
                    companionName={selectedCompanion.assignedCompanionName || "Companion"}
                    status={selectedCompanion.status}
                    height="350px"
                  />
                ) : (
                  <div className="alert alert-warning">
                    No GPS coordinates available.
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLocationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Assign Companion Modal */}
      <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="fs-5 fw-bold">
            👤 Assign Companion & Present Location
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveAssignCompanion}>
          <Modal.Body>
            {selectedCompanion && (
              <div className="mb-3 p-3 bg-light rounded border">
                <small className="text-muted d-block fw-semibold">Patient Information:</small>
                <strong>{selectedCompanion.patientName}</strong> ({selectedCompanion.Age} yrs) - Requesting <strong>{selectedCompanion.selectService}</strong> at {selectedCompanion.Address}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Select Created Care Assistant (Companion)</Form.Label>
              <Form.Select
                value={selectedStaffId}
                onChange={handleCareAssistantSelect}
              >
                <option value="">-- Choose Care Assistant --</option>
                {careAssistants.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.phone})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Selecting a Care Assistant will preset the Companion Name and Phone Number.
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Companion Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter assigned companion name"
                    value={assignedCompanionName}
                    onChange={(e) => setAssignedCompanionName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Companion Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter companion phone number"
                    value={assignedCompanionPhone}
                    onChange={(e) => setAssignedCompanionPhone(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted / Assigned</option>
                <option value="Reached Patient Home">Reached Patient Home</option>
                <option value="Reached Hospital">Reached Hospital</option>
                <option value="Reached Home / Service Completed">Reached Home / Service Completed</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save & Assign Companion
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CompanionCare;


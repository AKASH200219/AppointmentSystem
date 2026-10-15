import React, { useEffect, useState } from "react";
import {Badge,Button,Card,Col,Container,Form,Row,Spinner,Alert} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import defaultDoctorImg from "/src/assets/doc1.jpg";
import companionImg from "/src/assets/companion.jpg";
import UserNav from "./UserNav";

function MyAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All Bookings");
  const [alertInfo, setAlertInfo] = useState(null);

  const userId = localStorage.getItem("user");

  const fetchAppointments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get( `http://localhost:5000/api/book/user/${userId}`);
      setAppointments(res.data.appointments || []);
    } 
    catch (err) {
      console.error("Failed to load appointments:", err);
      setAlertInfo({
        type: "danger",
        message: "Failed to load appointments from server."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/appointments/status/${id}`, {
        status: "Cancelled"
      });
      setAlertInfo({
        type: "success",
        message: "Appointment cancelled successfully."
      });
      fetchAppointments();
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      setAlertInfo({
        type: "danger",
        message: "Could not cancel appointment. Please try again."
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
      case "Confirmed":
        return <Badge bg="success">Accepted</Badge>;
      case "Rejected":
      case "Cancelled":
        return <Badge bg="danger">{status}</Badge>;
      case "Completed":
        return <Badge bg="info">Completed</Badge>;
      case "Booked":
      default:
        return <Badge bg="warning" text="dark">Booked</Badge>;
    }
  };

  return (
    <>
      <UserNav />
      <Container className="py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Bookings</h2>
            <p className="text-muted mb-0">
              View and manage all your doctor appointments.
            </p>
          </div>
          <Button as={Link} to="/doctorpage" variant="primary" className="mt-2 mt-sm-0">
            + Book New Appointment
          </Button>
        </div>

        {alertInfo && (
          <Alert
            variant={alertInfo.type}
            dismissible
            onClose={() => setAlertInfo(null)}
            className="mb-4"
          >
            {alertInfo.message}
          </Alert>
        )}

        {!userId && (
          <Alert variant="warning" className="mb-4">
            You are not logged in. <Link to="/">Log in here</Link> to see your bookings.
          </Alert>
        )}

        <Row className="mb-4">
          <Col md={4}>
            <Form.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All Bookings</option>
              <option>Doctor Appointment</option>
              <option>Companion Care</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading your appointments...</p>
          </div>
        ) : filterType !== "Companion Care" && appointments.length === 0 ? (
          <Card className="text-center py-5 shadow-sm border-0 rounded-4">
            <Card.Body>
              <h5 className="fw-bold text-muted mb-3">No Appointments Found</h5>
              <p className="text-muted mb-4">
                You have not booked any doctor appointments yet.
              </p>
              <Button as={Link} to="/doctorpage" variant="primary">
                Book Your First Appointment
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <>
            {filterType !== "Companion Care" &&
              appointments.map((appt) => (
                <Card
                  key={appt._id}
                  className="shadow-sm border-0 mb-3 rounded-4 overflow-hidden"
                >
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={2} className="text-center mb-3 mb-md-0">
                        <img
                          src={
                            appt.doctorId?.image
                              ? `http://localhost:5000/uploads/${appt.doctorId.image}`
                              : defaultDoctorImg
                          }
                          alt="Doctor"
                          className="rounded-circle img-fluid shadow-sm"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            e.target.src = defaultDoctorImg;
                          }}
                        />
                      </Col>

                      <Col md={7}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h4 className="fw-bold mb-0">
                            Dr. {appt.doctorId?.name || "Specialist"}
                          </h4>
                          <Badge bg="primary" className="fs-6">
                            Token #{appt.tokenNumber}
                          </Badge>
                        </div>

                        <p className="text-primary fw-semibold mb-1">
                          {appt.doctorId?.specialization || "General Medicine"}
                        </p>
                        <p className="mb-1 text-muted">
                          <strong>Patient:</strong> {appt.patientName} (Age: {appt.age})
                        </p>
                        <p className="mb-1">
                          <strong>Date:</strong> {appt.appointmentDate}
                          {appt.tokenId && (
                            <span className="ms-2 text-muted">
                              ({appt.tokenId.availableTime} - {appt.tokenId.endingTime})
                            </span>
                          )}
                        </p>
                        {appt.doctorId?.fees && (
                          <p className="mb-1 text-muted">
                            <strong>Fee:</strong> ₹{appt.doctorId.fees}
                          </p>
                        )}
                        <div className="mt-2">{getStatusBadge(appt.status)}</div>
                      </Col>

                      <Col md={3} className="text-md-end mt-3 mt-md-0">
                        {appt.status !== "Cancelled" && appt.status !== "Rejected" ? (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancel(appt._id)}
                          >
                            Cancel Booking
                          </Button>
                        ) : (
                          <span className="text-muted small">No actions available</span>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
          </>
        )}
      </Container>
    </>
  );
}

export default MyAppointment;
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNav from "./AdminNav";

import {FaUsers,FaUserMd,FaUserNurse,FaCalendarCheck,FaPills,FaHandHoldingHeart,FaTools,FaSync,FaFlask} from "react-icons/fa";
import API from "../../api/axiosConfig";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalStaff: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    acceptedAppointments: 0,
    rejectedAppointments: 0,
    medicineOrders: 0,
    companionRequests: 0,
    equipmentBookings: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // const res = await axios.get("http://localhost:5000/api/admin/dashboard");
      const res = await API.get("/api/admin/dashboard");
      console.log(res);
      
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentAppointments(res.data.recentAppointments);
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <>
      <AdminNav />

      <Container fluid className="p-4 bg-light min-vh-100">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Admin Dashboard
            </h2>

            <p className="text-muted mb-0">
              Welcome to the DocAppointment administration panel
            </p>
          </div>

          <Button
            variant="primary"
            onClick={fetchDashboard}
            disabled={loading}
          >
            <FaSync className="me-2" />

            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <Row className="g-4 mb-4">

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">

                  <div>
                    <p className="text-muted mb-1">
                      Total Users
                    </p>

                    <h2 className="fw-bold">
                      {stats.totalUsers}
                    </h2>
                  </div>

                  <FaUsers size={40} className="text-primary"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card
              className="border-0 shadow-sm h-100 cursor-pointer"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => navigate("/doctorview")}
              title="Click to view and manage doctors"
            >
              <Card.Body>
                <div className="d-flex justify-content-between">

                  <div>
                    <p className="text-muted mb-1">
                      Total Doctors
                    </p>

                    <h2 className="fw-bold">
                      {stats.totalDoctors}
                    </h2>
                    <small className="text-primary fw-semibold">View Doctors &rarr;</small>
                  </div>

                  <FaUserMd size={40} className="text-success"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">

                  <div>
                    <p className="text-muted mb-1">
                      Total Staff
                    </p>

                    <h2 className="fw-bold">
                      {stats.totalStaff}
                    </h2>
                  </div>

                  <FaUserNurse size={40} className="text-info" />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">

                  <div>
                    <p className="text-muted mb-1">
                      Appointments
                    </p>

                    <h2 className="fw-bold">
                      {stats.totalAppointments}
                    </h2>
                  </div>

                  <FaCalendarCheck size={40} className="text-warning"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <Row className="g-4 mb-4">

          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <p className="text-muted mb-1">
                  Pending Appointments
                </p>

                <h3 className="text-warning fw-bold">
                  {stats.pendingAppointments}
                </h3>

                <Badge bg="warning" text="dark">
                  Pending
                </Badge>
              </Card.Body>
            </Card>
          </Col>


          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <p className="text-muted mb-1">
                  Accepted Appointments
                </p>

                <h3 className="text-success fw-bold">
                  {stats.acceptedAppointments}
                </h3>

                <Badge bg="success">
                  Accepted
                </Badge>
              </Card.Body>
            </Card>
          </Col>


          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <p className="text-muted mb-1">
                  Rejected Appointments
                </p>

                <h3 className="text-danger fw-bold">
                  {stats.rejectedAppointments}
                </h3>

                <Badge bg="danger">
                  Rejected
                </Badge>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <h4 className="fw-bold mb-3">
          Healthcare Services
        </h4>

        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold">
                      Medicine Orders
                    </h5>
                    <h2 className="text-primary fw-bold">
                      {stats.medicineOrders}
                    </h2>
                  </div>
                  <FaPills size={40} className="text-primary"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold">
                      Companion Requests
                    </h5>
                    <h2 className="text-info fw-bold">
                      {stats.companionRequests}
                    </h2>
                  </div>
                  <FaHandHoldingHeart size={40} className="text-info"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold">
                      Equipment Bookings
                    </h5>
                    <h2 className="text-success fw-bold">
                      {stats.equipmentBookings}
                    </h2>
                  </div>
                  <FaTools size={40} className="text-success"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card
              className="border-0 shadow-sm h-100 cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/managelab")}
            >
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold">
                      All Labs
                    </h5>
                    <h2 className="text-danger fw-bold">
                      Manage
                    </h2>
                    <small className="text-danger fw-semibold">View Labs </small>
                  </div>
                  <FaFlask size={40} className="text-danger"/>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <Card className="border-0 shadow-sm">

          <Card.Body>

            <h4 className="fw-bold mb-3">
              Recent Appointments
            </h4>

            <div className="table-responsive">

              <Table hover bordered>

                <thead className="table-light">

                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  {recentAppointments.length === 0 ? (

                    <tr>
                      <td
                        colSpan="5"
                        className="text-center"
                      >
                        No appointments found
                      </td>
                    </tr>

                  ) : (

                    recentAppointments.map((appointment, index) => (

                      <tr key={appointment._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {appointment.patientName || "N/A"}
                        </td>

                        <td>
                          {appointment.doctorId?.name || "N/A"}
                        </td>

                        <td>
                          {appointment.appointmentDate || "N/A"}
                        </td>

                        <td>

                          <Badge
                            bg={
                              appointment.status === "Accepted"
                                ? "success"
                                : appointment.status === "Rejected"
                                ? "danger"
                                : "warning"
                            }
                          >
                            {appointment.status || "Pending"}
                          </Badge>

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
    </>
  );
}

export default AdminDashboard;
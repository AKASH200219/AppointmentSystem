import React, { useEffect, useState } from "react";
import {Card,Col,Container,Row,Table,Badge,} from "react-bootstrap";
import DoctorNav from "./DoctorNav";
import axios from "axios";
import API from "../../api/axiosConfig";

function DocDashboard() {
  const Doctorid = localStorage.getItem("doctor");

  console.log("Doctor Id:", Doctorid);

  const [appointment, setAppointment] = useState([]);

  const Appointments = async () => {
    try {
      // const result = await axios.get(`http://localhost:5000/api/appointments/getDetails/${Doctorid}`);
      const result = await API.get(`/api/appointments/getDetails/${Doctorid}`);

      console.log("Appointments:", result.data);

      setAppointment(result.data.appointments);
    } 
    catch (error) {
      console.log("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    Appointments();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointment.filter((app) => app.appointmentDate === today);

  const bookedAppointments = appointment.filter((app) => app.status === "Booked");

  const acceptedAppointments = appointment.filter((app) => app.status === "Accepted");

  const rejectedAppointments = appointment.filter((app) => app.status === "Rejected");

  return (
    <>
      <DoctorNav />

      <Container className="py-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            Doctor Dashboard
          </h2>

          <p className="text-muted">
            Welcome back. Here's your appointment overview.
          </p>
        </div>

        <Row className="g-4 mb-4">


          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <p className="text-muted mb-2">
                  Total Appointments
                </p>

                <h2 className="fw-bold mb-0">
                  {appointment.length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <p className="text-muted mb-2">
                  Today's Appointments
                </p>

                <h2 className="fw-bold mb-0">
                  {todayAppointments.length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <p className="text-muted mb-2">
                  Booked
                </p>

                <h2 className="fw-bold mb-0">
                  {bookedAppointments.length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <p className="text-muted mb-2">
                  Accepted
                </p>

                <h2 className="fw-bold mb-0">
                  {acceptedAppointments.length}
                </h2>
              </Card.Body>
            </Card>
          </Col>

        </Row>

        <Row className="g-4 mb-4">

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>

                <p className="text-muted mb-1">
                  Booked Appointments
                </p>

                <h4 className="fw-bold">
                  {bookedAppointments.length}
                </h4>

                <Badge bg="warning" text="dark">
                  Pending
                </Badge>

              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>

                <p className="text-muted mb-1">
                  Accepted Appointments
                </p>

                <h4 className="fw-bold">
                  {acceptedAppointments.length}
                </h4>

                <Badge bg="success">
                  Confirmed
                </Badge>

              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>

                <p className="text-muted mb-1">
                  Rejected Appointments
                </p>

                <h4 className="fw-bold">
                  {rejectedAppointments.length}
                </h4>

                <Badge bg="danger">
                  Rejected
                </Badge>

              </Card.Body>
            </Card>
          </Col>

        </Row>

        <Card className="border-0 shadow-sm">

          <Card.Body>

            <div className="d-flex justify-content-between align-items-center mb-3">

              <div>
                <h5 className="fw-bold mb-1">
                  Today's Appointments
                </h5>
              </div>

              <Badge bg="dark">
                {today}
              </Badge>

            </div>

            <div className="table-responsive">

              <Table hover className="align-middle mb-0">

                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {todayAppointments.length > 0 ? (

                    todayAppointments.map((app) => (

                      <tr key={app._id}>

                        <td><strong>#{app.tokenNumber}</strong> </td>

                        <td> <strong> {app.patientName}</strong> </td>

                        <td>{app.age} </td>

                        <td> {app.phone} </td>

                        <td>{app.symptoms}</td>

                        <td>{app.status === "Booked" && (
                            <Badge bg="warning" text="dark"> Booked</Badge>
                          )}

                          {app.status === "Accepted" && (
                            <Badge bg="success"> Accepted </Badge>
                          )}

                          {app.status === "Rejected" && (
                            <Badge bg="danger">
                              Rejected
                            </Badge>
                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No appointments for today
                      </td>
                    </tr>

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

export default DocDashboard;
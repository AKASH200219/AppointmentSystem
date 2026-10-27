import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import UserNav from "./UserNav";
import API from "../../api/axiosConfig";

function DoctorProfile() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        // const response = await axios.get(`http://localhost:5000/api/booking/doctorBooking/${doctorId}`);
        const response = await API.get(`/api/booking/doctorBooking/${doctorId}`);
        setDoctor(response.data.doctorData);
        // const tokenResponse = await axios.get(`http://localhost:5000/api/token/gettoken/${doctorId}`);
        const tokenResponse = await API.get(`/api/token/gettoken/${doctorId}`);
        setSchedules(tokenResponse.data.tokenData || []);
      } catch (requestError) {
        console.error("Failed to load doctor profile:", requestError);
        setError(requestError.response?.data?.message || "Could not load doctor details.");
      }
    };
    loadDoctor();
  }, [doctorId]);

  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayString = today.toISOString().slice(0, 10);
  const upcomingSchedules = schedules.filter(
    (schedule) => schedule.month >= todayString.slice(0, 7)
  );

  return (
    <>
      <UserNav />
      <Container className="py-5">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!doctor && !error ? <p>Loading doctor details...</p> : doctor && (
          <>
            <Card className="shadow border-0 rounded-4 p-4 mb-4">
              <Row className="align-items-center g-4">
                <Col lg={4} className="text-center">
                  <img
                    // src={`http://localhost:5000/uploads/${doctor.image}`}
                    src={`${API.defaults.baseURL}/uploads/${doctor.image}`}
                    alt={`Dr. ${doctor.name}`}
                    className="img-fluid rounded-4 shadow"
                    style={{ width: "100%", maxWidth: "320px", height: "360px", objectFit: "cover" }}
                  />
                </Col>
                <Col lg={8}>
                  <h2 className="fw-bold">Dr. {doctor.name}</h2>
                  <h5 className="text-primary">{doctor.specialization}</h5>
                  <Badge bg="success" className="mb-3 fs-6">{doctor.experience} years of experience</Badge>
                  <Row className="mb-3">
                    <Col sm={6}>
                      <p><strong>Qualification:</strong> {doctor.qualification}</p>
                      <p><strong>Consultation Fee:</strong> ₹{doctor.fees}</p>
                    </Col>
                    <Col sm={6}>
                      <p><strong>Hospital:</strong> {doctor.hospital}</p>
                      <p><strong>Phone:</strong> {doctor.phone}</p>
                      <p><strong>Email:</strong> {doctor.email}</p>
                    </Col>
                  </Row>
                  <h5>Regular Availability</h5>
                  <p>
                    {(doctor.available || []).join(", ") || "See appointment dates below"}
                    {doctor.availableFrom && doctor.availableTo && (
                      <><br />{doctor.availableFrom} - {doctor.availableTo}</>
                    )}
                  </p>
                  <h5>About Doctor</h5>
                  <p className="text-muted">{doctor.about}</p>
                  <Button as={Link} to={`/bookappointment/${doctor._id}`} variant="primary">
                    Book Appointment
                  </Button>
                  <Button as={Link} to="/doctorpage" variant="outline-secondary" className="ms-2">
                    Back to Doctors
                  </Button>
                </Col>
              </Row>
            </Card>

            <h4 className="fw-bold mb-3">Upcoming Appointment Availability</h4>
            {upcomingSchedules.length === 0 ? (
              <p className="text-muted">No upcoming appointment schedules are available.</p>
            ) : (
              <Row className="g-3">
                {upcomingSchedules.map((schedule) => (
                  <Col md={6} lg={4} key={schedule._id}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body>
                        <h6 className="fw-bold">{schedule.month}</h6>
                            <p className="mb-1">Monthly appointment capacity</p>
                        <p className="mb-0">
                          Available tokens: <strong>{Math.max(0, schedule.token - (schedule.bookedtoken || 0))}</strong>
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default DoctorProfile;

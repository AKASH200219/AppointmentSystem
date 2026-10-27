import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, } from "react-bootstrap";
import UserNav from "./UserNav";
import axios from "axios";
import { useParams } from "react-router-dom";
import API from "../../api/axiosConfig";

function BookAppointment() {

  const { doctorId } = useParams();
  console.log("Doctor ID from URL:", doctorId);

  const [docInfo, setDocInfo] = useState(null);
  const [selectedToken, setSelectedToken] = useState([]);
  // const [selectedTokenId, setSelectedTokenId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getDoctorInfo = async () => {
    try {

      console.log("Doctor ID:", doctorId);

      // const result = await axios.get(`http://localhost:5000/api/booking/doctorBooking/${doctorId}`);
      const result = await API.get(`/api/booking/doctorBooking/${doctorId}`);

      console.log("Doctor info:", result.data);

      setDocInfo(result.data.doctorData);

    } catch (err) {
      console.log("Failed to get doctor data", err);
    }
  };

  const getToken = async () => {
    try {

      // const result = await axios.get(`http://localhost:5000/api/token/gettoken/${doctorId}`)
      const result = await API.get(`/api/token/gettoken/${doctorId}`)
      console.log("Token info:", result.data);
      setSelectedToken(result.data.tokenData || []);
    }
    catch (err) {
      console.log("Can't to get token", err);
      setBookingError(
        err.response?.data?.message || "Could not load appointment availability."
      );
    }
  }

  const handleAppointment = async (e) => {
    e.preventDefault();
    setBookingError("");

    const schedule = selectedToken.find(
      (item) => item.month === selectedDate.slice(0, 7)
    );
    if (!schedule || (schedule.bookedtoken || 0) >= schedule.token) {
      setBookingError("No tokens are available for the selected date. Please choose another date.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        appointmentDate: selectedDate, patientName,
        phoneNumber, dob, age, symptoms,
        userId: localStorage.getItem("user"),
      }
      console.log("Appointment data:", body);


      // const result = await axios.post(`http://localhost:5000/api/book/bookToken/${doctorId}`, body);
      const result = await API.post(`/api/book/bookToken/${doctorId}`, body);

      console.log("Booking result:", result.data);

      alert(`Appointment Confirmed.Your Token Number is ${result.data.tokenNumber}`);
      await getToken();

    }
    catch (err) {

      console.log("Failed to book appointment", err);
      setBookingError(
        [err.response?.data?.message, err.response?.data?.error]
          .filter(Boolean)
          .join(": ") ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSchedule = selectedToken.find(
    (item) => item.month === selectedDate.slice(0, 7)
  );
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minimumAppointmentDate = today.toISOString().slice(0, 10);


  useEffect(() => {
    getDoctorInfo();
    getToken();

  }, [doctorId]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    if (dob) {
      setAge(calculateAge(dob));
    } else {
      setAge("");
    }
  }, [dob]);
  return (
    <>
      <UserNav />
      <Container className="py-5">

        <Card className="shadow border-0 rounded-4">

          <Row className="g-0">
            {docInfo && (
              <>
                <Col lg={4} className="bg-light p-4 text-center">

                  <img
                    // src={`http://localhost:5000/uploads/${docInfo.image}`}
                     src={`${API.defaults.baseURL}/uploads/${docInfo.image}`}
                    alt="Doctor"
                    className="img-fluid rounded-4 shadow"
                    style={{
                      height: "320px",
                      objectFit: "cover",
                    }} />

                  <h3 className="mt-4 fw-bold">
                    Dr.{docInfo.name}
                  </h3>

                  <p className="text-primary fw-semibold">
                    {docInfo.specialization}
                  </p>
                  <p> Consultation Fee : ₹{docInfo.fees}</p>

                  <p>{docInfo.available}<br />09:00 AM - 05:00 PM</p>

                </Col>

                <Col lg={8} className="p-4">

                  <h3 className="fw-bold mb-4">Book Appointment</h3>

                  {selectedToken.filter((item) => item.month === selectedDate.slice(0, 7)).map((item) => (
                    <Card key={item._id} className="mb-4 shadow-sm border-0">
                      <Card.Body>
                        <h5 className="fw-bold">Monthly Appointment Capacity</h5>

                        <p>Total Tokens: <strong>{item.token}</strong></p>

                        <p>Booked Tokens: <strong>{item.bookedtoken}</strong></p>

                        <p className={`${item.token - item.bookedtoken > 0 ? "text-success" : "text-danger"} fw-bold`}>
                          Available Tokens: {Math.max(0, item.token - item.bookedtoken)}
                        </p>

                      </Card.Body>
                    </Card>
                  ))}

                  <Form onSubmit={handleAppointment}>

                    <Row>

                      <Col md={6}>
                        <Form.Group className="mb-4">

                          <Form.Label className="fw-bold">Select Appointment Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={selectedDate}
                            min={minimumAppointmentDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            required
                          />
                          {selectedDate && !selectedSchedule && (
                            <Form.Text className="text-muted">
                              No appointment schedule is available on this date.
                            </Form.Text>
                          )}

                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control type="tel" placeholder="Enter phone number"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            title="Enter a 10-digit phone number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required 
                            isValid={phoneNumber.length === 10}
                            isInvalid={phoneNumber.length > 0 && phoneNumber.length !== 10}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>

                        <Form.Label>Patient Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          onChange={(e) => setPatientName(e.target.value)}
                          required
                          isValid={patientName.trim() !== ""}
                          isInvalid={patientName.trim() === ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter the patient name.
                        </Form.Control.Feedback>
                      </Col>

                    </Row>

                    <Row>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>DOB</Form.Label>
                          <Form.Control type="date"
                            onChange={(e) => setDob(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Age</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Age"
                            value={age}
                            min="1"
                            step="1"
                            onChange={(e) => setAge(e.target.value)}
                            required
                            isValid={age !== ""}
                            isInvalid={age === ""}
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Symptoms</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe your problem"
                        onChange={(e) => setSymptoms(e.target.value)}
                        isValid={symptoms.trim() !== ""}
                        isInvalid={symptoms.trim() === ""}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please describe your symptoms.
                      </Form.Control.Feedback>
                    </Form.Group>


                    {bookingError && <div className="alert alert-danger" role="alert">{bookingError}</div>}

                    <Button variant="primary" size="lg" className="w-100"
                      type="submit" disabled={submitting || !selectedSchedule || (selectedSchedule.bookedtoken || 0) >= selectedSchedule.token}>
                      {submitting ? "Confirming..." : "Confirm Appointment"}
                    </Button>

                  </Form>

                </Col>
              </>
            )}
          </Row>

        </Card>

      </Container>
    </>
  );
}

export default BookAppointment;

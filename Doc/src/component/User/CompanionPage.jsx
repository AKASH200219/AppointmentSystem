import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import companion from "/src/assets/companion.jpg";
import UserNav from "./UserNav";
import axios from "axios";
import socket from "../../socket";
import API from "../../api/axiosConfig";

function CompanionPage() {
  const [service, setService] = useState("");
  const [patientName, setPatientname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [phone,setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const userid = localStorage.getItem("user");

  useEffect(() => {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return () => {
    socket.off("connect");
    socket.off("disconnect");
  };
}, []);
  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setErrorMsg("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      console.log("Latitude:", lat);
      console.log("Longitude:", lng);
    },
    (error) => {
      console.log("Location Error:", error);

      setErrorMsg(
        "Unable to get your location. Please allow location permission."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!service || service === "Select a Service") {
      setErrorMsg("Please select a valid service.");
      return;
    }
    if (!gender || gender === "Select Gender") {
      setErrorMsg("Please select a valid gender.");
      return;
    }
    if (!latitude || !longitude) {
  setErrorMsg("Please get your current location before submitting.");
  return;
}


    try {
     
      const body = {
        userId: userid,
        service,
        patientName,
        age: Number(age),
        gender,
        preferredDate,
        preferredTime,
        phone,
        address,
        latitude,
        longitude,
      };

      // const result = await axios.post("http://localhost:5000/api/companion/addCompanion", body);
      const result = await API.post("/api/companion/addCompanion", body);
      console.log("Companion request successful:", result);
      setSuccessMsg("Companion care request submitted successfully!");
      setService("");
      setPatientname("");
      setAge("");
      setGender("");
      setPreferredDate("");
      setPreferredTime("");
      setPhone("");
      setAddress("");
    } catch (err) {
      console.error("Failed to add companion request:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to submit companion care request. Please try again."
      );
    }
  };

  const handleReset = () => {
    setService("");
    setPatientname("");
    setAge("");
    setGender("");
    setPreferredDate("");
    setPreferredTime("");
    setAddress("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <>
      <UserNav />
      <Container fluid className="p-0">
        <Card className="border-0 rounded-0 text-white">
          <Card.Img
            src={companion}
            style={{ height: "400px", objectFit: "cover" }}
            alt="Companion Care"
          />

          <Card.ImgOverlay
            className="d-flex flex-column justify-content-center"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          >
            <Container>
              <h1 className="fw-bold">Companion Care Services</h1>
              <p className="mt-3" style={{ maxWidth: "650px", fontSize: "18px" }}>
                We provide trusted and compassionate caregivers to support patients and senior
                citizens at home. Our team is dedicated to ensuring comfort, safety, and quality care.
              </p>
            </Container>
          </Card.ImgOverlay>
        </Card>

        <Container className="py-5">
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h3 className="text-center fw-bold mb-4 text-primary">
                Request Companion Care
              </h3>

              {successMsg && (
                <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>
                  {successMsg}
                </Alert>
              )}

              {errorMsg && (
                <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>
                  {errorMsg}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Select Service</Form.Label>
                      <Form.Select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        required
                      >
                        <option value="">Select a Service</option>
                        <option value="Elderly Care">Elderly Care</option>
                        <option value="Disability Assistance">Disability Assistance</option>
                        <option value="Bedridden Patient Care">Bedridden Patient Care</option>
                        <option value="Palliative Care">Palliative Care</option>
                        <option value="Daily Living Assistance">Daily Living Assistance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Patient Name"
                        value={patientName}
                        onChange={(e) => setPatientname(e.target.value)}
                        isValid={patientName.trim() !== ""}
                        isInvalid={patientName.trim() === ""}
                      /><Form.Control.Feedback type="invalid">
                        Please enter the patient name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Age</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="130"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        isvalid={age !==""}
                        isInvalid={age ===""}
                      />
                      <Form.Control.Feedback type="invalid">Please enter the age</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Gender</Form.Label>
                      <Form.Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Preferred Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Preferred Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Phone No.</Form.Label>
                  <Form.Control
                    type="tel"
                    maxLength={10}
                    placeholder="Enter Phone Number "
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    isvalid={phone.length === 10}
                    isInvalid={phone.length !==10 }
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter complete address "
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Current Location
                  </Form.Label>

                 <Row>
                   <Col md={9}>
                     <Form.Control
                       type="text"
                       value={
                         latitude && longitude
                           ? `${latitude}, ${longitude}`
                           : ""
                       }
                       placeholder="Click Get Location"
                       readOnly
                     />
                   </Col>
                
                   <Col md={3}>
                     <Button
                       type="button"
                       variant="primary"
                       className="w-100"
                       onClick={getCurrentLocation}
                     >
                       Get Location
                     </Button>
                   </Col>
                 </Row>
                
                 {latitude && longitude && (
                   <div className="text-success mt-2">
                      Location detected successfully
                   </div>
                 )}
                </Form.Group>

                <Row className="mt-3">
                  <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 fw-bold"
                      type="submit"
                    >
                      Request
                    </Button>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      className="w-100 fw-semibold"
                      type="button"
                      onClick={handleReset}

                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </Container>
    </>
  );
}

export default CompanionPage;

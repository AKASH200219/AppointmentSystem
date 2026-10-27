import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import UserNav from "./UserNav";
import axios from "axios";
import {
  FaFlask,
  FaFileMedical,
  FaRupeeSign,
  FaClock,
  FaClinicMedical,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import API from "../../api/axiosConfig";

function LabBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateTest = location.state?.test;
  const stateLab = location.state?.lab;

  const userId = localStorage.getItem("user");

  const [allLabs, setAllLabs] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [selectedLabId, setSelectedLabId] = useState(
    stateLab?._id || stateTest?.labId || ""
  );
  const [selectedTestId, setSelectedTestId] = useState(stateTest?._id || "");

  const [selectedTest, setSelectedTest] = useState(stateTest || null);
  const [selectedLab, setSelectedLab] = useState(stateLab || null);

  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [attachmentType, setAttachmentType] = useState("Doctor Prescription");
  const [attachmentFile, setAttachmentFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: "", message: "" });

  useEffect(() => {
    // If user arrived directly without selecting a test or lab, fetch them
    if (!stateTest || !stateLab) {
      // axios.get("http://localhost:5000/api/lab/all-labs")
      API.get("/api/lab/all-labs")
        .then((res) => {
          if (res.data?.success) setAllLabs(res.data.result || []);
        })
        .catch((err) => console.log("Error fetching labs fallback:", err));

      // axios.get("http://localhost:5000/api/lab/tests")
       API.get("/api/lab/tests")
        .then((res) => {
          if (res.data?.success) setAllTests(res.data.result || []);
        })
        .catch((err) => console.log("Error fetching tests fallback:", err));
    }
  }, [stateTest, stateLab]);

  // When dropdown selections change
  const handleLabSelect = (labId) => {
    setSelectedLabId(labId);
    const foundLab = allLabs.find((l) => l._id === labId);
    setSelectedLab(foundLab || null);
  };

  const handleTestSelect = (testId) => {
    setSelectedTestId(testId);
    const foundTest = allTests.find((t) => t._id === testId);
    setSelectedTest(foundTest || null);
    if (foundTest?.labId && !selectedLabId) {
      handleLabSelect(foundTest.labId);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!patientName || !phone || !bookingDate || !bookingTime) {
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Please fill in all required patient fields and schedule.",
      });
      return;
    }

    if (!selectedTest?.testName) {
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Please select a diagnostic test to book.",
      });
      return;
    }

    setLoading(true);
    setAlertInfo({ show: false, variant: "", message: "" });

    try {
      const formData = new FormData();
      formData.append("userId", userId || "anonymous");
      formData.append("patientName", patientName);
      formData.append("phone", phone);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("address", address);
      formData.append("bookingDate", bookingDate);
      formData.append("bookingTime", bookingTime);

      // Lab info
      const labId = selectedLab?._id || selectedTest?.labId || selectedLabId || "";
      const labName =
        selectedLab?.name || selectedTest?.labName || "Central Diagnostic Lab";

      formData.append("labId", labId);
      formData.append("labName", labName);

      // Test info
      formData.append("testId", selectedTest?._id || "");
      formData.append("testName", selectedTest.testName);
      formData.append("category", selectedTest.category || "General");
      formData.append("price", selectedTest.price || 0);

      formData.append("attachmentType", attachmentType);
      if (attachmentFile) {
        formData.append("attachmentFile", attachmentFile);
      }

      // const res = await axios.post("http://localhost:5000/api/lab/book", formData, {
      const res = await API.post("/api/lab/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setAlertInfo({
          show: true,
          variant: "success",
          message: res.data?.message || "Lab test booking submitted successfully!",
        });

        setTimeout(() => {
          navigate("/labreports");
        }, 1500);
      } else {
        setAlertInfo({
          show: true,
          variant: "danger",
          message: res.data?.message || "Booking failed. Please try again.",
        });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setAlertInfo({
        show: true,
        variant: "danger",
        message: "Failed to connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <UserNav />

      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Book Diagnostic Laboratory Test</h2>
            <p className="text-muted mb-0">
              Complete patient registration, review test details, and schedule your sample collection.
            </p>
          </div>

          <Button
            as={Link}
            to="/labs"
            variant="outline-secondary"
            className="rounded-pill px-3 py-2 fw-medium d-inline-flex align-items-center gap-2"
          >
            <FaArrowLeft /> View All Labs
          </Button>
        </div>

        {alertInfo.show && (
          <Alert
            variant={alertInfo.variant}
            dismissible
            onClose={() => setAlertInfo({ show: false, variant: "", message: "" })}
            className="shadow-sm rounded-3 border-0"
          >
            {alertInfo.message}
          </Alert>
        )}

        <Row className="g-4">
          {/* Left Column: Selected Lab & Test Details */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">
              <div
                className="p-3 text-white"
                style={{
                  background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <FaClinicMedical className="fs-5 text-warning" />
                  <span className="fw-bold">Diagnostic Center & Test Summary</span>
                </div>
              </div>

              <Card.Body className="p-4 d-flex flex-column">
                {/* Lab Information Badge */}
                <div className="bg-light p-3 rounded-4 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span className="text-muted small fw-semibold text-uppercase">Diagnostic Lab</span>
                    {selectedLab?.accreditation && (
                      <Badge bg="success" className="rounded-pill fw-normal">
                        <FaShieldAlt className="me-1" />
                        {selectedLab.accreditation}
                      </Badge>
                    )}
                  </div>
                  <h5 className="fw-bold text-dark mb-1">
                    {selectedLab?.name || selectedTest?.labName || "Select Laboratory Below"}
                  </h5>
                  {selectedLab?.address && (
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <FaMapMarkerAlt className="text-danger small" />
                      <span>{selectedLab.address}</span>
                    </div>
                  )}
                </div>

                {/* Test Information */}
                {selectedTest ? (
                  <div className="border rounded-4 p-3 mb-3 bg-white shadow-xs">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="info" className="text-dark rounded-pill px-3 py-1">
                        {selectedTest.category}
                      </Badge>
                      <span className="fw-bold text-success fs-5 d-flex align-items-center">
                        <FaRupeeSign size={16} />
                        {selectedTest.price}
                      </span>
                    </div>

                    <h5 className="fw-bold text-primary mb-2">{selectedTest.testName}</h5>

                    <p className="text-muted small mb-3">
                      {selectedTest.description ||
                        "Standard clinical pathology test analyzing biological samples."}
                    </p>

                    <div className="small text-muted mb-1 d-flex align-items-center gap-2">
                      <FaClock className="text-primary" />
                      <span>Turnaround Time: <strong>{selectedTest.reportTime || "24 Hours"}</strong></span>
                    </div>

                    <div className="small text-muted d-flex align-items-center gap-2">
                      <FaFileMedical className="text-warning" />
                      <span>Guidelines: {selectedTest.preparation || "Fasting not required"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border border-dashed rounded-4 text-center text-muted mb-3">
                    <FaFlask size={32} className="mb-2 opacity-50 text-primary" />
                    <p className="small mb-0">No test preselected. Please select a test from dropdown below.</p>
                  </div>
                )}

                {/* Fallback Selection Dropdowns */}
                {(!stateTest || !stateLab) && (
                  <div className="mt-auto pt-3 border-top">
                    <h6 className="fw-semibold text-dark small mb-2">Choose Lab & Test Manually</h6>
                    <Form.Group className="mb-2">
                      <Form.Label className="small text-muted mb-1">Select Laboratory</Form.Label>
                      <Form.Select
                        value={selectedLabId}
                        onChange={(e) => handleLabSelect(e.target.value)}
                        size="sm"
                        className="rounded-3"
                      >
                        <option value="">-- Choose Lab --</option>
                        {allLabs.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.name} {l.city ? `(${l.city})` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label className="small text-muted mb-1">Select Test</Form.Label>
                      <Form.Select
                        value={selectedTestId}
                        onChange={(e) => handleTestSelect(e.target.value)}
                        size="sm"
                        className="rounded-3"
                      >
                        <option value="">-- Choose Test --</option>
                        {allTests.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.testName} (₹{t.price}) - {t.labName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Patient Information & Booking Form */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-4 bg-white">
              <Card.Body className="p-4 p-md-5">
                <h4 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                  <FaFileMedical className="text-primary" /> Patient & Appointment Details
                </h4>

                <Form onSubmit={handleBooking}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Patient Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter patient full name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          required
                          className="rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Phone Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="rounded-3 py-2"
                          maxLength={10}
                          pattern="[0-9]{10}"
                          isInvalid={phone && !/^\d{10}$/.test(phone)}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Age</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="e.g. 35"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          min="1"
                          max="120"
                          className="rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Gender</Form.Label>
                        <Form.Select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="rounded-3 py-2"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Sample Collection</Form.Label>
                        <Form.Select className="rounded-3 py-2">
                          <option value="Home Collection">Home Sample Collection</option>
                          <option value="Lab Walk-in">Walk-in at Lab</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Residential Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Enter complete residential address for home collection or billing"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="rounded-3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Doctor Prescription Upload (Optional) */}
                  <Card className="bg-light border-0 rounded-4 p-3 mb-4">
                    <Card.Body className="p-0">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-semibold small text-dark">
                          Attach Doctor Prescription or Medical Note (Optional)
                        </span>
                        <Badge bg="secondary" className="fw-normal">Optional</Badge>
                      </div>

                      <Row className="g-2">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-muted">Attachment Type</Form.Label>
                            <Form.Select
                              value={attachmentType}
                              onChange={(e) => setAttachmentType(e.target.value)}
                              className="rounded-3 form-control-sm"
                            >
                              <option value="Doctor Prescription">Doctor Prescription</option>
                              <option value="Prior Diagnostic Report">Prior Diagnostic Report</option>
                              <option value="Medical Certificate">Medical Certificate</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-muted">Choose File (PDF/Image)</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={(e) => setAttachmentFile(e.target.files[0])}
                              className="rounded-3 form-control-sm"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {attachmentFile && (
                        <div className="mt-2 text-success small fw-semibold">
                          ✓ File selected: {attachmentFile.name}
                        </div>
                      )}
                    </Card.Body>
                  </Card>

                  <h6 className="fw-bold mt-4 mb-3 text-dark">Preferred Date & Time Slot</h6>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Booking Date *</Form.Label>
                        <Form.Control
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          required
                          className="rounded-3 py-2"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Time Slot *</Form.Label>
                        <Form.Select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          required
                          className="rounded-3 py-2"
                        >
                          <option value="">Select Time Slot</option>
                          <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM</option>
                          <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM</option>
                          <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                          <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                          <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-pill px-5 py-2 fw-semibold shadow-sm"
                      disabled={loading || !selectedTest}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Confirming Booking...
                        </>
                      ) : (
                        "Confirm Lab Appointment"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LabBooking;
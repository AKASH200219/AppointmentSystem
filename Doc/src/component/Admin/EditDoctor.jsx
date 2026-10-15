import React, { useEffect, useState } from "react";
import {Button,Card,Col,Container,Form,Row,InputGroup,Image,Spinner,Alert,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {FaUserMd,FaArrowLeft,FaSave,FaHospital,FaRupeeSign,FaClock,FaCamera,} from "react-icons/fa";

const ALL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SPECIALIZATIONS = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "Psychiatrist",
  "Dentist",
  "General Physician",
  "ENT Specialist",
  "Ophthalmologist",
  "Urologist",
];

function EditDoctor() {
  const { doctorid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [about, setAbout] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [hospital, setHospital] = useState("");
  const [available, setAvailable] = useState([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [password, setPassword] = useState("");

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.get(`http://localhost:5000/api/admin/doctorinfo/${doctorid}`);
      console.log("Doctor data for edit:", res.data);
      const doc = res.data?.result;

      if (doc) {
        setName(doc.name || "");
        setPhone(doc.phone || "");
        setEmail(doc.email || "");
        setDob(doc.dob || "");
        setGender(doc.gender || "");
        setAddress(doc.address || "");
        setSpecialization(doc.specialization || "");
        setQualification(doc.qualification || "");
        setAbout(doc.about || "");
        setExperience(doc.experience ?? "");
        setFees(doc.fees ?? "");
        setHospital(doc.hospital || "");
        setAvailableFrom(doc.availableFrom || "");
        setAvailableTo(doc.availableTo || "");
        setOldImage(doc.image || "");

        if (Array.isArray(doc.available)) {
          setAvailable(doc.available);
        } else if (typeof doc.available === "string") {
          setAvailable(
            doc.available.split(",").map((d) => d.trim()).filter(Boolean)
          );
        } else {
          setAvailable([]);
        }
      } else {
        setErrorMsg("Doctor not found");
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setErrorMsg("Failed to load doctor information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorid]);

  const handleDayToggle = (day) => {
    if (available.includes(day)) {
      setAvailable((prev) => prev.filter((d) => d !== day));
    } else {
      setAvailable((prev) => [...prev, day]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg("");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("address", address);
      formData.append("specialization", specialization);
      formData.append("qualification", qualification);
      formData.append("about", about);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("hospital", hospital);
      formData.append("available", available.join(","));
      formData.append("availableFrom", availableFrom);
      formData.append("availableTo", availableTo);

      if (image) {
        formData.append("image", image);
      }
      if (password && password.trim()) {
        formData.append("password", password.trim());
      }

      const res = await axios.put(
        `http://localhost:5000/api/admin/updateDoctor/${doctorid}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data?.message || "Doctor updated successfully!");
      navigate("/doctorview");
    } catch (err) {
      console.error("Error updating doctor:", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to update doctor. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button
            as={Link}
            to="/doctorview"
            variant="outline-secondary"
            className="d-flex align-items-center gap-2 rounded-pill px-3"
          >
            <FaArrowLeft /> Back to Doctors List
          </Button>

          <h3 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
            <FaUserMd /> Edit Doctor Details
          </h3>
        </div>

        {errorMsg && (
          <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>
            {errorMsg}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading doctor data...</p>
          </div>
        ) : (
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleSubmit}>
                {/* Doctor Image Profile preview & change */}
                <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mb-4 pb-4 border-bottom">
                  <div className="position-relative">
                    <Image
                      src={
                        previewUrl ||
                        (oldImage
                          ? `http://localhost:5000/uploads/${oldImage}`
                          : "https://via.placeholder.com/130")
                      }
                      roundedCircle
                      width="120"
                      height="120"
                      style={{
                        objectFit: "cover",
                        border: "3px solid #0d6efd",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                      }}
                      className="shadow-sm"
                    />
                  </div>

                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">Doctor Profile Picture</h5>
                    <p className="text-muted small mb-2">
                      Upload a new photo to replace the current picture (optional)
                    </p>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-auto"
                    />
                  </div>
                </div>

                <h5 className="text-primary fw-bold mb-3">
                  Personal Information
                </h5>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Dr. Jane Doe"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label className="fw-semibold">Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      maxLength={10}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="10 digit number"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label className="fw-semibold">Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="doctor@example.com"
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Label className="fw-semibold">Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Label className="fw-semibold">Gender</Form.Label>
                    <div className="pt-2">
                      <Form.Check
                        inline
                        type="radio"
                        label="Male"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Female"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Other"
                        name="gender"
                        value="Other"
                        checked={gender === "Other"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>
                  </Col>

                  <Col md={12}>
                    <Form.Label className="fw-semibold">Clinic / Residential Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, city, state"
                    />
                  </Col>
                </Row>

                <hr className="my-4" />

                <h5 className="text-primary fw-bold mb-3">
                  Professional Information
                </h5>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Specialization *</Form.Label>
                    <Form.Select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    >
                      <option value="">Select Specialization</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="fw-semibold">Qualification *</Form.Label>
                    <Form.Control
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      required
                      placeholder="e.g. MBBS, MD - General Medicine"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label className="fw-semibold">Experience (Years) *</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        min="0"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        required
                      />
                      <InputGroup.Text>Years</InputGroup.Text>
                    </InputGroup>
                  </Col>

                  <Col md={4}>
                    <Form.Label className="fw-semibold">Consultation Fee (₹) *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </Col>

                  <Col md={4}>
                    <Form.Label className="fw-semibold">Hospital / Clinic *</Form.Label>
                    <Form.Control
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      required
                      placeholder="e.g. Apollo Hospital / City Clinic"
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label className="fw-semibold">About Doctor</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Doctor's background, accomplishments, bio..."
                    />
                  </Col>
                </Row>

                <hr className="my-4" />

                {/* Section 3: Availability & Hours */}
                <h5 className="text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaClock /> Schedule & Availability
                </h5>

                <div className="mb-3">
                  <Form.Label className="fw-semibold d-block">
                    Available Days *
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded-3">
                    {ALL_DAYS.map((day) => (
                      <Form.Check
                        key={day}
                        type="checkbox"
                        id={`check-${day}`}
                        label={day}
                        checked={available.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="fw-medium"
                      />
                    ))}
                  </div>
                </div>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Available From</Form.Label>
                    <Form.Control
                      type="time"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label className="fw-semibold">Available To</Form.Label>
                    <Form.Control
                      type="time"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                    />
                  </Col>
                </Row>

                <hr className="my-4" />

                <h5 className="text-primary fw-bold mb-3">
                  Account Credentials
                </h5>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">
                      New Password (Optional)
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Leave blank to keep existing password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Only enter a password if you want to reset the doctor's login password.
                    </Form.Text>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  <Button
                    as={Link}
                    to="/doctorview"
                    variant="outline-secondary"
                    className="rounded-pill px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="rounded-pill px-5 fw-semibold d-flex align-items-center gap-2 shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" /> Updating...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}

export default EditDoctor;

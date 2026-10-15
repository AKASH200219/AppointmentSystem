
import axios from "axios";
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  InputGroup,
} from "react-bootstrap";
import AdminNav from "./AdminNav";

function RegisterDoctor() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDOB] = useState("");
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
  const [confrmPassword, setConfrmPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const handleAvailable = (event) => {
    const day = event.target.value;

    if (event.target.checked) {
      setAvailable((previous) => [...previous, day]);
    } else {
      setAvailable((previous) => previous.filter((d) => d !== day));
    }
  };

  const DocReg = async (event) => {
    event.preventDefault();
    setValidated(true);

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    if (name.trim() === "") {
      return;
    }

    if (address.trim() === "") {
      return;
    }

    if (available.length === 0) {
      return;
    }

    if (availableFrom >= availableTo) {
      return;
    }

    if (password !== confrmPassword) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("name", name.trim());
      formData.append("phone", phone);
      formData.append("email", email.trim());
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("address", address.trim());
      formData.append("specialization", specialization);
      formData.append("qualification", qualification.trim());
      formData.append("about", about.trim());
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("hospital", hospital.trim());
      formData.append("available", available);
      formData.append("availableFrom", availableFrom);
      formData.append("availableTo", availableTo);
      formData.append("password", password);
      formData.append("confrmPassword", confrmPassword);

      const result = await axios.post(
        "http://localhost:5000/api/admin/RegDocs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(result.data.message || "Successfully added doctor");
    } catch (err) {
      console.log("Failed to register", err);
      alert(
        err.response?.data?.message || "Failed to register doctor"
      );
    }
  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center fw-bold text-primary mb-2">
              Register Doctor
            </h2>

            <Form noValidate validated={validated} onSubmit={DocReg}>
              <h5 className="text-primary fw-bold mb-3">
                Personal Information
              </h5>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Profile Image</Form.Label>

                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setImage(event.target.files[0] || null)
                    }
                    required
                    isInvalid={validated && !image}
                  />

                  <Form.Control.Feedback type="invalid">
                    Please upload a profile image.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Full Name</Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    pattern=".*\S.*"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter a valid name.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Phone</Form.Label>

                  <Form.Control
                    type="tel"
                    name="phone"
                    maxLength={10}
                    placeholder="Phone number"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    required
                    pattern="[0-9]{10}"
                  />

                  <Form.Control.Feedback type="invalid">
                    Enter a valid 10-digit phone number.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="@gmail.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    pattern="[A-Za-z0-9._%+-]+@gmail\.com"
                  />

                  <Form.Control.Feedback type="invalid">
                    Enter a valid Gmail address.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>

                  <Form.Control
                    type="date"
                    name="dob"
                    value={dob}
                    max={today}
                    onChange={(event) => setDOB(event.target.value)}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Please select a valid date of birth.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Gender</Form.Label>

                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Male"
                      name="gender"
                      value="Male"
                      checked={gender === "Male"}
                      onChange={(event) => setGender(event.target.value)}
                      required
                    />

                    <Form.Check
                      inline
                      type="radio"
                      label="Female"
                      name="gender"
                      value="Female"
                      checked={gender === "Female"}
                      onChange={(event) => setGender(event.target.value)}
                    />
                  </div>

                  {validated && !gender && (
                    <div className="text-danger small">
                      Please select gender.
                    </div>
                  )}
                </Col>

                <Col md={12} className="mb-4">
                  <Form.Label>Address</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    placeholder="Enter address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                    pattern=".*\S.*"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter the address.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <hr />

              <h5 className="text-primary fw-bold mb-3">
                Professional Information
              </h5>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Specialization</Form.Label>

                  <Form.Select
                    name="specialization"
                    value={specialization}
                    onChange={(event) =>
                      setSpecialization(event.target.value)
                    }
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Dentist">Dentist</option>
                    <option value="General Physician">
                      General Physician
                    </option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    Please select a specialization.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Qualification</Form.Label>

                  <Form.Control
                    type="text"
                    name="qualification"
                    placeholder="Enter qualification"
                    value={qualification}
                    onChange={(event) =>
                      setQualification(event.target.value)
                    }
                    required
                    pattern=".*\S.*"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter qualification.
                  </Form.Control.Feedback>
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Label>About</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="about"
                    placeholder="Enter about information"
                    value={about}
                    onChange={(event) => setAbout(event.target.value)}
                    required
                    pattern=".*\S.*"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter information about the doctor.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Experience</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="experience"
                      min="0"
                      max="80"
                      step="1"
                      placeholder="Years"
                      value={experience}
                      onChange={(event) =>
                        setExperience(event.target.value)
                      }
                      required
                    />

                    <InputGroup.Text>Years</InputGroup.Text>

                    <Form.Control.Feedback type="invalid">
                      Enter experience between 0 and 80 years.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label>Consultation Fee</Form.Label>

                  <InputGroup>
                    <InputGroup.Text>₹</InputGroup.Text>

                    <Form.Control
                      type="number"
                      name="fee"
                      min="0"
                      step="0.01"
                      placeholder="Enter consultation fee"
                      value={fees}
                      onChange={(event) => setFees(event.target.value)}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      Enter a valid consultation fee.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Col>

                <Col md={12} className="mb-4">
                  <Form.Label>Hospital / Clinic</Form.Label>

                  <Form.Control
                    type="text"
                    name="hospital"
                    placeholder="Hospital or clinic name"
                    value={hospital}
                    onChange={(event) => setHospital(event.target.value)}
                    required
                    pattern=".*\S.*"
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter hospital or clinic name.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <hr />

              <h5 className="text-primary fw-bold mb-3">
                Doctor Availability
              </h5>

              <Form.Label className="fw-bold">
                Available Days
              </Form.Label>

              <div className="d-flex flex-wrap gap-3 mb-2">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <Form.Check
                    key={day}
                    type="checkbox"
                    label={day}
                    value={day}
                    checked={available.includes(day)}
                    onChange={handleAvailable}
                  />
                ))}
              </div>

              {validated && available.length === 0 && (
                <div className="text-danger small mb-3">
                  Please select at least one available day.
                </div>
              )}

              <Row>
                <Col md={6} className="mb-4">
                  <Form.Label>Available From</Form.Label>

                  <Form.Control
                    type="time"
                    name="startTime"
                    value={availableFrom}
                    onChange={(event) =>
                      setAvailableFrom(event.target.value)
                    }
                    required
                    isInvalid={
                      validated &&
                      (!availableFrom ||
                        !availableTo ||
                        availableFrom >= availableTo)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    Select a valid starting time.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-4">
                  <Form.Label>Available To</Form.Label>

                  <Form.Control
                    type="time"
                    name="endTime"
                    value={availableTo}
                    onChange={(event) =>
                      setAvailableTo(event.target.value)
                    }
                    required
                    isInvalid={
                      validated &&
                      (!availableTo ||
                        !availableFrom ||
                        availableFrom >= availableTo)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    End time must be after starting time.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <hr />

              <h5 className="text-primary fw-bold mb-3">
                Login Information
              </h5>

              <Row>
                <Col md={6} className="mb-4">
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                  />

                  <Form.Control.Feedback type="invalid">
                    Password must contain at least 8 characters.
                  </Form.Control.Feedback>
                </Col>

                <Col md={6} className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>

                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={confrmPassword}
                    onChange={(event) =>
                      setConfrmPassword(event.target.value)
                    }
                    required
                    isInvalid={
                      validated && password !== confrmPassword
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    Passwords do not match.
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-5 me-2"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="px-5"
                  type="submit"
                >
                  Register Doctor
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default RegisterDoctor;

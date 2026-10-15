
import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import axios from "axios";
import AdminNav from "./AdminNav";

function StaffRegister() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [staffType, setStaffType] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpsw, setconfirmpsw] = useState("");
  const [image, setImage] = useState(null);
  const [validated, setValidated] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!e.currentTarget.checkValidity()) {
      return;
    }

    if (name.trim() === "" || address.trim() === "") {
      return;
    }

    if (password !== confirmpsw) {
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("phone", phone);
      formData.append("email", email.trim());
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("address", address.trim());
      formData.append("staffType", staffType);
      formData.append("qualification", qualification.trim());
      formData.append("experience", experience);
      formData.append("password", password);
      formData.append("confirmpsw", confirmpsw);
      formData.append("image", image);

      const result = await axios.post(
        "http://localhost:5000/api/staff/registeStaff",
        formData
      );

      alert(result.data.message || "Staff registered successfully");

      setName("");
      setPhone("");
      setEmail("");
      setDob("");
      setGender("");
      setAddress("");
      setStaffType("");
      setQualification("");
      setExperience("");
      setPassword("");
      setconfirmpsw("");
      setImage(null);
      setValidated(false);

      e.target.reset();
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Unable to register staff"
      );
    }
  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h3 className="fw-bold mb-4">
              Staff Registration
            </h3>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Staff Name</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter staff name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      pattern=".*\S.*"
                    />

                    <Form.Control.Feedback type="invalid">
                      Please enter staff name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>

                    <Form.Control
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      maxLength={10}
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
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      Enter a valid email address.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>

                    <Form.Control
                      type="date"
                      value={dob}
                      max={today}
                      onChange={(event) => setDob(event.target.value)}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      Select a valid date of birth.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>

                    <Form.Select
                      value={gender}
                      onChange={(event) => setGender(event.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      Please select gender.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Staff Type</Form.Label>

                    <Form.Select
                      value={staffType}
                      onChange={(event) => setStaffType(event.target.value)}
                      required
                    >
                      <option value="">Select Staff Type</option>
                      <option value="Care Assistant">Care Assistant</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Pharmacist">Pharmacist</option>
                    </Form.Select>

                    <Form.Control.Feedback type="invalid">
                      Please select staff type.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      required
                      pattern=".*\S.*"
                    />

                    <Form.Control.Feedback type="invalid">
                      Please enter address.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Qualification</Form.Label>

                    <Form.Control
                      type="text"
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
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience</Form.Label>

                    <Form.Control
                      type="number"
                      placeholder="Enter experience in years"
                      value={experience}
                      min="0"
                      max="80"
                      step="1"
                      onChange={(event) => setExperience(event.target.value)}
                      required
                    />

                    <Form.Control.Feedback type="invalid">
                      Enter experience between 0 and 80 years.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>

                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                    />

                    <Form.Control.Feedback type="invalid">
                      Password must contain at least 8 characters.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>

                    <Form.Control
                      type="password"
                      placeholder="Confirm password"
                      value={confirmpsw}
                      onChange={(event) => setconfirmpsw(event.target.value)}
                      required
                      isInvalid={
                        validated && password !== confirmpsw
                      }
                    />

                    <Form.Control.Feedback type="invalid">
                      Passwords do not match.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Staff Image</Form.Label>

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
                      Please upload a staff image.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
              >
                Register Staff
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default StaffRegister;

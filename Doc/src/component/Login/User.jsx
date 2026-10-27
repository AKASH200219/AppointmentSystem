import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";
function User() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState(" ");
  const [phone, setPhone] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [dob, setDob] = useState(" ");
  const [gender, SetGender] = useState(" ")
  const [address, setAddress] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [confirmpsw, setaconfirmpsw] = useState(" ")
  const navigate = useNavigate();
  const userReg = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("address", address);
      formData.append("password", password);
      formData.append("confirmpsw", confirmpsw)

      // const result = axios.post("http://localhost:5000/api/user/userreg", formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })

       const result = await API.post("/api/user/userreg", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      

      if (password !== confirmpsw) {
        alert("Password and Confirm Password do not match");
        return;
      }
      alert("Successfully added user")

    }
    catch (err) {
      console.log("Failed to create user", err);
      alert("failed to create a user")
    }
  }
  const backtologin = () => {
    localStorage.clear();
    navigate('/');
  };
  return (
    <Container className="py-5">

      <Card className="shadow-lg border-0 rounded-4">

        <Card.Body className="p-5">

          <h2 className="text-center fw-bold mb-2">Create User</h2>

          <Form onSubmit={userReg}>

            <Row>

              <Col md={6} >

                <Form.Label>
                  Upload Profile Image
                </Form.Label>

                <Form.Control
                  type="file"
                  onChange={(event) => setImage(event.target.files[0])}
                  required
                />

              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter full name" onChange={(event) => setName(event.target.value)}
                    required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    maxLength={10}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={(event) => setDob(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>

                  <div>

                    <Form.Check
                      inline
                      label="Male"
                      value="Male"
                      name="gender"
                      type="radio"
                      onChange={(event) => SetGender(event.target.value)}
                      required
                    />

                    <Form.Check
                      inline
                      label="Female"
                      value="Female"
                      name="gender"
                      type="radio"
                      onChange={(event) => SetGender(event.target.value)}
                      required
                    />

                  </div>

                </Form.Group>
              </Col>


              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter address"
                    onChange={(event) => setAddress(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    onChange={(event) => setaconfirmpsw(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

            </Row>

            <div className="text-center mt-4 d-flex justify-content-center gap-3">

              <Button
                variant="secondary"
                size="lg"
                className="px-5"
                onClick={backtologin}
              >
                Back to Login
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="px-5"
                type="submit"
              >
                Create User
              </Button>

            </div>

          </Form>

        </Card.Body>

      </Card>

    </Container>
  );
}

export default User;
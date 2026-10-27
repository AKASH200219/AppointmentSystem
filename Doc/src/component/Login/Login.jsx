
import { useEffect, useState } from "react";
import {Button,Card,Col,Container,Form,Row} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../api/axiosConfig";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const addlogin = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    setValidated(true);

    if (!form.checkValidity() || !name.trim() || !password.trim()) {
      event.stopPropagation();
      return;
    }

    const body = {
      name: name.trim(),
      password
    };

    try {
      // const result = await axios.post("http://localhost:5000/api/addLogin/login",body);
     const result= await API.post("/api/addLogin/login", body);

      localStorage.setItem("token", result.data.token);

      if (result.data.user.role === "user") {
        localStorage.setItem("user", result.data.user._id);
        navigate("/doctorpage");
      } else if (result.data.user.role === "doctor") {
        localStorage.setItem("doctor", result.data.doctor._id);
        navigate("/docdashboard");
      } else if (result.data.user.role === "admin") {
        localStorage.setItem("admin", result.data.user._id);
        navigate("/admindashboard");
      } else if (result.data.user.role === "staff") {
        localStorage.setItem("staff", result.data.user._id);
        navigate("/staffdashboard");
      } else if (result.data.user.role === "lab") {
        if (result.data.lab?._id) {
          localStorage.setItem("lab", result.data.lab._id);
        } else {
          localStorage.setItem("lab", result.data.user._id);
        }

        navigate("/labdashboard");
      }
    } catch (err) {
      console.log("Login failed:", err);
      alert("Invalid username or password. Please try again.");
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col lg={4} md={6} sm={10}>
          <Card className="border-0 shadow-lg rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">HealthCare</h2>
              </div>

              <Form noValidate validated={validated} onSubmit={addlogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Username / Email</Form.Label>

                 
                    <Form.Control
                      type="email"
                      placeholder="Enter Gmail address"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                      isValid={
                        name.trim() !== "" &&
                        /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(name.trim())
                      }
                      isInvalid={
                        name.trim() !== "" &&
                        !/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(name.trim())
                      }
                    />
                    
                    <Form.Control.Feedback type="valid">
                        Valid Username or Gmail address!
                    </Form.Control.Feedback>
                    
                    <Form.Control.Feedback type="invalid">
                      Please enter a valid Username or Gmail address.
                    </Form.Control.Feedback>
                    
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    isInvalid={validated && !password.trim()}
                  />

                  <Form.Control.Feedback type="invalid">
                    Please enter your password.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    size="lg"
                    className="rounded-pill"
                    type="submit"
                  >
                    Login
                  </Button>
                </div>

                <hr />

                <p className="text-center mb-0">
                  Don't have an account?
                  <Link
                    to="/userregister"
                    className="text-decoration-none fw-bold"
                  >
                    Create User
                  </Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;

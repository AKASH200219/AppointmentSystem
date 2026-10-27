import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaClinicMedical,
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserMd,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import API from "../../api/axiosConfig";

function DoctorNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const doctorId = localStorage.getItem("doctor");
  const [doctorinfo, setDoctorinfo] = useState({});

  useEffect(() => {
    if (doctorId) {
      // axios.get(`http://localhost:5000/api/admin/doctorinfo/${doctorId}`)
      API.get(`/api/admin/doctorinfo/${doctorId}`)
        .then((res) => setDoctorinfo(res.data.result || {}))
        .catch((err) => console.log(err));
    }
  }, [doctorId]);

  const Handlelogout = () => {
  localStorage.removeItem("doctor");
  localStorage.removeItem("token");

  window.location.replace("/");
};

  const isActive = (path) => location.pathname === path;
// useEffect(() => {
//   if (!localStorage.getItem("doctor")) {
//     window.location.replace("/");
//   }
// }, []);
  return (
    <Navbar
      expand="lg"
      variant="dark"
      sticky="top"
      className="py-2"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Container fluid className="px-lg-4">
        <Navbar.Brand
          as={Link}
          to="/docdashboard"
          className="fw-bold fs-4 text-white d-flex align-items-center gap-2"
        >
          <div
            className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle"
            style={{ width: "38px", height: "38px" }}
          >
            <FaClinicMedical />
          </div>

          HealthCare

          <Badge bg="info" pill>
            Doctor
          </Badge>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="doctor-navbar" />

        <Navbar.Collapse id="doctor-navbar">
          <Nav className="ms-auto align-items-lg-center gap-2 my-2 my-lg-0">
            <Nav.Link
              as={Link}
              to="/docdashboard"
              className={`px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/docdashboard")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white"
              }`}
            >
              <FaTachometerAlt />
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/docappointments"
              className={`px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/docappointments")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white"
              }`}
            >
              <FaCalendarAlt />
              Appointments
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/doctorprofile"
              className={`px-3 py-2 rounded-3 d-flex align-items-center gap-2 ${
                isActive("/doctorprofile")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white"
              }`}
            >
              {doctorinfo.image ? (
                <img
                  // src={`http://localhost:5000/uploads/${doctorinfo.image}`}
                   src={`${API.defaults.baseURL}/uploads/${doctorinfo.image}`}
                  alt="Doctor"
                  width="25"
                  height="25"
                  className="rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <FaUserMd />
              )}

              {doctorinfo.name || "Doctor"}
            </Nav.Link>

            <Button
              variant="outline-light"
              className="ms-lg-2 px-4 py-2 fw-semibold rounded-pill d-flex align-items-center justify-content-center gap-2"
              onClick={Handlelogout}
            >
              <FaSignOutAlt />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DoctorNav;
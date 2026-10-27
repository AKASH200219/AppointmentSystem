import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaClinicMedical,
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaHandHoldingHeart,
  FaClipboardList,
  FaTools,
  FaBoxes,
  FaPills,
  FaSignOutAlt,
  FaUserCircle,
  FaFlask
} from "react-icons/fa";
import API from "../../api/axiosConfig";

function UserNav() {
  const [userinfo, setUserinfo] = useState({});
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userid = localStorage.getItem("user");

  useEffect(() => {
    if (!userid) return;

    API.get(`/api/usernav/userinfo/${userid}`)
      .then((result) => {
        if (result.data?.result) {
          setUserinfo(result.data.result);
        }
      })
      .catch((err) => {
        console.log("Error fetching user nav info:", err);
      });
  }, [userid]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/");
  };

  const isActive = (path) => location.pathname === path;

  const isCompanionActive =
    location.pathname === "/companionpage" ||
    location.pathname === "/companionstatus";

  const isEquipmentActive =
    location.pathname === "/equipment" ||
    location.pathname === "/bookequipmentstatus";

  const isLaboratoryActive =
    location.pathname === "/labs" ||
    location.pathname.startsWith("/labdetails") ||
    location.pathname === "/labtests" ||
    location.pathname === "/labbooking" ||
    location.pathname === "/labreports";

  return (
    <Navbar
      expand="xxl"
      variant="dark"
      sticky="top"
      className="navbar-glass py-1"
    >
      <Container fluid className="px-2 px-lg-3">

        <Navbar.Brand
          as={Link}
          to="/doctorpage"
          className="fw-bold text-white d-flex align-items-center gap-2 me-2"
        >
          <div
            className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
            style={{ width: "34px", height: "34px", flexShrink: 0 }}
          >
            <FaClinicMedical className="fs-5" />
          </div>

          <div className="d-flex flex-column lh-1">
            <small className="text-info fw-semibold" style={{ fontSize: "10px" }}>
              Patient
            </small>
            <span className="fw-bold">HealthCare</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="user-navbar"
          className="border-0 shadow-none"
        />

        <Navbar.Collapse id="user-navbar">
          <Nav className="mx-auto align-items-xxl-center gap-1 my-2 my-xxl-0">

            <Nav.Link
              as={Link}
              to="/doctorpage"
              className={`px-2 py-2 rounded-3 fw-medium nav-link-custom ${
                isActive("/doctorpage") ? "active-nav-item" : ""
              }`}
            >
              <FaUserMd className="me-1" /> Doctors
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/myappointment"
              className={`px-2 py-2 rounded-3 fw-medium nav-link-custom ${
                isActive("/myappointment") ? "active-nav-item" : ""
              }`}
            >
              <FaCalendarAlt className="me-1" /> Appointments
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/prescriptions"
              className={`px-2 py-2 rounded-3 fw-medium nav-link-custom ${
                isActive("/prescriptions") ? "active-nav-item" : ""
              }`}
            >
              <FaFileMedical className="me-1" /> Prescriptions
            </Nav.Link>

            <NavDropdown
              title={
                <span className={isCompanionActive ? "fw-bold text-white" : ""}>
                  <FaHandHoldingHeart className="me-1" /> Companion
                </span>
              }
              id="user-companion-dropdown"
              className="custom-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="/companionpage">
                <FaHandHoldingHeart className="me-2 text-primary" />
                Book Companion
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/companionstatus">
                <FaClipboardList className="me-2 text-info" />
                Companion Status
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <span className={isEquipmentActive ? "fw-bold text-white" : ""}>
                  <FaTools className="me-1" /> Equipment
                </span>
              }
              id="user-equipment-dropdown"
              className="custom-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item as={Link} to="/equipment">
                <FaTools className="me-2 text-warning" />
                Rent Equipment
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/bookequipmentstatus">
                <FaBoxes className="me-2 text-success" />
                Equipment Bookings
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/user-medicine"
              className={`px-2 py-2 rounded-3 fw-medium nav-link-custom ${
                isActive("/user-medicine") ? "active-nav-item" : ""
              }`}
            >
              <FaPills className="me-1" /> Medicine
            </Nav.Link>

            <NavDropdown
              title={
                <span className={isLaboratoryActive ? "fw-bold text-white" : ""}>
                  <FaFlask className="me-1" /> Laboratory
                </span>
              }
              id="user-laboratory-dropdown"
              className="custom-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item
                as={Link}
                to="/labs"
                className={
                  isActive("/labs") ||
                  location.pathname.startsWith("/labdetails")
                    ? "active"
                    : ""
                }
              >
                <FaClinicMedical className="me-2 text-primary" />
                Diagnostic Laboratories
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                as={Link}
                to="/labtests"
                className={isActive("/labtests") ? "active" : ""}
              >
                <FaFlask className="me-2 text-info" />
                Browse Lab Tests
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                as={Link}
                to="/labbooking"
                className={isActive("/labbooking") ? "active" : ""}
              >
                <FaCalendarAlt className="me-2 text-success" />
                Book Lab Test
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item
                as={Link}
                to="/labreports"
                className={isActive("/labreports") ? "active" : ""}
              >
                <FaFileMedical className="me-2 text-warning" />
                My Lab Reports
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>

          <Nav className="ms-xxl-auto align-items-xxl-center gap-2">

            <div
              className="d-flex align-items-center bg-white-10 px-2 py-1 rounded-pill border border-white-10 text-white my-1"
              style={{ maxWidth: "100%" }}
            >
              {userinfo?.image && !imgError ? (
                <img
                  src={`${API.defaults.baseURL}/uploads/${userinfo.image}`}
                  alt="Profile"
                  width="30"
                  height="30"
                  className="rounded-circle me-2 border border-2 border-white shadow-sm"
                  style={{ objectFit: "cover", flexShrink: 0 }}
                  onLoad={(e) => {
                  console.log("Profile image loaded:", e.currentTarget.src);
                  }}
                  onError={(e) =>{
                     console.log("Profile image failed:", e.currentTarget.src);
                    setImgError(true)}}
                />
              ) : (
                <FaUserCircle className="fs-4 me-2 text-light" />
              )}

              <span
                className="fw-semibold text-truncate"
                style={{ maxWidth: "120px" }}
              >
                {userinfo?.name || "Patient Profile"}
              </span>
            </div>

            <Button
              variant="outline-light"
              className="px-3 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 border-0 bg-white-10 hover-bg-danger"
              onClick={logout}
              style={{ transition: "all 0.2s ease" }}
            >
              <FaSignOutAlt /> Logout
            </Button>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNav;

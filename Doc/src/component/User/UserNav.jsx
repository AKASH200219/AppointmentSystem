import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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

function UserNav() {
  const [userinfo, setUserinfo] = useState({});
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userid = localStorage.getItem("user");

  useEffect(() => {
    if (!userid) return;
    axios
      .get(`http://localhost:5000/api/usernav/userinfo/${userid}`)
      .then((result) => {
        if (result.data?.result) {
          setUserinfo(result.data.result);
        }
      })
      .catch((err) => {
        console.log("Error fetching user nav info:", err);
      });
  }, [userid]);

  // const logout = () => {
  //   localStorage.clear("user");
  //   navigate("/");
  // };
  const logout = () => {
  localStorage.removeItem("user");
  window.location.replace("/");
};
  const isActive = (path) => location.pathname === path;
  const isCompanionActive = location.pathname === "/companionpage" || location.pathname === "/companionstatus";
  const isEquipmentActive = location.pathname === "/equipment" || location.pathname === "/bookequipmentstatus";

  return (
    <Navbar
      expand="xl"
      variant="dark"
      sticky="top"
      className="navbar-glass py-2 px-1"
    >
      <Container fluid className="px-lg-4">
        {/* Brand Logo */}
        <Navbar.Brand
  as={Link}
  to="/doctorpage"
  className="fw-bold text-white d-flex align-items-center gap-2"
>
  <div
    className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
    style={{ width: "38px", height: "38px" }}
  >
    <FaClinicMedical className="fs-5 text-primary" />
  </div>

  <div className="d-flex flex-column lh-1">
    <small
      className="text-info fw-semibold"
      style={{ fontSize: "11px" }}
    >
      Patient
    </small>

    <span className="fw-bold">
      HealthCare
    </span>
  </div>
</Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar" className="border-0" />

        <Navbar.Collapse id="user-navbar">
          {/* Main Navigation Links */}
          <Nav className="mx-auto align-items-xl-center gap-1 my-2 my-xl-0">
            <Nav.Link
              as={Link}
              to="/doctorpage"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
                isActive("/doctorpage") ? "active-nav-item" : ""
              }`}
            >
              <FaUserMd /> Doctors
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/myappointment"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
                isActive("/myappointment") ? "active-nav-item" : ""
              }`}
            >
              <FaCalendarAlt /> My Appointments
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/prescriptions"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
                isActive("/prescriptions") ? "active-nav-item" : ""
              }`}
            >
              <FaFileMedical /> Prescriptions
            </Nav.Link>

            {/* Companion Care Dropdown */}
            <NavDropdown
              title={
                <span className={`d-inline-flex align-items-center gap-2 ${isCompanionActive ? "fw-bold text-white" : ""}`}>
                  <FaHandHoldingHeart /> Companion Care
                </span>
              }
              id="user-companion-dropdown"
              className="px-1 custom-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item
                as={Link}
                to="/companionpage"
                className={`py-2 d-flex align-items-center gap-2 ${isActive("/companionpage") ? "active" : ""}`}
              >
                <FaHandHoldingHeart className="text-primary" /> Book Companion
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to="/companionstatus"
                className={`py-2 d-flex align-items-center gap-2 ${isActive("/companionstatus") ? "active" : ""}`}
              >
                <FaClipboardList className="text-info" /> Companion Status
              </NavDropdown.Item>
            </NavDropdown>

            {/* Equipment Dropdown */}
            <NavDropdown
              title={
                <span className={`d-inline-flex align-items-center gap-2 ${isEquipmentActive ? "fw-bold text-white" : ""}`}>
                  <FaTools /> Medical Equipment
                </span>
              }
              id="user-equipment-dropdown"
              className="px-1 custom-nav-dropdown"
              menuVariant="dark"
            >
              <NavDropdown.Item
                as={Link}
                to="/equipment"
                className={`py-2 d-flex align-items-center gap-2 ${isActive("/equipment") ? "active" : ""}`}
              >
                <FaTools className="text-warning" /> Rent Equipment
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to="/bookequipmentstatus"
                className={`py-2 d-flex align-items-center gap-2 ${isActive("/bookequipmentstatus") ? "active" : ""}`}
              >
                <FaBoxes className="text-success" /> Equipment Bookings
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/user-medicine"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
                isActive("/user-medicine") ? "active-nav-item" : ""
              }`}
            >
              <FaPills /> Medicine 
            </Nav.Link>
             <NavDropdown
  title={
    <span
      className={`d-inline-flex align-items-center gap-2 ${
        location.pathname === "/labs" ||
        location.pathname.startsWith("/labdetails") ||
        location.pathname === "/labtests" ||
        location.pathname === "/labbooking" ||
        location.pathname === "/labreports"
          ? "fw-bold text-white"
          : ""
      }`}
    >
      <FaFlask /> Laboratory
    </span>
  }
  id="user-laboratory-dropdown"
  className="px-1 custom-nav-dropdown"
  menuVariant="dark"
>
  <NavDropdown.Item
    as={Link}
    to="/labs"
    className={`py-2 d-flex align-items-center gap-2 ${
      isActive("/labs") || location.pathname.startsWith("/labdetails") ? "active" : ""
    }`}
  >
    <FaClinicMedical className="text-primary" /> Diagnostic Laboratories
  </NavDropdown.Item>

  <NavDropdown.Divider />

  <NavDropdown.Item
    as={Link}
    to="/labtests"
    className={`py-2 d-flex align-items-center gap-2 ${
      isActive("/labtests") ? "active" : ""
    }`}
  >
    <FaFlask className="text-info" /> Browse Lab Tests
  </NavDropdown.Item>

  <NavDropdown.Divider />

  <NavDropdown.Item
    as={Link}
    to="/labbooking"
    className={`py-2 d-flex align-items-center gap-2 ${
      isActive("/labbooking") ? "active" : ""
    }`}
  >
    <FaCalendarAlt className="text-success" /> Book Lab Test
  </NavDropdown.Item>

  <NavDropdown.Divider />

  <NavDropdown.Item
    as={Link}
    to="/labreports"
    className={`py-2 d-flex align-items-center gap-2 ${
      isActive("/labreports") ? "active" : ""
    }`}
  >
    <FaFileMedical className="text-warning" /> My Lab Reports
  </NavDropdown.Item>
</NavDropdown>
          </Nav>

          {/* User Profile & Logout */}
          <Nav className="ms-xl-auto align-items-xl-center gap-2">
            <div className="d-flex align-items-center bg-white-10 px-3 py-1-5 rounded-pill border border-white-10 text-white me-xl-2 my-1 my-xl-0">
              {userinfo?.image && !imgError ? (
                <img
                  src={`http://localhost:5000/uploads/${userinfo.image}`}
                  alt="Profile"
                  width="34"
                  height="34"
                  className="rounded-circle me-2 border border-2 border-white shadow-sm"
                  style={{ objectFit: "cover" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <FaUserCircle className="fs-4 me-2 text-light" />
              )}
              <span className="fw-semibold fs-7 text-truncate" style={{ maxWidth: "140px" }}>
                {userinfo?.name || "Patient Profile"}
              </span>
            </div>

            <Button
              variant="outline-light"
              className="px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 border-0 bg-white-10 hover-bg-danger"
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

import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, Badge, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaClinicMedical,
  FaTachometerAlt,
  FaPills,
  FaHandHoldingHeart,
  FaSignOutAlt,
  FaUserNurse,
  FaFlask
} from "react-icons/fa";

function StaffNav() {
  const [staffInfo, setStaffInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const staffId = localStorage.getItem("staff");
  const Handlelogout = () => {
  localStorage.removeItem("staff");


  window.location.replace("/");
};
  useEffect(() => {
    if (!staffId) return;

    axios
      .get(`http://localhost:5000/api/staff/staffinfo/${staffId}`)
      .then((res) => {
        if (res.data?.result) {
          setStaffInfo(res.data.result);
        } else {
          axios
            .get("http://localhost:5000/api/staff/viewStaff")
            .then((listRes) => {
              const found = listRes.data?.result?.find(
                (staff) => staff.commonKey === staffId || staff._id === staffId
              );
              if (found) setStaffInfo(found);
            })
            .catch((err) => console.log("Error fetching staff fallback:", err));
        }
      })
      .catch(() => {
        axios
          .get("http://localhost:5000/api/staff/viewStaff")
          .then((listRes) => {
            const found = listRes.data?.result?.find(
              (staff) => staff.commonKey === staffId || staff._id === staffId
            );
            if (found) setStaffInfo(found);
          })
          .catch((err) => console.log("Error fetching staff fallback:", err));
      });
  }, [staffId]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const staffType = staffInfo?.staffType?.toLowerCase();
  const isPharmacist = staffType === "pharmacist";
  const isCareAssistant = staffType === "care assistant";
  const islabStaff= staffType  === "lab technician";

  return (
    <Navbar
      expand="lg"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #047857 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
      variant="dark"
      sticky="top"
      className="py-2 px-1"
    >
      <Container fluid className="px-lg-4">
        <Navbar.Brand
          as={Link}
          to="/staffdashboard"
          className="fw-bold fs-4 text-white d-flex align-items-center gap-2"
        >
          <div
            className="d-flex align-items-center justify-content-center bg-white text-success rounded-circle shadow-sm"
            style={{ width: "38px", height: "38px" }}
          >
            <FaClinicMedical className="fs-5 text-success" />
          </div>
          <span className="tracking-tight fw-bold">HealthCare Staff</span>
          {staffInfo?.staffType && (
            <Badge bg="info" className="ms-2 fs-6 fw-normal rounded-pill px-2 py-1 text-dark">
              {staffInfo.staffType}
            </Badge>
          )}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="staff-navbar" className="border-0" />

        <Navbar.Collapse id="staff-navbar">
          <Nav className="ms-auto align-items-lg-center gap-2 my-2 my-lg-0">
            <Nav.Link
              as={Link}
              to="/staffdashboard"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/staffdashboard")
                  ? "bg-white text-success shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaTachometerAlt /> Dashboard
            </Nav.Link>

            {(!staffType || isPharmacist) && (
              <Nav.Link
                as={Link}
                to="/staffmedicineorders"
                className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                  isActive("/staffmedicineorders")
                    ? "bg-white text-success shadow-sm"
                    : "text-white-50 text-white-hover"
                }`}
              >
                <FaPills /> Medicine Orders
              </Nav.Link>
            )}

            {(!staffType || isCareAssistant) && (
              <Nav.Link
                as={Link}
                to="/companiondetail"
                className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                  isActive("/companiondetail")
                    ? "bg-white text-success shadow-sm"
                    : "text-white-50 text-white-hover"
                }`}
              >
                <FaHandHoldingHeart /> Companion Care
              </Nav.Link>
            )}

            {/* {(!staffType || islabStaff) && (
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center gap-2 text-white">
                    <FaFlask /> Laboratory
                  </span>
                }
                id="staff-lab-dropdown"
                className="px-2"
                menuVariant="dark"
              >
                <NavDropdown.Item as={Link} to="/labdashboard" className="py-2">
                  Lab Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/stafflabtests" className="py-2">
                  Manage Lab Tests
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/labbookings" className="py-2">
                  Lab Bookings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/labprocessing" className="py-2">
                  Test Processing
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/labreport" className="py-2">
                  Upload Reports
                </NavDropdown.Item>
              </NavDropdown>
            )} */}

            <div className="d-flex align-items-center text-white ms-lg-3 me-2 my-1 my-lg-0">
              <FaUserNurse className="fs-4 me-2 text-light" />
              <span className="fw-semibold fs-7 text-truncate" style={{ maxWidth: "150px" }}>
                {staffInfo?.name || "Staff"}
              </span>
            </div>

            <Button
              variant="outline-light"
              className="ms-lg-2 px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 border-0 bg-white-10 hover-bg-danger"
              onClick={Handlelogout}
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

export default StaffNav;
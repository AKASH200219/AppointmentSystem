import { Navbar, Nav, Container, Button, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {FaUserMd,FaTools,FaHandHoldingHeart,FaPills,FaSignOutAlt,FaTachometerAlt,FaClinicMedical,FaFlask,FaCalendarAlt} from "react-icons/fa";

function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminId = localStorage.getItem("admin");
  // console.log("Admin ID:", adminId); 
  // const Handlelogout = () => {
  const Handlelogout = () => {
  localStorage.removeItem("admin");


  window.location.replace("/");
};
   

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
      variant="dark"
      sticky="top"
      className="py-2 px-1"
    >
      <Container fluid className="px-lg-4">
        <Navbar.Brand
          as={Link}
          to="/admindashboard"
          className="fw-bold fs-4 text-white d-flex align-items-center gap-2"
        >
          <div className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
            style={{ width: "38px", height: "38px" }}>
            <FaClinicMedical className="fs-5" />
          </div>
          <span className="tracking-tight fw-bold">HealthCare Admin</span>
          <Badge bg="info" className="ms-2 fs-6 fw-normal rounded-pill px-2 py-1">
            v2.0
          </Badge>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar" className="border-0" />

        <Navbar.Collapse id="admin-navbar">
          <Nav className="ms-auto align-items-lg-center gap-1 my-2 my-lg-0">
            <Nav.Link
              as={Link}
              to="/admindashboard"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/admindashboard")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaTachometerAlt /> Dashboard
            </Nav.Link>

            {/* <Nav.Link
              as={Link}
              to="/registerdoctor"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/registerdoctor")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaUserMd /> Register Doctor
            </Nav.Link> */}

            <Nav.Link
              as={Link}
              to="/doctorview"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/doctorview") || location.pathname.startsWith("/editdoctor")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaUserMd /> Doctors 
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/tokenmanagement"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/tokenmanagement")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaCalendarAlt /> Token 
            </Nav.Link>

            {/* <Nav.Link
              as={Link}
              to="/staffregister"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/staffregister")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaUserNurse /> Register Staff
            </Nav.Link> */}

            <Nav.Link
              as={Link}
              to="/staffview"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/staffview")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
               Staffs
            </Nav.Link>

            <NavDropdown
              title={
                <span className="d-inline-flex align-items-center gap-2 text-white">
                  <FaTools /> Equipment
                </span>
              }
              id="equipment-dropdown"
              className="px-2"
              menuVariant="dark"
            >
              {/* <NavDropdown.Item as={Link} to="/equipmentrental" className="py-2">
                Add Equipment
              </NavDropdown.Item>
              <NavDropdown.Divider /> */}
              <NavDropdown.Item as={Link} to="/viewequip" className="py-2">
                View Equipment
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/viewequipmentbook" className="py-2">
                Equipment Bookings
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/companion"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/companion")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaHandHoldingHeart /> Companion Care
            </Nav.Link>

            <NavDropdown
              title={
                <span className="d-inline-flex align-items-center gap-2 text-white">
                  <FaPills /> Medicine
                </span>
              }
              id="medicine-dropdown"
              className="px-2"
              menuVariant="dark"
            >
              {/* <NavDropdown.Item as={Link} to="/medicineAdd" className="py-2">
                Add Medicine
              </NavDropdown.Item>
              <NavDropdown.Divider /> */}
              <NavDropdown.Item as={Link} to="/medicinestock" className="py-2">
                Medicine Stock
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link
              as={Link}
              to="/managelab"
              className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 transition-all ${
                isActive("/managelab") || isActive("/managelabtest")
                  ? "bg-white text-primary shadow-sm"
                  : "text-white-50 text-white-hover"
              }`}
            >
              <FaFlask /> Manage Lab
            </Nav.Link>

            <Button
              variant="outline-light"
              className="ms-lg-3 mt-2 mt-lg-0 px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 border-0 bg-white-10 hover-bg-danger"
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

export default AdminNav;
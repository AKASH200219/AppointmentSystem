// import React, { useEffect, useState } from "react";
// import { Navbar, Nav, Container, Button, NavDropdown, Badge } from "react-bootstrap";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import {
//   FaClinicMedical,
//   FaUserMd,
//   FaCalendarAlt,
//   FaFileMedical,
//   FaHandHoldingHeart,
//   FaClipboardList,
//   FaTools,
//   FaBoxes,
//   FaPills,
//   FaSignOutAlt,
//   FaUserCircle,
//   FaFlask
// } from "react-icons/fa";
// import API from "../../api/axiosConfig";

// function UserNav() {
//   const [userinfo, setUserinfo] = useState({});
//   const [imgError, setImgError] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const userid = localStorage.getItem("user");

//   useEffect(() => {
//     if (!userid) return;
//     // axios.get(`http://localhost:5000/api/usernav/userinfo/${userid}`)
//      API.get(`/api/usernav/userinfo/${userid}`)
//       .then((result) => {
//         if (result.data?.result) {
//           setUserinfo(result.data.result);
//         }
//       })
//       .catch((err) => {
//         console.log("Error fetching user nav info:", err);
//       });
//   }, [userid]);

//   // const logout = () => {
//   //   localStorage.clear("user");
//   //   navigate("/");
//   // };
//   const logout = () => {
//   localStorage.removeItem("user");
//   window.location.replace("/");
// };
//   const isActive = (path) => location.pathname === path;
//   const isCompanionActive = location.pathname === "/companionpage" || location.pathname === "/companionstatus";
//   const isEquipmentActive = location.pathname === "/equipment" || location.pathname === "/bookequipmentstatus";

//   return (
//     <Navbar
//       expand="xl"
//       variant="dark"
//       sticky="top"
//       className="navbar-glass py-2 px-1"
//     >
//       <Container fluid className="px-lg-4">
//         {/* Brand Logo */}
//         <Navbar.Brand
//   as={Link}
//   to="/doctorpage"
//   className="fw-bold text-white d-flex align-items-center gap-2"
// >
//   <div
//     className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
//     style={{ width: "38px", height: "38px" }}
//   >
//     <FaClinicMedical className="fs-5 text-primary" />
//   </div>

//   <div className="d-flex flex-column lh-1">
//     <small
//       className="text-info fw-semibold"
//       style={{ fontSize: "11px" }}
//     >
//       Patient
//     </small>

//     <span className="fw-bold">
//       HealthCare
//     </span>
//   </div>
// </Navbar.Brand>
//         <Navbar.Toggle aria-controls="user-navbar" className="border-0" />

//         <Navbar.Collapse id="user-navbar">
//           {/* Main Navigation Links */}
//           <Nav className="mx-auto align-items-xl-center gap-1 my-2 my-xl-0">
//             <Nav.Link
//               as={Link}
//               to="/doctorpage"
//               className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
//                 isActive("/doctorpage") ? "active-nav-item" : ""
//               }`}
//             >
//               <FaUserMd /> Doctors
//             </Nav.Link>

//             <Nav.Link
//               as={Link}
//               to="/myappointment"
//               className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
//                 isActive("/myappointment") ? "active-nav-item" : ""
//               }`}
//             >
//               <FaCalendarAlt /> My Appointments
//             </Nav.Link>

//             <Nav.Link
//               as={Link}
//               to="/prescriptions"
//               className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
//                 isActive("/prescriptions") ? "active-nav-item" : ""
//               }`}
//             >
//               <FaFileMedical /> Prescriptions
//             </Nav.Link>

//             {/* Companion Care Dropdown */}
//             <NavDropdown
//               title={
//                 <span className={`d-inline-flex align-items-center gap-2 ${isCompanionActive ? "fw-bold text-white" : ""}`}>
//                   <FaHandHoldingHeart /> Companion Care
//                 </span>
//               }
//               id="user-companion-dropdown"
//               className="px-1 custom-nav-dropdown"
//               menuVariant="dark"
//             >
//               <NavDropdown.Item
//                 as={Link}
//                 to="/companionpage"
//                 className={`py-2 d-flex align-items-center gap-2 ${isActive("/companionpage") ? "active" : ""}`}
//               >
//                 <FaHandHoldingHeart className="text-primary" /> Book Companion
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item
//                 as={Link}
//                 to="/companionstatus"
//                 className={`py-2 d-flex align-items-center gap-2 ${isActive("/companionstatus") ? "active" : ""}`}
//               >
//                 <FaClipboardList className="text-info" /> Companion Status
//               </NavDropdown.Item>
//             </NavDropdown>

//             {/* Equipment Dropdown */}
//             <NavDropdown
//               title={
//                 <span className={`d-inline-flex align-items-center gap-2 ${isEquipmentActive ? "fw-bold text-white" : ""}`}>
//                   <FaTools /> Medical Equipment
//                 </span>
//               }
//               id="user-equipment-dropdown"
//               className="px-1 custom-nav-dropdown"
//               menuVariant="dark"
//             >
//               <NavDropdown.Item
//                 as={Link}
//                 to="/equipment"
//                 className={`py-2 d-flex align-items-center gap-2 ${isActive("/equipment") ? "active" : ""}`}
//               >
//                 <FaTools className="text-warning" /> Rent Equipment
//               </NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item
//                 as={Link}
//                 to="/bookequipmentstatus"
//                 className={`py-2 d-flex align-items-center gap-2 ${isActive("/bookequipmentstatus") ? "active" : ""}`}
//               >
//                 <FaBoxes className="text-success" /> Equipment Bookings
//               </NavDropdown.Item>
//             </NavDropdown>

//             <Nav.Link
//               as={Link}
//               to="/user-medicine"
//               className={`px-3 py-2 rounded-3 fw-medium d-flex align-items-center gap-2 nav-link-custom ${
//                 isActive("/user-medicine") ? "active-nav-item" : ""
//               }`}
//             >
//               <FaPills /> Medicine 
//             </Nav.Link>
//              <NavDropdown
//   title={
//     <span
//       className={`d-inline-flex align-items-center gap-2 ${
//         location.pathname === "/labs" ||
//         location.pathname.startsWith("/labdetails") ||
//         location.pathname === "/labtests" ||
//         location.pathname === "/labbooking" ||
//         location.pathname === "/labreports"
//           ? "fw-bold text-white"
//           : ""
//       }`}
//     >
//       <FaFlask /> Laboratory
//     </span>
//   }
//   id="user-laboratory-dropdown"
//   className="px-1 custom-nav-dropdown"
//   menuVariant="dark"
// >
//   <NavDropdown.Item
//     as={Link}
//     to="/labs"
//     className={`py-2 d-flex align-items-center gap-2 ${
//       isActive("/labs") || location.pathname.startsWith("/labdetails") ? "active" : ""
//     }`}
//   >
//     <FaClinicMedical className="text-primary" /> Diagnostic Laboratories
//   </NavDropdown.Item>

//   <NavDropdown.Divider />

//   <NavDropdown.Item
//     as={Link}
//     to="/labtests"
//     className={`py-2 d-flex align-items-center gap-2 ${
//       isActive("/labtests") ? "active" : ""
//     }`}
//   >
//     <FaFlask className="text-info" /> Browse Lab Tests
//   </NavDropdown.Item>

//   <NavDropdown.Divider />

//   <NavDropdown.Item
//     as={Link}
//     to="/labbooking"
//     className={`py-2 d-flex align-items-center gap-2 ${
//       isActive("/labbooking") ? "active" : ""
//     }`}
//   >
//     <FaCalendarAlt className="text-success" /> Book Lab Test
//   </NavDropdown.Item>

//   <NavDropdown.Divider />

//   <NavDropdown.Item
//     as={Link}
//     to="/labreports"
//     className={`py-2 d-flex align-items-center gap-2 ${
//       isActive("/labreports") ? "active" : ""
//     }`}
//   >
//     <FaFileMedical className="text-warning" /> My Lab Reports
//   </NavDropdown.Item>
// </NavDropdown>
//           </Nav>

//           {/* User Profile & Logout */}
//           <Nav className="ms-xl-auto align-items-xl-center gap-2">
//             <div className="d-flex align-items-center bg-white-10 px-3 py-1-5 rounded-pill border border-white-10 text-white me-xl-2 my-1 my-xl-0">
//               {userinfo?.image && !imgError ? (
//                 <img
//                   // src={`http://localhost:5000/uploads/${userinfo.image}`}
//                   src={`${API.defaults.baseURL}/uploads/${userinfo.image}`}
//                   alt="Profile"
//                   width="34"
//                   height="34"
//                   className="rounded-circle me-2 border border-2 border-white shadow-sm"
//                   style={{ objectFit: "cover" }}
//                   onError={() => setImgError(true)}
//                 />
//               ) : (
//                 <FaUserCircle className="fs-4 me-2 text-light" />
//               )}
//               <span className="fw-semibold fs-7 text-truncate" style={{ maxWidth: "140px" }}>
//                 {userinfo?.name || "Patient Profile"}
//               </span>
//             </div>

//             <Button
//               variant="outline-light"
//               className="px-4 py-2 fw-semibold rounded-pill d-flex align-items-center gap-2 border-0 bg-white-10 hover-bg-danger"
//               onClick={logout}
//               style={{ transition: "all 0.2s ease" }}
//             >
//               <FaSignOutAlt /> Logout
//             </Button>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default UserNav;


import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaClinicMedical, FaUserMd, FaCalendarAlt, FaFileMedical,
  FaHandHoldingHeart, FaClipboardList, FaTools, FaBoxes,
  FaPills, FaSignOutAlt, FaUserCircle, FaFlask
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
        if (result.data?.result) setUserinfo(result.data.result);
      })
      .catch((err) => console.log("Error fetching user info:", err));
  }, [userid]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const companionActive = ["/companionpage", "/companionstatus"].includes(location.pathname);
  const equipmentActive = ["/equipment", "/bookequipmentstatus"].includes(location.pathname);
  const labActive = ["/labs", "/labtests", "/labbooking", "/labreports"].includes(location.pathname)
    || location.pathname.startsWith("/labdetails");

  const linkClass = (path) =>
    `nav-link-custom px-2 py-2 rounded-2 d-flex align-items-center gap-1 ${
      isActive(path) ? "active-nav-item" : ""
    }`;

  return (
    <Navbar expand="xxl" variant="dark" sticky="top" className="navbar-glass py-2">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/doctorpage"
          className="fw-bold text-white d-flex align-items-center gap-2 me-3">
          <span className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36 }}>
            <FaClinicMedical />
          </span>
          <span className="d-flex flex-column lh-sm">
            <small className="text-info" style={{ fontSize: 10 }}>Patient</small>
            <span>HealthCare</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="user-navbar" className="border-0" />

        <Navbar.Collapse id="user-navbar">
          <Nav className="mx-auto align-items-xxl-center gap-1 my-2 my-xxl-0">
            <Nav.Link as={Link} to="/doctorpage" className={linkClass("/doctorpage")}>
              <FaUserMd /> Doctors
            </Nav.Link>

            <Nav.Link as={Link} to="/myappointment" className={linkClass("/myappointment")}>
              <FaCalendarAlt /> Appointments
            </Nav.Link>

            <Nav.Link as={Link} to="/prescriptions" className={linkClass("/prescriptions")}>
              <FaFileMedical /> Prescriptions
            </Nav.Link>

            <NavDropdown title={<span className={companionActive ? "fw-bold" : ""}>
              <FaHandHoldingHeart /> Companion Care
            </span>} id="companion-menu" className="custom-nav-dropdown"
              menuVariant="dark">
              <NavDropdown.Item as={Link} to="/companionpage">
                <FaHandHoldingHeart className="me-2" /> Book Companion
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/companionstatus">
                <FaClipboardList className="me-2" /> Companion Status
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title={<span className={equipmentActive ? "fw-bold" : ""}>
              <FaTools /> Equipment
            </span>} id="equipment-menu" className="custom-nav-dropdown"
              menuVariant="dark">
              <NavDropdown.Item as={Link} to="/equipment">
                <FaTools className="me-2" /> Rent Equipment
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/bookequipmentstatus">
                <FaBoxes className="me-2" /> Equipment Bookings
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/user-medicine" className={linkClass("/user-medicine")}>
              <FaPills /> Medicine
            </Nav.Link>

            <NavDropdown title={<span className={labActive ? "fw-bold" : ""}>
              <FaFlask /> Laboratory
            </span>} id="lab-menu" className="custom-nav-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/labs">
                <FaClinicMedical className="me-2" /> Diagnostic Labs
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/labtests">
                <FaFlask className="me-2" /> Browse Tests
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/labbooking">
                <FaCalendarAlt className="me-2" /> Book Lab Test
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/labreports">
                <FaFileMedical className="me-2" /> My Lab Reports
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Nav className="align-items-xxl-center gap-2 ms-xxl-2">
            <div className="d-flex align-items-center text-white rounded-pill px-2 py-1">
              {userinfo?.image && !imgError ? (
                <img src={`${API.defaults.baseURL}/uploads/${userinfo.image}`}
                  alt="Profile" width="32" height="32"
                  className="rounded-circle me-2"
                  style={{ objectFit: "cover" }}
                  onError={() => setImgError(true)} />
              ) : (
                <FaUserCircle className="fs-4 me-2" />
              )}
              <span className="text-truncate" style={{ maxWidth: 110 }}>
                {userinfo?.name || "Patient"}
              </span>
            </div>

            <Button variant="outline-light" size="sm"
              className="rounded-pill px-3 d-flex align-items-center gap-2"
              onClick={logout}>
              <FaSignOutAlt /> Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default UserNav;

import React from "react";
import { Container, Button, Navbar } from "react-bootstrap";
import { FaFlask } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function LabNav({ labName }) {
  const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.removeItem("lab");
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };  const Handlelogout = () => {
  const logout = () => {
  localStorage.removeItem("lab");
  localStorage.removeItem("token");

  window.location.replace("/");
};

  return (
    <Navbar bg="white" className="shadow-sm border-bottom py-3">
      <Container>
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold text-primary">
          <FaFlask size={24} />
          {labName || "Laboratory Portal"}
        </Navbar.Brand>

        <Button variant="outline-danger" size="sm" onClick={logout}>
          Log out
        </Button>
      </Container>
    </Navbar>
  );
}

export default LabNav;

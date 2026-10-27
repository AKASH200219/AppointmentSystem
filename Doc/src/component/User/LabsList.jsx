import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Badge,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import {
  FaFlask,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaClinicMedical,
  FaShieldAlt,
} from "react-icons/fa";
import axios from "axios";
import API from "../../api/axiosConfig";

function LabsList() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/lab/all-labs");
      const res = await API.get("/api/lab/all-labs");
      if (res.data?.success) {
        setLabs(res.data.result || []);
      }
    } catch (err) {
      console.error("Error fetching labs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Distinct cities list
  const cities = ["All", ...new Set(labs.map((l) => l.city).filter(Boolean))];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.name?.toLowerCase().includes(search.toLowerCase()) ||
      lab.city?.toLowerCase().includes(search.toLowerCase()) ||
      lab.address?.toLowerCase().includes(search.toLowerCase()) ||
      lab.accreditation?.toLowerCase().includes(search.toLowerCase());

    const matchesCity = selectedCity === "All" || lab.city === selectedCity;
    const isActive = lab.status !== "Inactive";
    return matchesSearch && matchesCity && isActive;
  });

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <UserNav />

      {/* Hero Header */}
      <div
        className="py-5 text-white"
        style={{
          background: "linear-gradient(135deg, #09203f 0%, #1e3a8a 100%)",
        }}
      >
        <Container className="text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-primary mb-3 shadow-lg"
            style={{ width: "70px", height: "70px" }}
          >
            <FaFlask size={32} />
          </div>
          <h1 className="fw-bold mb-2">Diagnostic Laboratories</h1>
          <p className="lead mb-0 text-white-50" style={{ maxWidth: "680px", margin: "0 auto" }}>
            Select an accredited diagnostic center to browse certified lab tests, view technicians, compare prices, and schedule your appointments online.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search & Filter Controls */}
        <Row className="justify-content-center mb-5 g-3">
          <Col md={7} lg={6}>
            <InputGroup className="shadow-sm rounded-pill overflow-hidden border bg-white">
              <InputGroup.Text className="bg-white border-0 ps-3">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search labs by name, address, or accreditation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 py-2 shadow-none"
              />
              {search && (
                <Button
                  variant="white"
                  className="border-0 text-muted"
                  onClick={() => setSearch("")}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>

          {cities.length > 2 && (
            <Col md={3} lg={3}>
              <Form.Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="shadow-sm rounded-pill py-2 border px-3 bg-white"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city === "All" ? "All Locations" : city}
                  </option>
                ))}
              </Form.Select>
            </Col>
          )}
        </Row>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted fw-medium">Loading certified laboratories...</p>
          </div>
        ) : (
          /* Laboratories Grid */
          <Row className="g-4">
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab) => (
                <Col lg={6} key={lab._id}>
                  <Card
                    className="h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow"
                    style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
                    onClick={() => navigate(`/labdetails/${lab._id}`)}
                  >
                    <div
                      className="p-3 text-white d-flex justify-content-between align-items-center"
                      style={{
                        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
                      }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <FaClinicMedical className="fs-5 text-warning" />
                        <span className="fw-semibold small">Certified Diagnostic Lab</span>
                      </div>
                      <Badge bg="light" text="dark" className="rounded-pill px-3 py-1 fw-bold">
                        <FaStar className="text-warning me-1" />
                        {lab.rating || 4.8} / 5.0
                      </Badge>
                    </div>

                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex gap-3 align-items-start mb-3">
                        {lab.image ? (
                          <img
                            // src={`http://localhost:5000/uploads/${lab.image}`}
                            src={`${API.defaults.baseURL}/uploads/${lab.image}`}
                            alt={lab.name}
                            width="75"
                            height="75"
                            className="rounded-3 shadow-sm border object-fit-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=120&auto=format&fit=crop&q=60";
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                            style={{ width: "75px", height: "75px" }}
                          >
                            <FaFlask size={32} />
                          </div>
                        )}

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h4 className="fw-bold mb-1 text-dark">{lab.name}</h4>
                            {lab.accreditation && (
                              <Badge bg="success" className="px-2 py-1 rounded-pill fw-normal small">
                                <FaShieldAlt className="me-1" />
                                {lab.accreditation}
                              </Badge>
                            )}
                          </div>
                          {lab.city && (
                            <span className="text-primary fw-medium small d-inline-flex align-items-center gap-1">
                              <FaMapMarkerAlt /> {lab.city}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-muted small mb-3">
                        {lab.description ||
                          "Comprehensive clinical pathology and diagnostic testing laboratory with modern equipment."}
                      </p>

                      {/* Info Chips */}
                      <div className="bg-light p-3 rounded-3 mb-3">
                        <div className="small text-muted mb-2 d-flex align-items-center gap-2">
                          <FaMapMarkerAlt className="text-danger flex-shrink-0" />
                          <span className="text-truncate">{lab.address || "Main Diagnostic Wing"}</span>
                        </div>

                        <div className="small text-muted mb-2 d-flex align-items-center gap-2">
                          <FaClock className="text-primary flex-shrink-0" />
                          <span>{lab.timing || "07:00 AM - 08:30 PM"}</span>
                        </div>

                        {lab.phone && (
                          <div className="small text-muted d-flex align-items-center gap-2">
                            <FaPhoneAlt className="text-success flex-shrink-0" />
                            <span>{lab.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {lab.features && lab.features.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-4">
                          {lab.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="badge bg-primary bg-opacity-10 text-primary fw-normal px-2 py-1 rounded"
                            >
                              <FaCheckCircle className="me-1 text-primary small" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-bold text-dark fs-5">
                            {lab.testCount || lab.totalTests || 0}
                          </span>{" "}
                          <small className="text-muted">Tests Available</small>
                        </div>

                        <Button
                          as={Link}
                          to={`/labdetails/${lab._id}`}
                          variant="primary"
                          className="rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details & Tests <FaArrowRight size={13} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <FaFlask size={45} className="text-muted mb-3" />
                  <h4>No Laboratories Found</h4>
                  <p className="text-muted">
                    No labs match your search filter. Try clearing your search keyword.
                  </p>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSearch("");
                      setSelectedCity("All");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default LabsList;

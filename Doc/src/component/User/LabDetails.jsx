import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import {
  FaFlask,
  FaMapMarkerAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaShieldAlt,
  FaSearch,
  FaRupeeSign,
  FaInfoCircle,
  FaArrowLeft,
  FaCheckCircle,
  FaCalendarCheck,
  FaUserNurse,
} from "react-icons/fa";
import axios from "axios";
import API from "../../api/axiosConfig";

function LabDetails() {
  const { labId } = useParams();
  const navigate = useNavigate();

  const [lab, setLab] = useState(null);
  const [tests, setTests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchLabDetails();
  }, [labId]);

  const fetchLabDetails = async () => {
    try {
      setLoading(true);
      // const res = await axios.get(`http://localhost:5000/api/lab/labs/${labId}`);
      const res = await API.get(`/api/lab/labs/${labId}`);
      if (res.data?.success) {
        setLab(res.data.result.lab);
        setTests(res.data.result.tests || []);
        setStaff(res.data.result.staff || []);
      }
    } catch (err) {
      console.error("Error fetching lab details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories
  const categories = ["All", ...new Set(tests.map((t) => t.category).filter(Boolean))];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testName?.toLowerCase().includes(search.toLowerCase()) ||
      test.description?.toLowerCase().includes(search.toLowerCase()) ||
      test.category?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleBookTest = (test) => {
    navigate("/labbooking", {
      state: {
        test,
        lab,
      },
    });
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <UserNav />

      {/* Top Navigation Breadcrumb */}
      <div className="bg-white py-3 border-bottom shadow-sm">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <Button
              as={Link}
              to="/labs"
              variant="outline-secondary"
              size="sm"
              className="rounded-pill d-inline-flex align-items-center gap-2 px-3 fw-medium"
            >
              <FaArrowLeft /> Back to All Labs
            </Button>
            <div className="small text-muted fw-semibold">
              Diagnostic Center Profile & Test Catalogue
            </div>
          </div>
        </Container>
      </div>

      {loading ? (
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading laboratory details & test catalogue...</p>
        </Container>
      ) : !lab ? (
        <Container className="py-5 text-center">
          <h4>Laboratory Not Found</h4>
          <p className="text-muted">The requested diagnostic center could not be found.</p>
          <Button as={Link} to="/labs" variant="primary">
            Back to All Labs
          </Button>
        </Container>
      ) : (
        <Container className="py-5">
          {/* Lab Header Profile Card */}
          <Card
            className="border-0 shadow-sm rounded-4 overflow-hidden mb-5 text-white"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            }}
          >
            <Card.Body className="p-4 p-md-5">
              <Row className="align-items-center g-4">
                <Col lg={8}>
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <Badge bg="warning" text="dark" className="rounded-pill px-3 py-1-5 fw-bold">
                      <FaStar className="me-1" />
                      {lab.rating || 4.8} Rating
                    </Badge>

                    {lab.accreditation && (
                      <Badge bg="success" className="rounded-pill px-3 py-1-5 fw-normal">
                        <FaShieldAlt className="me-1" />
                        {lab.accreditation}
                      </Badge>
                    )}

                    <Badge bg="info" className="rounded-pill px-3 py-1-5 text-dark fw-normal">
                      Verified Laboratory
                    </Badge>
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-3">
                    {lab.image && (
                      <img
                        // src={`http://localhost:5000/uploads/${lab.image}`}
                        src={`${API.defaults.baseURL}/uploads/${lab.image}`}
                        alt={lab.name}
                        width="80"
                        height="80"
                        className="rounded-3 border border-2 border-white shadow-sm object-fit-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div>
                      <h1 className="fw-bold mb-1 text-white">{lab.name}</h1>
                      {lab.city && (
                        <span className="text-info small fw-medium d-flex align-items-center gap-1">
                          <FaMapMarkerAlt /> {lab.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="lead text-white-50 mb-4" style={{ fontSize: "1.02rem" }}>
                    {lab.description ||
                      "Full-service clinical diagnostics and pathology laboratory with advanced testing facilities."}
                  </p>

                  <Row className="g-3 text-white-50 small">
                    <Col sm={6} md={4} className="d-flex align-items-center gap-2">
                      <FaMapMarkerAlt className="text-danger flex-shrink-0 fs-6" />
                      <span className="text-white text-truncate">{lab.address || "City Medical Wing"}</span>
                    </Col>

                    <Col sm={6} md={4} className="d-flex align-items-center gap-2">
                      <FaClock className="text-info flex-shrink-0 fs-6" />
                      <span className="text-white">{lab.timing || "07:00 AM - 08:30 PM"}</span>
                    </Col>

                    {lab.phone && (
                      <Col sm={6} md={4} className="d-flex align-items-center gap-2">
                        <FaPhoneAlt className="text-success flex-shrink-0 fs-6" />
                        <span className="text-white">{lab.phone}</span>
                      </Col>
                    )}

                    {lab.email && (
                      <Col sm={6} md={4} className="d-flex align-items-center gap-2">
                        <FaEnvelope className="text-warning flex-shrink-0 fs-6" />
                        <span className="text-white text-truncate">{lab.email}</span>
                      </Col>
                    )}
                  </Row>
                </Col>

                <Col lg={4}>
                  <div className="bg-white bg-opacity-10 p-4 rounded-4 backdrop-blur border border-white-10">
                    <h5 className="fw-bold mb-3 text-white">Lab Highlights</h5>
                    {lab.features && lab.features.length > 0 ? (
                      <ul className="list-unstyled mb-0">
                        {lab.features.map((feat, i) => (
                          <li key={i} className="mb-2 d-flex align-items-center gap-2 small text-light">
                            <FaCheckCircle className="text-success flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="small text-light mb-0">Digital reports, home sample collection and accredited testing.</p>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Qualified Lab Staff Section */}
          {staff && staff.length > 0 && (
            <div className="mb-5">
              <h4 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                <FaUserNurse className="text-primary" /> Technicians & Pathologists on Duty
              </h4>
              <Row className="g-3">
                {staff.map((member) => (
                  <Col md={4} sm={6} key={member._id}>
                    <Card className="border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
                      <div className="d-flex align-items-center gap-3">
                        {member.image ? (
                          <img
                            // src={`http://localhost:5000/uploads/${member.image}`}
                          src={`${API.defaults.baseURL}/uploads/${member.image}`}
                            alt={member.name}
                            width="52"
                            height="52"
                            className="rounded-circle object-fit-cover border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://images.unsplash.com/photo-1594824813589-3e3e20e8b2b7?w=100&auto=format&fit=crop&q=60";
                            }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                            style={{ width: "52px", height: "52px" }}
                          >
                            <FaUserNurse size={22} />
                          </div>
                        )}
                        <div>
                          <div className="fw-bold text-dark">{member.name}</div>
                          <Badge bg="secondary" className="fw-normal small">
                            {member.role || "Lab Technician"}
                          </Badge>
                          {member.qualification && (
                            <div className="text-muted small mt-1">{member.qualification}</div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Tests Section */}
          <div className="mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h3 className="fw-bold mb-1 text-dark">
                Diagnostic Tests Available at {lab.name}
              </h3>
              <p className="text-muted small mb-0">
                Total {tests.length} tests available. Fast results and accurate diagnosis guaranteed.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ minWidth: "280px" }}>
              <InputGroup className="shadow-sm rounded-pill overflow-hidden border bg-white">
                <InputGroup.Text className="bg-white border-0 ps-3">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search test in this lab..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-0 py-2 shadow-none"
                />
              </InputGroup>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="d-flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "primary" : "outline-secondary"}
                  size="sm"
                  className="rounded-pill px-3 py-1-5 fw-medium"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}

          {/* Test Cards Grid */}
          <Row className="g-4">
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <Col md={6} lg={4} key={test._id}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 transition-all hover-shadow bg-white">
                    <Card.Body className="p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-3"
                          style={{ width: "46px", height: "46px" }}
                        >
                          <FaFlask size={20} />
                        </div>

                        <Badge bg="info" className="text-dark px-3 py-1-5 rounded-pill fw-medium">
                          {test.category}
                        </Badge>
                      </div>

                      <h5 className="fw-bold mb-2 text-dark">{test.testName}</h5>

                      <p className="text-muted small mb-3 flex-grow-1">
                        {test.description || "Comprehensive clinical diagnostic pathology test."}
                      </p>

                      <div className="bg-light p-3 rounded-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small">Standard Fee</span>
                          <strong className="text-success fs-5 d-flex align-items-center">
                            <FaRupeeSign size={16} />
                            {test.price}
                          </strong>
                        </div>

                        <div className="small text-muted d-flex align-items-center gap-2 mb-1">
                          <FaClock className="text-primary flex-shrink-0" />
                          <span>Report Turnaround: <strong>{test.reportTime || "24 Hours"}</strong></span>
                        </div>

                        <div className="small text-muted d-flex align-items-center gap-2">
                          <FaInfoCircle className="text-warning flex-shrink-0" />
                          <span className="text-truncate">{test.preparation || "Fasting not required"}</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        className="w-100 rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        onClick={() => handleBookTest(test)}
                        disabled={test.status === "Unavailable"}
                      >
                        <FaCalendarCheck />
                        {test.status === "Unavailable" ? "Temporarily Unavailable" : "Book This Test"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col>
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <FaFlask size={45} className="text-muted mb-3" />
                  <h5>No Tests Found</h5>
                  <p className="text-muted">
                    No diagnostic tests found in this lab matching your search.
                  </p>
                  <Button variant="outline-primary" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
                    Reset Test Filter
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default LabDetails;

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
import { Link, useNavigate } from "react-router-dom";
import UserNav from "./UserNav";
import {
  FaFlask,
  FaSearch,
  FaClock,
  FaRupeeSign,
  FaCalendarCheck,
  FaClinicMedical,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";
import API from "../../api/axiosConfig";

function LabTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      // const res = await axios.get("http://localhost:5000/api/lab/tests");
      const res = await API.get("/api/lab/tests");
      if (res.data?.success) {
        setTests(res.data.result || []);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(tests.map((t) => t.category).filter(Boolean))];

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.testName?.toLowerCase().includes(search.toLowerCase()) ||
      test.description?.toLowerCase().includes(search.toLowerCase()) ||
      test.labName?.toLowerCase().includes(search.toLowerCase()) ||
      test.category?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleBookTest = (test) => {
    navigate("/labbooking", {
      state: {
        test,
      },
    });
  };

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
          <h1 className="fw-bold mb-2">Browse All Lab Tests</h1>
          <p className="lead mb-0 text-white-50" style={{ maxWidth: "680px", margin: "0 auto" }}>
            Explore pathology and diagnostic blood tests from top certified laboratories. Compare prices and book instantly.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Search & Category Filter Controls */}
        <Row className="justify-content-center mb-4 g-3">
          <Col md={7} lg={6}>
            <InputGroup className="shadow-sm rounded-pill overflow-hidden border bg-white">
              <InputGroup.Text className="bg-white border-0 ps-3">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search test by name, category, or lab..."
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
        </Row>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
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

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted fw-medium">Loading diagnostic tests...</p>
          </div>
        ) : (
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

                      <h5 className="fw-bold mb-1 text-dark">{test.testName}</h5>

                      <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                        <FaClinicMedical className="text-secondary small" />
                        <span>{test.labName || "Central Diagnostic Lab"}</span>
                      </div>

                      <p className="text-muted small mb-3 flex-grow-1">
                        {test.description || "Comprehensive clinical pathology diagnostic testing."}
                      </p>

                      <div className="bg-light p-3 rounded-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small">Fee</span>
                          <strong className="text-success fs-5 d-flex align-items-center">
                            <FaRupeeSign size={16} />
                            {test.price}
                          </strong>
                        </div>

                        <div className="small text-muted d-flex align-items-center gap-2 mb-1">
                          <FaClock className="text-primary flex-shrink-0" />
                          <span>Turnaround: <strong>{test.reportTime || "24 Hours"}</strong></span>
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
                  <h4>No Tests Found</h4>
                  <p className="text-muted">No diagnostic tests match your current search.</p>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                  >
                    Reset Filter
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

export default LabTests;
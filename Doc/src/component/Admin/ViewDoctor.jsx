import React, { useEffect, useState } from "react";
import {Button,Card,Container,Table,Image,Badge,Form,Row,Col,Modal,Spinner,InputGroup,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {FaUserMd,FaSearch,FaPlus,FaEdit,FaTrash,FaEye,FaClock,FaHospital,FaGraduationCap,FaRupeeSign,FaPhoneAlt,FaEnvelope,FaMapMarkerAlt,FaCalendarAlt,} from "react-icons/fa";
import API from "../../api/axiosConfig";

function ViewDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpec, setFilterSpec] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // const res = await axios.get("http://localhost:5000/api/admin/viewDoctors");
      const res = await API.get("/api/admin/viewDoctors");
      console.log("Doctors fetched:", res.data);
      if (res.data?.result) {
        setDoctors(res.data.result);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doctorId, doctorName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Dr. ${doctorName || "this doctor"}? This will also remove their doctor account.`
    );
    if (!confirmDelete) return;

    try {
      // const res = await axios.delete(`http://localhost:5000/api/admin/deleteDoctor/${doctorId}`);
      const res = await API.delete(`/api/admin/deleteDoctor/${doctorId}`);
      alert(res.data?.message || "Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert(err.response?.data?.message || "Failed to delete doctor");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization).filter(Boolean))
  );

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(doc.phone || "").includes(searchTerm);

    const matchesSpec =
      filterSpec === "all" || doc.specialization === filterSpec;

    return matchesSearch && matchesSpec;
  });

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  return (
    <>
      <AdminNav />

      <Container fluid className="py-4 px-lg-5 bg-light min-vh-100">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
              <FaUserMd /> Doctor Management
            </h2>
            <p className="text-muted mb-0">
              View, search, edit, and manage all registered doctors in the clinic network
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              as={Link}
              to="/registerdoctor"
              variant="primary"
              className="d-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
            >
              <FaPlus /> Register New Doctor
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-3">
            <Row className="g-3 align-items-center">
              <Col md={6} lg={5}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, specialty, hospital, phone, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </Col>

              <Col md={4} lg={4}>
                <Form.Select
                  value={filterSpec}
                  onChange={(e) => setFilterSpec(e.target.value)}
                >
                  <option value="all">All Specializations ({doctors.length})</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2} lg={3} className="text-md-end">
                <Badge bg="primary" className="p-2 fs-6 fw-normal rounded-3">
                  Showing {filteredDoctors.length} of {doctors.length} Doctors
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading doctor directory...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-5">
              <FaUserMd className="text-muted fs-1 mb-3" />
              <h5 className="fw-bold text-secondary">No doctors found</h5>
              <p className="text-muted mb-3">
                {searchTerm || filterSpec !== "all"
                  ? "Try adjusting your search criteria or filter."
                  : "No doctors have been registered yet."}
              </p>
              <Button
                as={Link}
                to="/registerdoctor"
                variant="outline-primary"
                className="rounded-pill px-4"
              >
                Register First Doctor
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover responsive className="align-middle mb-0 text-nowrap">
                <thead
                  style={{
                    backgroundColor: "#f8fafc",
                    borderBottom: "2px solid #e2e8f0",
                  }}
                >
                  <tr className="text-secondary small text-uppercase">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">Doctor</th>
                    <th className="py-3 px-3">Specialization</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Hospital / Clinic</th>
                    <th className="py-3 px-3">Fee & Exp</th>
                    <th className="py-3 px-3">Availability</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc, idx) => (
                    <tr key={doc._id}>
                      <td className="px-3 fw-medium text-muted">{idx + 1}</td>
                      <td className="px-3">
                        <div className="d-flex align-items-center gap-3">
                          <Image
                            src={
                              doc.image
                                // ? `http://localhost:5000/uploads/${doc.image}`
                                ? `${API.defaults.baseURL}/uploads/${doc.image}`
                                : "https://via.placeholder.com/60"
                            }
                            roundedCircle
                            width="48"
                            height="48"
                            style={{
                              objectFit: "cover",
                              border: "2px solid #e2e8f0",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                            }}
                          />
                          <div>
                            <div className="fw-bold text-dark">{doc.name}</div>
                            <small className="text-muted">
                              {doc.qualification || "MBBS"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="px-3">
                        <Badge
                          bg="info"
                          className="bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1 rounded-pill"
                        >
                          {doc.specialization || "General Physician"}
                        </Badge>
                      </td>
                      <td className="px-3">
                        <div>
                          <small className="d-block text-dark">
                            <FaPhoneAlt className="me-1 text-muted" size={12} />
                            {doc.phone}
                          </small>
                          <small className="text-muted">
                            <FaEnvelope className="me-1 text-muted" size={12} />
                            {doc.email}
                          </small>
                        </div>
                      </td>
                      <td className="px-3">
                        <div className="d-flex align-items-center gap-1 text-secondary">
                          <FaHospital className="text-primary opacity-75" />
                          <span>{doc.hospital || "Main Clinic"}</span>
                        </div>
                      </td>
                      <td className="px-3">
                        <div className="fw-semibold text-dark">
                          ₹{doc.fees ?? 0}
                        </div>
                        <small className="text-muted">
                          {doc.experience ?? 0} yrs exp
                        </small>
                      </td>
                      <td className="px-3">
                        <div style={{ maxWidth: "220px" }}>
                          <small className="d-block text-secondary text-truncate">
                            {Array.isArray(doc.available) && doc.available.length > 0
                              ? doc.available.join(", ")
                              : "Mon - Sat"}
                          </small>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FaClock size={11} />
                            {doc.availableFrom && doc.availableTo
                              ? `${doc.availableFrom} - ${doc.availableTo}`
                              : "Standard Hours"}
                          </small>
                        </div>
                      </td>
                      <td className="px-3 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Quick View Details"
                            onClick={() => handleViewDetails(doc)}
                            className="rounded-3 px-2 py-1"
                          >
                            <FaEye />
                          </Button>

                          <Button
                            variant="warning"
                            size="sm"
                            title="Edit Doctor"
                            onClick={() => navigate(`/editdoctor/${doc._id}`)}
                            className="rounded-3 px-2 py-1 text-dark fw-semibold"
                          >
                            <FaEdit className="me-1" /> Edit
                          </Button>

                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Manage Token Schedules"
                            onClick={() => navigate("/tokenlist", { state: { doctorId: doc._id } })}
                            className="rounded-3 px-2 py-1"
                          >
                            Tokens
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            title="Delete Doctor"
                            onClick={() => deleteDoctor(doc._id, doc.name)}
                            className="rounded-3 px-2 py-1"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

   
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold text-primary d-flex align-items-center gap-2">
            <FaUserMd /> Doctor Profile Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedDoctor && (
            <Row className="g-4">
              <Col md={4} className="text-center">
                <Image
                  src={
                    selectedDoctor.image
                      ? `${API.defaults.baseURL}/uploads/${selectedDoctor.image}`
                      : "https://via.placeholder.com/150"
                  }
                  roundedCircle
                  width="130"
                  height="130"
                  style={{ objectFit: "cover", border: "4px solid #e2e8f0" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
                  }}
                  className="shadow-sm mb-3"
                />
                <h5 className="fw-bold mb-1">{selectedDoctor.name}</h5>
                <Badge bg="primary" className="mb-2">
                  {selectedDoctor.specialization}
                </Badge>
                <div className="text-muted small">
                  {selectedDoctor.qualification}
                </div>
                <div className="fw-semibold text-success mt-2">
                  ₹{selectedDoctor.fees} / consultation
                </div>
              </Col>

              <Col md={8}>
                <h6 className="fw-bold text-secondary border-bottom pb-2">
                  Personal & Contact Details
                </h6>
                <Row className="mb-3 small">
                  <Col sm={6} className="mb-2">
                    <strong>Email:</strong> {selectedDoctor.email}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Phone:</strong> {selectedDoctor.phone}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Gender:</strong> {selectedDoctor.gender || "N/A"}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Date of Birth:</strong> {selectedDoctor.dob || "N/A"}
                  </Col>
                  <Col sm={12} className="mb-2">
                    <strong>Address:</strong> {selectedDoctor.address || "N/A"}
                  </Col>
                </Row>

                <h6 className="fw-bold text-secondary border-bottom pb-2">
                  Professional Information
                </h6>
                <Row className="mb-3 small">
                  <Col sm={6} className="mb-2">
                    <strong>Hospital / Clinic:</strong> {selectedDoctor.hospital}
                  </Col>
                  <Col sm={6} className="mb-2">
                    <strong>Experience:</strong> {selectedDoctor.experience} Years
                  </Col>
                  <Col sm={12} className="mb-2">
                    <strong>Available Days:</strong>{" "}
                    {Array.isArray(selectedDoctor.available)
                      ? selectedDoctor.available.join(", ")
                      : selectedDoctor.available}
                  </Col>
                  <Col sm={12} className="mb-2">
                    <strong>Timing:</strong> {selectedDoctor.availableFrom} -{" "}
                    {selectedDoctor.availableTo}
                  </Col>
                </Row>

                {selectedDoctor.about && (
                  <>
                    <h6 className="fw-bold text-secondary border-bottom pb-2">
                      About Doctor
                    </h6>
                    <p className="text-muted small mb-0">
                      {selectedDoctor.about}
                    </p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="rounded-pill px-4"
          >
            Close
          </Button>
          {selectedDoctor && (
            <Button
              variant="warning"
              onClick={() => {
                setShowModal(false);
                navigate(`/editdoctor/${selectedDoctor._id}`);
              }}
              className="rounded-pill px-4 fw-semibold"
            >
              <FaEdit className="me-1" /> Edit Doctor
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewDoctor;

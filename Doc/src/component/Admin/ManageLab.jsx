import React, { useState, useEffect } from "react";
import {Button,Card,Col,Container,Form,Modal,Row,Table,Badge,Spinner,Alert,InputGroup,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import {FaFlask,FaPlus,FaEdit,FaTrash,FaSearch,FaMapMarkerAlt,FaClock,FaShieldAlt,FaPhoneAlt,FaEnvelope,FaLock,FaImage,FaEye,FaExternalLinkAlt,FaCheckCircle,FaTimesCircle,} from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

function ManageLab() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
    timing: "07:00 AM - 08:30 PM",
    accreditation: "NABL & ICMR Approved",
    rating: 4.8,
    description: "Full-service diagnostic center and clinical pathology.",
    features: "Home Sample Collection, Online Digital Reports, Certified Pathologists",
    status: "Active",
  });
  const [addImageFile, setAddImageFile] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLabId, setEditLabId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
    timing: "",
    // accreditation: "",
    rating: 4.8,
    description: "",
    features: "",
    status: "Active",
    existingImage: "",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // Submitting spinner & alerts
  const [submitting, setSubmitting] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: "", message: "" });

  useEffect(() => {
    fetchLabs();
  }, []);

  const showAlert = (variant, message) => {
    setAlertInfo({ show: true, variant, message });
    setTimeout(() => {
      setAlertInfo({ show: false, variant: "", message: "" });
    }, 4500);
  };

  const fetchLabs = async () => {
    try {
      setLoading(true);
      // const res = await axios.get("http://localhost:5000/api/lab/all-labs");
      const res = await API.get("/api/lab/all-labs");
      if (res.data?.success) {
        setLabs(res.data.result || []);
      }
    } catch (err) {
      console.error("Error fetching labs:", err);
      showAlert("danger", "Failed to fetch diagnostic laboratories");
    } finally {
      setLoading(false);
    }
  };

  // Image Selection Handlers
  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImageFile(file);
      setAddImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddLabSubmit = async (e) => {
    e.preventDefault();

    if (!addFormData.name || !addFormData.phone || !addFormData.address || !addFormData.email) {
      showAlert("warning", "Please fill all required fields (Lab Name, Phone, Address, Email)");
      return;
    }

    if (addFormData.password !== addFormData.confirmPassword) {
      showAlert("danger", "Password and Confirm Password do not match!");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", addFormData.name);
      formData.append("phone", addFormData.phone);
      formData.append("address", addFormData.address);
      formData.append("city", addFormData.city);
      formData.append("email", addFormData.email);
      formData.append("password", addFormData.password);
      formData.append("confirmPassword", addFormData.confirmPassword);
      formData.append("timing", addFormData.timing);
      // formData.append("accreditation", addFormData.accreditation);
      formData.append("rating", addFormData.rating);
      formData.append("description", addFormData.description);
      formData.append("features", addFormData.features);
      formData.append("status", addFormData.status);

      if (addImageFile) {
        formData.append("image", addImageFile);
      }

      // const res = await axios.post("http://localhost:5000/api/lab/admin/add-lab", formData);
      const res = await API.post("/api/lab/admin/add-lab", formData);
      if (res.data?.success) {
        showAlert("success", res.data.message || "Laboratory added successfully!");
        setShowAddModal(false);
        // Reset form
        setAddFormData({
          name: "",
          phone: "",
          address: "",
          city: "",
          email: "",
          password: "",
          confirmPassword: "",
          timing: "07:00 AM - 08:30 PM",
          // accreditation: "NABL & ICMR Approved",
          rating: 4.8,
          description: "Full-service diagnostic center and clinical pathology.",
          features: "Home Sample Collection, Online Digital Reports, Certified Pathologists",
          status: "Active",
        });
        setAddImageFile(null);
        setAddImagePreview(null);
        fetchLabs();
      }
    } catch (err) {
      console.error("Error creating lab:", err);
      showAlert("danger", err.response?.data?.message || "Failed to add laboratory");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (lab) => {
    setEditLabId(lab._id);
    setEditFormData({
      name: lab.name || "",
      phone: lab.phone || "",
      address: lab.address || "",
      city: lab.city || "",
      email: lab.email || "",
      password: "",
      confirmPassword: "",
      timing: lab.timing || "07:00 AM - 08:30 PM",
      accreditation: lab.accreditation || "NABL & ICMR Approved",
      rating: lab.rating || 4.8,
      description: lab.description || "",
      features: Array.isArray(lab.features) ? lab.features.join(", ") : lab.features || "",
      status: lab.status || "Active",
      existingImage: lab.image || "",
    });
    setEditImageFile(null);
    // setEditImagePreview(lab.image ? `http://localhost:5000/uploads/${lab.image}` : null);
    setEditImagePreview(lab.image ? `${API.defaults.baseURL}/uploads/${lab.image}` : null);
    setShowEditModal(true);
  };

  // Handle Edit Lab Form Submit
  const handleEditLabSubmit = async (e) => {
    e.preventDefault();

    if (!editFormData.name || !editFormData.phone || !editFormData.address || !editFormData.email) {
      showAlert("warning", "Lab name, phone, address and email are required");
      return;
    }

    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      showAlert("danger", "Password and Confirm Password do not match!");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("phone", editFormData.phone);
      formData.append("address", editFormData.address);
      formData.append("city", editFormData.city);
      formData.append("email", editFormData.email);
      if (editFormData.password) {
        formData.append("password", editFormData.password);
        formData.append("confirmPassword", editFormData.confirmPassword);
      }
      formData.append("timing", editFormData.timing);
      formData.append("accreditation", editFormData.accreditation);
      formData.append("rating", editFormData.rating);
      formData.append("description", editFormData.description);
      formData.append("features", editFormData.features);
      formData.append("status", editFormData.status);

      if (editImageFile) {
        formData.append("image", editImageFile);
      }

      // const res = await axios.put(`http://localhost:5000/api/lab/admin/update-lab/${editLabId}`,formData);
      const res = await API.put(`/api/lab/admin/update-lab/${editLabId}`,formData);
      if (res.data?.success) {
        showAlert("success", res.data.message || "Laboratory updated successfully!");
        setShowEditModal(false);
        fetchLabs();
      }
    } catch (err) {
      console.error("Error updating lab:", err);
      showAlert("danger", err.response?.data?.message || "Failed to update laboratory");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Lab
  const handleDeleteLab = async (labId, labName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${labName}"? All tests, staff, and bookings associated with this laboratory will also be deleted.`
      )
    ) {
      try {
        // const res = await axios.delete(`http://localhost:5000/api/lab/admin/delete-lab/${labId}`);
        const res = await API.delete(`/api/lab/admin/delete-lab/${labId}`);
        if (res.data?.success) {
          showAlert("success", res.data.message || "Laboratory deleted successfully");
          fetchLabs();
        }
      } catch (err) {
        console.error("Error deleting lab:", err);
        showAlert("danger", err.response?.data?.message || "Failed to delete laboratory");
      }
    }
  };

  // Filtered labs
  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.name?.toLowerCase().includes(search.toLowerCase()) ||
      lab.address?.toLowerCase().includes(search.toLowerCase()) ||
      lab.phone?.toLowerCase().includes(search.toLowerCase()) ||
      lab.email?.toLowerCase().includes(search.toLowerCase()) ||
      lab.city?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || lab.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = labs.filter((l) => l.status === "Active").length;
  const totalTestsCount = labs.reduce((sum, l) => sum + (l.totalTests || l.testCount || 0), 0);
  const totalStaffCount = labs.reduce((sum, l) => sum + (l.staffCount || 0), 0);

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <AdminNav />

      {/* Header Banner */}
      <div
        className="py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
      >
        <Container fluid className="px-lg-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <div
                  className="d-flex align-items-center justify-content-center bg-white text-primary rounded-circle shadow-sm"
                  style={{ width: "42px", height: "42px" }}
                >
                  <FaFlask className="fs-5" />
                </div>
                <h2 className="fw-bold mb-0">Manage Diagnostic Laboratories</h2>
              </div>
              <p className="text-white-50 mb-0 ps-md-5">
                Register new labs, edit existing laboratory details, view credentials, and monitor diagnostic operations.
              </p>
            </div>

            <Button
              variant="light"
              className="fw-bold px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2 text-primary hover-scale"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add New Lab
            </Button>
          </div>
        </Container>
      </div>

      <Container fluid className="px-lg-5 py-4">
        {/* Alert notification */}
        {alertInfo.show && (
          <Alert
            variant={alertInfo.variant}
            dismissible
            onClose={() => setAlertInfo({ show: false, variant: "", message: "" })}
            className="shadow-sm border-0 rounded-3 mb-4"
          >
            {alertInfo.message}
          </Alert>
        )}

        {/* Quick Metrics */}
        <Row className="g-3 mb-4">
          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium">Total Laboratories</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{labs.length}</h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaFlask size={22} />
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium">Active Laboratories</span>
                  <h3 className="fw-bold text-success mt-1 mb-0">{activeCount}</h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaCheckCircle size={22} />
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium">Diagnostic Tests</span>
                  <h3 className="fw-bold text-info mt-1 mb-0">{totalTestsCount}</h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaShieldAlt size={22} />
                </div>
              </div>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium">Registered Staff</span>
                  <h3 className="fw-bold text-warning mt-1 mb-0">{totalStaffCount}</h3>
                </div>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaPhoneAlt size={22} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filter Controls & Search */}
        <Card className="border-0 shadow-sm rounded-4 mb-4">
          <Card.Body className="p-3">
            <Row className="g-3 align-items-center">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-light border-0 ps-3">
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by lab name, location, address, email, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 bg-light py-2"
                  />
                  {search && (
                    <Button
                      variant="light"
                      className="border-0 text-muted"
                      onClick={() => setSearch("")}
                    >
                      Clear
                    </Button>
                  )}
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-light border-0 py-2"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </Form.Select>
              </Col>

              <Col md={3} className="text-md-end text-muted small">
                Showing <strong>{filteredLabs.length}</strong> of <strong>{labs.length}</strong> Labs
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Labs Table */}
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <FaFlask className="text-primary" /> Registered Laboratories Table
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-3"
              onClick={fetchLabs}
            >
              Refresh
            </Button>
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading laboratories...</p>
              </div>
            ) : filteredLabs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FaFlask size={48} className="mb-3 text-secondary opacity-50" />
                <h5>No Laboratories Found</h5>
                <p className="small mb-3">No laboratories match your current search or filter criteria.</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-pill px-4"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus className="me-1" /> Add Laboratory
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover align="middle" className="mb-0 text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Laboratory</th>
                      <th>Location / Address</th>
                      <th>Contact Info</th>
                      <th>Timings & Rating</th>
                      <th>Tests / Staff</th>
                      <th>Status</th>
                      <th className="text-center pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLabs.map((lab, index) => (
                      <tr key={lab._id}>
                        <td className="ps-4 text-muted fw-semibold">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {lab.image ? (
                              <img
                                // src={`http://localhost:5000/uploads/${lab.image}`}
                                src={`${API.defaults.baseURL}/uploads/${lab.image}`}
                                alt={lab.name}
                                width="50"
                                height="50"
                                className="rounded-3 shadow-sm border object-fit-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=100&auto=format&fit=crop&q=60";
                                }}
                              />
                            ) : (
                              <div
                                className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center shadow-sm"
                                style={{ width: "50px", height: "50px" }}
                              >
                                <FaFlask size={20} />
                              </div>
                            )}
                            {/* <div>
                              <div className="fw-bold text-dark fs-6">{lab.name}</div>
                              {lab.accreditation && (
                                <Badge bg="light" className="text-dark border px-2 py-1 fw-normal small">
                                  <FaShieldAlt className="text-primary me-1" />
                                  {lab.accreditation}
                                </Badge>
                              )}
                            </div> */}
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="d-flex align-items-center gap-1 text-dark fw-medium">
                              <FaMapMarkerAlt className="text-danger flex-shrink-0" />
                              <span style={{ maxWidth: "230px" }} className="text-truncate d-inline-block">
                                {lab.address}
                              </span>
                            </div>
                            {lab.city && <span className="text-muted ms-3 small">({lab.city})</span>}
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="d-flex align-items-center gap-1 text-dark">
                              <FaPhoneAlt className="text-success small" />
                              <span>{lab.phone}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1 text-muted">
                              <FaEnvelope className="text-secondary small" />
                              <span>{lab.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="d-flex align-items-center gap-1 text-muted">
                              <FaClock className="text-primary small" />
                              <span>{lab.timing || "07:00 AM - 08:30 PM"}</span>
                            </div>
                            <span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 mt-1">
                              {lab.rating || 4.8} / 5.0
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <Badge bg="info" className="me-1">
                              {lab.totalTests || lab.testCount || 0} Tests
                            </Badge>
                            <Badge bg="secondary">
                              {lab.staffCount || 0} Staff
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={lab.status === "Active" ? "success" : "secondary"}
                            className="px-3 py-1-5 rounded-pill fw-normal"
                          >
                            {lab.status}
                          </Badge>
                        </td>
                        <td className="pe-4 text-center">
                          <div className="d-inline-flex gap-2">
                            {/* Open Lab Module */}
                            {/* <Link
                              to={`/labdashboard?labId=${lab._id}`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-2-5 py-1 d-inline-flex align-items-center gap-1"
                              title="Open Lab Module (Manage Staff, Tests & Requests)"
                            >
                              <FaExternalLinkAlt size={12} /> Lab Module
                            </Link> */}

                            {/* Edit Button */}
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="rounded-circle p-2"
                              onClick={() => handleOpenEditModal(lab)}
                              title="Edit Laboratory"
                            >
                              <FaEdit size={14} />
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="rounded-circle p-2"
                              onClick={() => handleDeleteLab(lab._id, lab.name)}
                              title="Delete Laboratory"
                            >
                              <FaTrash size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <FaFlask size={18} />
            </div>
            <span>Add Laboratory</span>
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleAddLabSubmit}>
          <Modal.Body className="px-4 py-3">
            <p className="text-muted small mb-4">
              Enter lab details, address, credentials, and image. This creates a dedicated portal for the laboratory.
            </p>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Lab Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // placeholder="e.g. Apex Diagnostics & Pathology"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    // placeholder="e.g. +91 98765 43210"
                    value={addFormData.phone}
                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Location / Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full street address or location"
                    value={addFormData.address}
                    onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">City / Area</Form.Label>
                  <Form.Control
                    type="text"
                    // placeholder="e.g. Metro City"
                    value={addFormData.city}
                    onChange={(e) => setAddFormData({ ...addFormData, city: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Email Address (Login Username) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder=" contact@apexlab.com"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create password"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Confirm Password <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat password"
                    value={addFormData.confirmPassword}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, confirmPassword: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              {/* Lab Image File */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small d-flex align-items-center gap-1">
                    <FaImage className="text-primary" /> Lab Image / Facade Photo
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleAddImageChange}
                  />
                  {addImagePreview && (
                    <div className="mt-2 d-flex align-items-center gap-3 p-2 bg-light rounded-3">
                      <img
                        src={addImagePreview}
                        alt="Preview"
                        width="70"
                        height="50"
                        className="rounded object-fit-cover border"
                      />
                      <span className="small text-muted">Image selected for upload</span>
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Opening Timings</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 07:00 AM - 08:30 PM (Mon-Sun)"
                    value={addFormData.timing}
                    onChange={(e) => setAddFormData({ ...addFormData, timing: e.target.value })}
                  />
                </Form.Group>
              </Col>

              {/* <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Accreditation / Certifications</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. NABL & ICMR Approved, ISO 9001"
                    value={addFormData.accreditation}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, accreditation: e.target.value })
                    }
                  />
                </Form.Group>
              </Col> */}

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Features & Services (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    // placeholder="Home Sample Collection, Online Reports, Pathologist Consultation"
                    value={addFormData.features}
                    onChange={(e) => setAddFormData({ ...addFormData, features: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Status</Form.Label>
                  <Form.Select
                    value={addFormData.status}
                    onChange={(e) => setAddFormData({ ...addFormData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Lab Description / Overview</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    // placeholder="Brief description about laboratory facilities, analyzers, and specialties"
                    value={addFormData.description}
                    onChange={(e) =>
                      setAddFormData({ ...addFormData, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button
              variant="light"
              className="rounded-pill px-4"
              onClick={() => setShowAddModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-pill px-4 fw-semibold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" /> Saving...
                </>
              ) : (
                "Save Laboratory"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ================= EDIT LAB MODAL ================= */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <div
              className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <FaEdit size={16} />
            </div>
            <span>Edit Laboratory Details</span>
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleEditLabSubmit}>
          <Modal.Body className="px-4 py-3">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Lab Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Location / Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">City</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Change Password (optional)</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new"
                    value={editFormData.confirmPassword}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, confirmPassword: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Update Lab Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  {editImagePreview && (
                    <div className="mt-2 d-flex align-items-center gap-3 p-2 bg-light rounded-3">
                      <img
                        src={editImagePreview}
                        alt="Current/Selected"
                        width="70"
                        height="50"
                        className="rounded object-fit-cover border"
                      />
                      <span className="small text-muted">Lab Photo Preview</span>
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Timings</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.timing}
                    onChange={(e) => setEditFormData({ ...editFormData, timing: e.target.value })}
                  />
                </Form.Group>
              </Col>

              {/* <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Accreditation</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.accreditation}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, accreditation: e.target.value })
                    }
                  />
                </Form.Group>
              </Col> */}

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Features </Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.features}
                    onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Status</Form.Label>
                  <Form.Select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0 px-4 pb-4">
            <Button
              variant="light"
              className="rounded-pill px-4"
              onClick={() => setShowEditModal(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-pill px-4 fw-semibold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" /> Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageLab;

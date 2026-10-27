import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container,Form, Modal, Row, Spinner, Table} from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import {FaFlask, FaPlus, FaEdit, FaTrash, FaFileMedical, FaArrowLeft} from "react-icons/fa";
import LabNav from "../Doctor/DoctorNav";
import API from "../../api/axiosConfig";

// const API = "http://localhost:5000/api/lab";

const statuses = [

  "Pending", "Accepted", "Rejected",

  "Sample Collected", "Processing",

  "Completed", "Cancelled"

];

const emptyTest = {

  testName: "",

  category: "Blood Test",

  price: "",

  reportTime: "24 Hours",

  preparation: "Fasting not required",

  description: "",

  status: "Available"

};

function LabModule() {

  const location = useLocation();

  const queryLabId = new URLSearchParams(location.search).get("labId") || "";

  const [labs, setLabs] = useState([]);

  const [labId, setLabId] = useState(

    queryLabId || localStorage.getItem("lab") || ""

  );

  const [lab, setLab] = useState(null);

  const [tests, setTests] = useState([]);

  const [staff, setStaff] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [stats, setStats] = useState({});

  const [activeTab, setActiveTab] = useState("requests");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const [showTestModal, setShowTestModal] = useState(false);

  const [editingTestId, setEditingTestId] = useState("");

  const [testForm, setTestForm] = useState(emptyTest);

  const [showStaffModal, setShowStaffModal] = useState(false);

  const [staffForm, setStaffForm] = useState({

    name: "",

    phone: "",

    email: "",

    role: "Lab Technician",

    qualification: "",

    experience: ""

  });

  const [staffImage, setStaffImage] = useState(null);
  const [reportBooking, setReportBooking] = useState(null);
  const [reportForm, setReportForm] = useState({

    result: "",
    remarks: "",
    file: null

  });

  useEffect(() => {

    if (queryLabId || localStorage.getItem("lab")) return;

    API.get("/api/lab/all-labs")

      .then((res) => {

        if (res.data.success) {

          setLabs(res.data.result || []);

        }

      })

      .catch((err) => {

        setError(err.response?.data?.message || "Could not load laboratories.");

      })

      .finally(() => setLoading(false));

  }, [queryLabId]);

  const loadModule = async () => {

    if (!labId) {

      setLoading(false);

      return;

    }

    setLoading(true);

    setError("");

    try {

      // const labRes = await axios.get(`${API}/labs/${labId}`);
      const labRes = await API.get(`/api/lab/labs/${labId}`);

      // const bookingRes = await axios.get(`${API}/requests/${labId}`);
      const bookingRes = await API.get(`/api/lab/requests/${labId}`);

      // const statsRes = await axios.get(`${API}/stats`, {
      const statsRes = await API.get(`/api/lab/stats`, {

        params: { labId }

      });

      if (!labRes.data.success ||

          !bookingRes.data.success ||

          !statsRes.data.success) {

        throw new Error("Could not load laboratory details.");

      }

      setLab(labRes.data.result.lab);
      setTests(labRes.data.result.tests || []);
      setStaff(labRes.data.result.staff || []);
      setBookings(bookingRes.data.result || []);
      setStats(statsRes.data.result || {});
    } catch (err) {

      setError(err.response?.data?.message || err.message);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadModule();

  }, [labId]);

  const openAddTest = () => {

    setEditingTestId("");

    setTestForm({ ...emptyTest });

    setShowTestModal(true);

  };


  const openEditTest = (test) => {

    setEditingTestId(test._id);

    setTestForm({

      testName: test.testName || "",

      category: test.category || "Blood Test",

      price: test.price ?? "",

      reportTime: test.reportTime || "24 Hours",

      preparation: test.preparation || "",

      description: test.description || "",

      status: test.status || "Available"

    });

    setShowTestModal(true);

  };


  const saveTest = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError("");

    try {

      const data = {

        ...testForm,

        labId,

        labName: lab?.name

      };

      let res;

      if (editingTestId) {

        res = await API.put(`/api/lab/update-test/${editingTestId}`, data);

      } else {

        res = await API.post(`/api/lab/add-test`, data);

      }

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not save test.");

      }

      setShowTestModal(false);

      setNotice(res.data.message || "Test saved successfully.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    } finally {

      setSubmitting(false);

    }

  };

 
  const toggleTest = async (id) => {

    try {

      const res = await API.patch(`/api/lab/status-test/${id}`);

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not update test.");

      }

      setNotice(res.data.message || "Test status updated.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    }

  };

  const deleteTest = async (test) => {

    if (!window.confirm(`Delete ${test.testName}?`)) return;

    try {

      const res = await API.delete(
        `/api/lab/delete-test/${test._id}`
      );

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not delete test.");

      }

      setNotice(res.data.message || "Test deleted.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    }

  };

  // Add laboratory staff

  const saveStaff = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError("");

    try {

      const data = new FormData();

      Object.entries({ ...staffForm, labId }).forEach(([key, value]) => {

        data.append(key, value);

      });

      if (staffImage) {

        data.append("image", staffImage);

      }

      const res = await API.post(`/api/lab/staff/add`, data);

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not add staff.");

      }

      setShowStaffModal(false);

      setStaffForm({

        name: "",

        phone: "",

        email: "",

        role: "Lab Technician",

        qualification: "",

        experience: ""

      });

      setStaffImage(null);

      setNotice(res.data.message || "Staff added successfully.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    } finally {

      setSubmitting(false);

    }

  };

  const deleteStaff = async (member) => {

    if (!window.confirm(`Remove ${member.name}?`)) return;

    try {

      const res = await API.delete(`/api/lab/staff/${member._id}`);

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not remove staff.");

      }

      setNotice(res.data.message || "Staff removed.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    }

  };

  const changeBookingStatus = async (id, status) => {

    try {

      const res = await API.patch(`/api/lab/status/${id}`, { status });

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not update status.");

      }

      setNotice(res.data.message || "Booking status updated.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    }

  };

  const openReport = (booking) => {

    setReportBooking(booking);

    setReportForm({

      result: booking.result || "",

      remarks: booking.remarks || "",

      file: null

    });

  };

  const submitReport = async (e) => {

    e.preventDefault();

    if (!reportForm.result.trim() && !reportForm.file) {

      setError("Enter a result or select a report file.");

      return;

    }

    setSubmitting(true);

    setError("");

    try {

      const data = new FormData();

      data.append("result", reportForm.result);

      data.append("remarks", reportForm.remarks);

      if (reportForm.file) {

        data.append("reportFile", reportForm.file);

      }

      const res = await API.post(
        `/api/lab/report/${reportBooking._id}`, data
      );

      if (!res.data.success) {

        throw new Error(res.data.message || "Could not send report.");

      }

      setReportBooking(null);

      setNotice(res.data.message || "Report delivered successfully.");

      await loadModule();

    } catch (err) {

      setError(err.response?.data?.message || err.message);

    } finally {

      setSubmitting(false);

    }

  };

  return (
<>
<LabNav/>
 <div className="bg-light min-vh-100">
     
      <Container fluid className="px-lg-5 py-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">

          <div>

            <h2 className="fw-bold">Laboratory Operations</h2>

            <p className="text-muted">

              Manage tests, staff, patient bookings and reports.

            </p>

          </div>

         
        </div>

        {/* Select laboratory */}

        {!queryLabId && !localStorage.getItem("lab") && (

          <Card className="mb-4">

            <Card.Body>

              <Form.Label>Choose a laboratory</Form.Label>

              <Form.Select

                value={labId}

                onChange={(e) => setLabId(e.target.value)}

              >

                <option value="">Select laboratory</option>

                {labs.map((item) => (

                  <option key={item._id} value={item._id}>

                    {item.name}

                  </option>

                ))}

              </Form.Select>

            </Card.Body>

          </Card>

        )}

        {error && (

          <Alert variant="danger" dismissible onClose={() => setError("")}>

            {error}

          </Alert>

        )}

        {notice && (

          <Alert variant="success" dismissible onClose={() => setNotice("")}>

            {notice}

          </Alert>

        )}

        {loading ? (

          <div className="text-center p-5">

            <Spinner animation="border" />

          </div>

        ) : !labId ? (

          <Alert variant="info">Please select a laboratory.</Alert>

        ) : !lab ? (

          <Alert variant="warning">Laboratory not found.</Alert>

        ) : (

          <>

            {/* Laboratory details */}

            <Card className="mb-4 border-0 shadow-sm">

              <Card.Body className="d-flex align-items-center gap-3">

                {lab.image ? (

                  <img

                    // src={`http://localhost:5000/uploads/${lab.image}`}
                    src={`${API.defaults.baseURL}/uploads/${lab.image}`}

                    alt={lab.name}

                    width="65"

                    height="65"

                    className="rounded object-fit-cover"

                  />

                ) : (

                  <FaFlask size={40} className="text-primary" />

                )}

                <div>

                  <h4>{lab.name}</h4>

                  <p className="text-muted mb-0">

                    {lab.address} {lab.city}

                  </p>

                </div>

                <Badge bg={lab.status === "Active" ? "success" : "secondary"}

                  className="ms-auto">

                  {lab.status}

                </Badge>

              </Card.Body>

            </Card>

            {/* Summary */}

            <Row className="g-3 mb-4">

              {[

                ["Requests", stats.totalBookings || 0],

                ["Pending", stats.pending || 0],

                ["Tests", stats.totalTests || 0],

                ["Staff", stats.totalStaff || 0]

              ].map(([label, value]) => (

                <Col xs={6} lg={3} key={label}>

                  <Card className="border-0 shadow-sm h-100">

                    <Card.Body>

                      <p className="text-muted mb-1">{label}</p>

                      <h3>{value}</h3>

                    </Card.Body>

                  </Card>

                </Col>

              ))}

            </Row>

            {/* Tabs */}

            <Card className="border-0 shadow-sm">

              <Card.Header className="bg-white">

                <div className="d-flex flex-wrap gap-2 align-items-center">

                  <Button

                    variant={activeTab === "requests" ? "primary" : "outline-primary"}

                    onClick={() => setActiveTab("requests")}

                  >

                    Patient Requests

                  </Button>

                  <Button

                    variant={activeTab === "tests" ? "primary" : "outline-primary"}

                    onClick={() => setActiveTab("tests")}

                  >

                    Lab Tests

                  </Button>

                  <Button

                    variant={activeTab === "staff" ? "primary" : "outline-primary"}

                    onClick={() => setActiveTab("staff")}

                  >

                    Staff

                  </Button>

                  {activeTab === "tests" && (

                    <Button className="ms-auto" onClick={openAddTest}>

                      <FaPlus className="me-2" /> Add Test

                    </Button>

                  )}

                  {activeTab === "staff" && (

                    <Button className="ms-auto" onClick={() => setShowStaffModal(true)}>

                      <FaPlus className="me-2" /> Add Staff

                    </Button>

                  )}

                </div>

              </Card.Header>

              <Card.Body className="p-0">

                {/* Patient requests */}

                {activeTab === "requests" && (

                  bookings.length ? (

                    <div className="table-responsive">

                      <Table hover className="mb-0 align-middle">

                        <thead>

                          <tr>

                            <th>Patient</th>

                            <th>Test</th>

                            <th>Appointment</th>

                            <th>Status</th>

                            <th>Update</th>

                            <th>Report</th>

                          </tr>

                        </thead>

                        <tbody>

                          {bookings.map((booking) => (

                            <tr key={booking._id}>

                              <td>

                                {booking.patientName}

                                <div className="small text-muted">{booking.phone}</div>

                                <div className="small text-muted">{booking.email}</div>

                              </td>

                              <td>

                                {booking.testName}

                                <div className="small text-muted">

                                  {booking.category} · ₹{booking.price}

                                </div>

                              </td>

                              <td>

                                {booking.bookingDate}

                                <div>{booking.bookingTime}</div>

                              </td>

                              <td>

                                <Badge bg={

                                  booking.status === "Completed" ? "success" :

                                  booking.status === "Rejected" ? "danger" :

                                  "primary"

                                }>

                                  {booking.status}

                                </Badge>

                              </td>

                              <td>

                                <Form.Select

                                  size="sm"

                                  value={booking.status}

                                  onChange={(e) => changeBookingStatus(

                                    booking._id, e.target.value

                                  )}

                                >

                                  {statuses.map((status) => (

                                    <option key={status} value={status}>

                                      {status}

                                    </option>

                                  ))}

                                </Form.Select>

                              </td>

                              <td>

                                <Button

                                  size="sm"

                                  variant="outline-success"

                                  onClick={() => openReport(booking)}

                                >

                                  <FaFileMedical className="me-1" />

                                  {booking.status === "Completed" ? "Update" : "Send"}

                                </Button>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </Table>

                    </div>

                  ) : (

                    <p className="text-center text-muted p-5">

                      No patient requests found.

                    </p>

                  )

                )}

                {/* Laboratory tests */}

                {activeTab === "tests" && (

                  tests.length ? (

                    <div className="table-responsive">

                      <Table hover className="mb-0 align-middle">

                        <thead>

                          <tr>

                            <th>Test</th>

                            <th>Category</th>

                            <th>Price</th>

                            <th>Report Time</th>

                            <th>Status</th>

                            <th>Actions</th>

                          </tr>

                        </thead>

                        <tbody>

                          {tests.map((test) => (

                            <tr key={test._id}>

                              <td>

                                {test.testName}

                                <div className="small text-muted">

                                  {test.description}

                                </div>

                              </td>

                              <td>{test.category}</td>

                              <td>₹{test.price}</td>

                              <td>{test.reportTime}</td>

                              <td>

                                <Badge bg={test.status === "Available" ? "success" : "secondary"}>

                                  {test.status}

                                </Badge>

                              </td>

                              <td className="text-nowrap">

                                <Button

                                  size="sm"

                                  variant="outline-primary"

                                  className="me-1"

                                  onClick={() => openEditTest(test)}

                                >

                                  <FaEdit />

                                </Button>

                                <Button

                                  size="sm"

                                  variant="outline-secondary"

                                  className="me-1"

                                  onClick={() => toggleTest(test._id)}

                                >

                                  {test.status === "Available" ? "Disable" : "Enable"}

                                </Button>

                                <Button

                                  size="sm"

                                  variant="outline-danger"

                                  onClick={() => deleteTest(test)}

                                >

                                  <FaTrash />

                                </Button>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </Table>

                    </div>

                  ) : (

                    <p className="text-center text-muted p-5">

                      No tests added yet.

                    </p>

                  )

                )}

                {/* Laboratory staff */}

                {activeTab === "staff" && (

                  staff.length ? (

                    <div className="table-responsive">

                      <Table hover className="mb-0 align-middle">

                        <thead>

                          <tr>

                            <th>Name</th>

                            <th>Role</th>

                            <th>Contact</th>

                            <th>Qualification</th>

                            <th>Action</th>

                          </tr>

                        </thead>

                        <tbody>

                          {staff.map((member) => (

                            <tr key={member._id}>

                              <td>{member.name}</td>

                              <td>{member.role}</td>

                              <td>

                                {member.phone}

                                <div className="small text-muted">{member.email}</div>

                              </td>

                              <td>

                                {member.qualification || "—"}

                                {member.experience ? ` · ${member.experience}` : ""}

                              </td>

                              <td>

                                <Button

                                  size="sm"

                                  variant="outline-danger"

                                  onClick={() => deleteStaff(member)}

                                >

                                  <FaTrash className="me-1" /> Remove

                                </Button>

                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </Table>

                    </div>

                  ) : (

                    <p className="text-center text-muted p-5">

                      No staff added yet.

                    </p>

                  )

                )}

              </Card.Body>

            </Card>

          </>

        )}

      </Container>

      {/* Add or edit test */}

      <Modal show={showTestModal} onHide={() => setShowTestModal(false)} centered>

        <Form onSubmit={saveTest}>

          <Modal.Header closeButton>

            <Modal.Title>{editingTestId ? "Edit Test" : "Add Lab Test"}</Modal.Title>

          </Modal.Header>

          <Modal.Body>

            <Form.Group className="mb-3">

              <Form.Label>Test Name</Form.Label>

              <Form.Control

                required

                value={testForm.testName}

                onChange={(e) => setTestForm({

                  ...testForm, testName: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Category</Form.Label>

              <Form.Control

                required

                value={testForm.category}

                onChange={(e) => setTestForm({

                  ...testForm, category: e.target.value

                })}

              />

            </Form.Group>

            <Row>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>Price</Form.Label>

                  <Form.Control

                    type="number"

                    min="0"

                    step="0.01"

                    required

                    value={testForm.price}

                    onChange={(e) => setTestForm({

                      ...testForm, price: e.target.value

                    })}

                  />

                </Form.Group>

              </Col>

              <Col md={8}>

                <Form.Group className="mb-3">

                  <Form.Label>Report Time</Form.Label>

                  <Form.Control

                    value={testForm.reportTime}

                    onChange={(e) => setTestForm({

                      ...testForm, reportTime: e.target.value

                    })}

                  />

                </Form.Group>

              </Col>

            </Row>

            <Form.Group className="mb-3">

              <Form.Label>Preparation</Form.Label>

              <Form.Control

                value={testForm.preparation}

                onChange={(e) => setTestForm({

                  ...testForm, preparation: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Description</Form.Label>

              <Form.Control

                as="textarea"

                rows={2}

                value={testForm.description}

                onChange={(e) => setTestForm({

                  ...testForm, description: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group>

              <Form.Label>Availability</Form.Label>

              <Form.Select

                value={testForm.status}

                onChange={(e) => setTestForm({

                  ...testForm, status: e.target.value

                })}

              >

                <option value="Available">Available</option>

                <option value="Unavailable">Unavailable</option>

              </Form.Select>

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button variant="secondary" onClick={() => setShowTestModal(false)}>

              Cancel

            </Button>

            <Button type="submit" disabled={submitting}>

              {submitting ? "Saving..." : "Save Test"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

      {/* Add staff */}

      <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)} centered>

        <Form onSubmit={saveStaff}>

          <Modal.Header closeButton>

            <Modal.Title>Add Laboratory Staff</Modal.Title>

          </Modal.Header>

          <Modal.Body>

            <Form.Group className="mb-3">

              <Form.Label>Name</Form.Label>

              <Form.Control

                required

                value={staffForm.name}

                onChange={(e) => setStaffForm({

                  ...staffForm, name: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Role</Form.Label>

              <Form.Control

                value={staffForm.role}

                onChange={(e) => setStaffForm({

                  ...staffForm, role: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Phone</Form.Label>

              <Form.Control

                required

                type="tel"

                value={staffForm.phone}

                onChange={(e) => setStaffForm({

                  ...staffForm, phone: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Email</Form.Label>

              <Form.Control

                required

                type="email"

                value={staffForm.email}

                onChange={(e) => setStaffForm({

                  ...staffForm, email: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Qualification</Form.Label>

              <Form.Control

                value={staffForm.qualification}

                onChange={(e) => setStaffForm({

                  ...staffForm, qualification: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Experience</Form.Label>

              <Form.Control

                value={staffForm.experience}

                onChange={(e) => setStaffForm({

                  ...staffForm, experience: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group>

              <Form.Label>Photo (Optional)</Form.Label>

              <Form.Control

                type="file"

                accept="image/*"

                onChange={(e) => setStaffImage(e.target.files[0] || null)}

              />

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button variant="secondary" onClick={() => setShowStaffModal(false)}>

              Cancel

            </Button>

            <Button type="submit" disabled={submitting}>

              {submitting ? "Adding..." : "Add Staff"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

      {/* Patient report */}

      <Modal show={Boolean(reportBooking)} onHide={() => setReportBooking(null)} centered>

        <Form onSubmit={submitReport}>

          <Modal.Header closeButton>

            <Modal.Title>Patient Report</Modal.Title>

          </Modal.Header>

          <Modal.Body>

            <p className="text-muted">

              {reportBooking?.patientName} · {reportBooking?.testName}

            </p>

            <Form.Group className="mb-3">

              <Form.Label>Result / Findings</Form.Label>

              <Form.Control

                as="textarea"

                rows={4}

                value={reportForm.result}

                onChange={(e) => setReportForm({

                  ...reportForm, result: e.target.value

                })}

                placeholder="Enter test results"

              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Remarks</Form.Label>

              <Form.Control

                as="textarea"

                rows={2}

                value={reportForm.remarks}

                onChange={(e) => setReportForm({

                  ...reportForm, remarks: e.target.value

                })}

              />

            </Form.Group>

            <Form.Group>

              <Form.Label>Report File (PDF or Image)</Form.Label>

              <Form.Control

                type="file"

                accept=".pdf,image/*"

                onChange={(e) => setReportForm({

                  ...reportForm, file: e.target.files[0] || null

                })}

              />

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button variant="secondary" onClick={() => setReportBooking(null)}>

              Cancel

            </Button>

            <Button type="submit" variant="success" disabled={submitting}>

              {submitting ? "Sending..." : "Deliver Report"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </div>
</>
   

  );

}

export default LabModule;

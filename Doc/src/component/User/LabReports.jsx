import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import UserNav from "./UserNav";
import {
  FaFileMedical,
  FaEye,
  FaDownload,
  FaFlask,
  FaCheckCircle,
  FaClock,
  FaPaperclip,
  FaExclamationTriangle,
  FaClinicMedical,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

function LabReports() {
  const userId = localStorage.getItem("user");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserLabReports();
  }, [userId]);

  const fetchUserLabReports = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/lab/user/${userId}`);
      if (res.data?.success) {
        setReports(res.data.result || []);
      }
    } catch (err) {
      console.log("Error fetching user lab reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const getStatusBadge = (status) => {
    if (status === "Completed") {
      return (
        <Badge bg="success" className="px-3 py-1-5 rounded-pill fw-normal">
          <FaCheckCircle className="me-1" />
          Completed
        </Badge>
      );
    }
    if (status === "Processing" || status === "Sample Collected") {
      return (
        <Badge bg="info" text="dark" className="px-3 py-1-5 rounded-pill fw-normal">
          <FaClock className="me-1" />
          {status}
        </Badge>
      );
    }
    if (status === "Accepted") {
      return (
        <Badge bg="primary" className="px-3 py-1-5 rounded-pill fw-normal">
          Accepted
        </Badge>
      );
    }
    if (status === "Rejected" || status === "Cancelled") {
      return (
        <Badge bg="danger" className="px-3 py-1-5 rounded-pill fw-normal">
          <FaTimesCircle className="me-1" />
          {status}
        </Badge>
      );
    }
    return (
      <Badge bg="warning" text="dark" className="px-3 py-1-5 rounded-pill fw-normal">
        <FaClock className="me-1" />
        Pending
      </Badge>
    );
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <UserNav />

      {/* Header Banner */}
      <div
        className="py-4 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #09203f 0%, #537895 100%)" }}
      >
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <FaFileMedical className="fs-3 text-warning" />
                <h2 className="fw-bold mb-0">My Lab Test Requests & Reports</h2>
              </div>
              <p className="text-white-50 mb-0">
                Track status of requested diagnostic tests, view lab findings, and download certified pathology reports.
              </p>
            </div>

            <Button
              as={Link}
              to="/labs"
              variant="light"
              className="fw-bold px-4 py-2 rounded-pill shadow-sm text-primary"
            >
              <FaFlask className="me-1" /> Book Another Test
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <FaFlask className="text-primary" /> Test Appointment History
            </h5>
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-3"
              onClick={fetchUserLabReports}
            >
              Refresh
            </Button>
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Retrieving your diagnostic test records...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FaFileMedical size={45} className="mb-3 text-secondary opacity-50" />
                <h4>No Lab Appointments Yet</h4>
                <p className="small mb-3">You have not booked any lab tests through the portal yet.</p>
                <Button
                  as={Link}
                  to="/labs"
                  variant="primary"
                  className="rounded-pill px-4"
                >
                  Browse Diagnostic Laboratories
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover align="middle" className="mb-0 text-nowrap">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">#</th>
                      <th>Patient & Contact</th>
                      <th>Diagnostic Test</th>
                      <th>Laboratory</th>
                      <th>Schedule Slot</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th className="text-center pe-4">Action / Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="ps-4 text-muted fw-semibold">{idx + 1}</td>
                        <td>
                          <div className="fw-bold text-dark">{item.patientName}</div>
                          <div className="small text-muted">{item.phone}</div>
                        </td>
                        <td>
                          <div className="fw-semibold text-primary">{item.testName}</div>
                          <span className="badge bg-light text-dark border small fw-normal">
                            {item.category || "Clinical Test"}
                          </span>
                        </td>
                        <td>
                          <div className="fw-medium text-dark d-flex align-items-center gap-1">
                            <FaClinicMedical className="text-secondary small" />
                            {item.labName}
                          </div>
                        </td>
                        <td>
                          <div className="small fw-medium text-dark">{item.bookingDate}</div>
                          <div className="small text-muted">{item.bookingTime}</div>
                        </td>
                        <td>
                          <span className="fw-bold text-success">₹{item.price}</span>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td className="pe-4 text-center">
                          {item.status === "Completed" ? (
                            <Button
                              variant="success"
                              size="sm"
                              className="rounded-pill px-3 py-1-5 d-inline-flex align-items-center gap-1 shadow-sm"
                              onClick={() => viewReport(item)}
                            >
                              <FaEye size={13} /> View Report
                            </Button>
                          ) : item.attachmentFile ? (
                            <a
                              href={`http://localhost:5000/uploads/${item.attachmentFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1"
                            >
                              <FaPaperclip size={12} /> Prescription
                            </a>
                          ) : (
                            <span className="text-muted small fst-italic">Pending Lab</span>
                          )}
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

      {/* ================= VIEW REPORT MODAL ================= */}
      <Modal
        show={showModal}
        onHide={closeModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <div
              className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "38px", height: "38px" }}
            >
              <FaCheckCircle size={20} />
            </div>
            <span>Certified Diagnostic Report</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {selectedReport && (
            <div>
              {/* Header Info */}
              <div className="bg-light p-3 rounded-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold text-primary mb-0">{selectedReport.testName}</h5>
                  <Badge bg="success" className="rounded-pill px-3 py-1">
                    Verified Report
                  </Badge>
                </div>
                <div className="small text-muted">
                  Conducted by: <strong>{selectedReport.labName}</strong> | Patient:{" "}
                  <strong>{selectedReport.patientName}</strong>
                </div>
              </div>

              {/* Result Summary */}
              {selectedReport.result ? (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">Test Findings & Observations:</h6>
                  <div className="p-3 bg-white border rounded-3 text-dark small" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedReport.result}
                  </div>
                </div>
              ) : null}

              {/* Remarks */}
              {selectedReport.remarks ? (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">Pathologist / Doctor Remarks:</h6>
                  <div className="p-3 bg-light rounded-3 text-muted small fst-italic">
                    "{selectedReport.remarks}"
                  </div>
                </div>
              ) : null}

              {/* Uploaded File Link */}
              {selectedReport.reportFile ? (
                <div className="p-4 border border-dashed rounded-4 text-center bg-light">
                  <FaFileMedical size={36} className="text-primary mb-2" />
                  <h6 className="fw-bold text-dark mb-1">Official Report Document Available</h6>
                  <p className="text-muted small mb-3">
                    Download or open the certified pathology PDF/Image report stamped by the lab.
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedReport.reportFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 fw-semibold"
                  >
                    <FaDownload size={14} /> Open / Download Report File
                  </a>
                </div>
              ) : (
                <div className="text-muted small text-center py-2">
                  Summary delivered digitally. Physical report available upon request at laboratory.
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0">
          <Button variant="secondary" className="rounded-pill px-4" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LabReports;
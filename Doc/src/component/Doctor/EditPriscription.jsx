import React, { useEffect, useState } from "react";
import {Alert,Button,Card,Col,Container,Form,Row,Table,} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import DoctorNav from "./DoctorNav";
import API from "../../api/axiosConfig";

function EditPriscription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [appointment, setAppointment] = useState(
    location.state?.appointment || null
  );
  const [medicines, setMedicines] = useState([]);
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPrescription();
  }, [appointmentId]);

  const loadPrescription = async () => {
    try {
      setLoading(true);
      setError("");

      // const result = await axios.get(`http://localhost:5000/api/prescriptions/appointment/${appointmentId}` );
       const result = await API.get(`/api/prescriptions/appointment/${appointmentId}` );

      setMedicines(result.data.prescriptions || []);

      if (result.data.prescriptions?.length > 0) {
        setAppointment((previous) =>
          previous || result.data.prescriptions[0].appointmentId
        );
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setMedicines([]);
      } else {
        setError(
          err.response?.data?.message || "Failed to load prescription"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setMedicine("");
    setDosage("");
    setDuration("");
    setInstructions("");
    setEditingId(null);
  };

  const handleAddMedicine = async () => {
    if (
      !medicine.trim() ||
      !dosage.trim() ||
      !duration.trim()
    ) {
      setError("Please enter medicine name, dosage and duration.");
      return;
    }

    setError("");
    setSaving(true);
    const isEditing = Boolean(editingId);

    try {
      if (isEditing) {
        // await axios.put(`http://localhost:5000/api/prescriptions/update/${editingId}`,
        await API.put(`/api/prescriptions/update/${editingId}`,
          {
            medicine: medicine.trim(),
            dosage: dosage.trim(),
            duration: duration.trim(),
            instruction: instructions.trim() || "No instructions",
          }
        );

        await loadPrescription();
      } else {
        const doctorId = localStorage.getItem("doctor");

        const patientId =
          appointment?.patientId?._id ||
          appointment?.patientId ||
          appointment?.userId?._id ||
          appointment?.userId ||
          medicines[0]?.patientId;

        if (!patientId || !doctorId) {
          setError(
            "Patient ID or Doctor ID is missing. Please check your appointment data."
          );
          setSaving(false);
          return;
        }

        // await axios.post("http://localhost:5000/api/prescriptions/add",
         await API.post("/api/prescriptions/add",
          {
            appointmentId,
            patientId,
            doctorId,
            medicines: [
              {
                medicine: medicine.trim(),
                dosage: dosage.trim(),
                duration: duration.trim(),
                instruction: instructions.trim() || "No instructions",
              },
            ],
          }
        );

        await loadPrescription();
      }

      clearForm();
      if (isEditing) {
        navigate("/docappointments");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save medicine"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditMedicine = (item) => {
    setEditingId(item._id);
    setMedicine(item.medicine);
    setDosage(item.dosage);
    setDuration(item.duration);
    setInstructions(item.instruction || "");
    setError("");
  };

  const handleRemoveMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    try {
      setError("");

      // await axios.delete(`http://localhost:5000/api/prescriptions/delete/${id}`);
      await API.delete(`/api/prescriptions/delete/${id}`);

      setMedicines((previous) =>
        previous.filter((item) => item._id !== id)
      );

      if (editingId === id) {
        clearForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete medicine"
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      handleAddMedicine();
    }
  };

  const handleCancel = () => {
    navigate("/docappointments");
  };

  return (
    <>
      <DoctorNav />

      <Container className="py-5">
        <h2 className="fw-bold">Edit Prescription</h2>
        <p className="text-muted">
          Add, edit or remove medicines for the selected patient.
        </p>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <p className="text-center py-4">
            Loading prescription details...
          </p>
        ) : (
          <>
            {appointment && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="fw-bold mb-4">Patient Details</h5>

                  <Row>
                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Patient Name</p>
                      <h6 className="fw-bold">
                        {appointment.patientName || "Not available"}
                      </h6>
                    </Col>

                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Age</p>
                      <h6 className="fw-bold">
                        {appointment.age || "Not available"}
                      </h6>
                    </Col>

                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Phone</p>
                      <h6 className="fw-bold">
                        {appointment.phone || "Not available"}
                      </h6>
                    </Col>

                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Appointment Date</p>
                      <h6 className="fw-bold">
                        {appointment.appointmentDate || "Not available"}
                      </h6>
                    </Col>

                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Token Number</p>
                      <h6 className="fw-bold">
                        #{appointment.tokenNumber || "N/A"}
                      </h6>
                    </Col>

                    <Col md={4} className="mb-3">
                      <p className="text-muted mb-1">Symptoms</p>
                      <h6 className="fw-bold">
                        {appointment.symptoms || "Not provided"}
                      </h6>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">
                  {editingId ? "Update Medicine" : "Add Medicine"}
                </h5>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3 align-items-end">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Medicine Name *</Form.Label>
                        <Form.Control
                          value={medicine}
                          onChange={(e) => setMedicine(e.target.value)}
                          placeholder="Enter medicine"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Dosage *</Form.Label>
                        <Form.Control
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          placeholder="500 mg"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Duration *</Form.Label>
                        <Form.Control
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="5 days"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={1}
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="After food"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        variant="success"
                        className="w-100"
                        onClick={handleAddMedicine}
                        disabled={saving}
                      >
                        {saving
                          ? "Saving..."
                          : editingId
                          ? "Save"
                          : "+ Add Medicine"}
                      </Button>
                    </Col>
                  </Row>

                  {editingId && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-3"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}

                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">
                      Medicines ({medicines.length})
                    </h6>

                    <Table bordered hover responsive>
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Duration</th>
                          <th>Instructions</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {medicines.length > 0 ? (
                          medicines.map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.medicine}</td>
                              <td>{item.dosage}</td>
                              <td>{item.duration}</td>
                              <td>{item.instruction || "No instructions"}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="me-2 mb-1"
                                  type="button"
                                  onClick={() => handleEditMedicine(item)}
                                >
                                  Edit
                                </Button>

                                <Button
                                  size="sm"
                                  variant="danger"
                                  type="button"
                                  className="mb-1"
                                  onClick={() =>
                                    handleRemoveMedicine(item._id)
                                  }
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              No medicines added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>

                  {!editingId && (
                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                      >
                        Back to Appointments
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    </>
  );
}

export default EditPriscription;

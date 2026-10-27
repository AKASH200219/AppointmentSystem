import React, { useEffect, useState } from "react";
import {Button,Card,Col,Container,Form,Row,Table,Alert,} from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DoctorNav from "./DoctorNav";
import API from "../../api/axiosConfig";

function Prescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [medicines, setMedicines] = useState([]);

  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

 
  const getAppointment = async () => {
    try {
      // const result = await axios.get(`http://localhost:5000/api/appointments/detailsAppointment/${appointmentId}`);
      const result = await API.get(`/api/appointments/detailsAppointment/${appointmentId}`);
      setAppointment(result.data.appointmentDetails);
    } catch (error) {
      console.log("Failed to get appointment:", error);
      setError(
        error.response?.data?.message ||
          "Unable to load appointment details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      getAppointment();
    } else {
      setError("Appointment ID is missing");
      setLoading(false);
    }
  }, [appointmentId]);

 
  const handleAddMedicine = () => {
    if (!medicine.trim() || !dosage.trim() || !duration.trim()) {
      alert("Please enter medicine name, dosage, and duration");
      return;
    }

    const newMedicine = {
      medicine: medicine.trim(),
      dosage: dosage.trim(),
      duration: duration.trim(),
      instruction: instructions.trim(),
    };

    setMedicines([...medicines, newMedicine]);

    setMedicine("");
    setDosage("");
    setDuration("");
    setInstructions("");
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(
      medicines.filter((item, i) => i !== index)
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointment) {
      alert("Appointment details are not available");
      return;
    }

    let medicinesToSave = [...medicines];

    if (
      medicine.trim() ||
      dosage.trim() ||
      duration.trim() ||
      instructions.trim()
    ) {
      if (!medicine.trim() || !dosage.trim() || !duration.trim()) {
        alert("Complete the current medicine details or clear the fields");
        return;
      }

      medicinesToSave.push({
        medicine: medicine.trim(),
        dosage: dosage.trim(),
        duration: duration.trim(),
        instruction: instructions.trim(),
      });
    }

    if (medicinesToSave.length === 0) {
      alert("Please add at least one medicine");
      return;
    }

    // Get IDs from appointment
    const patientId =
      appointment.userId?._id || appointment.userId;

    const doctorId =
      appointment.doctorId?._id || appointment.doctorId;

    if (!patientId || !doctorId) {
      alert("Patient ID or Doctor ID is missing");
      return;
    }

    try {
      setSaving(true);

      const prescriptionData = {
        appointmentId: appointment._id,
        patientId,
        doctorId,
        medicines: medicinesToSave,
      };

      // const result = await axios.post("http://localhost:5000/api/prescriptions/add",prescriptionData);
      const result = await API.post("/api/prescriptions/add",prescriptionData);

      console.log("Prescription saved:", result.data);

      alert("Prescription saved successfully");
      navigate("/docappointments");
    } catch (error) {
      console.log("Prescription save failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save prescription"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <DoctorNav />

      <Container className="py-5">
        <h2 className="fw-bold">Prescription</h2>

        <p className="text-muted">
          Add medicines for the selected patient
        </p>

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {loading ? (
          <p className="text-center py-4">
            Loading appointment details...
          </p>
        ) : appointment ? (
          <>
           
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-4">
                  Patient Details
                </h5>

                <Row>
                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Patient Name
                    </p>
                    <h6 className="fw-bold">
                      {appointment.patientName}
                    </h6>
                  </Col>

                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Age
                    </p>
                    <h6 className="fw-bold">
                      {appointment.age}
                    </h6>
                  </Col>

                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Phone
                    </p>
                    <h6 className="fw-bold">
                      {appointment.phone}
                    </h6>
                  </Col>

                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Appointment Date
                    </p>
                    <h6 className="fw-bold">
                      {appointment.appointmentDate}
                    </h6>
                  </Col>

                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Token Number
                    </p>
                    <h6 className="fw-bold">
                      #{appointment.tokenNumber}
                    </h6>
                  </Col>

                  <Col md={4} className="mb-3">
                    <p className="text-muted mb-1">
                      Symptoms
                    </p>
                    <h6 className="fw-bold">
                      {appointment.symptoms || "Not provided"}
                    </h6>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">
                  Add Medicine
                </h5>

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3 align-items-end">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>
                          Medicine Name *
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Enter medicine"
                          value={medicine}
                          onChange={(e) =>
                            setMedicine(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>
                          Dosage *
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="As prescribed"
                          value={dosage}
                          onChange={(e) =>
                            setDosage(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>
                          Duration *
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="e.g. 5 days"
                          value={duration}
                          onChange={(e) =>
                            setDuration(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>
                          Instructions (Optional)
                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={1}
                          placeholder="As directed by doctor"
                          value={instructions}
                          onChange={(e) =>
                            setInstructions(e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        variant="success"
                        className="w-100"
                        onClick={handleAddMedicine}
                      >
                        + Add Medicine
                      </Button>
                    </Col>
                  </Row>

                  {/* Added Medicines Table */}
                  {medicines.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">
                        Added Medicines ({medicines.length})
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
                          {medicines.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.medicine}</td>
                              <td>{item.dosage}</td>
                              <td>{item.duration}</td>
                              <td>
                                {item.instruction ||
                                  "No instructions"}
                              </td>
                              <td>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleRemoveMedicine(index)
                                  }
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="d-flex gap-2 justify-content-center mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Prescription"}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      disabled={saving}
                      onClick={() =>
                        navigate("/docappointments")
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </>
        ) : (
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-4">
              Appointment details could not be loaded.
              <div className="mt-3">
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate("/docappointments")
                  }
                >
                  Back to Appointments
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}

export default Prescription;

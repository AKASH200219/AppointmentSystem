import React, { useEffect, useState } from "react";
import {Badge,Button,Card,Container,Table,Alert,Form,Spinner,} from "react-bootstrap";
import axios from "axios";
import DoctorNav from "./DoctorNav";
import { Link } from "react-router-dom";

function DocAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const doctorid = localStorage.getItem("doctor");
  const token = localStorage.getItem("token");

  // Doctor login validation
  useEffect(() => {
    if (!doctorid || !token) {
      localStorage.removeItem("doctor");
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  }, [doctorid, token]);

  // Get appointments
  const getAppointments = async () => {
    if (!doctorid || !token) {
      setLoading(false);
      return;
    }

    try {
      setError("");
      const result = await axios.get(`http://localhost:5000/api/appointments/getappointment/${doctorid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const list = Array.isArray(result.data.appointment)
        ? result.data.appointment
        : [];

      setAppointments(list);

      const status = {};

      await Promise.all(
        list
          .filter((item) => item.status === "Accepted")
          .map(async (item) => {
            try {
              const response = await axios.get(
                `http://localhost:5000/api/prescriptions/appointment/${item._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              status[item._id] =
                Array.isArray(response.data.prescriptions) &&
                response.data.prescriptions.length > 0;
            } catch (err) {
              status[item._id] = false;

              if (err.response?.status !== 404) {
                console.log("Prescription check failed:", err);
              }
            }
          })
      );

      setPrescriptionStatus(status);
    } catch (err) {
      console.log("Can't get appointments:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("doctor");
        localStorage.removeItem("token");
        window.location.replace("/");
        return;
      }

      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorid && token) {
      getAppointments();
    } else {
      setLoading(false);
    }
  }, []);

  // Date validation
  const handleDateChange = (value) => {
    setSuccess("");
    setDateError("");

    if (!value) {
      setSearchDate("");
      return;
    }

    const selectedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      setDateError("Please select a valid date.");
      setSearchDate("");
      return;
    }

    const year = selectedDate.getFullYear();

    if (year < 2000 || year > 2100) {
      setDateError("Please select a valid year.");
      setSearchDate("");
      return;
    }

    setSearchDate(value);
  };

  // Filter appointments by date
  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchDate) {
      return true;
    }

    if (!appointment.appointmentDate) {
      return false;
    }

    const appointmentDate = new Date(appointment.appointmentDate);

    if (Number.isNaN(appointmentDate.getTime())) {
      return false;
    }

    const year = appointmentDate.getFullYear();
    const month = String(appointmentDate.getMonth() + 1).padStart(2, "0");
    const day = String(appointmentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}` === searchDate;
  });

  // Accept or reject appointment
  const updateStatus = async (id, status) => {
    if (!doctorid || !token) {
      localStorage.removeItem("doctor");
      localStorage.removeItem("token");
      window.location.replace("/");
      return;
    }

    if (!id) {
      setError("Invalid appointment.");
      return;
    }

    if (!["Accepted", "Rejected"].includes(status)) {
      setError("Invalid appointment status.");
      return;
    }

    if (updatingId) {
      return;
    }

    const appointment = appointments.find((item) => item._id === id);

    if (!appointment || appointment.status !== "Booked") {
      setError("Only booked appointments can be updated.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setUpdatingId(id);

      await axios.put(
        `http://localhost:5000/api/appointments/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Appointment ${status.toLowerCase()} successfully.`);

      await getAppointments();
    } catch (err) {
      console.log("Status update failed:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("doctor");
        localStorage.removeItem("token");
        window.location.replace("/");
        return;
      }

      setError("Unable to update appointment status. Please try again.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <>
      <DoctorNav />

      <Container className="py-5">
        <h2 className="fw-bold">Appointments</h2>

        <p className="text-muted">
          Manage your patient appointments
        </p>

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>
            <h5 className="fw-bold mb-3">
              Patient Appointments
            </h5>

            {/* Search by date */}
            <div className="d-flex flex-wrap align-items-start gap-2 mb-3">
              <div>
                <Form.Control
                  type="date"
                  value={searchDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  isInvalid={Boolean(dateError)}
                  aria-label="Search appointments by date"
                  style={{ maxWidth: "250px" }}
                />

                {dateError && (
                  <Form.Control.Feedback type="invalid">
                    {dateError}
                  </Form.Control.Feedback>
                )}
              </div>

              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchDate("");
                  setDateError("");
                }}
                disabled={!searchDate}
              >
                Clear Date
              </Button>
            </div>

            {!loading && !dateError && searchDate && (
              <p className="text-muted">
                Found {filteredAppointments.length} appointment(s).
              </p>
            )}

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-center text-muted py-4">
                No appointments found.
              </p>
            ) : filteredAppointments.length === 0 ? (
              <p className="text-center text-muted py-4">
                No appointments found for the selected date.
              </p>
            ) : (
              <Table hover bordered responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>Prescription</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>#{appointment.tokenNumber ?? "-"}</td>
                      <td>{appointment.patientName || "-"}</td>
                      <td>{appointment.age ?? "-"}</td>
                      <td>{appointment.phone || "-"}</td>

                      <td>
                        {appointment.appointmentDate &&
                        !Number.isNaN(
                          new Date(appointment.appointmentDate).getTime()
                        )
                          ? new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td>{appointment.symptoms || "-"}</td>

                      <td>
                        {appointment.status === "Booked" ? (
                          <Badge bg="warning" text="dark">
                            Booked
                          </Badge>
                        ) : appointment.status === "Accepted" ? (
                          <Badge bg="success">Accepted</Badge>
                        ) : appointment.status === "Rejected" ? (
                          <Badge bg="danger">Rejected</Badge>
                        ) : (
                          <Badge bg="secondary">
                            {appointment.status || "Unknown"}
                          </Badge>
                        )}
                      </td>

                      <td>
                        {appointment.status === "Booked" ? (
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              disabled={Boolean(updatingId)}
                              onClick={() =>
                                updateStatus(appointment._id, "Accepted")
                              }
                            >
                              {updatingId === appointment._id ? (
                                <Spinner size="sm" animation="border" />
                              ) : (
                                "Accept"
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="danger"
                              disabled={Boolean(updatingId)}
                              onClick={() =>
                                updateStatus(appointment._id, "Rejected")
                              }
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted">No action</span>
                        )}
                      </td>

                      <td>
                        {appointment.status !== "Accepted" ? (
                          <span className="text-muted">Accept first</span>
                        ) : prescriptionStatus[appointment._id] === undefined ? (
                          <span className="text-muted">Checking...</span>
                        ) : prescriptionStatus[appointment._id] ? (
                          <Button
                            as={Link}
                            to={`/edit-prescription/${appointment._id}`}
                            state={{ appointment }}
                            size="sm"
                            variant="outline-primary"
                          >
                            Edit Prescription
                          </Button>
                        ) : (
                          <Button
                            as={Link}
                            to={`/prescription/${appointment._id}`}
                            state={{ appointment }}
                            size="sm"
                            variant="primary"
                          >
                            Add Prescription
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default DocAppointments;
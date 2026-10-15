import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import DoctorNav from "./DoctorNav";

function ViewPrescription() {
  const { appointmentId } = useParams();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await axios.get(
          `http://localhost:5000/api/prescriptions/appointment/${appointmentId}`
        );

        setPrescriptions(result.data.prescriptions || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load prescription"
        );
      } finally {
        setLoading(false);
      }
    };

    getPrescriptions();
  }, [appointmentId]);

  return (
    <>
      <DoctorNav />

      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold">View Prescription</h2>
            <p className="text-muted mb-0">
              Patient prescription details
            </p>
          </div>

          <Button
            as={Link}
            to="/docappointments"
            variant="outline-secondary"
          >
            Back to Appointments
          </Button>
        </div>

        <Card className="shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h5 className="fw-bold mb-0">
                Prescribed Medicines
              </h5>

              {!loading && !error && (
                <Badge bg="primary">
                  Total Medicines: {prescriptions.length}
                </Badge>
              )}
            </div>

            {loading ? (
              <p className="text-center py-4">
                Loading prescriptions...
              </p>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : prescriptions.length === 0 ? (
              <Alert variant="info">
                No prescription found for this appointment.
              </Alert>
            ) : (
              <Table
                responsive
                bordered
                hover
                className="align-middle"
              >
                <thead className="table-light">
                  <tr>
                    <th>No.</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>

                <tbody>
                  {prescriptions.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">
                        {item.medicine || "-"}
                      </td>
                      <td>{item.dosage || "-"}</td>
                      <td>{item.duration || "-"}</td>
                      <td>{item.instruction || "-"}</td>
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

export default ViewPrescription;
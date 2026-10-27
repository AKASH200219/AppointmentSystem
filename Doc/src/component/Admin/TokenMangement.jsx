import { useCallback, useEffect, useState } from "react";
import {Alert,Button,Card,Container,Form,Table,} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNav from "./AdminNav";
import API from "../../api/axiosConfig";

// const API_URL = "http://localhost:5000";

function TokenMangement() {
  const navigate = useNavigate();

  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [token, setToken] = useState("150");
  const [schedules, setSchedules] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate(localStorage.getItem("doctor") ? "/docdashboard" : "/");
    }
  }, [navigate]);

  const loadTokens = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // const response = await axios.get(`${API_URL}/api/token/all/${month}`,
      const response = await API.get(`/api/token/all/${month}`,
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || ""
            }`,
          },
        }
      );

      const list = response.data.tokenData || [];

      setSchedules(list);

      if (list.length > 0) {
        setToken(String(list[0].token));
      }
    } catch (err) {
      setSchedules([]);
      setError(
        err.response?.data?.message || "Failed to load token records."
      );
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    if (localStorage.getItem("admin")) {
      loadTokens();
    }
  }, [loadTokens]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const tokenLimit = Number(token);

    if (!Number.isInteger(tokenLimit) || tokenLimit < 1) {
      setError("Enter a whole number greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const response = await API.post(
        `/api/token/addtoken`,
        {
          month,
          token: tokenLimit,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("token") || ""
            }`,
          },
        }
      );

      setSchedules(response.data.tokenData || []);

      setMessage(
        `Daily token limit updated to ${tokenLimit} for every doctor in ${month}.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save daily tokens."
      );
    } finally {
      setSaving(false);
    }
  };

  // Convert YYYY-MM into DD-MM-YYYY date range.
  const getDateRange = () => {
    if (!month) return "";

    const [year, monthNumber] = month.split("-").map(Number);
    const lastDay = new Date(year, monthNumber, 0).getDate();

    const formatDate = (day) =>
      `${String(day).padStart(2, "0")}-${String(
        monthNumber
      ).padStart(2, "0")}-${year}`;

    return `${formatDate(1)} to ${formatDate(lastDay)}`;
  };

  // Group daily records into one row per doctor.
  const doctorSummary = [
    ...new Map(
      schedules.map((item) => [
        String(item.doctorId?._id || item.doctorId),
        item,
      ])
    ).values(),
  ].map((item) => {
    const doctorId = String(item.doctorId?._id || item.doctorId);

    const doctorRecords = schedules.filter(
      (record) =>
        String(record.doctorId?._id || record.doctorId) === doctorId
    );

    const dailyLimit = Number(item.token || 0);

    const totalBooked = doctorRecords.reduce(
      (total, record) => total + Number(record.bookedtoken || 0),
      0
    );

    // Available per day is calculated from one day's record.
    const firstDayBooked = Number(
      doctorRecords[0]?.bookedtoken || 0
    );

    const dailyAvailable = Math.max(0, dailyLimit - firstDayBooked);

    return {
      doctorId,
      doctorName: item.doctorId?.name || "Doctor",
      dailyLimit,
      totalBooked,
      dailyAvailable,
    };
  });

  return (
    <>
      <AdminNav />

      <Container className="py-4">
        <h2 className="mb-2">Daily Token Management</h2>

        <p className="text-muted">
          Set the same daily token limit for all doctors for the selected
          month. Each date has a separate booking count.
        </p>

        {message && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}

        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Month</Form.Label>

                <Form.Control
                  type="month"
                  value={month}
                  onChange={(event) => {
                    setMonth(event.target.value);
                    setMessage("");
                    setError("");
                  }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tokens Per Day</Form.Label>

                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={saving || !month}
              >
                {saving ? "Saving..." : "Save / Update Daily Tokens"}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">
              Monthly Token Summary — {month}
            </h5>

            <p className="text-muted">
              Date Range: {getDateRange()}
            </p>

            {loading ? (
              <p>Loading token records...</p>
            ) : (
              <div className="table-responsive">
                <Table bordered hover striped responsive="sm">
                  <thead>
                    <tr>
                      <th>Date Range</th>
                      <th>Doctor</th>
                      <th>Daily Limit</th>
                      <th>Total Booked</th>
                      <th>Daily Available</th>
                    </tr>
                  </thead>

                  <tbody>
                    {doctorSummary.map((item) => (
                      <tr key={item.doctorId}>
                        <td>{getDateRange()}</td>
                        <td>{item.doctorName}</td>
                        <td>{item.dailyLimit}</td>
                        <td>{item.totalBooked}</td>
                        <td>{item.dailyAvailable}</td>
                      </tr>
                    ))}

                    {doctorSummary.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No records found. Select a month and save a token
                          limit to create daily records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default TokenMangement;

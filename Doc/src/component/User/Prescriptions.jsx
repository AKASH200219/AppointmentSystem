import React, { useEffect, useState } from "react";
import {Badge,Button,Card,Col,Container,Modal,Row,Table,} from "react-bootstrap";
import axios from "axios";
import jsPDF from "jspdf";
import UserNav from "./UserNav";
import API from "../../api/axiosConfig";

const groupPrescriptions = (items) => {
  const grouped = new Map();

  items.forEach((item) => {
    const appointmentId =
      typeof item.appointmentId === "object"
        ? item.appointmentId?._id
        : item.appointmentId;
    const key = appointmentId || item._id;

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...item,
        medicines: [],
      });
    }

    grouped.get(key).medicines.push({
      _id: item._id,
      medicine: item.medicine || "Medicine",
      dosage: item.dosage || "N/A",
      duration: item.duration || "N/A",
      instruction:
        item.instruction ||
        item.instructions ||
        "No specific instructions provided.",
    });
  });

  return Array.from(grouped.values());
};

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("user");

  const getPrescriptions = async () => {
    try {
      // const res = await axios.get(`http://localhost:5000/api/prescriptions/user/${userId}` );
      const res = await API.get(`/api/prescriptions/user/${userId}` );

      console.log("Prescriptions:", res.data);

      setPrescriptions(
        groupPrescriptions(res.data.prescriptions || [])
      );
    } catch (err) {
      console.log("Error fetching prescriptions:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      getPrescriptions();
    }
  }, [userId]);

 
  const handleOpenModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

const handleDownloadPrescription = (prescription) => {
  const doc = new jsPDF();
  const medicines =
    prescription.medicines?.length > 0
      ? prescription.medicines
      : [
          {
            medicine: prescription.medicine || "Medicine",
            dosage: prescription.dosage || "N/A",
            duration: prescription.duration || "N/A",
            instruction:
              prescription.instruction ||
              prescription.instructions ||
              "No specific instructions provided.",
          },
        ];

  const doctor =
    prescription.doctorId?.name || "Doctor";

  const specialization =
    prescription.doctorId?.specialization || "General";

  const hospital =
    prescription.doctorId?.hospital || "HealthCare Center";

  const patient =
    prescription.appointmentId?.patientName || "Patient";

  const date =
    prescription.appointmentId?.appointmentDate ||
    new Date(prescription.createdAt).toLocaleDateString();

  const token =
    prescription.appointmentId?.tokenNumber || "N/A";

  
  doc.setFillColor(13, 110, 253);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text("HEALTHCARE CENTER", 15, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(hospital, 15, 23);

  doc.text("PRESCRIPTION", 195, 15, {
    align: "right",
  });

  doc.text(`Date: ${date}`, 195, 23, {
    align: "right",
  });

  // =========================
  // DOCTOR
  // =========================

  doc.setTextColor(30, 30, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text(`Dr. ${doctor}`, 15, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(specialization, 15, 57);

  doc.setDrawColor(220, 220, 220);
  doc.line(15, 64, 195, 64);

  // =========================
  // PATIENT
  // =========================

  doc.setFillColor(245, 248, 252);

  doc.roundedRect(
    15,
    72,
    180,
    30,
    3,
    3,
    "F"
  );

  doc.setTextColor(13, 110, 253);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text("PATIENT DETAILS", 22, 81);

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Name: ${patient}`, 22, 91);

  doc.text(`Token: #${token}`, 22, 98);

  doc.text(`Date: ${date}`, 120, 91);

  // RX

  doc.setTextColor(13, 110, 253);
  doc.setFont("times", "bolditalic");
  doc.setFontSize(25);

  doc.text("Rx", 15, 120);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);

  doc.text("PRESCRIBED MEDICINE", 35, 119);

  doc.setFillColor(13, 110, 253);

  const drawMedicineHeader = (y) => {
    doc.setFillColor(13, 110, 253);
    doc.roundedRect(15, y, 180, 11, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("MEDICINE", 22, y + 7);
    doc.text("DOSAGE", 105, y + 7);
    doc.text("DURATION", 155, y + 7);
  };

  let y = 128;
  drawMedicineHeader(y);
  y += 11;

  medicines.forEach((item) => {
    const medicineLines = doc.splitTextToSize(
      item.medicine || "Medicine",
      70
    );
    const dosageLines = doc.splitTextToSize(
      item.dosage || "N/A",
      38
    );
    const durationLines = doc.splitTextToSize(
      item.duration || "N/A",
      38
    );
    const rowHeight = Math.max(
      14,
      Math.max(
        medicineLines.length,
        dosageLines.length,
        durationLines.length
      ) * 5 + 4
    );

    if (y + rowHeight > 250) {
      doc.addPage();
      y = 20;
      drawMedicineHeader(y);
      y += 11;
    }

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.rect(15, y, 180, rowHeight);
    doc.line(98, y, 98, y + rowHeight);
    doc.line(148, y, 148, y + rowHeight);
    doc.text(medicineLines, 22, y + 8);
    doc.text(dosageLines, 105, y + 8);
    doc.text(durationLines, 155, y + 8);
    y += rowHeight;
  });

  if (y + 14 > 265) {
    doc.addPage();
    y = 20;
  } else {
    y += 10;
  }

  doc.setTextColor(13, 110, 253);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DOCTOR'S INSTRUCTIONS", 15, y);
  y += 6;

  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  medicines.forEach((item) => {
    const instructionLines = doc.splitTextToSize(
      `${item.medicine || "Medicine"}: ${
        item.instruction ||
        "No specific instructions provided."
      }`,
      175
    );
    const blockHeight = instructionLines.length * 5 + 8;

    if (y + blockHeight > 265) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(245, 248, 252);
    doc.roundedRect(15, y, 180, blockHeight, 3, 3, "F");
    doc.text(instructionLines, 22, y + 6);
    y += blockHeight + 3;
  });

  // =========================
  // SIGNATURE
  // =========================

  if (y + 25 > 270) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(100, 100, 100);

  doc.line(140, y + 8, 195, y + 8);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);

  doc.text(
    "Doctor's Signature",
    140,
    y + 15
  );
  
  doc.text(
    `Dr. ${doctor}`,
    140,
    y + 21
  );
  
  // FOOTER

  doc.setDrawColor(220, 220, 220);
  doc.line(15, 275, 195, 275);
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);

  doc.text(
    "Computer-generated prescription",
    105,
    283,
    {
      align: "center",
    }
  );

  // DOWNLOAD
  
  doc.save(
    `Prescription_${prescription._id}.pdf`
  );
};


  return (
    <>
      <UserNav />

      <Container className="py-5">

        <h2 className="fw-bold">
          My Prescriptions
        </h2>

        <p className="text-muted">
          View all your doctor prescribed medicines
        </p>

        <Card className="shadow-sm border-0 mt-4">
          <Card.Body>

            <h5 className="fw-bold mb-3">
              Prescription History
            </h5>

            {prescriptions.length === 0 ? (

              <p className="text-center text-muted py-4">
                No prescriptions found
              </p>

            ) : (

              <Table
                hover
                bordered
                responsive
                className="align-middle"
              >

                <thead className="table-light">

                  <tr>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {prescriptions.map((item) => (

                    <tr key={item._id}>

                      {/* DOCTOR */}

                      <td>

                        <div className="d-flex align-items-center">

                          {item.doctorId?.image ? (

                            <img
                              // src={`http://localhost:5000/uploads/${item.doctorId.image}`}
                              src={`${API.defaults.baseURL}/uploads/${item.doctorId.image}`}
                              alt="Doctor"
                              className="rounded-circle me-2"
                              style={{
                                width: "45px",
                                height: "45px",
                                objectFit: "cover",
                              }}
                            />

                          ) : (

                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 fw-bold"
                              style={{
                                width: "45px",
                                height: "45px",
                              }}
                            >
                              Dr
                            </div>

                          )}

                          <div>

                            <strong className="d-block">
                              Dr.{" "}
                              {item.doctorId?.name ||
                                "Doctor"}
                            </strong>

                            <small className="text-muted">
                              {item.doctorId
                                ?.specialization ||
                                "General"}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* DATE */}

                      <td>

                        {item.appointmentId
                          ?.appointmentDate ||
                          new Date(
                            item.createdAt
                          ).toLocaleDateString()}

                      </td>

                      {/* MEDICINE */}

                      <td>
                        {item.medicines.map((medicine) => (
                          <Badge
                            key={medicine._id}
                            bg="primary"
                            className="px-2 py-1 me-1 mb-1"
                          >
                            {medicine.medicine}
                          </Badge>
                        ))}
                      </td>

                      {/* DOSAGE */}

                      <td>
                        {item.medicines.map((medicine) => (
                          <div key={medicine._id}>
                            {medicine.dosage}
                          </div>
                        ))}
                      </td>

                      {/* DURATION */}

                      <td>
                        {item.medicines.map((medicine) => (
                          <div key={medicine._id}>
                            {medicine.duration}
                          </div>
                        ))}
                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="d-flex align-items-center">

                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() =>
                              handleOpenModal(item)
                            }
                          >
                            View Prescription
                          </Button>

                          <Button
                            size="sm"
                            variant="outline-success"
                            className="ms-2"
                            onClick={() =>
                              handleDownloadPrescription(
                                item
                              )
                            }
                          >
                            Download PDF
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </Table>

            )}

          </Card.Body>
        </Card>

        {/* ==============================
            PRESCRIPTION MODAL
        ============================== */}

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          size="lg"
          centered
        >

          {selectedPrescription && (

            <>

              <Modal.Header closeButton>

                <Modal.Title className="fw-bold text-primary">
                  Prescription Details
                </Modal.Title>

              </Modal.Header>

              <Modal.Body className="p-4">

                {/* DOCTOR */}

                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">

                  {selectedPrescription.doctorId
                    ?.image && (

                    <img
                      // src={`http://localhost:5000/uploads/${selectedPrescription.doctorId.image}`}
                      src={`${API.defaults.baseURL}/uploads/${selectedPrescription.doctorId.image}`}
                      alt="Doctor"
                      className="rounded-circle me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />

                  )}

                  <div>

                    <h5 className="fw-bold mb-0">
                      Dr.{" "}
                      {selectedPrescription.doctorId
                        ?.name}
                    </h5>

                    <p className="text-primary mb-0 small fw-semibold">
                      {
                        selectedPrescription.doctorId
                          ?.specialization
                      }
                    </p>

                    <small className="text-muted">
                      {selectedPrescription.doctorId
                        ?.hospital ||
                        "HealthCare Center"}
                    </small>

                  </div>

                </div>

                {/* PATIENT DETAILS */}

                <Card className="bg-light border-0 mb-4">

                  <Card.Body>

                    <Row className="g-3">

                      <Col md={4}>

                        <small className="text-muted d-block">
                          Token Number
                        </small>

                        <h6 className="fw-bold text-primary mb-0">
                          #
                          {selectedPrescription
                            .appointmentId
                            ?.tokenNumber || "N/A"}
                        </h6>

                      </Col>

                      <Col md={4}>

                        <small className="text-muted d-block">
                          Patient Name
                        </small>

                        <h6 className="fw-bold mb-0">
                          {selectedPrescription
                            .appointmentId
                            ?.patientName ||
                            "Patient"}
                        </h6>

                      </Col>

                      <Col md={4}>

                        <small className="text-muted d-block">
                          Appointment Date
                        </small>

                        <h6 className="fw-bold mb-0">
                          {selectedPrescription
                            .appointmentId
                            ?.appointmentDate ||
                            new Date(
                              selectedPrescription.createdAt
                            ).toLocaleDateString()}
                        </h6>

                      </Col>

                    </Row>

                  </Card.Body>

                </Card>

                {/* MEDICINE */}

                <h6 className="fw-bold mb-2">
                  Medicine Details
                </h6>

                <Table
                  bordered
                  responsive
                  className="align-middle mb-3"
                >

                  <thead className="table-light">

                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                    </tr>

                  </thead>

                  <tbody>

                    {selectedPrescription.medicines.map(
                      (medicine) => (
                        <tr key={medicine._id}>
                          <td>
                            <strong>{medicine.medicine}</strong>
                          </td>
                          <td>{medicine.dosage}</td>
                          <td>{medicine.duration}</td>
                        </tr>
                      )
                    )}

                  </tbody>

                </Table>

                {/* INSTRUCTIONS */}

                <div className="p-3 bg-light rounded">

                  <h6 className="fw-bold mb-1">
                    Doctor's Instructions:
                  </h6>

                  {selectedPrescription.medicines.map(
                    (medicine) => (
                      <p
                        className="mb-1 text-muted"
                        key={medicine._id}
                      >
                        <strong>{medicine.medicine}:</strong>{" "}
                        {medicine.instruction}
                      </p>
                    )
                  )}

                </div>

              </Modal.Body>

              <Modal.Footer>

                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </Button>

                <Button
                  variant="primary"
                  onClick={() =>
                    window.print()
                  }
                >
                  Print
                </Button>

                <Button
                  variant="success"
                  onClick={() =>
                    handleDownloadPrescription(
                      selectedPrescription
                    )
                  }
                >
                  Download PDF
                </Button>

              </Modal.Footer>

            </>

          )}

        </Modal>

      </Container>
    </>
  );
}

export default Prescriptions;

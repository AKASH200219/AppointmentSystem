import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Badge
} from "react-bootstrap";


import axios from "axios";
import { useNavigate } from "react-router-dom";
import StaffNav from "./StaffNav";

function Staffpage() {

  const navigate = useNavigate();

  const [staffInfo, setStaffInfo] = useState(null);
  const [orders, setOrders] = useState([]);

  const staffId = localStorage.getItem("staff");


  // ===============================
  // FETCH STAFF DETAILS
  // ===============================

  const fetchStaffDetails = async () => {

    if (!staffId) return;

    try {

      const res = await axios.get(
        `http://localhost:5000/api/staff/staffinfo/${staffId}`
      );

      console.log("Staff Info:", res.data);

      if (res.data?.result) {

        setStaffInfo(res.data.result);

        return;
      }

    } catch (error) {

      console.log(
        "Primary staff fetch failed:",
        error
      );

    }


  

    try {

      const listRes = await axios.get(
        "http://localhost:5000/api/staff/viewStaff"
      );

      const found = listRes.data?.result?.find(
        (staff) =>
          staff.commonKey === staffId ||
          staff._id === staffId
      );

      if (found) {

        setStaffInfo(found);

      }

    } catch (error) {

      console.log(
        "Error fetching staff profile:",
        error
      );

    }

  };


  // ===============================
  // FETCH MEDICINE ORDERS
  // ONLY PHARMACIST
  // ===============================

  const fetchOrders = async () => {

    if (!staffInfo) return;

    const pharmacist =
      staffInfo.staffType?.toLowerCase() ===
      "pharmacist";


    if (!pharmacist) {

      setOrders([]);

      return;
    }


    try {

      const res = await axios.get(
        "http://localhost:5000/api/medicine/orders"
      );

      console.log("Orders:", res.data);

      setOrders(
        res.data?.orders || []
      );

    } catch (error) {

      console.log(
        "Error fetching orders:",
        error
      );

      setOrders([]);

    }

  };


  useEffect(() => {

    fetchStaffDetails();

  }, [staffId]);


  useEffect(() => {

    if (staffInfo) {

      fetchOrders();

    }

  }, [staffInfo]);


  // ===============================
  // ROLE
  // ===============================

  const staffType =
    staffInfo?.staffType?.toLowerCase();


  const isPharmacist =
    staffType === "pharmacist";

  const isCareAssistant =
    staffType === "care assistant";

  // const isLabStaff =
  //   staffType === "lab technician";


  // ===============================
  // MEDICINE COUNTS
  // ===============================

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) =>
        order.status?.toLowerCase() ===
        "pending"
    ).length;


  return (

    <>

      <StaffNav  />


      <Container className="py-5">


        <div className="text-center mb-5">

          {isPharmacist && (

            <Badge
              bg="primary"
              className="px-3 py-2 mb-2 fs-6"
            >
              Pharmacist Dashboard
            </Badge>

          )}


          {isCareAssistant && (

            <Badge
              bg="success"
              className="px-3 py-2 mb-2 fs-6"
            >
              Companion Care Dashboard
            </Badge>

          )}


          <h2 className="fw-bold text-primary">

            Welcome,{" "}

            {staffInfo?.name ||
              "Staff Member"}

            !

          </h2>


          <p className="text-muted">

            {isPharmacist
              ? "Manage medicine orders and pharmacy activities."
              : isCareAssistant
              ? "Manage companion care requests and patient assistance."
              : "Manage your staff activities."
            }

          </p>

        </div>


  
        <Row className="g-4 justify-content-center">


          {isPharmacist && (

            <Col
              md={6}
              lg={5}
            >

              <Card
                className="shadow-sm border-0 rounded-4 h-100"
              >

                <Card.Body className="p-4">

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="fw-bold text-primary mb-0">

                      Medicine Orders

                    </h5>


                    <Badge
                      bg="warning"
                      text="dark"
                    >

                      {pendingOrders} Pending

                    </Badge>

                  </div>


                  <p className="text-muted">

                    Review customer medicine
                    orders and update order
                    status.

                  </p>


                  <h3 className="fw-bold">

                    {totalOrders}

                  </h3>


                  <p className="text-muted">

                    Total Orders

                  </p>


                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() =>
                      navigate(
                        "/staffmedicineorders"
                      )
                    }
                  >

                    Manage Medicine Orders

                  </Button>

                </Card.Body>

              </Card>

            </Col>

          )}


          {isCareAssistant && (

            <Col
              md={6}
              lg={5}
            >

              <Card
                className="shadow-sm border-0 rounded-4 h-100"
              >

                <Card.Body className="p-4">

                  <h5 className="fw-bold text-success mb-3">

                    Companion Care

                  </h5>


                  <p className="text-muted">

                    View companion requests,
                    accept patients, update
                    location and manage
                    companion care status.

                  </p>


                  <h3 className="fw-bold">

                    Companion Requests

                  </h3>


                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={() =>
                      navigate(
                        "/companiondetail"
                      )
                    }
                  >

                    Manage Companion Requests

                  </Button>

                </Card.Body>

              </Card>

            </Col>

          )}

          {/* {isLabStaff && (
            <Col md={6} lg={5}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body className="p-4">
                  <h5 className="fw-bold text-primary mb-3">
                    Laboratory Services
                  </h5>

                  <p className="text-muted">
                    Manage diagnostic tests, view patient bookings, process laboratory samples, and upload certified reports.
                  </p>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      variant="primary"
                      className="rounded-pill py-2 fw-semibold"
                      onClick={() => navigate("/stafflabtests")}
                    >
                      Manage & Add Lab Tests
                    </Button>

                    <Button
                      variant="outline-primary"
                      className="rounded-pill py-2 fw-semibold"
                      onClick={() => navigate("/labbookings")}
                    >
                      View Lab Bookings
                    </Button>

                    <Button
                      variant="outline-secondary"
                      className="rounded-pill py-2 fw-semibold"
                      onClick={() => navigate("/labdashboard")}
                    >
                      Lab Dashboard
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )} */}


          <Col
            md={6}
            lg={5}
          >

            <Card
              className="shadow-sm border-0 rounded-4 h-100"
            >

              <Card.Body className="p-4">

                <h5 className="fw-bold text-primary mb-3">

                  My Profile

                </h5>


                <p className="text-muted mb-2">

                  <strong>Name:</strong>{" "}

                  {staffInfo?.name ||
                    "N/A"}

                </p>


                <p className="text-muted mb-2">

                  <strong>Staff Type:</strong>{" "}

                  {staffInfo?.staffType ||
                    "N/A"}

                </p>


                <p className="text-muted mb-3">

                  <strong>Experience:</strong>{" "}

                  {staffInfo?.experience ||
                    "N/A"}

                </p>


                <Badge
                  bg="light"
                  text="dark"
                  className="p-2 border"
                >

                  Staff Role Active

                </Badge>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Container>

    </>

  );

}

export default Staffpage;
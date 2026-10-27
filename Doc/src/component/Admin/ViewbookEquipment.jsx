import React, { useEffect, useState } from "react";
import {Button,Card,Container,Table,Badge,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { Link } from "react-router-dom";
import API from "../../api/axiosConfig";

function ViewbookEquipment() {
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    try {
      // const result = await axios.get("http://localhost:5000/api/equipment/getBookings");
      const result = await API.get("/api/equipment/getBookings");

      console.log("Equipment bookings:", result.data);

      setBookings(result.data.bookings || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to get equipment bookings"
      );
    }
  };


  const updateStatus = async (id, status) => {
    try {
      // const result = await axios.put(`http://localhost:5000/api/equipment/updateStatus/${id}`,{status: status,});
      const result = await API.put(`/api/equipment/updateStatus/${id}`,{status: status,});
      alert(
        result.data.message ||
          `Booking ${status}`
      );

      getBookings();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to update booking"
      );
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <>
      <AdminNav />

      <Container className="py-5">

        <div className="text-center mb-4">

          <h2 className="fw-bold text-primary">
            Equipment Booking Details
          </h2>

          <p className="text-muted">
            View and manage equipment rental requests
          </p>

        </div>

        <Card className="shadow border-0 rounded-4">

          <Card.Body className="p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h5 className="fw-bold mb-0">
                Rental Requests
              </h5>

              <Button
                as={Link}
                to="/equipmentrental"
                variant="primary"
              >
                + Add Equipment
              </Button>

            </div>

            <div className="table-responsive">

              <Table
                bordered
                hover
                className="align-middle text-center"
              >

                <thead className="table-primary">

                  <tr>

                    <th>#</th>
                    <th>Person Name</th>
                    <th>Image</th>
                    <th>Equipment Name</th>
                    <th>Type</th>
                    <th>Rent Price</th>
                    <th>Quantity</th>
                    <th>Days</th>
                    <th>Total Rent</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.length > 0 ? (

                    bookings.map((item, index) => (

                      <tr key={item._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td className="fw-semibold">
                          {
                            item.name ||
                            "User"}
                        </td>

                        
                        <td>

                          <img
                            // src={`http://localhost:5000/uploads/${item.image}`}
                            src={`${API.defaults.baseURL}/uploads/${item.image}`}
                            alt={item.image}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              
                              
                            }}
                            onError={(e) => console.log("Image error:", e.target.src)}
                          />

                        </td>

                        <td className="fw-semibold">
                          {item.equipmentName}
                        </td>

                        <td>
                          {item.equipmentType}
                        </td>


                        <td>
                          ₹{item.rentprice}
                        </td>

                        {/* Quantity */}
                        <td>
                          {item.quantity}
                        </td>

                        {/* Days */}
                        <td>
                          {item.days}
                        </td>

                        {/* Total Rent */}
                        <td className="fw-bold text-primary">
                          ₹{item.totalRent}
                        </td>

                        {/* Status */}
                        <td>

                          {item.status === "Accepted" ? (

                            <Badge bg="success">
                              Accepted
                            </Badge>

                          ) : item.status === "Cancelled" ? (

                            <Badge bg="danger">
                              Cancelled
                            </Badge>

                          ) : (

                            <Badge
                              bg="warning"
                              text="dark"
                            >
                              Pending
                            </Badge>

                          )}

                        </td>

                       
                        <td>

                          <div className="d-flex justify-content-center gap-2">

                           
                            <Button
                              variant="success"
                              size="sm"
                              
                              onClick={() =>
                                updateStatus(
                                  item._id,
                                  "Accepted"
                                )
                              }
                            >
                              Accept
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                             
                              onClick={() =>
                                updateStatus(
                                  item._id,
                                  "Cancelled"
                                )
                              }
                            >
                              Cancel
                            </Button>
                            <Button variant="secondary" size="sm" 
                            onClick={() => updateStatus( item._id, 
                              "Pending" ) } 
                            > Reset </Button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="11"
                        className="text-muted py-4"
                      >
                        No equipment bookings found
                      </td>

                    </tr>

                  )}

                </tbody>

              </Table>

            </div>

          </Card.Body>

        </Card>

      </Container>
    </>
  );
}

export default ViewbookEquipment;

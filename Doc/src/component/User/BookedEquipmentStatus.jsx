import React, { useEffect, useState } from "react";
import {Card,Container,Table,Badge,} from "react-bootstrap";
import axios from "axios";
import UserNav from "./UserNav";
import API from "../../api/axiosConfig";

function BookedEquipmentStatus() {

  const [bookings, setBookings] = useState([]);

  const userId = localStorage.getItem("user");


  const getBookings = async () => {

    try {

      // const result = await axios.get(`http://localhost:5000/api/equipment/equipmentbookedstatus/${userId}`);
      const result = await API.get(`/api/equipment/equipmentbookedstatus/${userId}`);
      console.log("My Bookings:", result.data);

      setBookings(result.data.bookings || []);

    } 
    catch (error) {

      console.log(error);

      alert(error.response?.data?.message ||"Unable to get bookings");

    }

  };

  useEffect(() => {

    if (userId) {
      getBookings();
    }

  }, [userId]);

  return (
    <>
      <UserNav/>
      <Container className="py-5">

        <div className="text-center mb-4">

          <h2 className="fw-bold text-primary">
            My Equipment Bookings
          </h2>

          <p className="text-muted">
            View your equipment booking details and status
          </p>

        </div>

        <Card className="shadow border-0 rounded-4">

          <Card.Body className="p-4">

            <h4 className="fw-bold text-primary mb-4">
              My Bookings
            </h4>

            <div className="table-responsive">

              <Table
                bordered
                hover
                responsive
                className="align-middle text-center"
              >

                <thead className="table-primary">

                  <tr>

                    <th>#</th>
                    <th>Image</th>
                    <th>Equipment</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Days</th>
                    <th>Rent Price</th>
                    <th>Total Rent</th>
                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.length > 0 ? (

                    bookings.map((item, index) => (

                      <tr key={item._id}>

                        <td>{index + 1}</td>

                        <td>

                          <img
                            // src={`http://localhost:5000/uploads/${item.image}`}
                             src={`${API.defaults.baseURL}/uploads/${item.image}`}
                            alt={item.equipmentName}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />

                        </td>

                        <td className="fw-semibold">
                          {item.equipmentName}
                        </td>

                        <td>
                          {item.equipmentType}
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          {item.days}
                        </td>

                        <td>
                          ₹{item.rentprice}
                        </td>

                        <td className="fw-bold">
                          ₹{item.totalRent}
                        </td>

                        <td>

                          {item.status === "Pending" && (

                            <Badge
                              bg="warning"
                              text="dark"
                            >
                              Pending
                            </Badge>

                          )}


                          {item.status === "Accepted" && (

                            <Badge bg="success">
                              Accepted
                            </Badge>

                          )}

                          {item.status === "Cancelled" && (

                            <Badge bg="danger">
                              Cancelled
                            </Badge>

                          )}

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="9">

                        <div className="py-3 text-muted">

                          No equipment bookings found

                        </div>

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

export default BookedEquipmentStatus;

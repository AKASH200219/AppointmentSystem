import React, { useEffect, useState } from "react";
import {Button,Card,Container,Table,

} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewEquipment() {
  const [equipment, setEquipment] = useState([]);

  const getEquipment = async () => {
    try {
      const result = await axios.get(
        "http://localhost:5000/api/equipment/get"
      );

      setEquipment(result.data.equipment || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to get equipment"
      );
    } 
  };

  useEffect(() => {
    getEquipment();
  }, []);

  const deleteEquipment = async (id) => {
    
    try {
      const result = await axios.delete(`http://localhost:5000/api/equipment/deleteequip/${id}`);

      alert(
        result.data.message ||
          "Equipment deleted successfully"
      );

     
      getEquipment();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete equipment"
      );
    }
  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">

        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            Medical Equipment
          </h2>

          <p className="text-muted">
            View and manage medical equipment
          </p>
        </div>

        <Card className="shadow border-0 rounded-4">

          <Card.Body className="p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h4 className="fw-bold text-primary mb-0">
                Equipment List
              </h4>

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
                  responsive
                  className="align-middle text-center"
                >

                  <thead className="table-primary">

                    <tr>
                      <th>#</th>
                      <th>Image</th>
                      <th>Equipment Name</th>
                      <th>Type</th>
                      <th>Rent Price</th>
                      {/* <th>Price / Day</th> */}
                      <th>Quantity</th>
                      <th>Information</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {equipment.map((item, index) => (

                      <tr key={item._id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <img
                            src={`http://localhost:5000/uploads/${item.image}`}
                            alt={item.name}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </td>

                        {/* Name */}
                        <td className="fw-semibold">
                          {item.name}
                        </td>

                        {/* Type */}
                        <td>
                          {item.type}
                        </td>

                        {/* Rent Price */}
                        <td>
                          ₹{item.rentprice}
                        </td>

                       
                        <td>
                          {item.quantity}
                        </td>

                        {/* Information */}
                        <td
                          style={{
                            maxWidth: "250px",
                            minWidth: "200px",
                          }}
                        >
                          {item.information}
                        </td>

                        {/* Actions */}
                        <td>

                          <div className="d-flex justify-content-center gap-2">

                            <Button
                              as={Link}
                              to={`/equipmentedit/${item._id}`}
                              variant="warning"
                              size="sm"
                            >
                              Edit
                            </Button>

                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                deleteEquipment(item._id)
                              }
                            >
                              Delete
                            </Button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </Table>

              </div>
            

          </Card.Body>

        </Card>

      </Container>
    </>
  );
}

export default ViewEquipment;
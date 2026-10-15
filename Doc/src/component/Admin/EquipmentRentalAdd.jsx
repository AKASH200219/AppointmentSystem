import React, { useState } from "react";
import {Button,Card,Col,Container,Form,Row,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";

function EquipmentRental() {

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rentprice,setRentPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [information, setInformation] = useState("");

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      const formData = new FormData();

      formData.append("image",image);
      formData.append("name",name);
      formData.append("type",type);
      formData.append("rentprice",rentprice)
      formData.append("quantity", quantity);
      formData.append("information",information);

      const result = await axios.post( "http://localhost:5000/api/equipment/add",formData,
        {headers: {"Content-Type":"multipart/form-data", }, });

      alert(result.data.message);

      setImage(null);
      setName("");
      setType("");
      setRentPrice("");
      setQuantity("");
      setInformation("");

    } catch (error) {

      console.log(error,"Can't to add medicine");

      alert( error.response?.data?.message ||"Something went wrong" );

    } 

  };

  return (
    <>
      <AdminNav />

      <Container className="py-5">

        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            Medical Equipment Rental
          </h2>

          <p className="text-muted">
            Add medical equipment for rental
          </p>
        </div>

        <Card className="shadow border-0 rounded-4">

          <Card.Body className="p-4 p-md-5">

            <h4 className="fw-bold text-primary mb-4">
              Add New Equipment
            </h4>

            <Form onSubmit={handleSubmit}>

              <Row className="g-3 mb-3">

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Equipment Image
                    </Form.Label>

                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(event) => {setImage(event.target.files[0] )}}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Equipment Name
                    </Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter equipment name"
                      value={name}
                      onChange={(event)=>{setName(event.target.value)}}
                      required
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row className="g-3 mb-3">

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Equipment Type
                    </Form.Label>

                    <Form.Select
                    value={type}
                     onChange={(event)=>{setType(event.target.value)}}
                     required
                    >

                      <option value="">Select Equipment Type</option>
                      <option value="Wheelchair">Wheelchair</option>
                      <option value="Oxygen Cylinder">Oxygen Cylinder</option>
                      <option value="Hospital Bed">Hospital Bed</option>
                      <option value="Crutches">Crutches</option>
                      <option value="Walker">Walker</option>
                      <option value="Nebulizer">Nebulizer</option>
                      <option value=" Blood Pressure Monitor"> Blood Pressure Monitor</option>
                      <option value="Glucose Meter">Glucose Meter</option>
                      <option value="Thermometer">Thermometer</option>

                    </Form.Select>
                  </Form.Group>
                </Col>

                 <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Rent Price
                    </Form.Label>

                    <Form.Control
                      type="number"
                      placeholder="₹ Price"
                      onChange={(event)=>{setRentPrice(event.target.value)}}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Quantity
                    </Form.Label>

                    <Form.Control
                      type="number"
                      min="1"
                      placeholder="Quantity"
                      onChange={(event)=>{setQuantity(event.target.value)}}
                    />
                  </Form.Group>
                </Col>

              </Row>

              <Row className="mb-3">

                <Col md={12}>

                  <Form.Group>

                    <Form.Label className="fw-semibold">
                      Equipment Information
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter equipment details and fetures"
                      onChange={(event)=>{setInformation(event.target.value)}}
                    />

                  </Form.Group>

                </Col>

              </Row>

              <div className="d-flex justify-content-center gap-3 mt-4">

                <Button
                  variant="secondary"
                  size="sm"
                  className="px-3"
                   onClick={() =>
                    window.history.back()
                  }
                >
                  Back
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="px-3"
                  type="submit"
                
                >
                  Submit

                </Button>

              </div>

            </Form>

          </Card.Body>

        </Card>

      </Container>
    </>
  );
}

export default EquipmentRental;
import React, { useEffect, useState } from "react";
import {Button,Card,Col,Container,Form,Row,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosConfig";

function EditEquipment() {
  const { id } = useParams();
  console.log(id);
  
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rentprice, setRentPrice] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [quantity, setQuantity] = useState("");
  const [information, setInformation] = useState("");

  const [fetching, setFetching] = useState(true);


  const getEquipment = async () => {
    try {
      // const result = await axios.get(`http://localhost:5000/api/equipment/getequip/${id}`);
      const result = await API.get(`/api/equipment/getequip/${id}`);

      console.log("Equipment Data:",result.data);

      const equipment = result.data.equipment;

      setName(equipment.name || "");
      setType(equipment.type || "");
      setRentPrice(equipment.rentprice || "");
     
      setQuantity(equipment.quantity || "");
      setInformation(equipment.information || "");
      setOldImage(equipment.image || "");

      setFetching(false);

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Unable to get equipment details"
      );
    }
  };

  useEffect(() => {
    getEquipment();
  }, [id]);

  const updateEquipment = async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("type", type);
    formData.append("rentprice", rentprice);
    formData.append("quantity", quantity);
    formData.append("information", information);

    if (image) {
      formData.append("image", image);
    }

    // const result = await axios.put(`http://localhost:5000/api/equipment/update/${id}`,
    const result = await API.put(`/api/equipment/update/${id}`,
      formData,{headers: {"Content-Type": "multipart/form-data",},});

    alert(result.data.message || "Equipment updated successfully");

    navigate("/viewequip");

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Unable to update equipment"
    );
  }
};

  return (

      <>
      <AdminNav />

      <Container className="py-5">

       
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">
            Edit Medical Equipment
          </h2>

          <p className="text-muted">
            Update equipment details and availability
          </p>
        </div>

        <Card className="shadow border-0 rounded-4">

          <Card.Body className="p-4 p-md-5">

           {!fetching &&(

            <Form onSubmit={updateEquipment}>

              <Row className="g-3 mb-3">

                <Col md={12}>
                  <Form.Group>

                    <Form.Label className="fw-semibold">
                      Equipment Image
                    </Form.Label>

                    
                      <div className="mb-3">

                        {/* <img src={`http://localhost:5000/uploads/${oldImage}`} */}
                        <img src={`${API.defaults.baseURL}/uploads/${oldImage}`}
                          alt="Equipment"
                          style={{
                            width: "150px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                          }}
                        />

                      </div>
                    
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(event)=>setImage(event.target.files[0])}
                    />
                    <Form.Text>Current file: <strong>{oldImage}</strong></Form.Text><br></br>

                    <Form.Text className="text-muted">
                      Select a new image if you want to change it.
                    </Form.Text>

                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>

                    <Form.Label className="fw-semibold">
                      Equipment Name
                    </Form.Label>

                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(event)=>setName(event.target.value)}
                      placeholder="Enter equipment name"
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
                      onChange={(event)=>setType(event.target.value)}
                    >

                      <option value="">
                        Select Equipment Type
                      </option>

                      <option value="Wheelchair">
                        Wheelchair
                      </option>

                      <option value="Oxygen Cylinder">
                        Oxygen Cylinder
                      </option>

                      <option value="Hospital Bed">
                        Hospital Bed
                      </option>

                      <option value="Crutches">
                        Crutches
                      </option>

                      <option value="Walker">
                        Walker
                      </option>

                      <option value="Nebulizer">
                        Nebulizer
                      </option>

                      <option value="Blood Pressure Monitor">
                        Blood Pressure Monitor
                      </option>

                      <option value="Glucose Meter">
                        Glucose Meter
                      </option>

                      <option value="Thermometer">
                        Thermometer
                      </option>

                    </Form.Select>

                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group>

                    <Form.Label className="fw-semibold">
                      Rent Price
                    </Form.Label>

                    <Form.Control
                      type="number"
                      min="0"
                      value={rentprice}
                      onChange={(event)=>setRentPrice(event.target.value)}
                      placeholder="₹ Price"
                      required
                    />

                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group>

                    <Form.Label className="fw-semibold">
                      Quantity
                    </Form.Label>

                    <Form.Control
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event)=>setQuantity(event.target.value)}
                      placeholder="Quantity"
                      required
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
                      value={information}
                      onChange={(event)=>setInformation(event.target.value)}
                      placeholder="Enter equipment information"
                      required
                    />

                  </Form.Group>

                </Col>

              </Row>

              <div className="d-flex justify-content-center gap-2 mt-4">

                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4"
                   type="submit"
                >
                  Update
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="px-4"
                  onClick={()=>navigate("/viewequip")}
                >
                  Cancel
                </Button>

              </div>

            </Form>

           )}

          </Card.Body>

        </Card>

      </Container>
    </>
  )
}

export default EditEquipment;


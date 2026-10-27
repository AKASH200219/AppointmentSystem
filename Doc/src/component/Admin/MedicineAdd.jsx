import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

function MedicineAdd() {
  const navigate = useNavigate();

  const [medicinename, setMedicinename] = useState("");
  const [image, setImage] = useState(null);
  const [genericname, setGenericname] = useState("");
  const [category, setCategory] = useState("");
  const [manufature, setManufature] = useState("");
  const [dosage, setDosage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discription, setDiscription] = useState("");

  const handleAddMedicine = async (event) => {
    event.preventDefault();

    if (!medicinename || !category || !price || !stock) {
      alert("Please fill in required fields (Medicine Name, Category, Price, Stock Quantity)");
      return;
    }

    if (!image) {
      alert("Please upload a medicine image");
      return;
    }

    try {
     
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", medicinename);
      formData.append("genericName", genericname);
      formData.append("category", category);
      formData.append("manufacturer", manufature);
      formData.append("dosage", dosage);
      formData.append("price", price);
      formData.append("quantity", stock);
      formData.append("expiryDate", expiry);
      formData.append("description", discription);

      // const result = await axios.post("http://localhost:5000/api/medicine/add", formData, {
      const result = await API.post("/api/medicine/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Add Medicine response:", result.data);
      alert(result.data.message || "Medicine registered successfully");
      navigate("/medicinestock");
    } 
    catch (err) {
      console.log("Failed to register medicine", err);
      alert(err.response?.data?.message || "Failed to register medicine");
    } 
  };

  return (
    <>
      <AdminNav />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1 text-primary">Add New Medicine</h2>
            <p className="text-muted mb-0">
              Register new medicine item in health store inventory
            </p>
          </div>
          <Button variant="outline-primary" onClick={() => navigate("/medicinestock")}>
            View Medicine Stock
          </Button>
        </div>

        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Body className="p-4">
            <Form onSubmit={handleAddMedicine}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Medicine Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter medicine name"
                      value={medicinename}
                      onChange={(e) => setMedicinename(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Medicine Image *</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Generic Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter generic name"
                      value={genericname}
                      onChange={(e) => setGenericname(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Category *</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                      <option value="Drops">Drops</option>
                      <option value="Ointment">Ointment</option>
                      <option value="Inhaler">Inhaler</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Manufacturer</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter manufacturer"
                      value={manufature}
                      onChange={(e) => setManufature(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Dosage</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Example: 500 mg"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Price (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Stock Quantity *</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Enter quantity"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter medicine description, usages, side effects info..."
                      value={discription}
                      onChange={(e) => setDiscription(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={12} className="text-end mt-4">
                  <Button
                    variant="secondary"
                    className="me-2 px-4"
                    onClick={() => navigate("/medicinestock")}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="px-4" >
                    Add medicine
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default MedicineAdd;

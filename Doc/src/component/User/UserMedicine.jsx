import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, InputGroup, Modal, Nav, Row, Table, } from "react-bootstrap";
import axios from "axios";
import UserNav from "./UserNav";


function UserMedicine() {
  const userId = localStorage.getItem("user");

  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selected, setSelected] = useState(null);

  const [tab, setTab] = useState("store");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [details, setDetails] = useState(false);
  const [order, setOrder] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    "All",
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Cream",
    "Drops",
    "Ointment",
    "Inhaler",
  ];


  const fetchMedicines = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/medicine/get");
      setMedicines(result.data.medicines || []);
    } catch (error) {
      console.log("Error fetching medicines:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/medicine/user-orders/${userId}`);

      setOrders(result.data.orders || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/usernav/userinfo/${userId}`);

      const user = result.data.result;

      setAddress(String(user?.address || ""));
      setPhone(String(user?.phone || ""));
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  const loadData = async () => {
    await fetchMedicines();
    await fetchOrders();
    await fetchUser();
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const getImage = (image) => {
    if (image) {
      return `http://localhost:5000/uploads/${image}`;
    }

  };


  const filteredMedicines = medicines.filter((medicine) => {
    const text = `${medicine.name} ${medicine.genericName} ${medicine.category}`.toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const categoryMatch = category === "All" || medicine.category?.toLowerCase() === category.toLowerCase();

    return searchMatch && categoryMatch;
  });

  const openDetails = (medicine) => {
    setSelected(medicine);
    setDetails(true);
  };

  const openOrder = (medicine) => {
    setSelected(medicine);
    setQuantity(1);
    setOrder(true);
  };


  const placeOrder = async () => {
    if (!selected) return;

    const typeAddress = String(address || "").trim();
    const typePhone = String(phone || "").trim();

    if (!typeAddress) {
      alert("Please enter your address");
      return;
    }

    if (!typePhone) {
      alert("Please enter your phone number");
      return;
    }

    if (quantity < 1) {
      alert("Please select a valid quantity");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/medicine/order`, {
        userId: userId,
        medicineId: selected._id,
        quantity: Number(quantity),
        address: typeAddress,
        phone: typePhone,
      });

      alert("Medicine order placed successfully!");

      setOrder(false);
      setSelected(null);
      setQuantity(1);

      await fetchOrders();
      setTab("orders");
    } catch (error) {
      console.log("Error placing order:", error);
      alert(
        error.response?.data?.message || "Failed to place medicine order"
      );
    }
  };


  const statusBadge = (status) => {
    if (status === "Accepted") {
      return <Badge bg="success">Accepted</Badge>;
    }

    if (status === "Delivered") {
      return <Badge bg="primary">Delivered</Badge>;
    }

    if (status === "Cancelled") {
      return <Badge bg="danger">Cancelled</Badge>;
    }

    return <Badge bg="warning" text="dark">Pending</Badge>;
  };


  const uploadPrescription = async () => {
    if (!prescriptionFile) {
      alert("Please select a prescription PDF");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("userId", userId);
      formData.append("prescription", prescriptionFile);

      await axios.post(
        "http://localhost:5000/api/medicine/prescriptionorder",
        formData
      );

      alert("Prescription uploaded successfully");

      setPrescriptionFile(null);

    } catch (error) {
      console.log("Upload error:", error);

      alert(
        error.response?.data?.message ||
        "Prescription upload failed"
      );

    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <UserNav />

      <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
        <Container className="py-4">

          <Card
            className="border-0 shadow-sm mb-4"
            style={{ borderRadius: "20px" }}
          >
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={7}>
                  <h2 className="fw-bold mb-2">
                    Medicine Store
                  </h2>

                  <p className="text-muted mb-0">
                    Order medicines easily and safely from our online store.
                  </p>
                </Col>

                <Col md={5} className="text-md-end mt-3 mt-md-0">
                  <Badge
                    bg="light"
                    text="dark"
                    className="px-3 py-2"
                    style={{ fontSize: "14px" }}
                  >
                    {orders.length} Orders
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Nav
            variant="pills"
            className="mb-4 bg-white p-2 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <Nav.Item>
              <Nav.Link
                active={tab === "store"}
                onClick={() => setTab("store")}
              >
                Medicine Store
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                active={tab === "orders"}
                onClick={() => {
                  setTab("orders");
                  fetchOrders();
                }}
              >
                My Orders
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                active={tab === "prescription"}
                onClick={() => setTab("prescription")}

              >
                Order By prescription
              </Nav.Link>
            </Nav.Item>


          </Nav>

          {tab === "store" && (
            <>

              <Card
                className="border-0 shadow-sm mb-4"
                style={{ borderRadius: "18px" }}
              >
                <Card.Body>
                  <InputGroup>
                    <InputGroup.Text></InputGroup.Text>

                    <Form.Control
                      placeholder="Search medicine..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </Card.Body>
              </Card>

              <div className="mb-4 d-flex flex-wrap gap-2">
                {categories.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={
                      category === item ? "primary" : "light"
                    }
                    className="rounded-pill px-3"
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>

              <Row>
                {filteredMedicines.length === 0 ? (
                  <Col>
                    <Card className="border-0 shadow-sm text-center p-5">
                      <h4> No medicines found</h4>
                      <p className="text-muted mb-0">
                        Try another search or category.
                      </p>
                    </Card>
                  </Col>
                ) : (filteredMedicines.map((medicine) => {
                  const stock = Number(medicine.quantity || 0);

                  return (
                    <Col
                      md={6}
                      lg={4}
                      className="mb-4"
                      key={medicine._id}
                    >
                      <Card
                        className="h-100 border-0 shadow-sm"
                        style={{
                          borderRadius: "20px",
                          overflow: "hidden",
                        }}
                      >

                        <div
                          style={{
                            height: "190px",
                            background: "#f8f9fa",
                          }}
                        >
                          <img
                            src={getImage(medicine.image)}
                            alt={medicine.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="fw-bold mb-0">
                              {medicine.name}
                            </h5>

                            <Badge bg="light" text="dark">
                              {medicine.category}
                            </Badge>
                          </div>

                          <p className="text-muted small mb-2">
                            {medicine.genericName || "Generic medicine"}
                          </p>

                          <p
                            className="text-muted small"
                            style={{
                              minHeight: "40px",
                            }}
                          >
                            {medicine.description ||
                              "Quality medicine available for order."}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold text-primary mb-0">
                              ₹{medicine.price}
                            </h5>

                            <small
                              className={
                                stock > 0
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {stock > 0
                                ? `${stock} in stock`
                                : "Out of stock"}
                            </small>
                          </div>

                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              className="w-50 rounded-pill"
                              onClick={() =>
                                openDetails(medicine)
                              }
                            >
                              Details
                            </Button>

                            <Button
                              variant="primary"
                              className="w-50 rounded-pill"
                              disabled={stock <= 0}
                              onClick={() =>
                                openOrder(medicine)
                              }
                            >
                              Order
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
                )}
              </Row>
            </>
          )}


          {tab === "orders" && (
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1"> My Orders</h4>
                    <p className="text-muted mb-0">
                      View your medicine orders
                    </p>
                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                    onClick={fetchOrders}
                  >
                    Refresh
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: "50px" }}></div>

                    <h5 className="mt-3">
                      No orders yet
                    </h5>

                    <p className="text-muted">
                      Your medicine orders will appear here.
                    </p>

                    <Button
                      variant="primary"
                      className="rounded-pill px-4"
                      onClick={() => setTab("store")}
                    >
                      Browse Medicines
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead>
                        <tr>
                          <th>Medicine / Info</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Phone</th>
                          <th>Date</th>
                          <th>Delivery Schedule</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orders.map((item) => (
                          <tr key={item._id}>
                            <td className="fw-semibold">
                              {item.prescription ? (
                                <div>
                                  <span className="text-primary"><i className="bi bi-file-earmark-medical me-1"></i>Prescription Upload</span>
                                </div>
                              ) : (
                                item.medicineName || "N/A"
                              )}
                            </td>

                            <td>{item.quantity || "N/A"}</td>

                            <td className="fw-bold">
                              {item.totalPrice != null ? `₹${item.totalPrice}` : "N/A"}
                            </td>

                            <td>
                              {String(item.phone || "-")}
                            </td>

                            <td>
                              {item.createdAt
                                ? new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td>
                              {item.deliveryTime ? (
                                <span className="text-info fw-semibold"><i className="bi bi-clock me-1"></i> {item.deliveryTime}</span>
                              ) : (
                                <span className="text-muted">Not Set</span>
                              )}
                            </td>

                            <td>
                              {statusBadge(item.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {tab === "prescription" && (
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1"> Order By Prescription</h4>
                    <p className="text-muted mb-0">
                      Upload your prescription to order medicines.
                    </p>
                  </div>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill"
                    onClick={() => setPrescriptionFile(null)}
                  >
                    Clear
                  </Button>
                </div>

                <Form.Group controlId="prescriptionFile" className="mb-3">
                  <Form.Label>Upload Prescription (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setPrescriptionFile(e.target.files[0])}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="rounded-pill px-4"
                  onClick={uploadPrescription}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Prescription"}
                </Button>
              </Card.Body>
            </Card>
          )}

        </Container>
      </div>

      <Modal
        show={details}
        onHide={() => setDetails(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Medicine Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selected && (
            <>
              <img
                src={getImage(selected.image)}
                alt={selected.name}
                className="w-100 rounded mb-3"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <h4 className="fw-bold">
                {selected.name}
              </h4>

              <p className="text-muted">
                {selected.genericName}
              </p>

              <hr />

              <p>
                <strong>Category:</strong>{" "}
                {selected.category || "-"}
              </p>

              <p>
                <strong>Dosage:</strong>{" "}
                {selected.dosage || "-"}
              </p>

              <p>
                <strong>Manufacturer:</strong>{" "}
                {selected.manufacturer || "-"}
              </p>

              <p>
                <strong>Expiry Date:</strong>{" "}
                {selected.expiryDate
                  ? new Date(
                    selected.expiryDate
                  ).toLocaleDateString()
                  : "-"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selected.description || "-"}
              </p>

              <h5 className="text-primary fw-bold">
                ₹{selected.price}
              </h5>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDetails(false)}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              setDetails(false);
              openOrder(selected);
            }}
          >
            Order Now
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={order}
        onHide={() => setOrder(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Place Medicine Order
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selected && (
            <>

              <Card className="border-0 bg-light mb-4">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={4}>
                      <img
                        src={getImage(selected.image)}
                        alt={selected.name}
                        className="w-100 rounded"
                        style={{
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>

                    <Col xs={8}>
                      <h6 className="fw-bold mb-1">
                        {selected.name}
                      </h6>

                      <p className="text-muted mb-1 small">
                        {selected.category}
                      </p>

                      <strong className="text-primary">
                        ₹{selected.price}
                      </strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Quantity
                </Form.Label>

                <Form.Control
                  type="number"
                  min="1"
                  max={Number(selected.quantity || 1)}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Number(e.target.value) || 1
                      )
                    )
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Delivery Address
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  Phone Number
                </Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </Form.Group>

              <Card className="border-0 bg-primary text-white">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">
                    Total Amount
                  </span>

                  <h4 className="fw-bold mb-0">
                    ₹
                    {(
                      Number(selected.price || 0) *
                      Number(quantity || 1)
                    ).toFixed(2)}
                  </h4>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setOrder(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={placeOrder}
          >
            Confirm Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserMedicine;
import React, { useEffect, useState } from "react";
import {Container,Row,Col,Card,Table,Form,Button,Badge,Modal,Nav,Dropdown,} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosConfig";

function MedicineStock() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("stock");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editMedicineData, setEditMedicineData] = useState({
    _id: "",
    name: "",
    genericName: "",
    category: "",
    manufacturer: "",
    dosage: "",
    price: "",
    quantity: "",
    expiryDate: "",
    description: "",
    image: "",
  });
  const [newImage, setNewImage] = useState(null);

  const fetchMedicines = async () => {
    try {
      // const result = await axios.get("http://localhost:5000/api/medicine/get");
      const result = await API.get("/api/medicine/get");
      setMedicines(result.data.medicines || []);
    } 
    catch (error) {
      console.log("Error fetching medicines:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      // const result = await axios.get("http://localhost:5000/api/medicine/orders");
      const result = await API.get("/api/medicine/orders");
      setOrders(result.data.orders || []);
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchOrders();
  }, []);

  const totalMedicines = medicines.length;
  const lowStockCount = medicines.filter((medicine) => medicine.quantity > 0 && medicine.quantity <= 10).length;
  const outOfStockCount = medicines.filter((m) => m.quantity === 0).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  const filteredMedicines = medicines.filter((item) => {
    const med = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(med) ||
      item.genericName?.toLowerCase().includes(med) ||
      item.category?.toLowerCase().includes(med)
    );
  });

  const handleEditClick = (item) => {
    setEditMedicineData({
      _id: item._id,
      name: item.name || "",
      genericName: item.genericName || "",
      category: item.category || "",
      manufacturer: item.manufacturer || "",
      dosage: item.dosage || "",
      price: item.price || "",
      quantity: item.quantity || "",
      expiryDate: item.expiryDate || "",
      description: item.description || "",
      image: item.image || "",
    });
    setNewImage(null);
    setShowEditModal(true);
  };

  const handleUpdateMedicine = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editMedicineData.name);
      formData.append("genericName", editMedicineData.genericName);
      formData.append("category", editMedicineData.category);
      formData.append("manufacturer", editMedicineData.manufacturer);
      formData.append("dosage", editMedicineData.dosage);
      formData.append("price", editMedicineData.price);
      formData.append("quantity", editMedicineData.quantity);
      formData.append("expiryDate", editMedicineData.expiryDate);
      formData.append("description", editMedicineData.description);
      if (newImage) {
        formData.append("image", newImage);
      }

      // const result = await axios.put(`http://localhost:5000/api/medicine/update/${editMedicineData._id}`,
      const result = await API.put(`/api/medicine/update/${editMedicineData._id}`,
        formData,{ headers: { "Content-Type": "multipart/form-data" } });

      alert(result.data.message || "Medicine updated successfully");
      setShowEditModal(false);
      fetchMedicines();
    } catch (error) {
      console.log("Error updating medicine:", error);
      alert(error.response?.data?.message || "Failed to update medicine");
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        // const result = await axios.delete(`http://localhost:5000/api/medicine/delete/${id}`);
         const result = await API.delete(`/api/medicine/delete/${id}`);
        alert(result.data.message || "Medicine deleted successfully");
        fetchMedicines();
      } catch (error) {
        console.log("Error deleting medicine:", error);
        alert(error.response?.data?.message || "Failed to delete medicine");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // const result = await axios.put(`http://localhost:5000/api/medicine/update-order-status/${orderId}`,{ status: newStatus });
      const result = await API.put(`/api/medicine/update-order-status/${orderId}`,{ status: newStatus });
      alert(result.data.message || `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.log("Error updating order status:", error);
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  return (
    <>
      <AdminNav />

      <div className="bg-light min-vh-100 py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-primary mb-1">
                Medicine & Order Management
              </h2>
              <p className="text-muted mb-0">
                Manage medicine stock inventory and customer orders
              </p>
            </div>
            <Button
              variant="primary"
              className="fw-semibold"
              onClick={() => navigate("/medicineAdd")}
            >
              + Add New Medicine
            </Button>
          </div>

          <Row className="g-3 mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Total Medicines</p>
                  <h3 className="fw-bold text-primary mb-0">{totalMedicines}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Low Stock (≤10)</p>
                  <h3 className="fw-bold text-warning mb-0">{lowStockCount}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Out of Stock</p>
                  <h3 className="fw-bold text-danger mb-0">{outOfStockCount}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Pending Orders</p>
                  <h3 className="fw-bold text-info mb-0">{pendingOrdersCount}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm rounded-3 mb-4">
            <Card.Body className="p-2">
              <Nav
                variant="pills"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="gap-2"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="stock"
                    className={`fw-semibold px-4 py-2 ${
                      activeTab === "stock" ? "bg-primary text-white" : "text-dark"
                    }`}
                  >
                    Medicine Stock List ({medicines.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="orders"
                    className={`fw-semibold px-4 py-2 ${
                      activeTab === "orders" ? "bg-primary text-white" : "text-dark"
                    }`}
                  >
                    Customer Orders ({orders.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>

          {activeTab === "stock" && (
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <Row className="align-items-center mb-4">
                  <Col md={6}>
                    <h5 className="fw-bold mb-0">Medicine Inventory List</h5>
                  </Col>

                  <Col md={6} className="mt-3 mt-md-0">
                    <Form.Control
                      type="text"
                      placeholder="Search medicine name, generic name, category..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Col>
                </Row>

                <div className="table-responsive">
                  <Table hover bordered className="align-middle mb-0 text-center">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Medicine Name</th>
                        <th>Category</th>
                        <th>Dosage</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Expiry</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMedicines.map((item, index) => {
                        let statusBadge;
                        if (item.quantity > 10) {
                          statusBadge = <Badge bg="success">Available</Badge>;
                        } else if (item.quantity > 0) {
                          statusBadge = (
                            <Badge bg="warning" text="dark">
                              Low Stock
                            </Badge>
                          );
                        } else {
                          statusBadge = <Badge bg="danger">Out of Stock</Badge>;
                        }

                        return (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>
                              <img
                                src={`${API.defaults.baseURL}/uploads/${item.image}`}
                                alt={item.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/50?text=Med";
                                }}
                              />
                            </td>
                            <td className="text-start">
                              <div className="fw-semibold">{item.name}</div>
                              {item.genericName && (
                                <small className="text-muted d-block">
                                  {item.genericName}
                                </small>
                              )}
                            </td>
                            <td>{item.category}</td>
                            <td>{item.dosage || "N/A"}</td>
                            <td className="fw-bold text-primary">₹{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.expiryDate || "N/A"}</td>
                            <td>{statusBadge}</td>
                            <td className="text-center">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => handleEditClick(item)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDeleteMedicine(item._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* TAB 2: CUSTOMER ORDERS LIST */}
          {activeTab === "orders" && (
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-primary mb-0">Customer Medicine Orders</h5>
                <Button variant="outline-primary" size="sm" onClick={fetchOrders}>
                  Refresh Orders
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover bordered className="align-middle mb-0 text-center">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Customer Details</th>
                        <th>Medicine / Prescription</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Delivery Address</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((item, index) => {
                          const customerName =
                            item.userId?.name || "Customer";
                          const customerPhone =
                            item.phone || item.userId?.phone || "N/A";
                          const orderDate = item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A";

                          let statusBadge;
                          switch (item.status) {
                            case "Pending":
                              statusBadge = <Badge bg="warning" text="dark">Pending</Badge>;
                              break;
                            case "Accepted":
                              statusBadge = <Badge bg="info">Accepted</Badge>;
                              break;
                            case "Delivered":
                              statusBadge = <Badge bg="success">Delivered</Badge>;
                              break;
                            case "Cancelled":
                              statusBadge = <Badge bg="danger">Cancelled</Badge>;
                              break;
                            default:
                              statusBadge = <Badge bg="secondary">{item.status}</Badge>;
                          }

                          return (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td className="text-start">
                                <div className="fw-semibold">{customerName}</div>
                                <small className="text-muted d-block">
                                  Phone: {customerPhone}
                                </small>
                              </td>
                              <td className="text-start">
                                {item.prescription ? (
                                  <a
                                    href={`${API.defaults.baseURL}/api/medicine/prescription/${item._id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-sm btn-outline-primary fw-bold"
                                  >
                                    <i className="bi bi-file-earmark-medical me-1"></i>
                                    View Prescription
                                  </a>
                                ) : (
                                  <div className="d-flex align-items-center gap-2">
                                    <img
                                      src={`${API.defaults.baseURL}/uploads/${item.image}`}
                                      alt={item.medicineName}
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                      }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://via.placeholder.com/40?text=Med";
                                      }}
                                    />
                                    <span>{item.medicineName}</span>
                                  </div>
                                )}
                              </td>
                              <td>{item.category || "N/A"}</td>
                              <td className="fw-bold">{item.quantity}</td>
                              <td>₹{item.price}</td>
                              <td className="fw-bold text-primary">
                                ₹{item.totalPrice}
                              </td>
                              <td className="text-start small" style={{ maxWidth: "160px" }}>
                                {item.address}
                              </td>
                              <td>{orderDate}</td>
                              <td>{statusBadge}</td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="outline-secondary"
                                    size="sm"
                                    id={`dropdown-${item._id}`}
                                  >
                                    Change Status
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleUpdateOrderStatus(item._id, "Pending")
                                      }
                                    >
                                      Mark as Pending
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleUpdateOrderStatus(item._id, "Accepted")
                                      }
                                    >
                                      Mark as Accepted
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleUpdateOrderStatus(item._id, "Delivered")
                                      }
                                    >
                                      Mark as Delivered
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                      className="text-danger"
                                      onClick={() =>
                                        handleUpdateOrderStatus(item._id, "Cancelled")
                                      }
                                    >
                                      Mark as Cancelled
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="11" className="py-4 text-muted">
                            No customer medicine orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      {/* EDIT MEDICINE MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Medicine Details</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateMedicine}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Medicine Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMedicineData.name}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Generic Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMedicineData.genericName}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        genericName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Select
                    value={editMedicineData.category}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        category: e.target.value,
                      })
                    }
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

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Manufacturer</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMedicineData.manufacturer}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        manufacturer: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Dosage</Form.Label>
                  <Form.Control
                    type="text"
                    value={editMedicineData.dosage}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        dosage: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={editMedicineData.price}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={editMedicineData.quantity}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Expiry Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editMedicineData.expiryDate}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Change Image (Optional)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files[0])}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editMedicineData.description}
                    onChange={(e) =>
                      setEditMedicineData({
                        ...editMedicineData,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default MedicineStock;
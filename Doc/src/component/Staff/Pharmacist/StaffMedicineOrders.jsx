import React, { useEffect, useState } from "react";
import {Container,Row,Col,Card,Table,Badge,Form,Button,Dropdown,InputGroup,} from "react-bootstrap";
import axios from "axios";
import StaffNav from "../StaffNav";

function StaffMedicineOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [staffInfo, setStaffInfo] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const staffId = localStorage.getItem("staff");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/medicine/orders");
      console.log("get Orders:",res);
      
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log("Error fetching orders for staff:", err);
    }
  };

  const fetchStaffDetails = async () => {
    if (!staffId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/staff/staffinfo/${staffId}`);
      if (res.data?.result) {
        setStaffInfo(res.data.result);
      }
    } catch (e) {
      try {
        const listRes = await axios.get("http://localhost:5000/api/staff/viewStaff");
        const found = listRes.data?.result?.find(
          (s) => s.commonKey === staffId || s._id === staffId
        );
        if (found) setStaffInfo(found);
      } catch (err) {
        console.log("Error fetching staff profile:", err);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStaffDetails();
  }, [staffId]);

  const isPharmacist = staffInfo?.staffType?.toLowerCase() === "pharmacist";

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!isPharmacist) {
      alert("Permission Denied: Only registered Pharmacists can accept or update medicine orders.");
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5000/api/medicine/update-order-status/${orderId}`,
        { status: newStatus }
      );
      alert(res.data.message || `Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.log("Error updating order status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const acceptedOrders = orders.filter((o) => o.status === "Accepted").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "All" ||
      order.status?.toLowerCase() === selectedStatus.toLowerCase();

    const query = searchTerm.toLowerCase();
    const customerName = order.userId?.name?.toLowerCase() || "";
    const customerPhone = (order.phone || order.userId?.phone || "").toLowerCase();
    const medicineName = order.medicineName?.toLowerCase() || "";
    const address = order.address?.toLowerCase() || "";

    const matchesSearch =
      customerName.includes(query) ||
      customerPhone.includes(query) ||
      medicineName.includes(query) ||
      address.includes(query);

    return matchesStatus && matchesSearch;
  });

 const getPrescriptionFile = async (orderId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/medicine/prescription/${orderId}`,
      {
        responseType: "blob",
      }
    );
    console .log("Prescription file fetched:", res);

    const file = new Blob([res.data], {
      type: res.headers["content-type"] || "application/pdf",
    });

    const url = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = `prescription_${orderId}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.log("Error fetching prescription file:", err);

    alert(
      err.response?.data?.message ||
      "Failed to fetch prescription file"
    );
  }
};
  return (
    <>
      <StaffNav />

      <div className="bg-light min-vh-100 py-4">
        <Container>
         
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-primary mb-1">
                Medical Store - Customer Orders
              </h2>
              <p className="text-muted mb-0">
                View buyer details, order info, and manage order fulfillment status.
              </p>
            </div>
            <Button variant="outline-primary" onClick={fetchOrders} className="fw-semibold">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
            </Button>
          </div>

          {staffInfo && !isPharmacist && (
            <div className="alert alert-warning d-flex align-items-center mb-4 rounded-3 shadow-sm border-warning" role="alert">
              <span className="me-2 fw-bold">⚠️ Notice ({staffInfo.staffType || "Staff"} Role):</span>
              <span>Only staff with <strong>Pharmacist</strong> role can accept or update customer medicine orders. You have read-only viewing permissions.</span>
            </div>
          )}

         
          <Row className="g-3 mb-4">
            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Total Orders</p>
                  <h3 className="fw-bold text-primary mb-0">{totalOrders}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Pending Approval</p>
                  <h3 className="fw-bold text-warning mb-0">{pendingOrders}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Accepted / Processing</p>
                  <h3 className="fw-bold text-info mb-0">{acceptedOrders}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm h-100 rounded-3">
                <Card.Body>
                  <p className="text-muted mb-1 fw-semibold">Delivered</p>
                  <h3 className="fw-bold text-success mb-0">{deliveredOrders}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

         
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <Row className="g-3 align-items-center">
                <Col md={6}>
                  <Form.Label className="fw-semibold small text-muted">
                    Search Buyer or Medicine
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search buyer name, phone, medicine name, address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                <Col md={6}>
                  <Form.Label className="fw-semibold small text-muted">
                    Filter Status
                  </Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {["All", "Pending", "Accepted", "Delivered", "Cancelled"].map(
                      (status) => (
                        <Button
                          key={status}
                          variant={
                            selectedStatus === status ? "primary" : "outline-secondary"
                          }
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => setSelectedStatus(status)}
                        >
                          {status}
                        </Button>
                      )
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover align-middle className="mb-0 text-center">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Buyer / Customer</th>
                      <th>Prescription</th>
                      <th>Medicine Name</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                      <th>Delivery Address</th>
                      <th>Order Date</th>
                      <th>Current Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((item, index) => {
                        const buyerName = item.userId?.name || "Customer";
                        const buyerPhone = item.phone || item.userId?.phone || "N/A";
                        const buyerEmail = item.userId?.email || "";
                        const orderDate = item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A";

                        let statusBadge;
                        switch (item.status) {
                          case "Pending":
                            statusBadge = (
                              <Badge bg="warning" text="dark">
                                Pending
                              </Badge>
                            );
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
                            statusBadge = (
                              <Badge bg="secondary">{item.status || "Pending"}</Badge>
                            );
                        }

                        return (
                          <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td className="text-start">
                              <div className="fw-bold text-dark">{buyerName}</div>
                              {buyerEmail && (
                                <small className="text-muted d-block">{buyerEmail}</small>
                              )}
                              <small className="text-primary d-block">
                                Ph: {buyerPhone}
                              </small>
                            </td>
                            <td>
                              {item.prescription ? (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => getPrescriptionFile(item._id)}
                                >
                                  Download
                                </Button>
                              ) : (
                                <span className="text-muted">No Prescription</span>
                              )}
                            </td>
                            <td className="text-start">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={`http://localhost:5000/uploads/${item.image}`}
                                  alt={item.medicineName}
                                  style={{
                                    width: "42px",
                                    height: "42px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                 
                                />
                                <div>
                                  <div className="fw-semibold">{item.medicineName}</div>
                                </div>
                              </div>
                            </td>
                            <td>{item.category || "N/A"}</td>
                            <td className="fw-bold">{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td className="fw-bold text-primary">₹{item.totalPrice}</td>
                            <td className="text-start small" style={{ maxWidth: "180px" }}>
                              {item.address}
                            </td>
                            <td>{orderDate}</td>
                            <td>{statusBadge}</td>
                            <td>
                              {isPharmacist ? (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    variant="outline-primary"
                                    size="sm"
                                    id={`staff-drop-${item._id}`}
                                  >
                                    Update Status
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
                              ) : (
                                <Badge bg="secondary" className="px-2 py-1 fw-normal">
                                  Pharmacist Access Required
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="11" className="py-5 text-muted">
                          <i className="bi bi-inbox fs-2 d-block mb-2 text-muted"></i>
                          No medicine orders found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default StaffMedicineOrders;

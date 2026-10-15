import React, { useEffect, useState } from "react";
import {Card,Col,Container,Row,Button,Modal,Form,Badge,} from "react-bootstrap";
import axios from "axios";
import UserNav from "./UserNav";

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);

  const userid = localStorage.getItem("user");

  const getEquipment = async () => {
    try {
      const result = await axios.get("http://localhost:5000/api/equipment/get");
      console.log("get equipment:", result);

      setEquipment(result.data.equipment || []);
    } 
    catch (error) {
      console.log(error);

      alert(error.response?.data?.message ||"Unable to get equipment");
    }
  };

  const handleRentClick = (item) => {
    setSelectedEquipment(item);
    setQuantity(1);
    setDays(1);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedEquipment(null);
  };

  const handleSubmit = async () => {
    if (!selectedEquipment) {
      return;
    }

    if (quantity < 1) {
      alert("Please enter valid quantity");
      return;
    }

    if (quantity > selectedEquipment.quantity) {
      alert("Quantity is not available");
      return;
    }

    if (days < 1) {
      alert("Please enter valid rental days");
      return;
    }

    const totalRent =
      Number(selectedEquipment.rentprice) *
      Number(quantity) *
      Number(days);

    try {
      const body = {
        userId: userid,
        equipmentId: selectedEquipment._id,
        equipmentName: selectedEquipment.name,
        equipmentType: selectedEquipment.type,
        quantity: Number(quantity),
        days: Number(days),
        rentprice: Number(selectedEquipment.rentprice),
        totalRent: totalRent,
      };

      console.log("Booking body:", body);

      const result = await axios.post(`http://localhost:5000/api/equipment/bookingEquipment/${selectedEquipment._id}`,body);

      console.log("Booking response:", result.data);

      alert(result.data.message ||"Equipment booked successfully");

      handleClose();

      getEquipment();
    } 
    catch (error) {
      console.log("Unable to book equipment:", error);

      alert(error.response?.data?.message ||"Unable to book equipment");
    }
  };

  useEffect(() => {
    getEquipment();
  }, []);

  return (
    <>
      <UserNav />

      <Container className="py-5">

        <div className="text-center mb-5">

          <Badge
            bg="primary"
            className="px-3 py-2 mb-3"
          >
            Medical Equipment Rental
          </Badge>

          <h2 className="fw-bold text-primary">
            Rent Medical Equipment
          </h2>

          <p className="text-muted">
            Choose the equipment you need and rent it
            for your required period.
          </p>

        </div>

        <Row className="g-4">

          {equipment.map((item) => (

            <Col key={item._id}xs={12}sm={6}md={4} lg={3}>

              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">

                <div style={{height: "210px",
                    backgroundColor: "#f5f7fa",}}>

                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    style={{
                      height: "210px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />

                </div>

                <Card.Body className="d-flex flex-column p-4">

                  <div className="mb-2">

                    <Badge
                      bg="light"
                      text="primary"
                      className="border"
                    >
                      {item.type}
                    </Badge>

                  </div>

                  <Card.Title className="fw-bold mb-2">
                    {item.name}
                  </Card.Title>

                  <p className="mb-2">

                    <strong>
                      Rent:
                    </strong>{" "}

                    <span className="text-primary fw-bold">
                      ₹{item.rentprice}
                    </span>

                    <span className="text-muted">
                      {" "} / day
                    </span>

                  </p>

                  <p className="mb-2">

                    <strong>
                      Available:
                    </strong>{" "}

                    {item.quantity > 0 ? (

                      <span className="text-success">
                        {item.quantity} units
                      </span>

                    ) : (

                      <span className="text-danger">
                        Out of stock
                      </span>

                    )}

                  </p>

                  <p
                    className="text-muted small"
                    style={{
                      minHeight: "60px",
                    }}
                  >
                    {item.information}
                  </p>

                  <Button
                    variant="primary"
                    className="w-100 mt-auto rounded-3"
                    disabled={item.quantity <= 0}
                    onClick={() => handleRentClick(item)}
                  >
                    {item.quantity > 0
                      ? "Rent Equipment"
                      : "Out of Stock"}
                  </Button>

                </Card.Body>

              </Card>

            </Col>

          ))}

        </Row>

      </Container>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
      >

        <Modal.Header closeButton>

          <Modal.Title className="fw-bold">
            Rent Equipment
          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          {selectedEquipment && (

            <>

              <div className="d-flex gap-3 mb-4">

                <img
                  src={`http://localhost:5000/uploads/${selectedEquipment.image}`}
                  alt={selectedEquipment.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div>

                  <h5 className="fw-bold">
                    {selectedEquipment.name}
                  </h5>

                  <p className="text-muted mb-1">
                    {selectedEquipment.type}
                  </p>

                  <p className="mb-1">
                    Available:{" "}
                    <strong>
                      {selectedEquipment.quantity}
                    </strong>{" "}
                    units
                  </p>

                  <p className="mb-0">
                    Price:{" "}
                    <strong className="text-primary">
                      ₹{selectedEquipment.rentprice}
                    </strong>{" "}
                    / day
                  </p>

                </div>

              </div>

              <Form.Group className="mb-3">

                <Form.Label className="fw-semibold">
                  Quantity
                </Form.Label>

                <Form.Control
                  type="number"
                  min="1"
                  max={selectedEquipment.quantity}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Number(event.target.value)
                    )
                  }
                />

                <Form.Text className="text-muted">
                  Available:{" "}
                  {selectedEquipment.quantity} units
                </Form.Text>

              </Form.Group>

              <Form.Group className="mb-3">

                <Form.Label className="fw-semibold">
                  Rental Days
                </Form.Label>

                <Form.Control
                  type="number"
                  min="1"
                  value={days}
                  onChange={(event) =>
                    setDays(
                      Number(event.target.value)
                    )
                  }
                />

              </Form.Group>

              <Card className="bg-light border-0">

                <Card.Body>

                  <div className="d-flex justify-content-between">

                    <span>Equipment</span>

                    <strong>{selectedEquipment.name}</strong>

                  </div>

                  <div className="d-flex justify-content-between mt-2">

                    <span>Rent / Day</span>

                    <strong>₹{selectedEquipment.rentprice}</strong>

                  </div>

                  <div className="d-flex justify-content-between mt-2">

                    <span>Quantity</span>

                    <strong>{quantity}</strong>

                  </div>

                  <div className="d-flex justify-content-between mt-2">

                    <span> Rental Days</span>

                    <strong>{days}</strong>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <span className="fw-bold">Total Rent</span>

                    <strong className="text-primary fs-5">
                      ₹{Number(selectedEquipment.rentprice) * Number(quantity) * Number(days)}
                    </strong>

                  </div>

                </Card.Body>

              </Card>

            </>

          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={
              !selectedEquipment ||
              quantity < 1 ||
              days < 1 ||
              quantity >
                selectedEquipment?.quantity
            }
          >
            Confirm Rental
          </Button>

        </Modal.Footer>

      </Modal>
    </>
  );
}

export default Equipment;

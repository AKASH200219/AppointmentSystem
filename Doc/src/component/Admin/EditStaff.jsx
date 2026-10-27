import React, { useEffect, useState } from "react";
import {Button,Card,Col,Container,Form,Row,Image} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axiosConfig";

function EditStaff() {

  const { staffid } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [staffType, setStaffType] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  const getStaff = async () => {

    try {

      // const result = await axios.get(`http://localhost:5000/api/staff/staffinfo/${staffid}`);
      const result = await API.get(`/api/staff/staffinfo/${staffid}`);

      console.log("Staff:", result.data);

      const staff = result.data.result;

      setName(staff.name);
      setPhone(staff.phone);
      setEmail(staff.email);
      setDob(staff.dob);
      setGender(staff.gender);
      setAddress(staff.address);
      setStaffType(staff.staffType);
      setQualification(staff.qualification);
      setExperience(staff.experience);
      setOldImage(staff.image);

    }

    catch (err) {

      console.log("Error:", err);

    }

  };

  const updateStaff = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("address", address);
      formData.append("staffType", staffType);
      formData.append("qualification", qualification);
      formData.append("experience", experience);

      if (image) {

        formData.append("image", image);

      }

      // const result = await axios.put(`http://localhost:5000/api/staff/updateStaff/${staffid}`,formData);
      const result = await API.put(`/api/staff/updateStaff/${staffid}`,formData);

      alert(result.data.message);

      navigate("/staffview");

    }

    catch (err) {

      console.log("Update Error:", err);

      alert("Failed to update staff");

    }

  };

  useEffect(() => {

    getStaff();

  }, [staffid]);

  return (

    <>

      <AdminNav />

      <Container className="py-5">

        <div className="text-center mb-4">

          <h2 className="fw-bold text-primary">Edit Staff</h2>

          <p className="text-muted">Update Staff details</p>

        </div>

        <Card className="shadow border-0 rounded-4 p-4">

          <Form onSubmit={updateStaff}>

            <Row>

              <Col md={6} className="mb-3">

                <Form.Label> Staff Name</Form.Label>

                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) =>setName(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Phone</Form.Label>

                <Form.Control
                  type="number"
                  value={phone}
                  onChange={(e) =>setPhone(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) =>setEmail(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Date of Birth</Form.Label>

                <Form.Control
                  type="date"
                  value={dob}
                  onChange={(e) =>setDob(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Gender</Form.Label>

                <Form.Select
                  value={gender}
                  onChange={(e) =>setGender(e.target.value)}
                >

                  <option value="">Select Gender</option>
                  <option value="Male"> Male</option>
                  <option value="Female">Female</option>
                  
                </Form.Select>

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Staff Type</Form.Label>

                <Form.Select
                  value={staffType}
                  onChange={(e) =>setStaffType(e.target.value)}
                >

                  <option value="">Select Staff Type </option>
                  <option value="Care Assistant">Care Assistant</option>
                  <option value="Nurse"> Nurse</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Pharmacist"> Pharmacist </option>
                  {/* <option value="Lab Technician">Lab Technician</option> */}

                </Form.Select>

              </Col>

              <Col md={12} className="mb-3">

                <Form.Label>Address</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  value={address}
                  onChange={(e) =>setAddress(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Qualification</Form.Label>

                <Form.Control
                  type="text"
                  value={qualification}
                  onChange={(e) =>
                    setQualification(e.target.value)
                  }
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Experience</Form.Label>

                <Form.Control
                  type="number"
                  value={experience}
                  onChange={(e) =>setExperience(e.target.value)}
                />

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Current Image</Form.Label>

                <br />

                {oldImage && (

                  <Image
                    // src={`http://localhost:5000/uploads/${oldImage}`}
                    src={`${API.defaults.baseURL}/uploads/${oldImage}`}
                    width="100"
                    height="100"
                    rounded
                    style={{
                      objectFit: "cover"
                    }}
                  />

                )}

              </Col>

              <Col md={6} className="mb-3">

                <Form.Label>Change Image</Form.Label>

                <Form.Control
                  type="file"
                  onChange={(e) =>setImage(e.target.files[0])}
                />

              </Col>

            </Row>

            <div className="text-center mt-3">

              <Button
                type="submit"
                variant="primary"
                className="me-2"
              >

                Update Staff

              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() =>navigate("/staffview")}
              >

                Cancel

              </Button>

            </div>

          </Form>

        </Card>

      </Container>

    </>

  );

}

export default EditStaff;
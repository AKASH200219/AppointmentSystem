import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import UserNav from "./UserNav";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../../api/axiosConfig";
function DoctorPage() {
 const [doctorinfo,setDoctorinfo]=useState([]);

  const Doctorinfo = async()=>{
    try{
      // const result = await axios.get("http://localhost:5000/api/doctorpage/doctorinfo")
      const result = await API.get("/api/doctorpage/doctorinfo")
      console.log("Successfully get Doctorinfo",result);
      setDoctorinfo(result.data.doctorData);
      
    }
    catch(err){
      console.log("Can't get doctor details",err);
      
    }
  }
  useEffect(()=>{
    Doctorinfo();
  },[])
  
  return (
    <>
     <UserNav />

      <Container className="py-5">

        <h2 className="text-center fw-bold mb-2">Our Doctors</h2>

      <p className="text-center text-muted mb-5">
        Choose your preferred doctor and book an appointment.
      </p>

    <Row className="g-4">

      {doctorinfo.map((doctor) => (

      <Col lg={3} md={6} sm={6} xs={12} key={doctor._id}>

        <Card className="shadow border-0 h-100">

          <Card.Img
          variant="top"
        //  src={`http://localhost:5000/uploads/${doctor.image}`}
        src={`${API.defaults.baseURL}/uploads/${doctor.image}`}
          style={{
         height: "250px",
          objectFit: "cover",
        objectPosition: "center 20%"
        }}
  onError={(e) => console.log("Image error:", e.target.src)}
        />

          <Card.Body className="text-center">

            <h5 className="fw-bold">
              Dr.{doctor.name}
            </h5>

            <p className="text-primary mb-1">
              {doctor.specialization}
            </p>

            <p className="text-muted small">
              {doctor.qualification}
            </p>

            <p className="mb-3">
              {doctor.available}
            </p>

            <div className="d-grid gap-2">

              <Button
                variant="outline-primary"
                as={Link}
                to={`/doctorprofile/${doctor._id}`}
              >
                View Profile
              </Button>

              <Button
                variant="primary"
                as={Link}
                to={`/bookappointment/${doctor._id}`}
              >
                Book Appointment
              </Button>

            </div>

          </Card.Body>

        </Card>

      </Col>

    ))}

    </Row>

    </Container>
  </>
   
  );
}

export default DoctorPage;
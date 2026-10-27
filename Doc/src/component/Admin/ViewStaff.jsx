import React, { useEffect, useState } from "react";
import {Button,Card,Container,Table,Image,Alert} from "react-bootstrap";
import AdminNav from "./AdminNav";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import API from "../../api/axiosConfig";


function ViewStaff() {

  const [Staff, setViewStaff] = useState([]);
  const navigate =useNavigate();

  const viewStaff = async () => {

    try {

      // const result = await axios.get( "http://localhost:5000/api/staff/viewStaff");
      const result = await API.get( "/api/staff/viewStaff");
      console.log("Staff:", result.data);

      setViewStaff(result.data.result);

    }

    catch (err) {

      console.log("Error:", err);
    }

  };

  const deleteStaff = async (staffid) => {

    try {

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this staff?"
      );

      if (!confirmDelete) {

        return;

      }

      // const result = await axios.delete(`http://localhost:5000/api/staff/deleteStaff/${staffid}`);
      const result = await API.delete(`/api/staff/deleteStaff/${staffid}`);

      alert(result.data.message);
      viewStaff();

    }

    catch (err) {

      console.log("Delete Error:", err);

      alert("Failed to delete staff");

    }

  };

  useEffect(() => {

    viewStaff();

  }, []);

  return (

    <>

      <AdminNav />

      <Container className="py-5">

        <div className="text-center mb-4">

          <h2 className="fw-bold text-primary">
            View Staff
          </h2>

          <p className="text-muted">
            View and manage staff details
          </p>

        </div>
        <div className="d-flex align-items-center gap-3 mb-4">
            <Button
              as={Link}
              to="/staffregister"
              variant="primary"
              className="d-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
            >
              <FaPlus /> Add Staff
            </Button>
          </div>
        

        <Card className="shadow border-0 rounded-4">

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
                  <th>Staff Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>DoB</th>
                  <th>Gender</th>
                  <th>Staff Type</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {Staff.map((staff, index) => (

                  <tr key={staff._id}>

                    <td>{index + 1}</td>
                    <td>{staff.image ? (

                        <Image
                          // src={`http://localhost:5000/uploads/${staff.image}`}
                          src={`${API.defaults.baseURL}/uploads/${staff.image}`}
                          roundedCircle
                          width="60"
                          height="60"
                          style={{
                            objectFit: "cover"
                          }}
                        />

                      ) : ("No Image")}

                    </td>
                    <td>{staff.name} </td>
                    <td>{staff.phone}</td>
                    <td>{staff.email}</td>
                    <td>{staff.dob}</td>
                    <td>{staff.gender}</td>
                    <td>{staff.staffType} </td>
                    <td>{staff.qualification}</td>
                    <td>{staff.experience} years</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">

                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() =>navigate(`/editStaff/${staff._id}`)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>deleteStaff(staff._id)}>
                          Delete
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </Table>

          </div>

        </Card>

      </Container>

    </>

  );

}

export default ViewStaff;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Card } from "react-bootstrap";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      

      if (!token) {
        setError("You must be logged in as admin.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/admin/myStudents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      setStudents(res.data);
      
      
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStudents();
  }, []);

  return (
    <Card className="p-4 shadow-sm" style={{marginTop:'80px'}}>
      <h3 className="mb-3 text-center">My Students</h3>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && students.length === 0 && (
        <Alert variant="info">No students created yet.</Alert>
      )}

      {!loading && students.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.studentId}</td>
                <td>{s.sName}</td>
                <td>{s.sEmail}</td>
                <td>{s.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
};

export default MyStudents;

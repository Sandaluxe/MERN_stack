import React, { useState, useEffect, useRef } from 'react';
import { Table, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Usertable = () => {
  const [users, setItems] = useState([]);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:3001/users/${userId}`, {
          method: 'DELETE',
        });
        setItems((prevUsers) => prevUsers.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdate = (userId) => {
    navigate(`/edituser/${userId}`);
    console.log('Update user with ID:', userId);
  };

  // Function to generate and download PDF
  const handleDownloadPDF = async () => {
    const input = componentRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("Users_Report.pdf");
    alert("Users Report Successfully Downloaded!");
  };

  return (
    <>
      <Button color="secondary" onClick={handleDownloadPDF} className="mb-3">
        Download PDF
      </Button>
      <div ref={componentRef}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.age}</td>
                <td>
                  <Button color="primary" onClick={() => handleUpdate(user._id)} className="me-2">
                    Update
                  </Button>
                  <Button color="danger" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Usertable;

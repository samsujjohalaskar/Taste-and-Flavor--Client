import React, { useState } from 'react';
import '../css/signin.css';
import { BASE_URL } from '../utils/services';

export default function Edit({ onClose, data, }) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: data.username,
    email: data.email,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber
  });

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, email, fullName, phoneNumber } = formData;
    try {
      const res = await fetch(`${BASE_URL}/update-owner-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, email, fullName, phoneNumber,
        }),
      });

      const data = await res.json();
      // console.log(data);

      if (res.status === 422 || !data) {
        window.alert("All Fields are Mandatory.");
      } else if (res.status === 404) {
        window.alert("User not found.");
      } else if (res.status === 500) {
        window.alert("Internal server error.");
      } else if (res.status === 200) {
        window.alert("User details updated successfully.");
        onClose();
      } else {
        window.alert(res.json);
      }
    } catch (error) {
      window.alert("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay show-overlay">
      <div className="modal">
        <h2>Edit User Details</h2>
        <form onSubmit={(e) => handleEdit(e)}>
          <div className="form-group">
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Full Name:</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <button className='subLogin button' type="submit">{loading ? "Saving..." : "Save"}</button>
          <span><button className='close button' onClick={onClose}>Close</button></span>
        </form>
      </div>
    </div>
  );
}

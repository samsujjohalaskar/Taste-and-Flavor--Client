import React, { useState } from 'react';
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
    <div className="fixed flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20">
      <div className="flex flex-col justify-center items-center gap-6 bg-white p-12 shadow-review">
        <p className='text-lg font-bold'>Edit User Details</p>
        <form className='flex flex-col items-center gap-4' onSubmit={(e) => handleEdit(e)}>
          <input className="w-[280px] p-4 bg-bg outline-none" type="text" name="username" value={formData.username} onChange={handleChange} required />
          <input className="w-[280px] p-4 bg-bg outline-none" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <input className="w-[280px] p-4 bg-bg outline-none" type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <input className="w-[280px] p-4 bg-bg outline-none" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          <button className='w-[280px] p-3 bg-theme text-white font-bold text-xl hover:opacity-80' type="submit">{loading ? "Saving..." : "Save"}</button>
        </form>
      </div>
      <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={onClose}>×</div>
    </div>
  );
}

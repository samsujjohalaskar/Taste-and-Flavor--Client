import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';

const LogoutButton = ({ userData, handleUserData }) => {

  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (userData) {
      fetch(`${BASE_URL}/owner-logout`, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      }).then((res) => {
        if (res.status === 200) {
          handleUserData();
          window.alert("Logged Out Successfully.");
          navigate("/owner-login", { replace: true });
        } else {
          const err = new Error(res.err);
          console.log(err);
        }
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log("Error Found.");
    }
  };

  return (
    <FaPowerOff className="cursor-pointer hover:text-theme mt-6" title='Logout' onClick={handleLogout} size={25} />
  );
};

export default LogoutButton;

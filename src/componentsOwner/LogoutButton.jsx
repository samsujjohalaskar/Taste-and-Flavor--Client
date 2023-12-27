import React from 'react';
import { FaPowerOff } from 'react-icons/fa';
import "../css/logoutButton.css";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/services';

const LogoutButton = ({userData}) => {

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
              window.alert("Logged Out Successfully.");
              navigate("/owner-login");
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
        <div className="logout-button" onClick={handleLogout}>
            <div className="icon">
                <FaPowerOff />
            </div>
        </div>
    );
};

export default LogoutButton;

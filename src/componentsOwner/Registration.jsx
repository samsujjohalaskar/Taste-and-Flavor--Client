import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/ownerLogin.css";
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { BASE_URL } from '../utils/services';

const Registration = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const [seeCPassword, setSeeCPassword] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password, cPassword, email, fullName, phoneNumber } = owner;

    if (password === cPassword) {
      try {
        const res = await fetch(`${BASE_URL}/owner-registration`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username, password, email, fullName, phoneNumber,
          }),
        });

        const data = await res.json();

        if (res.status === 422 || !data) {
          window.alert("All Fields are Mandatory.");
        } else if (res.status === 421) {
          window.alert("User Exist. Enter a different Username.");
        } else if (res.status === 423) {
          window.alert("Email already Registered");
        } else if (res.status === 201) {
          window.alert("Registration Successful.");
          navigate("/owner-login");
        } else {
          window.alert(res.json);
        }
      } catch (error) {
        window.alert("Error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      window.alert("Passwords do not match.");
      setLoading(false);
    }

  };

  const [owner, setOwner] = useState({
    username: "", password: "", cPassword: "", email: "", fullName: "", phoneNumber: ""
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setOwner({ ...owner, [name]: value });
  };

  return (
    <>
      <div class="form-container">
        <h2>Restaurant Owner Registration</h2>
        <form id="signup-form" method='POST' onSubmit={handleRegistration}>
          <div class="form-group">
            <input type="text" id="username" name="username" placeholder='Username' required value={owner.username} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <span className='password-hide' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
            <input type={`${seePassword ? "" : "password"}`} id="password" name="password" placeholder='Password' required value={owner.password} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <span className='password-hide' onClick={() => setSeeCPassword(!seeCPassword)}>{!seeCPassword ? (<LuEye />) : (<LuEyeOff />)}</span>
            <input type={`${seeCPassword ? "" : "password"}`} id="cPassword" name="cPassword" placeholder='Confirm Password' required value={owner.cPassword} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="email" id="email" name="email" placeholder='Email' required value={owner.email} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="text" id="fullName" name="fullName" placeholder='Full Name' required value={owner.fullName} onChange={handleInputs} />
          </div>
          <div class="form-group">
            <input type="tel" id="phoneNumber" name="phoneNumber" placeholder='Mobile' required value={owner.phoneNumber} onChange={handleInputs} />
          </div>
          <button type="submit" class="submit-btn button" disabled>{loading ? "Registering..." : "Disabled"}</button>
        </form>
        <br />
        <p>Already registered? <Link to="/owner-login">Login here</Link></p>
      </div>
    </>
  )
}

export default Registration;


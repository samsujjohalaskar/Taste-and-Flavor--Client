import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="fixed flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20">
      <div className="flex flex-col justify-center items-center gap-6 bg-white p-12 shadow-review">
        <p className='text-lg font-bold'>Restaurant Owner Registration</p>
        <form className='flex flex-col gap-4' id="signup-form" method='POST' onSubmit={handleRegistration}>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="text" id="username" name="username" placeholder='Username' required value={owner.username} onChange={handleInputs} />
          </div>
          <div className="flex items-center w-[280px] p-4 bg-bg">
            <input className="flex-1 bg-bg outline-none mr-1" type={`${seePassword ? "" : "password"}`} id="password" name="password" placeholder='Password' required value={owner.password} onChange={handleInputs} />
            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
          </div>
          <div className="flex items-center w-[280px] p-4 bg-bg">
            <input className="flex-1 bg-bg outline-none mr-1" type={`${seeCPassword ? "" : "password"}`} id="cPassword" name="cPassword" placeholder='Confirm Password' required value={owner.cPassword} onChange={handleInputs} />
            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeeCPassword(!seeCPassword)}>{!seeCPassword ? (<LuEye />) : (<LuEyeOff />)}</span>
          </div>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="email" id="email" name="email" placeholder='Email' required value={owner.email} onChange={handleInputs} />
          </div>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="text" id="fullName" name="fullName" placeholder='Full Name' required value={owner.fullName} onChange={handleInputs} />
          </div>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="tel" id="phoneNumber" name="phoneNumber" placeholder='Mobile' required value={owner.phoneNumber} onChange={handleInputs} />
          </div>
          <button className='w-[280px] p-3 bg-theme text-white font-bold text-xl hover:opacity-80' type="submit" disabled>{loading ? "Registering..." : "Disabled"}</button>
        </form>
        <p>Already registered? <Link className='text-reviews cursor-pointer' to="/owner-login">Login here</Link></p>
      </div>
    </div>
  )
}

export default Registration;


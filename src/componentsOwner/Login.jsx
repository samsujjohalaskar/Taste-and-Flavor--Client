import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/ownerLogin.css";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { BASE_URL } from '../utils/services';

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const [owner, setOwner] = useState({
    username: "", password: ""
  });

  let name, value;
  const handleInputs = (e) => {
    name = e.target.name;
    value = e.target.value;

    setOwner({ ...owner, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { username, password } = owner;
    try {
      const res = await fetch(`${BASE_URL}/owner-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username, password,
        }),
      });

      const data = await res.json();

      if (res.status === 400 || !data) {
        window.alert("Invalid Credentials.");
      } else if (res.status === 201) {
        window.alert("Logged in Successfully.");
        navigate("/owner-home");
      } else {
        window.alert("Error:", data.message);
      }
    } catch (error) {
      window.alert("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-container">
        <h2>Restaurant Owner Login</h2>
        <form id="signup-form" onSubmit={(e) => { handleLogin(e) }}>
          <div className="form-group">
            <input type="text" id="username" name="username" placeholder='Username' required value={owner.username} onChange={handleInputs} />
          </div>
          <div className="form-group">
            <span className='password-hide' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
            <input type={`${seePassword ? "" : "password"}`} id="password" name="password" placeholder='Password' required value={owner.password} onChange={handleInputs} />
          </div>
          <button type="submit" className="submit-btn button">{loading ? "Logging in..." : "Login"}</button>
        </form>
        <br />
        <p>New here? <Link to="/owner-registration">Register here</Link></p>
      </div>
    </>
  )
}

export default Login;


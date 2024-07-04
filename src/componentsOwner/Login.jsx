import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuEye, LuEyeOff } from "react-icons/lu";
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';

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
    <div className="fixed flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20">
      <div className="flex flex-col justify-center items-center gap-6 bg-white p-12 shadow-review">
        <p className='text-lg font-bold'>Restaurant Owner Login</p>
        <form className='flex flex-col gap-4' id="signup-form" onSubmit={(e) => { handleLogin(e) }}>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="text" id="username" name="username" placeholder='Username' required value={owner.username} onChange={handleInputs} />
          </div>
          <div className="flex items-center w-[280px] p-4 bg-bg">
            <input className="flex-1 bg-bg outline-none mr-1" type={`${seePassword ? "" : "password"}`} id="password" name="password" placeholder='Password' required value={owner.password} onChange={handleInputs} />
            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
          </div>
          <button className='w-[280px] p-3 bg-theme text-white font-bold text-xl hover:opacity-80' type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p>New here? <Link className='text-reviews cursor-pointer' to="/owner-registration">Register here</Link></p>
      </div>
      {loading && <Loading />}
    </div>
  )
}

export default Login;


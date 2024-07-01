import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Loading from './Loading';
import Swal from 'sweetalert2';

export default function Signin({ onClose, handleSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleSignin = async (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.fire({
        icon: "success",
        title: "Logged in Successfully!"
      });
      onClose();
      navigate(currentPath);
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20">
      <div className="flex flex-col justify-center items-center bg-white p-12 shadow-review">
        <form className='flex flex-col gap-4' onSubmit={(e) => { handleSignin(e); }}>
          <div>
            <input className="w-[280px] p-4 bg-bg outline-none" type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex items-center w-[280px] p-4 bg-bg">
            <input className="flex-1 bg-bg outline-none mr-1" type={`${seePassword ? "" : "password"}`} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
          </div>
          {error && <div className="text-sm mb-2 text-red-600">{error}</div>}
          <button className='w-[280px] p-3 bg-theme text-white font-bold text-xl hover:opacity-80' type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className='mt-4'>
          New here? <span className='text-reviews cursor-pointer' onClick={handleSignUp}> Register</span>
        </div>
      </div>
      <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={onClose}>×</div>
      {isLoading && <Loading />}
    </div>
  );
}

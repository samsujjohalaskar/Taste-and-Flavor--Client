import React, { useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../css/signin.css';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { IoMdClose } from 'react-icons/io';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export default function Signin({ onClose, handleSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    const currentPath = window.location.pathname;
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully!');
      onClose();
      navigate(currentPath);
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overlay show-overlay signup-model-overlay">
      <div className="modal signup-model">
        <form onSubmit={(e) => { handleSignin(e); }}>
          <div className="form-group sign-up-form">
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group sign-up-form">
            <span className='password-hide-user' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
            <input type={`${seePassword ? "" : "password"}`} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="signup-error-message">{error}</div>}
          <button className='subLogin button login-form-button' type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>        </form>
        <div className='signup-sign'>
          New here? <span onClick={handleSignUp}> Register</span>
        </div>
      </div>
      <div className='signup-close-icon' onClick={onClose}><IoMdClose /></div>
    </div>
  );
}

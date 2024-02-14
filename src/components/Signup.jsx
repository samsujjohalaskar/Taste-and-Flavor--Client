import React, { useState } from 'react';
import { auth } from '../firebase';
import '../css/signin.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { IoMdClose } from 'react-icons/io';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Loading from './Loading';
import Swal from 'sweetalert2';

const Signup = ({ onClose, handleSignIn }) => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seePassword, setSeePassword] = useState(false);
    const [seeCPassword, setSeeCPassword] = useState(false);

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

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password === cPassword) {
            try {
                setLoading(true);
                await createUserWithEmailAndPassword(auth, email, password);

                const user = auth.currentUser;
                await updateProfile(user, {
                    displayName: displayName
                });
                Toast.fire({
                    icon: "success",
                    title: "Signed in Successfully!"
                });
                onClose();
            } catch (error) {
                if (error.code === "auth/email-already-in-use") {
                    setError("Email already registered, use another email");
                } else {
                    setError(error.code);
                }
            } finally {
                setLoading(false);
            }
        } else {
            setError("Passwords do not match.");
        }
    };

    return (
        <>
            <div className="overlay show-overlay signup-model-overlay">
                <div className="modal signup-model">
                    <form onSubmit={(e) => { handleSignup(e); }}>
                        <div className="form-group sign-up-form">
                            <input type="text" placeholder='Full name' value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        </div>
                        <div className="form-group sign-up-form">
                            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group sign-up-form">
                            <span className='password-hide-user' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
                            <input type={`${seePassword ? "" : "password"}`} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="form-group sign-up-form">
                            <span className='password-hide-user' onClick={() => setSeeCPassword(!seeCPassword)}>{!seeCPassword ? (<LuEye />) : (<LuEyeOff />)}</span>
                            <input type={`${seeCPassword ? "" : "password"}`} placeholder='Confirm Password' value={cPassword} onChange={(e) => setCPassword(e.target.value)} required />
                        </div>
                        {error && <div className="signup-error-message">{error}</div>}
                        <button className='subLogin button login-form-button' type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <div className='signup-sign'>
                        Have an account? <span onClick={handleSignIn}> Login</span>
                    </div>
                </div>
                <div className='signup-close-icon' onClick={onClose}><IoMdClose /></div>
                {loading && <Loading />}
            </div>
        </>
    );
}

export default Signup;
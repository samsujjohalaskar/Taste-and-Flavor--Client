import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
            <div className="fixed flex flex-col justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20">
                <div className="flex flex-col justify-center items-center bg-white p-12 shadow-review">
                    <form className='flex flex-col gap-4' onSubmit={(e) => { handleSignup(e); }}>
                        <div>
                            <input className="w-[280px] p-4 bg-bg outline-none" type="text" placeholder='Full name' value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        </div>
                        <div>
                            <input className="w-[280px] p-4 bg-bg outline-none" type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="flex items-center w-[280px] p-4 bg-bg">
                            <input className="flex-1 bg-bg outline-none mr-1" type={`${seePassword ? "" : "password"}`} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeePassword(!seePassword)}>{!seePassword ? (<LuEye />) : (<LuEyeOff />)}</span>
                        </div>
                        <div className="flex items-center w-[280px] p-4 bg-bg">
                            <input className="flex-1 bg-bg outline-none mr-1" type={`${seeCPassword ? "" : "password"}`} placeholder='Confirm Password' value={cPassword} onChange={(e) => setCPassword(e.target.value)} required />
                            <span className='w-max cursor-pointer text-gray-800' onClick={() => setSeeCPassword(!seeCPassword)}>{!seeCPassword ? (<LuEye />) : (<LuEyeOff />)}</span>
                        </div>
                        {error && <div className="text-sm mb-2 text-red-600">{error}</div>}
                        <button className='w-[280px] p-3 bg-theme text-white font-bold text-xl hover:opacity-80' type="submit" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <div className='mt-4'>
                        Have an account? <span className='text-reviews cursor-pointer' onClick={handleSignIn}> Login</span>
                    </div>
                </div>
                <div className='flex justify-center items-center mt-3 bg-border h-10 w-10 rounded-full text-white text-3xl cursor-pointer' onClick={onClose}>×</div>
                {loading && <Loading />}
            </div>
        </>
    );
}

export default Signup;
import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"

const FooterBottom = () => {
    return (
        <section className="flex justify-center items-center flex-col pt-6 pb-12 h-max w-full border-b-2 border-bg md:py-14">
            <div className='flex flex-col justify-center items-center w-full text-text xl:w-[1140px] 2xl:w-[1200px]'>
                <div>
                    <img className="h-[60px] w-64" src={logo} alt="Taste&Flavor" />
                </div>
                <div>
                    <p className='text-sm'>Every Bite Speaks Taste, Flavorful Journey</p>
                </div>
                <div className='flex gap-1'>Write to us at: <p><Link className='text-black font-extrabold' to="https://mail.google.com/mail/?view=cm&fs=1&to=samsujjohalaskar@gmail.com"> samsujjohalaskar@gmail.com</Link></p></div>
                <div>
                    <p className='text-sm'>© 2023 - Taste&Flavor All Rights Reserved</p>
                </div>
            </div>
        </section>
    )
}

export default FooterBottom

import React from 'react';
import { FaSearch } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';

const PageLoading = ({ link }) => {
    return (
        <>
            <div className="flex justify-center items-center gap-8 pt-20">
                <div className='flex gap-3 justify-center items-center'>
                    <FaSearch size={30} className='animate-ping' />
                    <h3>Page Loading...</h3>
                </div>
                <Link to={link}><AiFillHome className='hover:text-theme' size={25} title='Back Home' /></Link>
            </div>
        </>
    )
}

export default PageLoading;

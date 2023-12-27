import React from 'react';
import "../css/ownerHome.css";
import { FaSearch } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { Link } from 'react-router-dom';

const PageLoading = ({link}) => {
    return (
        <>
            <div className="container">
                <div className="subItems">
                    <div className="icon"><FaSearch /></div>
                    <div className="content"><h3>Page Loading...</h3></div>
                </div>
                <Link to={link} className=" icon"><AiFillHome title='Back Home'/></Link>
            </div>
        </>
    )
}

export default PageLoading;

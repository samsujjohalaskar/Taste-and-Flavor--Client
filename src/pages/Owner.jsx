import React, { useEffect, useState } from 'react';
import "../css/ownerHome.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaHouseUser } from "react-icons/fa";
import { AiTwotoneEdit } from "react-icons/ai";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../componentsOwner/LogoutButton';
import Edit from '../componentsOwner/Edit';
import PageLoading from '../componentsOwner/PageLoading';
import { BASE_URL } from '../utils/services';


const Owner = () => {

  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [userData, setUserData] = useState(null);

  const callHomePage = async () => {
    try {
      const res = await fetch(`${BASE_URL}/owner-home`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data);
      setUserData(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }

    } catch (error) {
      console.log(error);
      navigate("/owner-login");
    }
  }

  useEffect(() => {
    callHomePage();
  },);

  const handleEditButton = (e) => {
    e.preventDefault();
    if (userData) {
      setShowEdit(true);
    } else {
      navigate("/owner-login");
    }
  };

  const handleAddButton = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/add-restaurant`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        window.alert("Unauthorized User.")
        navigate("/owner-login");
      } else if (res.status === 200) {
        window.alert("Please maintain the input format as instructed.");
        navigate("/add-restaurant");
      }
    } catch (error) {

    }
  }

  if (userData) {
    return (
      <>
        <form method='GET' className="container">
          <div className="items">
            <div className="subItems">
              <div className="icon"><FaHouseUser /></div>
              <div className="content"><h3>{userData.username}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><MdEmail /></div>
              <div className="content"><h3>{userData.email}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><FaUser /></div>
              <div className="content"><h3>{userData.fullName}</h3></div>
            </div>
            <div className="subItems">
              <div className="icon"><BsFillTelephoneInboundFill /></div>
              <div className="content"><h3>{userData.phoneNumber}</h3></div>
            </div>
            <div className='subItems editIcon' title='Edit User Details' onClick={handleEditButton}>
              <AiTwotoneEdit />
            </div>
          </div>
        </form>
        {showEdit && <Edit data={userData} onClose={() => setShowEdit(false)} />}
        <div className="resContainer">
          <div className="resItems">
            <div className="Heading">My Restaurants</div>
            <div className="editIcon" title='Add Restaurant' onClick={handleAddButton}><BiSolidMessageSquareAdd /></div>
          </div>
          {userData.restaurants.map((item, index) => (
            <div className='resItems1' key={index}>
              <div className='subHeading'>{index + 1}. {item.name}, {item.location}, {item.city}</div>
              <Link title='See Details' to={`/restaurant/${item._id}`}><details></details></Link>
            </div>
          ))}
        </div>
        <div className="logout-button-container" title='Log Out'>
          <LogoutButton userData />
        </div>
      </>
    )
  } else {
    return (
      <>
        <PageLoading link={"/"} />
      </>
    )
  }
}

export default Owner;

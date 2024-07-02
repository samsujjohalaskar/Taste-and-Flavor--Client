import React, { useEffect, useState } from 'react';
import { AiTwotoneEdit } from "react-icons/ai";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
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
      if (data) {
        setUserData(data);
      }

      if (res.status === 401) {
        navigate("/owner-login");
      }

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
    if (!userData) {
      callHomePage();
    }
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

  if (userData && userData.restaurants) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100'>
        <form className="flex flex-col w-full max-w-3xl p-4 bg-white shadow-md rounded-lg" method='GET'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Informations</h1>
            <AiTwotoneEdit className='cursor-pointer text-theme hover:opacity-80' size={25} title='Edit User Details' onClick={handleEditButton} />
          </div>
          <div className='flex flex-wrap gap-4 mb-6'>
            <p className="w-full sm:w-1/2">Username: {userData.username}</p>
            <p className="w-full sm:w-1/2">Email: {userData.email}</p>
            <p className="w-full sm:w-1/2">Name: {userData.fullName}</p>
            <p className="w-full sm:w-1/2">Mobile: {userData.phoneNumber}</p>
          </div>
        </form>
        {showEdit && <Edit data={userData} onClose={() => setShowEdit(false)} />}
        <div className="w-full max-w-3xl mt-6 bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Restaurants</h1>
            <BiSolidMessageSquareAdd className='cursor-pointer text-theme hover:opacity-80' size={25} title='Add Restaurant' onClick={handleAddButton} />
          </div>
          {userData.restaurants.map((item, index) => (
            <div className='flex justify-between items-center w-full mb-4' key={index}>
              <div className='text-lg font-semibold'>{index + 1}. {item.name}, {item.location}, {item.city}</div>
              <Link title='See Details' to={`/restaurant/${item._id}`} className='text-theme hover:underline'>Details</Link>
            </div>
          ))}
        </div>
        <LogoutButton userData={userData} handleUserData={() => setUserData(null)} />
      </div>
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

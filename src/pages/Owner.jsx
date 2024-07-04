import React, { useEffect, useState } from 'react';
import { AiTwotoneEdit } from "react-icons/ai";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from '../componentsOwner/LogoutButton';
import Edit from '../componentsOwner/Edit';
import PageLoading from '../componentsOwner/PageLoading';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';


const Owner = () => {

  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const callHomePage = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  if (userData && userData.restaurants) {
    return (
      <div className='bg-gray-100 min-h-screen'>
        <div className='flex flex-col justify-center items-center p-4'>
          <div className='flex flex-row flex-wrap justify-center gap-4 w-full'>
            <form className="flex flex-col w-full max-w-sm p-4 h-max bg-white shadow-md rounded-lg" method='GET'>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Informations</h1>
                <AiTwotoneEdit className='cursor-pointer text-reviews' size={25} title='Edit User Details' onClick={handleEditButton} />
              </div>
              <div className='flex flex-wrap gap-4'>
                <p className="w-full">Username: {userData.username}</p>
                <p className="w-full">Email: {userData.email}</p>
                <p className="w-full">Name: {userData.fullName}</p>
                <p className="w-full">Mobile: {userData.phoneNumber}</p>
              </div>
            </form>
            {showEdit && <Edit data={userData} onClose={() => { setShowEdit(false); callHomePage() }} />}
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 h-max">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Restaurants</h1>
                <BiSolidMessageSquareAdd className='cursor-pointer text-reviews' size={25} title='Add Restaurant' onClick={() => navigate("/add-restaurant")} />
              </div>
              {userData.restaurants.map((item, index) => (
                <div className='flex justify-between items-center w-full mb-4' key={index}>
                  <div className='text-lg font-semibold'>{index + 1}. {item.name}, {item.location}, {item.city}</div>
                  <Link title='See Details' to={`/restaurant/${item._id}`} className='text-reviews hover:underline'>Details</Link>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-center w-full mt-4'>
            <LogoutButton userData={userData} handleUserData={() => setUserData(null)} />
          </div>
        </div>
        {loading && <Loading />}
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

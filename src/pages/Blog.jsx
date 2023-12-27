import React from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { useCity } from '../CityContext';

const Blog = () => {

  const navigate = useNavigate();
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <>
      <Navbar city={selectedCity.toLowerCase()}
        onSelectCity={setSelectedCity}
        onCityChangeRedirect={(selectedCity) => {
          navigate(`/${selectedCity.toLowerCase()}`);
        }} />
      <h1>Coming Soon...</h1>
    </>
  )
}

export default Blog

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import logo from "../assets/logo.png";
import Signin from "./Signin";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import cities from "../allCities";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import Signup from "./Signup";
import Swal from 'sweetalert2';
import { VscClose, VscThreeBars } from "react-icons/vsc";

function Navbar({ city, onSelectCity, onCityChangeRedirect, active }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const [user] = useAuthState(auth);
  const cityRef = useRef();

  const toggleDropdown = () => {
    setFilteredCities(filteredCities.length ? [] : cities);
    setShowKey(!showKey)
  };

  const links = [
    { name: "Home", link: "/" },
    { name: "Book a Table", link: `/${city ? city : localStorage.getItem('localCity')}-restaurants` },
    { name: "Blog", link: "/blog/all-blogs" },
  ];

  const handleCitySearch = (searchTerm) => {
    const filtered = cities.filter(city => city.cityName.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCities(filtered);
  };

  const handleCitySelect = (selectedCity) => {
    setSearchTerm("");
    setFilteredCities([]);
    onSelectCity(selectedCity);
    localStorage.setItem("localCity", selectedCity);
    onCityChangeRedirect(selectedCity);
    setShowKey(false);
  };

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

  const handleLoginButtonClick = () => {
    if (user) {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        iconColor: "#ff7676",
        showCancelButton: true,
        confirmButtonColor: "#006edc",
        confirmButtonText: "Yes, Logout!"
      }).then((result) => {
        if (result.isConfirmed) {
          auth.signOut();
          Toast.fire({
            icon: "success",
            title: "Logged out Successfully!"
          });
        }
      });
    } else {
      setShowLogin(true);
    }
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowKey(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [cityRef]);

  return (
    <>
      <nav className="">
        <div className="flex justify-evenly items-center bg-white h-[60px] w-full">
          <VscThreeBars className="absolute text-text left-4 cursor-pointer md:hidden" onClick={() => setShowSideBar(true)} size={25} />
          <div>
            <img className="h-[60px] w-64" src={logo} alt="Taste&Flavor" />
          </div>
          <div className="hidden items-center border-[0.5px] border-border rounded md:flex">
            <span>
              <CiLocationOn className="text-xl text-text" />
            </span>
            <input
              type="text"
              placeholder={showKey ? "Search City.." : capitalizeWords(city) ? capitalizeWords(city) : "Search City.."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleCitySearch(e.target.value);
              }}
              onFocus={() => searchTerm === '' && setFilteredCities(cities)}
              onClick={() => setShowKey(true)}
              className="h-7 text-text outline-none text-sm ml-3"
            />
            {showKey && filteredCities && (
              <ul className="absolute w-48 bg-white list-none p-0 m-0 z-10 max-h-48 overflow-y-scroll top-11 ml-4 shadow-cities" ref={cityRef}>
                {filteredCities.map((city) => (
                  <li key={city.cityName} onClick={() => handleCitySelect(city.cityName)} className="px-4 py-2 text-text cursor-pointer hover:bg-gray-200">
                    {city.cityName}
                  </li>
                ))}
              </ul>
            )}
            {!showKey ? (
              <FaCaretDown onClick={() => toggleDropdown()} className="text-text" />
            ) : (
              <FaCaretUp onClick={() => toggleDropdown()} className=" text-text" />
            )}
          </div>
          <div className="hidden lg:flex">
            <ul className="flex gap-4 text-text lg:gap-16">
              {links.map(({ name, link }) => {
                return (
                  <li className={name === active ? "text-theme" : ""} key={name}>
                    <Link to={link}>{name}</Link>
                  </li>
                );
              })}
              {user && (
                <li className={active === "History" ? "text-theme" : ""} key="History">
                  <Link to="/history">Profile</Link>
                </li>
              )}
            </ul>
          </div>
          <div className="hidden md:flex">
            <button onClick={handleLoginButtonClick} className="bg-theme py-[6px] px-6 text-lg text-white font-extrabold rounded hover:bg-hover">
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* sidebar component */}

        <div className={`fixed h-fill-available w-48 bg-gray-200 ${showSideBar ? "left-0 top-0" : "left-[-200px] top-0"} z-20 transition-all duration-500 md:hidden`}>
          <div className="p-4">
            <VscClose size={25} className="cursor-pointer float-right" onClick={() => setShowSideBar(false)} />
            <div className="mt-10">
              <ul className="flex flex-col gap-4 text-text">
                {links.map(({ name, link }) => {
                  return (
                    <li className={name === active ? "text-theme" : ""} key={name}>
                      <Link to={link}>{name}</Link>
                    </li>
                  );
                })}
                {user && (
                  <li className={active === "History" ? "text-theme" : ""} key="History">
                    <Link to="/history">Profile</Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-5 flex items-center border-[0.5px] border-border rounded">
              <span>
                <CiLocationOn className="text-xl text-text" />
              </span>
              <input
                type="text"
                placeholder={showKey ? "Search City.." : capitalizeWords(city) ? capitalizeWords(city) : "Search City.."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleCitySearch(e.target.value);
                }}
                onFocus={() => searchTerm === '' && setFilteredCities(cities)}
                onClick={() => setShowKey(true)}
                className="h-7 text-text outline-none text-sm ml-3 w-28 bg-gray-200"
              />
              {showKey && filteredCities && (
                <ul className="absolute w-48 bg-white list-none p-0 m-0 z-10 max-h-48 overflow-y-scroll top-54 shadow-cities" ref={cityRef}>
                  {filteredCities.map((city) => (
                    <li key={city.cityName} onClick={() => handleCitySelect(city.cityName)} className="px-4 py-2 text-text cursor-pointer hover:bg-gray-200">
                      {city.cityName}
                    </li>
                  ))}
                </ul>
              )}
              {!showKey ? (
                <FaCaretDown onClick={() => toggleDropdown()} className="text-text" />
              ) : (
                <FaCaretUp onClick={() => toggleDropdown()} className=" text-text" />
              )}
            </div>
            <div className="absolute bottom-4">
              <button onClick={handleLoginButtonClick} className="w-40 bg-theme py-2 px-6 text-white font-extrabold rounded hover:bg-hover">
                {user ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>
        </div>

        {/* sidebar component ends*/}

      </nav >
      <div className="hidden justify-center items-center border-t-[1px] p-2 md:flex lg:hidden">
        <ul className="flex text-text gap-16">
          {links.map(({ name, link }) => {
            return (
              <li className={name === active ? "text-theme" : ""} key={name}>
                <Link to={link}>{name}</Link>
              </li>
            );
          })}
          {user && (
            <li className={active === "History" ? "text-theme" : ""} key="History">
              <Link to="/history">Profile</Link>
            </li>
          )}
        </ul>
      </div>
      {showLogin && <Signin onClose={() => setShowLogin(false)}
        handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
      />
      }
      {
        showSignUp && <Signup onClose={() => setShowSignUp(false)}
          handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
        />
      }
    </>
  );
}

export default Navbar;

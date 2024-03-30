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
import { BASE_URL } from "../utils/services";

function Navbar({ city, onSelectCity, onCityChangeRedirect, active }) {

  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [postUser, setPostUser] = useState(false);
  const [userDetails, setUserDetails] = useState(localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : null);

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setUserDetails(data);
          localStorage.setItem("userDetails", JSON.stringify(data));

        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setPostUser(true);
      }
    };

    if (user && user.email !== (userDetails ? userDetails.userEmail : null)) {
      fetchUserDetails();
    }
  }, [user]);

  useEffect(() => {
    const handlePostUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/add-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: user.displayName,
            userEmail: user.email,
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (postUser && userDetails === null && user) {
      handlePostUser();
    }

  }, [user, userDetails, postUser]);


  return (
    <>
      <nav className="navBar flex">
        <div className="flex-item logo">
          <img src={logo} alt="Taste&Flavor" />
        </div>
        <div className="flex-item dropdownMenu">
          <span>
            <CiLocationOn className="locationIcon" />
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
            className="searchInput"
          />
          {showKey && filteredCities && (
            <ul className="citySuggestions" ref={cityRef}>
              {filteredCities.map((city) => (
                <li key={city.cityName} onClick={() => handleCitySelect(city.cityName)}>
                  {city.cityName}
                </li>
              ))}
            </ul>
          )}
          {!showKey ? (
            <FaCaretDown onClick={() => toggleDropdown()} className="locationIcon showKey" />
          ) : (
            <FaCaretUp onClick={() => toggleDropdown()} className="locationIcon showKey" />
          )}
        </div>
        <div className="flex-item">
          <ul className="flex links">
            {links.map(({ name, link }) => {
              return (
                <li className={name === active ? "navbar-border-bottom" : ""} key={name}>
                  <Link to={link}>{name}</Link>
                </li>
              );
            })}
            {user && (
              <li className={active === "History" ? "navbar-border-bottom" : ""} key="History">
                <Link to="/history">Profile</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex-item login">
          <button onClick={handleLoginButtonClick} className="loginButton">
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>
      {showLogin && <Signin onClose={() => setShowLogin(false)}
        handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
      />}
      {showSignUp && <Signup onClose={() => setShowSignUp(false)}
        handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
      />}
    </>
  );
}

export default Navbar;

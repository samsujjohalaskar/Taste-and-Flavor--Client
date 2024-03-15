import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import BlogCard from '../componentsBlog/BlogCard';
import { useNavigate } from 'react-router-dom';
import { useCity } from '../CityContext';
import '../css/signin.css';
import "../css/blog.css";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { BASE_URL } from '../utils/services';
import { IoMdClose } from 'react-icons/io';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Loading from '../components/Loading';
import Swal from 'sweetalert2';
import logo from "../assets/logo.png"
import BlogFeaturedCard from '../componentsBlog/BlogFeaturedCard';
import BlogFeaturedSuggCard from '../componentsBlog/BlogFeaturedSuggCard';

const Blog = () => {

  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { selectedCity, setSelectedCity } = useCity();
  const [blogs, setBlogs] = useState([]);
  const [userDetails, setUserDetails] = useState("")
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    category: '',
  });

  const categories = [
    "Food", "Restaurant Reviews", "Family Dinner", "Friends Dayout", "Chef Spotlight", "Healthy Eating",
    "Food Events", "Behind the Scenes", "Date Night", "Customer Success Stories",
    "Local Food Culture", "Special Occasions", "Customer Stories", "Restaurant Updates",
    "Wine and Beverage Pairing", "Cooking Tips and Techniques", "Seasonal Menus",
    "Culinary Travel", "Food Photography Tips", "Community Engagement",
    "Customer Feedback and Responses", "Chef's Recommendations", "Food and Health Tips",
    "Food Industry Trends", "Restaurant Sustainability Initiatives",
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user-info?userEmail=${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setUserDetails(data);

        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('postedBy', userDetails._id);

      const response = await fetch(`${BASE_URL}/post-blog`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setShowAddBlog(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thank You!",
          text: "Your Blog Posted Successfully.",
          confirmButtonColor: "#006edc",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });

      } else {
        console.error('Failed to post blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/blogs`);
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          console.log('Failed to fetch blogs');
        }
      } catch (error) {
        console.log('Error fetching blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const records = blogs.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(blogs.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCurrentPage(n) {
    setCurrentPage(n);
  }

  function nextPage() {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <>
      <Navbar city={selectedCity.toLowerCase()}
        onSelectCity={setSelectedCity}
        active={"Blog"}
        onCityChangeRedirect={(selectedCity) => {
          navigate(`/${selectedCity.toLowerCase()}`);
        }} />
      <div className="blog-container">
        {records.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      {records.length < blogs.length ?
        (<div className='blog-pagination-container'>
          <li className='blog-pagination-item-pn'>
            <a href="#" onClick={prevPage}>Prev</a>
          </li>
          {
            numbers.map((n, i) => (
              <li key={i} className={`blog-pagination-item ${currentPage === n ? 'blog-active' : ''}`}>
                <a href="#" onClick={() => changeCurrentPage(n)} >{n}</a>
              </li>
            ))
          }
          <li className='blog-pagination-item-pn'>
            <a href="#" onClick={nextPage}>Next</a>
          </li>
        </div>)
        : ""
      }

      <div className="blog-featured-container">
        <div className="blog-featured-posts">
          <p className="blog-featured-posts-heading">Spotlight on Our Favorites</p>
          {records.reverse().map((blog) => (
            <BlogFeaturedCard key={blog._id} blog={blog} />
          ))}
        </div>
        <div className="blog-featured-suggestions">
          <p className="blog-featured-sugg-heading">HOT OFF THE KITCHEN</p>
          {records.reverse().map((blog) => (
            <BlogFeaturedSuggCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>

      {/* <div onClick={() => user ? setShowAddBlog(true) : setShowLogin(true)}> Add Blog +</div> */}

      {showAddBlog && (
        <div className="overlay show-overlay signup-model-overlay">
          <div className="modal blog-card-model">
            <form className="blog-card-form" onSubmit={handleSubmit}>

              <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>

              <input type="text" id="title" name="title" placeholder="Blog Title" value={formData.title} onChange={handleChange} required />

              <textarea id="content" name="content" placeholder="Write Content.." rows={10} value={formData.content} onChange={handleChange} required />

              <input type="file" id="image" name="image" onChange={handleImageChange} accept="image/*" />

              <button className='subBlog button blog-form-button' type="submit" disabled={isLoading}>
                {isLoading ? 'Posting...' : 'Post Blog'}
              </button>
            </form>
          </div>
          <div className='signup-close-icon' onClick={() => setShowAddBlog(false)}><IoMdClose /></div>
        </div>
      )}

      {isLoading && <Loading />}

      {showLogin && <Signin onClose={() => setShowLogin(false)}
        handleSignUp={() => { setShowLogin(false); setShowSignUp(true); }}
      />}
      {showSignUp && <Signup onClose={() => setShowSignUp(false)}
        handleSignIn={() => { setShowSignUp(false); setShowLogin(true) }}
      />}

      <div className="footerBottom flex">
        <div className="mainColor flex-item logo">
          <img src={logo} alt="" />
        </div>
        <div className="flex-item">
          <p>Every Bite Speaks Taste, Flavorful Journey</p>
        </div>
        <div className="flex-item">Write to us at: <strong><a className='write-us' href="https://mail.google.com/mail/?view=cm&fs=1&to=samsujjohalaskar@gmail.com">samsujjohalaskar@gmail.com</a></strong></div>
        <div className="flex-item">
          <p>© 2023 - Taste&Flavor All Rights Reserved</p>
        </div>
      </div>
    </>
  )
}

export default Blog

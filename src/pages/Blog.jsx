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


  return (
    <>
      <Navbar city={selectedCity.toLowerCase()}
        onSelectCity={setSelectedCity}
        active={"Blog"}
        onCityChangeRedirect={(selectedCity) => {
          navigate(`/${selectedCity.toLowerCase()}`);
        }} />
        <h2>This Page is Under Development</h2>
      <div className="blog-container">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog}/>
        ))}
      </div>

      <div onClick={() => user ? setShowAddBlog(true) : setShowLogin(true)}> Add Blog +</div>

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
    </>
  )
}

export default Blog

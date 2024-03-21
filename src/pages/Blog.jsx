import React, { useEffect, useState } from 'react'
import BlogCard from '../componentsBlog/BlogCard';
import '../css/signin.css';
import "../css/blog.css";
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import logo from "../assets/logo.png"
import BlogFeaturedCard from '../componentsBlog/BlogFeaturedCard';
import BlogFeaturedSuggCard from '../componentsBlog/BlogFeaturedSuggCard';
import BlogNavbar from '../componentsBlog/BlogNavbar';

const Blog = () => {

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/blogs/all-available/fetch-all`, {
          mode: 'no-cors',
        });
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);

          const categories = Array.from(new Set(data.map(blog => blog.category)));
          setCategories(categories);
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

  const randomCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 6);
  localStorage.setItem("categories", categories);

  const featuredBlogs = blogs.sort((a, b) => {
    const commentsComparison = b.comments.length - a.comments.length;
    if (commentsComparison !== 0) {
      return commentsComparison;
    } else {
      return b.likes.length - a.likes.length;
    }
  }).slice(0, 10);

  const featuredSuggBlogs = blogs.slice(-10).reverse();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const shuffledBlogs = [...blogs].sort(() => Math.random() - 0.5);

  const records = shuffledBlogs.slice(firstIndex, lastIndex);
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
      <BlogNavbar actualCategories={randomCategories} />
      <div className="blog-container">
        {records.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
      {records.length < blogs.length ?
        (<div className='blog-pagination-container'>
          <li className='blog-pagination-item-pn'>
            <a href={`#page${currentPage}`} onClick={prevPage}>Prev</a>
          </li>
          {
            numbers.map((n, i) => (
              <li key={i} className={`blog-pagination-item ${currentPage === n ? 'blog-active' : ''}`}>
                <a href={`#page${currentPage}`} onClick={() => changeCurrentPage(n)} >{n}</a>
              </li>
            ))
          }
          <li className='blog-pagination-item-pn'>
            <a href={`#page${currentPage}`} onClick={nextPage}>Next</a>
          </li>
        </div>)
        : ""
      }

      <div className="blog-featured-container">
        <div className="blog-featured-posts">
          <p className="blog-featured-posts-heading">Spotlight on Our Favorites</p>
          {featuredBlogs.map((blog) => (
            <BlogFeaturedCard key={blog._id} blog={blog} />
          ))}
        </div>
        <div className="blog-featured-suggestions">
          <p className="blog-featured-sugg-heading">HOT OFF THE KITCHEN</p>
          {featuredSuggBlogs.map((blog) => (
            <BlogFeaturedSuggCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>

      {isLoading && <Loading />}

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

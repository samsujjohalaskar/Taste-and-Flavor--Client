import React, { useEffect, useState } from 'react'
import BlogCard from '../componentsBlog/BlogCard';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import BlogFeaturedCard from '../componentsBlog/BlogFeaturedCard';
import BlogFeaturedSuggCard from '../componentsBlog/BlogFeaturedSuggCard';
import BlogNavbar from '../componentsBlog/BlogNavbar';
import FooterBottom from '../components/FooterBottom';

const Blog = () => {

  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/blogs/all-available/fetch-all`);
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
  localStorage.setItem("categories", randomCategories);

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

  const records = blogs.reverse().slice(firstIndex, lastIndex);
  const nPage = Math.ceil(blogs.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  const groupedRecords = [];

  for (let i = 0; i < records.length; i += 2) {
    groupedRecords.push(records.slice(i, i + 2));
  }


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
      <BlogNavbar />
      <div className="flex justify-center flex-wrap gap-5 bg-bg py-9 px-5 md:py-6">
        {records && records.length !== 0 ? (
          groupedRecords.map((group, index) => (
            <div key={index} className='flex flex-col gap-5'>
              {group.map((record, idx) => (
                <BlogCard
                  key={record._id}
                  blog={record}
                />
              ))}
            </div>
          ))
        ) : (
          [...Array(4)].map((_, index) => (
            <div key={index} className='flex flex-col gap-2 w-[450px] h-max animate-pulse rounded'>
              <div className='h-56 w-full bg-slate-500 rounded'></div>
              <div className='h-4 w-full bg-slate-500 rounded-full'></div>
              <div className='h-4 w-full bg-slate-500 rounded-full'></div>
            </div>
          ))
        )}
      </div>
      {records.length < blogs.length ?
        (<div className='flex justify-center items-center gap-3 bg-bg px-8 py-5'>
          <li className='list-none'>
            <a className='text-black hover:text-theme' href={`#page${currentPage}`} onClick={prevPage}>Prev</a>
          </li>
          {
            numbers.map((n, i) => {
              if (n === 1 || n === nPage || (n >= currentPage - 1 && n <= currentPage + 1)) {
                return (
                  <li key={i} className={`flex justify-center items-center list-none h-7 w-7 rounded-full ${currentPage === n ? 'bg-theme text-white' : 'hover:bg-gray-500 hover:text-white'}`}>
                    <a href={`#page${currentPage}`} onClick={() => changeCurrentPage(n)}>{n}</a>
                  </li>
                );
              } else if (n === currentPage - 2 || n === currentPage + 2) {
                return (
                  <li key={i} className={`flex justify-center items-center list-none h-7 w-7 rounded-full`}>
                    <span>...</span>
                  </li>
                );
              }
              return null;
            })
          }
          <li className='list-none'>
            <a className='text-black hover:text-theme' href={`#page${currentPage}`} onClick={nextPage}>Next</a>
          </li>
        </div>)
        : ""
      }

      <div className="flex justify-center flex-wrap border-b-[1px] border-bg">
        <div className="flex flex-col gap-8 p-6 border-b-[1px] border-bg lg:p-12 lg:border-r-[1px] lg:border-b-0">
          <p className="text-lg font-normal uppercase tracking-[1px]">Spotlight on Our Favorites</p>
          {featuredBlogs.map((blog) => (
            <BlogFeaturedCard key={blog._id} blog={blog} />
          ))}
        </div>
        <div className="p-6 lg:p-12">
          <p className="text-lg font-normal uppercase tracking-[1px]">HOT OFF THE KITCHEN</p>
          {featuredSuggBlogs.map((blog) => (
            <BlogFeaturedSuggCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>

      {isLoading && <Loading />}

      <FooterBottom />
    </>
  )
}

export default Blog

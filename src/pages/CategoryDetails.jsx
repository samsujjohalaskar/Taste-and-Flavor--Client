import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../css/blog.css";
import logo from "../assets/logo.png";
import { BASE_URL } from '../utils/services';
import BlogNavbar from '../componentsBlog/BlogNavbar';
import BlogDetailsSimilarCard from '../componentsBlog/BlogDetailsSimilarCard';
import Loading from '../components/Loading';
import CategoryCard from '../componentsBlog/CategoryCard';

const CategoryDetails = () => {

    const { blogCategory } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [randomBlog, setRandomBlog] = useState([]);
    const [similarBlog, setSimilarBlog] = useState([]);

    const categoriesActual = [
        "Food", "Restaurant Reviews", "Family Dinner", "Friends Dayout", "Chef Spotlight", "Healthy Eating",
        "Food Events", "Behind the Scenes", "Date Night", "Customer Success Stories",
        "Local Food Culture", "Special Occasions", "Customer Stories", "Restaurant Updates",
        "Wine and Beverage Pairing", "Cooking Tips and Techniques", "Seasonal Menus",
        "Culinary Travel", "Food Photography Tips", "Community Engagement",
        "Customer Feedback and Responses", "Chef's Recommendations", "Food and Health Tips",
        "Food Industry Trends", "Restaurant Sustainability Initiatives",
    ];

    const categoryMapping = {};
    categoriesActual.forEach(category => {
        const cleanedCategory = category.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
        categoryMapping[cleanedCategory] = category;
    });

    function getOriginalCategory(cleanedCategory) {
        return categoryMapping[cleanedCategory];
    }

    const blogCat = getOriginalCategory(blogCategory);

    useEffect(() => {
        const fetchBlogs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/blog/individual-blogs?blogCat=${blogCat}`);
                if (response.ok) {
                    const data = await response.json();
                    setBlog(data);
                } else {
                    console.log('Failed to fetch blogs');
                }
            } catch (error) {
                console.log('Error fetching blogs');
            } finally {
                setIsLoading(false);
            }
        };

        if (blogCat) {
            fetchBlogs();
        }
    }, [blogCat]);

    useEffect(() => {
        const shuffledBlogs = blog.sort(() => Math.random() - 0.5).slice(0, 40);
        setRandomBlog(shuffledBlogs);
    }, [blog]);

    const categories = localStorage.getItem("categories");
    const categoriesArray = categories.split(',');
    const randomCategories = categoriesArray.sort(() => 0.5 - Math.random()).slice(0, 6);

    if (blogCat && !randomCategories.includes(blogCat)) {
        randomCategories.push(blogCat);
    }

    const topPicksBlogs = blog.sort((a, b) => {
        const commentsComparison = b.comments.length - a.comments.length;
        if (commentsComparison !== 0) {
            return commentsComparison;
        } else {
            return b.likes.length - a.likes.length;
        }
    }).slice(0, 5);

    return (
        <>
            <BlogNavbar actualCategories={randomCategories} currentCategory={blogCat} />
            <div className="blog-details-container">
                <div className="blog-featured-posts">
                    {randomBlog.map(blog => (
                        <CategoryCard key={blog._id} blog={blog} />
                    ))}
                </div>
                <div className="blog-featured-suggestions">
                    <p className="blog-featured-sugg-heading">Top Picks</p>
                    {topPicksBlogs.length === 0 &&
                        <p className="blog-featured-no-similar-posts">
                            No Posts Available..
                        </p>
                    }
                    {topPicksBlogs.map(blog => (
                        <BlogDetailsSimilarCard key={blog._id} blog={blog} />
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

export default CategoryDetails

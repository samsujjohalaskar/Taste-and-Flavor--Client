import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../utils/services';
import BlogNavbar from '../componentsBlog/BlogNavbar';
import BlogFeaturedSuggCard from '../componentsBlog/BlogFeaturedSuggCard';
import Loading from '../components/Loading';
import CategoryCard from '../componentsBlog/CategoryCard';
import FooterBottom from '../components/FooterBottom';

const CategoryDetails = () => {

    const { blogCategory } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [blog, setBlog] = useState([]);
    const [randomBlog, setRandomBlog] = useState([]);

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
    let randomCategories = [];
    if (categories) {
        const categoriesArray = categories.split(',');
        randomCategories = categoriesArray.sort(() => 0.5 - Math.random()).slice(0, 6);
    }

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
            <div className="flex justify-center flex-wrap border-b-[1px] border-t-[1px] border-bg">
                <div className="flex flex-col border-b-[1px] border-bg max-w-[980px] gap-6 px-6 py-9 md:px-12 2xl:border-r-[1px] xl:border-b-0">
                    {randomBlog && randomBlog.length !== 0 ? (randomBlog.map(blog => (
                        <CategoryCard key={blog._id} blog={blog} />
                    ))) : (
                        [...Array(3)].map((_, index) => (
                            <div key={index} className='flex flex-col gap-4 animate-pulse'>
                                <div className="bg-slate-500 cursor-not-allowed min-w-[370px] md:min-w-[810px] h-32 rounded" ></div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 lg:p-12">
                    <p className="text-lg font-normal uppercase tracking-[1px]">Top Picks</p>
                    {topPicksBlogs.length === 0 && !isLoading &&
                        <p className="text-xs italic mt-2">
                            No Posts Available..
                        </p>
                    }
                    {topPicksBlogs.length === 0 && isLoading &&
                        [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-slate-500 animate-pulse cursor-not-allowed w-full rounded-full h-6 my-3"></div>
                        ))
                    }
                    {topPicksBlogs.map(blog => (
                        <BlogFeaturedSuggCard key={blog._id} blog={blog} />
                    ))}
                </div>
            </div>

            {isLoading && <Loading />}

            <FooterBottom />
        </>
    )
}

export default CategoryDetails

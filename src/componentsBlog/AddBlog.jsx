import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import axios from 'axios';
import BlogNavbar from './BlogNavbar';
import FooterBottom from '../components/FooterBottom'

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Paragraph from '@editorjs/paragraph';
import RawTool from '@editorjs/raw';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import Checklist from '@editorjs/checklist'
import ImageTool from '@editorjs/image';

const AddBlog = () => {

  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);

  const [editorContent, setEditorContent] = useState(null);
  const [dataToSend, setDataToSend] = useState({
    title: '',
    category: '',
    content: '',
    mainContent: '',
    image: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/blog/all-blogs');
    }
  }, [user, navigate]);

  useEffect(() => {
    let editorInstance;

    if (user) {
      editorInstance = new EditorJS({
        holder: 'editorjs',
        tools: {
          heading: {
            class: Header,
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          simpleImage: SimpleImage,
          // image: {
          //   class: ImageTool,
          //   config: {
          //     uploader: {
          //       async uploadByFile(file) {
          //         const formData = new FormData();
          //         formData.append('file', file);

          //         const response = await axios.post(
          //           `${BASE_URL}/upload`,
          //           formData,
          //           {
          //             headers: {
          //               'Content-Type': 'multipart/form-data',
          //             },
          //             withCredentials: false,
          //           }
          //         );

          //         if (response.data.success === 1) {
          //           return response.data;
          //         }
          //       },

          //       async uploadByUrl(url) {
          //         const response = await axios.post(
          //           `${BASE_URL}/uploadByUrl`,
          //           {
          //             url,
          //           }
          //         );

          //         if (response.data.success === 1) {
          //           return response.data;
          //         }
          //       },
          //     },
          //   },
          // },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          raw: RawTool,
          embed: Embed,
        },
        onChange: () => {
          editorInstance.save().then((outputData) => {
            setEditorContent(outputData);
          });
        },
        placeholder: 'Tell your story...',
      });
    }

    return () => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    };
  }, [user]);


  const handleChange = (e) => {
    setDataToSend({
      ...dataToSend,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setDataToSend({
      ...dataToSend,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (id) => {
    const currentPath = window.location.pathname;
    if (id && dataToSend.title && dataToSend.content && dataToSend.category && dataToSend.image && editorContent) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', dataToSend.title);
        formData.append('content', dataToSend.content);
        formData.append('category', dataToSend.category);
        formData.append('postedBy', id);

        // Convert editorContent to JSON and append to formData
        const contentJSON = JSON.stringify(editorContent);
        formData.append('mainContent', contentJSON);

        // Append image file if selected
        if (dataToSend.image) {
          formData.append('image', dataToSend.image);
        }

        const response = await fetch(`${BASE_URL}/post-blog`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Thank You!",
            text: "Your Blog Posted Successfully.",
            confirmButtonColor: "#006edc",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/blog/all-blogs");
            }
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error!",
            text: "Too large image files!!",
            confirmButtonColor: "#006edc",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(currentPath);
            }
          });
        }
      } catch (error) {
        console.error('Error posting blog:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error!",
        text: "All fields required.",
        confirmButtonColor: "#006edc",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(currentPath);
        }
      });
    }
  };

  const categories = [
    "Food", "Restaurant Reviews", "Family Dinner", "Friends Dayout", "Chef Spotlight", "Healthy Eating",
    "Food Events", "Behind the Scenes", "Date Night", "Customer Success Stories",
    "Local Food Culture", "Special Occasions", "Customer Stories", "Restaurant Updates",
    "Wine and Beverage Pairing", "Cooking Tips and Techniques", "Seasonal Menus",
    "Culinary Travel", "Food Photography Tips", "Community Engagement",
    "Customer Feedback and Responses", "Chef's Recommendations", "Food and Health Tips",
    "Food Industry Trends", "Restaurant Sustainability Initiatives",
  ];

  return (
    <>
      <BlogNavbar isAddBlog={true} handleSubmit={handleSubmit} />
      <div className='border-y-[1px] border-bg'>
        <form className='max-w-4xl mx-auto py-10 px-4' >
          <div className="w-full">
            <div className="flex flex-col gap-4">
              <input
                className='py-2 px-4 outline-none text-2xl border-l-2 border-border'
                type="text"
                name="title"
                placeholder="Blog Title"
                value={dataToSend.title}
                onChange={handleChange}
                required
              />

              <input
                className='py-2 px-4 outline-none'
                type="text"
                name="content"
                placeholder="Add summery of your blog."
                value={dataToSend.content}
                onChange={handleChange}
                required
              />

              <div id="editorjs" className="p-1"></div>

              <div className="flex items-center gap-2">
                <p className="text-gray-700">Feature image:</p>
                <input
                  className='file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-reviews hover:file:bg-blue-100'
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              <select
                className='p-2 rounded outline-none'
                name="category"
                value={dataToSend.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a suitable category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && <Loading />}
        </form>
      </div>
      <FooterBottom />
    </>
  );

}

export default AddBlog

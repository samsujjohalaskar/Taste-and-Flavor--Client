import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { BASE_URL } from '../utils/services';

const initialState = {
  name: '', city: '', area: '', location: '', contactNumber: '',
  averageCostForTwo: '', cuisine: [], types: [], offers: [],
  startTime: '', endTime: '23:00', website: '',
  extraDiscount: [], amenities: [], images: [], menu: [],
};
const MAX_FILE_SIZE_MB = 5; // 5MB in bytes

const AddRestaurant = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...initialState });
  const [error, setError] = useState(null);
  const [imageFileNames, setImageFileNames] = useState([]);
  const [menuFileNames, setMenuFileNames] = useState([]);

  const [showCuisineExample, setShowCuisineExample] = useState(false);
  const [showTypesExample, setShowTypesExample] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [amenities, setAmenities] = useState({
    Wifi: false,
    Parking: false,
    AC: false,
    PetsAllowed: false,
    OutdoorSeating: false,
    CardsAccepted: false,
    WalletAccepted: false,
    HomeDelivery: false,
    ValetAvailable: false,
    RoofTop: false,
    FullBarAvailable: false,
    Lift: false,
    SmokingArea: false,
    LivePerformance: false,
    LiveScreening: false,
  });

  const handleAmenitiesChange = (e) => {
    const { name, checked } = e.target;
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, isSelected]) => isSelected)
      .map(([amenity]) => amenity);
    setFormData((prevData) => ({
      ...prevData,
      amenities: selectedAmenities,
    }));
  }, [amenities]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const selectedFiles = Array.from(files).filter((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

    if (selectedFiles.length === files.length) {
      setFormData({ ...formData, images: selectedFiles });
      setImageFileNames(selectedFiles.map((file) => ({ name: file.name })));
    } else {
      window.alert(`Some images exceed ${MAX_FILE_SIZE_MB}MB.`);
    }
  };

  const handleMenuChange = (e) => {
    const files = e.target.files;
    const selectedFiles = Array.from(files).filter((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);

    if (selectedFiles.length === files.length) {
      setFormData({ ...formData, menu: selectedFiles });
      setMenuFileNames(selectedFiles.map((file) => ({ name: file.name })));
    } else {
      window.alert(`Some files exceed ${MAX_FILE_SIZE_MB}MB.`);
    }
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
    setImageFileNames(updatedImages.map((file) => ({ name: file.name })));
  };

  const handleMenuRemove = (index) => {
    const updatedMenu = [...formData.menu];
    updatedMenu.splice(index, 1);
    setFormData({ ...formData, menu: updatedMenu });
    setMenuFileNames(updatedMenu.map((file) => ({ name: file.name })));
  };

  function truncateFileName(fileName, maxLength = 15) {
    if (fileName.length <= maxLength) {
      return fileName;
    } else {
      return fileName.substring(0, maxLength - 3) + '...';
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'openingHours') {
          Object.entries(value).forEach(([timeKey, timeValue]) => {
            formDataToSend.append(`openingHours.${timeKey}`, timeValue);
          });
        } else if (key === 'amenities') {
          value.forEach((amenity) => {
            formDataToSend.append('amenities', amenity);
          });
        } else if (key === 'cuisine') {
          value.forEach((cuisine) => {
            formDataToSend.append('cuisine', cuisine);
          });
        }
        else if (key === 'types') {
          value.forEach((type) => {
            formDataToSend.append('types', type);
          });
        }
        else if (key === 'offers') {
          value.forEach((offer) => {
            formDataToSend.append('offers', offer);
          });
        } else if (key === 'images' || key === 'menu') {
          value.forEach((file) => {
            formDataToSend.append(key, file);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      const res = await fetch(`${BASE_URL}/add-restaurant`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const data = await res.json();
      if (res.status === 200) {
        window.alert("Restaurant Added Successfully.");
        setFormData({ ...initialState });
        navigate("/owner-home");
      } else if (res.status === 402 || !data) {
        window.alert("Marked Fields Are Mandatory");
      } else if (res.status === 403) {
        window.alert("Unauthorized Access.");
      } else {
        setError("Failed to add restaurant. Please try again.");
      }
    } catch (error) {
      setError("Failed to add restaurant.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center p-4 bg-gray-100'>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <Link to={"/owner-home"} className="text-blue-500 mb-4 inline-flex items-center">
          <MdArrowBack size={20} className="mr-2" /> Back
        </Link>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-6">
            <p className="text-2xl font-semibold">Add Your Restaurant</p>
          </div>

          <div className="mb-6">
            <div className="text-xl font-semibold mb-2">Basic Information <span className="text-sm">(mandatory)</span></div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold">Name:</label>
                <input className="p-2 border rounded" type="text" name="name" placeholder='Taste & Flavor' value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">City:</label>
                <input className="p-2 border rounded" type="text" name="city" placeholder='Kolkata,Delhi,Mumbai,Chennai,etc.' value={formData.city} onChange={handleInputChange} required />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Area:</label>
                <input className="p-2 border rounded" type="text" name="area" placeholder='North Kolkata,South Delhi,etc.' value={formData.area} onChange={handleInputChange} required />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Location:</label>
                <input className="p-2 border rounded" type="text" name="location" placeholder='Exact Location of the Restaurant.' value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Contact Number:</label>
                <input className="p-2 border rounded" type="text" name="contactNumber" placeholder='+91 98x69x25x4' value={formData.contactNumber} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xl font-semibold mb-2">Restaurant Details <span className="text-sm">(not mandatory)</span></div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold">Open Hours:</label>
                <div className="flex flex-wrap gap-2">
                  <input className="p-2 border rounded" type="text" name="startTime" value={formData.startTime} onChange={handleInputChange} placeholder="24 hrs format e.g: 13:00" />
                  <span className="flex items-center"> to </span>
                  <input className="p-2 border rounded" type="text" name="endTime" value={formData.endTime} onChange={handleInputChange} placeholder="Closing Time upto 24:00" />
                </div>
              </div>
              <div className="flex flex-col relative">
                <label className="font-semibold">Cuisine:</label>
                <input className="p-2 border rounded" type="text" name="cuisine" placeholder='Chinese,Italian,French,etc.(no space after commas)' value={formData.cuisine.join(',')} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value.split(',') })} />
                <span
                  className='absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-blue-500'
                  onMouseEnter={() => {
                    setShowCuisineExample(true);
                  }}
                  onMouseLeave={() => {
                    setShowCuisineExample(false);
                  }}>
                  ?
                </span>
                {showCuisineExample && (
                  <div className='absolute z-30 bg-white border p-2 rounded shadow-md top-10 right-0 w-64 text-sm'>
                    Italian, South Indian, North Indian, Mexican, Thai, Nepali, Gujrati, Chinese, Bengali, Rajasthani, Kashmiri, Goan, Punjabi, Hyderabadi, Kerala, Assamese, Odisha, Maharashtrian, Malabari, Mediterranean, Korean, Lebanese, French, Mughlai, Fast Food, Continental, etc.
                  </div>
                )}
              </div>
              <div className="flex flex-col relative">
                <label className="font-semibold">Types:</label>
                <input className="p-2 border rounded" type="text" name="types" placeholder='Fine Dining,5 Star,Street Food,etc.(no space after commas)' value={formData.types.join(',')} onChange={(e) => setFormData({ ...formData, types: e.target.value.split(',') })} />
                <span className='absolute right-0 top-0 mt-2 mr-2 cursor-pointer text-blue-500'
                  onMouseEnter={() => {
                    setShowTypesExample(true);
                  }}
                  onMouseLeave={() => {
                    setShowTypesExample(false);
                  }}>
                  ?
                </span>
                {showTypesExample && (
                  <div className='absolute z-30 bg-white border p-2 rounded shadow-md top-10 right-0 w-64 text-sm'>
                    Fine Dining, Casual Dining, Qsr, Ethnic Cuisine, Cafe, Pizza, Girf Flat 50, Pub, Street Food, Family Style, Seafood, Bakery, Food Truck, Girf Buffet Deals, Buffet, Vegan, 5 Star, etc.
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Offers:</label>
                <input className="p-2 border rounded" type="text" name="offers" placeholder='10% Off, Happy Hour, etc.(no space after commas)' value={formData.offers.join(',')} onChange={(e) => setFormData({ ...formData, offers: e.target.value.split(',') })} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xl font-semibold mb-2">Additional Details <span className="text-sm">(not mandatory)</span></div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold">Website:</label>
                <input className="p-2 border rounded" type="text" name="website" placeholder='www.tasteandflavor.com' value={formData.website} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Average Cost for Two:</label>
                <input className="p-2 border rounded" type="number" name="averageCostForTwo" placeholder='1320 (Numbers Only)' value={formData.averageCostForTwo} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Extra Discount:</label>
                <input className="p-2 border rounded" type="text" name="extraDiscount" placeholder='20% Off on total bill,etc.(no space after commas)' value={formData.extraDiscount.join(',')} onChange={(e) => setFormData({ ...formData, extraDiscount: e.target.value.split(',') })} />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Amenities:</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(amenities).map((key) => (
                    <div key={key} className="flex items-center">
                      <input className="mr-2 cursor-pointer" type="checkbox" id={key} name={key} checked={amenities[key]} onChange={handleAmenitiesChange} />
                      <label htmlFor={key}>{key}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xl font-semibold mb-2">Images and Menu <span className="text-sm">(not mandatory)</span></div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold">Images:</label>
                <input className="p-2 border rounded" type="file" name="images" accept="image/*" onChange={handleImageChange} multiple />
                <div className="flex flex-wrap gap-2 mt-2">
                  {imageFileNames.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded flex items-center">
                      <p className="truncate">{truncateFileName(item.name)}</p>
                      <div className="ml-2 cursor-pointer" onClick={() => handleImageRemove(index)}><RiDeleteBin6Line /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Menu:</label>
                <input className="p-2 border rounded" type="file" name="menu" accept="image/*" onChange={handleMenuChange} multiple />
                <div className="flex flex-wrap gap-2 mt-2">
                  {menuFileNames.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded flex items-center">
                      <p className="truncate">{truncateFileName(item.name)}</p>
                      <div className="ml-2 cursor-pointer" onClick={() => handleMenuRemove(index)}><RiDeleteBin6Line /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button className="bg-reviews text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300" type="submit">{loading ? "Adding..." : "Add Restaurant"}</button>
        </form>
      </div>
    </div>
  );


};

export default AddRestaurant;

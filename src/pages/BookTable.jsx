import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import "../css/bookATable.css";
import Footer from '../components/Footer';
import CityCard from '../components/CityCard';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { cuisineOptions } from '../filterParameters';
import { typesOptions } from '../filterParameters';
import { featureOptions } from '../filterParameters';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';

const BookTable = () => {

  const { city, area, location, cuisine, types, amenities } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [showNoRestaurant, setShowNoRestaurant] = useState(false);

  const [selectedCuisines, setSelectedCuisines] = useState(cuisine ? [convertToTitleCase(cuisine),] : []);
  const [selectedTypes, setSelectedTypes] = useState(types ? [convertToTitleCase(types),] : []);
  const [selectedFeatures, setSelectedFeatures] = useState(amenities ? [convertToCamelCase(amenities),] : []);

  const [showCuisineFilters, setShowCuisineFilters] = useState(true);
  const [showTypeFilters, setShowTypeFilters] = useState(true);
  const [showFeatureFilters, setShowFeatureFilters] = useState(true);

  const [showMoreCuisine, setShowMoreCuisine] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [showMoreFeature, setShowMoreFeature] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [averageRatings, setAverageRatings] = useState([]);

  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(capitalizedCity);

  function formatString(area) {
    const words = area.split('-');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const formattedString = capitalizedWords.join(' ');

    return formattedString;
  }

  // Convert kebab-case to camelCase
  const kebabToCamel = (str) => {
    return str ? str.replace(/-([a-z])/g, (match, group) => group.toUpperCase()) : '';
  };

  // Convert kebab-case to PascalCase
  const kebabToPascal = (str) => {
    const camelCase = kebabToCamel(str);
    return camelCase ? camelCase.charAt(0).toUpperCase() + camelCase.slice(1) : '';
  };

  // Convert kebab-case to Title Case
  const kebabToTitleCase = (str) => {
    return str
      ? str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      : '';
  };

  function convertToCamelCase(inputString) {
    return inputString.replace(/-([a-z])/g, function (match, group1) {
      return group1.toUpperCase();
    }).replace(/^\w/, c => c.toUpperCase());
  };

  function convertToTitleCase(str) {
    return str.replace(/(?:^|-)([a-z])/g, function (match, group) {
      return ' ' + group.toUpperCase();
    }).trim();
  };

  let cuisineInParams, typeInParams, featureInParams;
  if (cuisine) {
    cuisineInParams = convertToTitleCase(cuisine);
  } else if (types) {
    typeInParams = convertToTitleCase(types);
  } else if (amenities) {
    featureInParams = convertToCamelCase(amenities);
  }

  //Convert the types to desired format
  function convertToOriginalFormat(cleanedString) {
    if (cleanedString) {
      const words = cleanedString.split('-');
      const originalFormat = words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return originalFormat;
    }
  }

  useEffect(() => {
    setShowLoading(true);
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          types
            ? `${BASE_URL}/restaurants?city=${capitalizedCity}&types=${convertToOriginalFormat(types)}`
            : amenities
              ? `${BASE_URL}/restaurants?city=${capitalizedCity}&area=${formatString(area)}&amenities=${kebabToPascal(amenities)}`
              : location
                ? `${BASE_URL}/restaurants?city=${capitalizedCity}&area=${formatString(area)}&location=${formatString(location)}`
                : cuisine
                  ? area
                    ? `${BASE_URL}/restaurants?city=${capitalizedCity}&area=${formatString(area)}&cuisine=${formatString(cuisine)}`
                    : `${BASE_URL}/restaurants?city=${capitalizedCity}&cuisine=${formatString(cuisine)}`
                  : area
                    ? `${BASE_URL}/restaurants?city=${capitalizedCity}&area=${formatString(area)}`
                    : `${BASE_URL}/restaurants?city=${capitalizedCity}`
        );
        const data = await response.json();
        setRestaurants(data.restaurants || []);

        // Calculate and store average ratings for each restaurant
        const ratingsArray = data.restaurants.map(restaurant => {
          const reviews = restaurant.reviews;
          const totalRatings = reviews.length;
          const ratingSum = totalRatings > 0 ? reviews.reduce((sum, review) => sum + review._id.rating, 0) : 0;
          const avgRating = totalRatings > 0 ? ratingSum / totalRatings : 0;

          return avgRating.toFixed(1);
        });

        setAverageRatings(ratingsArray);

      } catch (error) {
        console.error(error);
      } finally {
        setShowLoading(false);
      }
    };

    fetchRestaurants();
  }, [capitalizedCity, area, location, cuisine, types, amenities]);

  const sortOptions = [
    { label: 'Rating', value: 'rating' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Price: Low to High', value: 'lowToHigh' },
    { label: 'Price: High to Low', value: 'highToLow' },
  ];

  //Applying filter/sorting on fetched restaurants
  const filterRestaurants = () => {
    let filteredRestaurants = [...restaurants];

    // Apply cuisine filters
    if (selectedCuisines.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.cuisine && selectedCuisines.every((cuisine) => restaurant.cuisine.includes(cuisine))
      );
    }

    // Apply type filters if selected
    if (selectedTypes.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.types && selectedTypes.every((type) => restaurant.types.includes(type))
      );
    }

    // Apply feature filters if selected
    if (selectedFeatures.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.amenities && selectedFeatures.every((amenity) => restaurant.amenities.includes(amenity))
      );
    }

    // Apply sorting if selected
    if (sortBy === 'lowToHigh') {
      filteredRestaurants = filteredRestaurants.sort((a, b) => a.averageCostForTwo - b.averageCostForTwo);
    } else if (sortBy === 'highToLow') {
      filteredRestaurants = filteredRestaurants.sort((a, b) => b.averageCostForTwo - a.averageCostForTwo);
    } else if (sortBy === 'rating') {
      filteredRestaurants.sort((a, b) => averageRatings[restaurants.indexOf(b)] - averageRatings[restaurants.indexOf(a)]);
    } else {
      filteredRestaurants = filteredRestaurants.sort((a, b) => b.reviews.length - a.reviews.length);
    }

    return filteredRestaurants;
  };

  const records = filterRestaurants().slice(firstIndex, lastIndex);
  const nPage = Math.ceil(filterRestaurants().length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  const handleCuisineChange = (e) => {
    const value = e.target.value;
    setSelectedCuisines((prev) =>
      prev.includes(value) ? prev.filter((cuisine) => cuisine !== value) : [...prev, value]
    );
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]
    );
  };

  const handleFeatureChange = (e) => {
    const value = e.target.value;
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((feature) => feature !== value) : [...prev, value]
    );
  };

  const restaurantAreaArrays = restaurants ? restaurants.map((restaurant) => restaurant.area) : [];
  const uniqueArea = [...new Set(restaurantAreaArrays.flat())];

  function getRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const actualArea = getRandomElements(uniqueArea, 1);

  let convertedArea = '';

  if (Array.isArray(actualArea) && actualArea.length > 0) {
    convertedArea = actualArea[0].toLowerCase().replace(/\s+/g, '-');
  }

  useEffect(() => {
    if (records.length === 0) {
      setShowNoRestaurant(true);
    } else {
      setShowNoRestaurant(false);
    }
  }, [records]);

  const handleClearClick = (parameter) => {
    // Clear all selected features
    if (parameter === "features") {
      if (featureInParams) {
        setSelectedFeatures((prev) => {
          const filteredCuisines = prev.filter((feature) => featureInParams.includes(feature));
          return filteredCuisines;
        });
      } else {
        setSelectedFeatures([]);
      }
    } else if (parameter === "types") {
      if (typeInParams) {
        setSelectedTypes((prev) => {
          const filteredCuisines = prev.filter((type) => typeInParams.includes(type));
          return filteredCuisines;
        });
      } else {
        setSelectedTypes([]);
      }
    } else {
      if (cuisineInParams) {
        setSelectedCuisines((prev) => {
          const filteredCuisines = prev.filter((cuisine) => cuisineInParams.includes(cuisine));
          return filteredCuisines;
        });
      } else {
        setSelectedCuisines([]);
      }
    }
  };

  return (
    <>
      <Navbar
        city={selectedCity.toLowerCase()}
        active={"Book a Table"}
        onSelectCity={setSelectedCity}
        onCityChangeRedirect={(selectedCity) => {
          navigate(`/${selectedCity.toLowerCase()}`);
        }}
      />
      {showLoading && <Loading />}
      <div className="city-restaurant">
        <div className="city-filters">
          {!showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(true)}><FaPlus /></span>
            </div>
          }
          {showCuisineFilters &&
            <div className="city-cuisine-filters">
              Cuisines
              <span className='city-cuisine-filters-span' onClick={() => setShowCuisineFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">
                {cuisineOptions.slice(0, 7).map((cuisine) => (
                  <>
                    <input type="checkbox" id={cuisine.value} name={cuisine.value} onChange={handleCuisineChange} checked={selectedCuisines.includes(cuisine.label)} value={cuisine.label} disabled={cuisineInParams === cuisine.label} />
                    <label htmlFor={cuisine.value}>{cuisine.label}</label><br />
                  </>
                ))}
                {!showMoreCuisine && (
                  <p className='city-show-more' onClick={() => setShowMoreCuisine(true)}>
                    Show more..
                  </p>
                )}
                {showMoreCuisine &&
                  <div className='book-table-filter-modal'>
                    <div className='book-table-filter-modal-contents'>
                      <div className='book-table-filter-modal-header'>
                        <h3>Filter by Cuisines</h3>
                        <p onClick={() => setShowMoreCuisine(false)}>
                          <span className='book-table-filter-close' title='Close'><IoClose /></span>
                        </p>
                      </div>
                      <div className='book-table-filter-modal-content'>
                        {cuisineOptions.map((cuisine) => (
                          <div key={cuisine.value} title={`${cuisine.label} Cuisines`} className='book-table-filter-modal-actual-content'>
                            <input type="checkbox" id={cuisine.value} name={cuisine.value} onChange={handleCuisineChange} checked={selectedCuisines.includes(cuisine.label)} value={cuisine.label} disabled={cuisineInParams === cuisine.label} />
                            <label htmlFor={cuisine.value}>{cuisine.label}</label>
                          </div>
                        ))}
                      </div>
                      <div onClick={() => handleClearClick("cuisines")} title='Clear' className='book-table-filter-modal-footer'>
                        Clear
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          {!showTypeFilters &&
            <div className="city-type-filters">
              Types
              <span className='city-type-filters-span' onClick={() => setShowTypeFilters(true)}><FaPlus /></span>
            </div>
          }
          {showTypeFilters &&
            <div className="city-type-filters">
              Types
              <span className='city-type-filters-span' onClick={() => setShowTypeFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">
                {typesOptions.slice(0, 7).map((types) => (
                  <>
                    <input type="checkbox" id={types.value} name={types.value} onChange={handleTypeChange} checked={selectedTypes.includes(types.label)} value={types.label} disabled={typeInParams === types.label} />
                    <label htmlFor={types.value}>
                      {
                        types.label === 'Qsr' ? 'QSR' :
                          types.label === 'Girf Buffet Deals' ? 'GIRF Buffet Deals' :
                            types.label === 'Girf Flat 50' ? 'GIRF Flat 50' : types.label
                      }
                    </label><br />
                  </>
                ))}
                {!showMoreTypes && (
                  <p className='city-show-more' onClick={() => setShowMoreTypes(true)}>
                    Show more..
                  </p>
                )}
                {showMoreTypes &&
                  <div className='book-table-filter-modal'>
                    <div className='book-table-filter-modal-contents'>
                      <div className='book-table-filter-modal-header'>
                        <h3>Filter by Types</h3>
                        <p onClick={() => setShowMoreTypes(false)}>
                          <span className='book-table-filter-close' title='Close'><IoClose /></span>
                        </p>
                      </div>
                      <div className='book-table-filter-modal-content'>
                        {typesOptions.map((types) => (
                          <div key={types.value} title={`${types.label === 'Qsr' ? 'QSR' :
                            types.label === 'Girf Buffet Deals' ? 'GIRF Buffet Deals' :
                              types.label === 'Girf Flat 50' ? 'GIRF Flat 50' : types.label
                            } Restaurants`}
                            className='book-table-filter-modal-actual-content'>
                            <input type="checkbox" id={types.value} name={types.value} onChange={handleTypeChange} checked={selectedTypes.includes(types.label)} value={types.label} disabled={typeInParams === types.label} />
                            <label htmlFor={types.value}>
                              {
                                types.label === 'Qsr' ? 'QSR' :
                                  types.label === 'Girf Buffet Deals' ? 'GIRF Buffet Deals' :
                                    types.label === 'Girf Flat 50' ? 'GIRF Flat 50' : types.label
                              }
                            </label>
                          </div>
                        ))}
                      </div>
                      <div onClick={() => handleClearClick("types")} title='Clear' className='book-table-filter-modal-footer'>
                        Clear
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          {!showFeatureFilters &&
            <div className="city-feature-filters">
              Features
              <span className='city-feature-filters-span' onClick={() => setShowFeatureFilters(true)}><FaPlus /></span>
            </div>
          }
          {showFeatureFilters &&
            <div className="city-feature-filters">
              Features
              <span className='city-feature-filters-span' onClick={() => setShowFeatureFilters(false)}><FaMinus /></span>
              <div className="city-checkboxes">
                {featureOptions.slice(0, 7).map((feature) => (
                  <>
                    <input type="checkbox" id={feature.value} name={feature.value} onChange={handleFeatureChange} checked={selectedFeatures.includes(feature.value)} value={feature.value} disabled={featureInParams === feature.value} />
                    <label htmlFor={feature.value}>{feature.label}</label><br />
                  </>
                ))}
                {!showMoreFeature && (
                  <p className='city-show-more' onClick={() => setShowMoreFeature(true)}>
                    Show more..
                  </p>
                )}
                {showMoreFeature &&
                  <div className='book-table-filter-modal'>
                    <div className='book-table-filter-modal-contents'>
                      <div className='book-table-filter-modal-header'>
                        <h3>Filter by Features</h3>
                        <p onClick={() => setShowMoreFeature(false)}>
                          <span className='book-table-filter-close' title='Close'><IoClose /></span>
                        </p>
                      </div>
                      <div className='book-table-filter-modal-content'>
                        {featureOptions.map((feature) => (
                          <div key={feature.value} title={`${feature.label} Feature`} className='book-table-filter-modal-actual-content'>
                            <input type="checkbox" id={feature.value} name={feature.value} onChange={handleFeatureChange} checked={selectedFeatures.includes(feature.value)} value={feature.value} disabled={featureInParams === feature.value} />
                            <label htmlFor={feature.value}>{feature.label}</label>
                          </div>
                        ))}
                      </div>
                      <div onClick={() => handleClearClick("features")} title='Clear' className='book-table-filter-modal-footer'>
                        Clear
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

        </div>
        <div className="city-restaurant-content">
          <div className="resMainUrls">
            <a className='url' href={"/"}> Taste&Flavor {'>'} </a>
            <a className='url' href={`/${city}-restaurants`}> {capitalizedCity} {'>'} </a>
            {area &&
              <a className='url' href={`/${city}-restaurants/${area}`}> {formatString(area)} {'>'} </a>
            }
            {location &&
              <a className='url' href={`/${city}-restaurants/${area}/${location}`}> {formatString(location)} {'>'} </a>
            }
            {
              amenities ? kebabToTitleCase(amenities) + " Feature" :
                cuisine ? formatString(cuisine) + ' Cuisine' :
                  (location ? formatString(location) : area ? formatString(area) : capitalizedCity) + ' Restaurants'
            }
            {
              types
                ? (() => {
                  let originalFormat = convertToOriginalFormat(types);

                  return originalFormat === "Qsr"
                    ? " > QSR Restaurants"
                    : originalFormat === "Girf Flat 50"
                      ? " > GIRF Flat 50 Restaurants"
                      : originalFormat === "Girf Buffet Deals"
                        ? " > GIRF Buffet Deals Restaurants"
                        : `${" > "} ${originalFormat} Restaurants`;
                })()
                : " "
            }
          </div>
          <div className="city-restaurants-heading-sort">
            <div className="city-restaurants-heading">
              Best {amenities ? kebabToTitleCase(amenities) : ' '}
              {cuisine ? ` ${formatString(cuisine)}` : ' '}
              {
                types
                  ? (() => {
                    let originalFormat = convertToOriginalFormat(types);

                    return originalFormat === "Qsr"
                      ? "QSR"
                      : originalFormat === "Girf Flat 50"
                        ? "GIRF Flat 50"
                        : originalFormat === "Girf Buffet Deals"
                          ? "GIRF Buffet Deals"
                          : originalFormat;
                  })()
                  : " "
              }
              {' '}Restaurants Near Me in{' '}
              {location ? `${formatString(location)}, ${formatString(area)}` : area ? formatString(area) : capitalizedCity}
              <span className="city-restaurants-length"> ({records.length}) </span>
            </div>
            <span className='city-sort-by'>Sort by</span>
            <div className="city-restaurants-sort">
              <div className="city-restaurants-sort-element" onClick={() => setShowSort(!showSort)}>
                <span>{sortBy === 'popularity' ? 'Popularity' : sortBy === 'rating' ? 'Rating' : sortBy === 'lowToHigh' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                <span className="city-restaurants-updown">{showSort ? <GoChevronUp /> : <GoChevronDown />}</span>
              </div>
              {showSort &&
                <div className="city-restaurants-sort-elements">
                  {sortOptions.map(option => (
                    <div
                      key={option.value}
                      className="city-sort-elements"
                      onClick={() => { setSortBy(option.value); setShowSort(false); }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
          <div className="city-restaurants">
            {showNoRestaurant ? (
              <h1 className='city-no-restaurant'>No Food Found!</h1>
            ) : (
              records.map((restaurant) => (
                <CityCard key={restaurant._id} restaurant={restaurant} />
              ))
            )}
          </div>
          {records.length < filterRestaurants().length ?
            (<div className='pagination-container'>
              <li className='pagination-item'>
                <a href="#" onClick={prevPage}>Prev</a>
              </li>
              {
                numbers.map((n, i) => (
                  <li key={i} className={`pagination-item ${currentPage === n ? 'active' : ''}`}>
                    <a href="#" onClick={() => changeCurrentPage(n)} >{n}</a>
                  </li>
                ))
              }
              <li className='pagination-item'>
                <a href="#" onClick={nextPage}>Next</a>
              </li>
            </div>)
            : ""
          }
        </div>
      </div>
      <Footer city={city} area={convertedArea} />
    </>
  );

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

}

export default BookTable;

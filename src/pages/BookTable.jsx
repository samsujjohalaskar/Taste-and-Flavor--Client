import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CityCard from '../components/CityCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { cuisineOptions } from '../filterParameters';
import { typesOptions } from '../filterParameters';
import { featureOptions } from '../filterParameters';
import { BASE_URL } from '../utils/services';
import Loading from '../components/Loading';
import NotACard from '../components/NotACard';
import FilterSection from '../components/FilterSection';

const BookTable = () => {

  const { city, area, location, cuisine, types, amenities } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const [showNoRestaurant, setShowNoRestaurant] = useState(false);

  const [selectedCuisines, setSelectedCuisines] = useState(cuisine ? [convertToTitleCase(cuisine),] : []);
  const [selectedTypes, setSelectedTypes] = useState(types ? [convertToTitleCase(types),] : []);
  const [selectedFeatures, setSelectedFeatures] = useState(amenities ? [convertToCamelCase(amenities),] : []);

  const [showCuisineFilters, setShowCuisineFilters] = useState(true);
  const [showTypeFilters, setShowTypeFilters] = useState(false);
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
    const fetchRestaurants = async () => {
      setShowLoading(true);
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
          const ratingSum = totalRatings > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) : 0;
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
      <div className="flex justify-center bg-bg p-4">
        <div className="hidden w-[200px] my-2 mr-2 xl:block">

          <FilterSection
            title="Cuisines"
            showFilters={showCuisineFilters}
            setShowFilters={setShowCuisineFilters}
            options={cuisineOptions}
            selectedOptions={selectedCuisines}
            optionInParams={cuisineInParams}
            handleOptionChange={handleCuisineChange}
            showMoreOptions={showMoreCuisine}
            setShowMoreOptions={setShowMoreCuisine}
            handleClearClick={handleClearClick}
          />

          <FilterSection
            title="Features"
            showFilters={showFeatureFilters}
            setShowFilters={setShowFeatureFilters}
            options={featureOptions}
            selectedOptions={selectedFeatures}
            optionInParams={featureInParams}
            handleOptionChange={handleFeatureChange}
            showMoreOptions={showMoreFeature}
            setShowMoreOptions={setShowMoreFeature}
            handleClearClick={handleClearClick}
          />

          <FilterSection
            title="Types"
            showFilters={showTypeFilters}
            setShowFilters={setShowTypeFilters}
            options={typesOptions}
            selectedOptions={selectedTypes}
            optionInParams={typeInParams}
            handleOptionChange={handleTypeChange}
            showMoreOptions={showMoreTypes}
            setShowMoreOptions={setShowMoreTypes}
            handleClearClick={handleClearClick}
          />

        </div>
        <div className="m-4">
          <div className="text-sm text-text pb-2">
            <Link className='text-sm' to={"/"}> Taste&Flavor {'>'} </Link>
            <Link className='text-sm' to={`/${city}-restaurants`}> {capitalizedCity} {'>'} </Link>
            {area &&
              <Link className='text-sm' to={`/${city}-restaurants/${area}`}> {formatString(area)} {'>'} </Link>
            }
            {location &&
              <Link className='text-sm' to={`/${city}-restaurants/${area}/${location}`}> {formatString(location)} {'>'} </Link>
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
          <div className="flex justify-between items-center flex-wrap my-2 gap-2 max-w-[870px]">
            <div className="text-2xl font-semibold">
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
              <span className="ml-1 align-text-bottom text-xs text-text font-thin"> ({filterRestaurants().length}) </span>
            </div>
            <div className='flex items-center'>
              <span className='text-text'>Sort by</span>
              <div>
                <div className="w-[160px] bg-white ml-2 py-2 px-3 text-sm font-thin rounded text-text cursor-pointer" onClick={() => setShowSort(!showSort)}>
                  <span>{sortBy === 'popularity' ? 'Popularity' : sortBy === 'rating' ? 'Rating' : sortBy === 'lowToHigh' ? 'Price: Low to High' : 'Price: High to Low'}</span>
                  <span className="text-xl float-right">{showSort ? <GoChevronUp /> : <GoChevronDown />}</span>
                </div>
                {showSort &&
                  <div className="absolute w-44 bg-white ml-[10px] font-thin text-sm text-text z-10 shadow-offers border-[1px] border-border">
                    {sortOptions.map(option => (
                      <div
                        key={option.value}
                        className="py-[10px] pl-[14px] border-b-[1px] border-border cursor-pointer last:border-b-[0px]"
                        onClick={() => { setSortBy(option.value); setShowSort(false); }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-5 max-w-[870px] md:justify-start">
            {showNoRestaurant ? (
              showLoading ? (
                [...Array(6)].map((_, index) => (
                  <NotACard key={index} />
                ))
              ) : (
                <p className='text-2xl text-theme text-center m-4'>No Food Found!</p>
              )
            ) : (
              records.map((restaurant) => (
                <CityCard key={restaurant._id} restaurant={restaurant} />
              ))
            )}
          </div>
          {records.length < filterRestaurants().length ?
            (<div className='flex justify-center w-max mt-7'>
              <li className='px-2 py-1 list-none'>
                <a href={`#page${currentPage}`} onClick={prevPage} className='block text-black px-2 py-1 no-underline'>Prev</a>
              </li>
              {
                numbers.map((n, i) => (
                  <li key={i} className={`px-2 py-1 list-none ${currentPage === n ? 'bg-pagination text-white' : 'text-black'}`}>
                    <a href={`#page${currentPage}`} onClick={() => changeCurrentPage(n)} className='block px-2 py-1 no-underline'>{n}</a>
                  </li>
                ))
              }
              <li className='px-2 py-1 list-none'>
                <a href={`#page${currentPage}`} onClick={nextPage} className='block text-black px-2 py-1 no-underline'>Next</a>
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

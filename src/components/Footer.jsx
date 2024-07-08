import React from 'react'
import cities from "../allCities";
import { Link } from 'react-router-dom';
import FooterBottom from './FooterBottom';

export default function Footer({ city }) {

  const midSections = [
    {
      title: 'Discover',
      items: ['Trending Restaurants']
    },
    {
      title: 'About',
      items: ['About Us', 'Blog', 'Terms & Conditions', 'Privacy Policy']
    }
  ];

  const getCuisineItems = (selectedCity) => {
    switch (selectedCity) {
      case 'delhi':
        return ['North Indian', 'Mughlai', 'Street Food', 'Italian', 'Chinese'];
      case 'mumbai':
        return ['Maharashtrian', 'Seafood', 'Street Food', 'Chinese', 'Italian'];
      case 'bangalore':
        return ['South Indian', 'North Indian', 'Chinese', 'Italian', 'Mexican'];
      case 'kolkata':
        return ['Bengali', 'North Indian', 'Chinese', 'Street Food', 'Italian'];
      case 'chennai':
        return ['South Indian', 'North Indian', 'Chinese', 'Italian', 'Fast Food'];
      case 'hyderabad':
        return ['Hyderabadi', 'South Indian', 'North Indian', 'Chinese', 'Italian'];
      case 'pune':
        return ['Maharashtrian', 'North Indian', 'Chinese', 'Italian', 'Mughlai'];
      case 'ahmedabad':
        return ['Gujarati', 'North Indian', 'Chinese', 'Italian', 'Mughlai'];
      case 'jaipur':
        return ['Rajasthani', 'North Indian', 'Chinese', 'Italian', 'Mughlai'];
      case 'lucknow':
        return ['Awadhi', 'North Indian', 'Chinese', 'Italian', 'Mughlai'];
      case 'chandigarh':
        return ['North Indian', 'Chinese', 'Italian', 'Mughlai', 'Continental'];
      case 'bhopal':
        return ['North Indian', 'Chinese', 'Italian', 'Mughlai', 'Fast Food'];
      case 'indore':
        return ['North Indian', 'Chinese', 'Italian', 'Mughlai', 'Street Food'];
      case 'nagpur':
        return ['Maharashtrian', 'North Indian', 'Chinese', 'Italian', 'Mughlai'];
      case 'patna':
        return ['North Indian', 'Chinese', 'Italian', 'Mughlai', 'Fast Food'];
      case 'kanpur':
        return ['North Indian', 'Chinese', 'Italian', 'Mughlai', 'Street Food'];
      case 'agra':
        return ['North Indian', 'Mughlai', 'Street Food', 'Chinese', 'Italian'];
      case 'varanasi':
        return ['North Indian', 'Bengali', 'Chinese', 'Italian', 'Mughlai'];
      case 'coimbatore':
        return ['South Indian', 'North Indian', 'Chinese', 'Italian', 'Fast Food'];
      case 'visakhapatnam':
        return ['South Indian', 'North Indian', 'Chinese', 'Italian', 'Seafood'];
      default:
        return [];
    }
  };

  const getFacilityItems = (selectedCity) => {
    switch (selectedCity) {
      case 'delhi':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'Street Food', '5 Star'];
      case 'mumbai':
        return ['Casual Dining', 'Pizza', 'QSR', 'Seafood', 'Buffet'];
      case 'bangalore':
        return ['Ethnic Cuisine', 'Cafe', 'GIRF Flat 50', 'Street Food', '5 Star'];
      case 'kolkata':
        return ['Casual Dining', 'Pizza', 'Fine Dining', 'GIRF Flat 50', 'Buffet'];
      case 'chennai':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'Bakery'];
      case 'hyderabad':
        return ['Casual Dining', 'Pizza', 'QSR', 'Pub', 'Buffet'];
      case 'pune':
        return ['Casual Dining', 'Pizza', 'QSR', 'Family Style', 'Vegan'];
      case 'ahmedabad':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'Street Food'];
      case 'jaipur':
        return ['Casual Dining', 'Pizza', 'QSR', 'Buffet', 'Vegan'];
      case 'lucknow':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'Street Food', 'GIRF Buffet Deals'];
      case 'chandigarh':
        return ['Casual Dining', 'Pizza', 'QSR', 'Ethnic Cuisine', 'Street Food'];
      case 'bhopal':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'GIRF Buffet Deals'];
      case 'indore':
        return ['Casual Dining', 'Pizza', 'QSR', 'Street Food', 'Vegan'];
      case 'nagpur':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'Buffet'];
      case 'patna':
        return ['Casual Dining', 'Pizza', 'QSR', 'GIRF Buffet Deals', 'Vegan'];
      case 'kanpur':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'Street Food', 'Vegan'];
      case 'agra':
        return ['Casual Dining', 'Pizza', 'QSR', 'Street Food', 'GIRF Buffet Deals'];
      case 'varanasi':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'Vegan'];
      case 'coimbatore':
        return ['Casual Dining', 'Pizza', 'QSR', 'Street Food', 'Bakery'];
      case 'visakhapatnam':
        return ['Fine Dining', 'Casual Dining', 'Pizza', 'QSR', 'Buffet'];
      default:
        return [];
    }
  };

  const getLocationItems = (selectedCity) => {
    switch (selectedCity) {
      case 'delhi':
        return [
          { name: 'Connaught Place', area: 'Central Delhi' },
          { name: 'Karol Bagh', area: 'Central Delhi' },
          { name: 'South Delhi', area: 'South Delhi' },
          { name: 'Rajouri Garden', area: 'West Delhi' },
          { name: 'Lajpat Nagar', area: 'South Delhi' },
          { name: 'Saket', area: 'South Delhi' }
        ];
      case 'mumbai':
        return [
          { name: 'Colaba', area: 'South Mumbai' },
          { name: 'Bandra', area: 'West Mumbai' },
          { name: 'Andheri', area: 'West Mumbai' },
          { name: 'Powai', area: 'East Mumbai' },
          { name: 'Lower Parel', area: 'South Mumbai' },
          { name: 'Chembur', area: 'East Mumbai' }
        ];
      case 'bangalore':
        return [
          { name: 'Indiranagar', area: 'East Bangalore' },
          { name: 'Koramangala', area: 'South Bangalore' },
          { name: 'Whitefield', area: 'East Bangalore' },
          { name: 'Malleshwaram', area: 'North Bangalore' },
          { name: 'Electronic City', area: 'South Bangalore' },
          { name: 'Jayanagar', area: 'South Bangalore' }
        ];
      case 'kolkata':
        return [
          { name: 'Park Street', area: 'Central Kolkata' },
          { name: 'Salt Lake', area: 'East Kolkata' },
          { name: 'Howrah', area: 'West Kolkata' },
          { name: 'New Town', area: 'East Kolkata' },
          { name: 'Kolkata Airport', area: 'East Kolkata' },
          { name: 'Gariahat', area: 'South Kolkata' }
        ];
      case 'chennai':
        return [
          { name: 'Anna Nagar', area: 'North Chennai' },
          { name: 'Thyagaraya Nagar', area: 'Central Chennai' },
          { name: 'Adyar', area: 'South Chennai' },
          { name: 'Velachery', area: 'South Chennai' },
          { name: 'Guindy', area: 'South Chennai' },
          { name: 'Mylapore', area: 'Central Chennai' }
        ];
      case 'hyderabad':
        return [
          { name: 'Banjara Hills', area: 'Central Hyderabad' },
          { name: 'Jubilee Hills', area: 'Central Hyderabad' },
          { name: 'Gachibowli', area: 'West Hyderabad' },
          { name: 'Secunderabad', area: 'North Hyderabad' },
          { name: 'Kondapur', area: 'West Hyderabad' },
          { name: 'Madhapur', area: 'West Hyderabad' }
        ];
      case 'pune':
        return [
          { name: 'Koregaon Park', area: 'East Pune' },
          { name: 'Deccan', area: 'Central Pune' },
          { name: 'Hadapsar', area: 'East Pune' },
          { name: 'Magarpatta', area: 'East Pune' },
          { name: 'Kothrud', area: 'West Pune' },
          { name: 'Viman Nagar', area: 'East Pune' }
        ];
      case 'ahmedabad':
        return [
          { name: 'C.G. Road', area: 'West Ahmedabad' },
          { name: 'Manek Chowk', area: 'Central Ahmedabad' },
          { name: 'Prahlad Nagar', area: 'West Ahmedabad' },
          { name: 'SG Highway', area: 'West Ahmedabad' },
          { name: 'Ambawadi', area: 'West Ahmedabad' },
          { name: 'Navrangpura', area: 'West Ahmedabad' }
        ];
      case 'jaipur':
        return [
          { name: 'C-Scheme', area: 'Central Jaipur' },
          { name: 'Vaishali Nagar', area: 'West Jaipur' },
          { name: 'Tonk Road', area: 'South Jaipur' },
          { name: 'Malviya Nagar', area: 'South Jaipur' },
          { name: 'Raja Park', area: 'Central Jaipur' },
          { name: 'Jhotwara', area: 'North Jaipur' }
        ];
      case 'lucknow':
        return [
          { name: 'Hazratganj', area: 'Central Lucknow' },
          { name: 'Gomti Nagar', area: 'East Lucknow' },
          { name: 'Aliganj', area: 'West Lucknow' },
          { name: 'Indira Nagar', area: 'East Lucknow' },
          { name: 'Husainabad', area: 'Central Lucknow' },
          { name: 'Mahanagar', area: 'West Lucknow' }
        ];
      case 'chandigarh':
        return [
          { name: 'Sector 17', area: 'Central Chandigarh' },
          { name: 'Sector 35', area: 'Central Chandigarh' },
          { name: 'Sector 26', area: 'Central Chandigarh' },
          { name: 'Sector 43', area: 'Central Chandigarh' },
          { name: 'Panchkula', area: 'East Chandigarh' },
          { name: 'Zirakpur', area: 'East Chandigarh' }
        ];
      case 'bhopal':
        return [
          { name: 'MP Nagar', area: 'South Bhopal' },
          { name: 'Arera Colony', area: 'South Bhopal' },
          { name: 'Berasia Road', area: 'North Bhopal' },
          { name: 'Shyamla Hills', area: 'South Bhopal' },
          { name: 'Govindpura', area: 'North Bhopal' },
          { name: 'Habibganj', area: 'North Bhopal' }
        ];
      case 'indore':
        return [
          { name: 'Vijay Nagar', area: 'East Indore' },
          { name: 'South Tukoganj', area: 'Central Indore' },
          { name: 'Old Palasia', area: 'Central Indore' },
          { name: 'Bhawarkua', area: 'Central Indore' },
          { name: 'Rajwada', area: 'Central Indore' },
          { name: 'Manorama Ganj', area: 'Central Indore' }
        ];
      case 'nagpur':
        return [
          { name: 'Sitabuldi', area: 'Central Nagpur' },
          { name: 'Sadar', area: 'Central Nagpur' },
          { name: 'Dharampeth', area: 'Central Nagpur' },
          { name: 'Ramdaspeth', area: 'Central Nagpur' },
          { name: 'Civil Lines', area: 'Central Nagpur' },
          { name: 'Nandanvan', area: 'East Nagpur' }
        ];
      case 'patna':
        return [
          { name: 'Kankarbagh', area: 'Central Patna' },
          { name: 'Boring Road', area: 'Central Patna' },
          { name: 'Frazer Road', area: 'Central Patna' },
          { name: 'Rajendra Nagar', area: 'Central Patna' },
          { name: 'Gandhi Maidan', area: 'Central Patna' },
          { name: 'Ashiana Nagar', area: 'East Patna' }
        ];
      case 'kanpur':
        return [
          { name: 'Civil Lines', area: 'Central Kanpur' },
          { name: 'Swaroop Nagar', area: 'Central Kanpur' },
          { name: 'Kakadeo', area: 'Central Kanpur' },
          { name: 'Kidwai Nagar', area: 'Central Kanpur' },
          { name: 'Kalyanpur', area: 'Central Kanpur' },
          { name: 'Shastri Nagar', area: 'Central Kanpur' }
        ];
      case 'agra':
        return [
          { name: 'Tajganj', area: 'Central Agra' },
          { name: 'Fatehabad Road', area: 'Central Agra' },
          { name: 'Sikandra', area: 'Central Agra' },
          { name: 'Civil Lines', area: 'Central Agra' },
          { name: 'Sanjay Place', area: 'Central Agra' },
          { name: 'Kamla Nagar', area: 'Central Agra' }
        ];
      case 'varanasi':
        return [
          { name: 'Assi Ghat', area: 'East Varanasi' },
          { name: 'Varanasi Cantt', area: 'East Varanasi' },
          { name: 'Sarnath', area: 'East Varanasi' },
          { name: 'Sigra', area: 'East Varanasi' },
          { name: 'Bhelupur', area: 'East Varanasi' },
          { name: 'Maldahiya', area: 'East Varanasi' }
        ];
      case 'coimbatore':
        return [
          { name: 'RS Puram', area: 'Central Coimbatore' },
          { name: 'Peelamedu', area: 'Central Coimbatore' },
          { name: 'Gandhipuram', area: 'Central Coimbatore' },
          { name: 'Saibaba Colony', area: 'Central Coimbatore' },
          { name: 'Race Course', area: 'Central Coimbatore' },
          { name: 'Singanallur', area: 'South Coimbatore' }
        ];
      case 'visakhapatnam':
        return [
          { name: 'Dwaraka Nagar', area: 'Central Visakhapatnam' },
          { name: 'Asilmetta', area: 'Central Visakhapatnam' },
          { name: 'Madhurawada', area: 'North Visakhapatnam' },
          { name: 'Seethammadhara', area: 'North Visakhapatnam' },
          { name: 'Beach Road', area: 'Central Visakhapatnam' },
          { name: 'MVP Colony', area: 'Central Visakhapatnam' }
        ];
      default:
        return [];
    }
  };

  const midSectionsCuisine = [
    {
      title: 'Top Cuisines',
      items: getCuisineItems(city)
    }
  ];

  const midSectionsFeature = [
    {
      title: 'Top Facilities',
      items: getFacilityItems(city)
    }
  ];

  const midSectionsLocations = [
    {
      title: 'Top Locations',
      items: getLocationItems(city)
    }
  ];

  return (
    <>
      <div className="footer">
        <section className="flex justify-center flex-col pt-6 pb-12 pl-4 h-max w-full border-b-2 border-bg md:py-14 md:pl-20 lg:pl-32 2xl:items-center 2xl:pl-0">
          <div className='flex flex-col w-full xl:w-[1140px] 2xl:w-[1200px]'>
            <p className="subHeading">Available in</p>
            <ul className="flex list-none flex-row flex-wrap gap-2 sm:gap-0">
              {cities.map((c) => {
                const cleanedCityName = c.cityName
                  .toLowerCase()
                  .replace(/[^a-zA-Z]/g, '-')
                  .replace(/--+/g, '-');

                const url = `/${cleanedCityName}-restaurants`;

                return (
                  <li key={c.cityName} className='min-w-[20%] pt-3'>
                    <Link to={url}>{c.cityName}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <section className="flex justify-center flex-col pt-6 pb-12 pl-4 h-max w-full border-b-2 border-bg md:py-14 md:pl-20 lg:pl-32 2xl:items-center 2xl:pl-0">
          <div className='flex flex-col flex-wrap w-full gap-2 md:flex-row sm:gap-0 xl:w-[1140px] 2xl:w-[1200px]'>
            {midSections.map((section, index) => (
              <div className="min-w-[20%] pt-3" key={index}>
                <p className="subHeading">{section.title}</p>
                <ul className="flex list-none flex-col pt-2 gap-2 flex-wrap">
                  {section.items.map((item, index) => {
                    const cleanedItem = item
                      .toLowerCase()
                      .replace(/[^a-zA-Z]/g, '-')
                      .replace(/--+/g, '-');

                    const url = `/${cleanedItem}`;

                    return (
                      <li key={index}>
                        <Link to={url}>{item}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {midSectionsCuisine.map((section, index) => (
              <div className="min-w-[20%] pt-3" key={index}>
                <p className="subHeading">{section.title}</p>
                <ul className="flex list-none flex-col pt-2 gap-2 flex-wrap">
                  {section.items ? (
                    section.items.map((item, index) => {
                      const cleanedItem = item
                        .toLowerCase()
                        .replace(/[^a-zA-Z]/g, '-')
                        .replace(/--+/g, '-');

                      const url = `/${city}-restaurants/${cleanedItem}-cuisine`;

                      return (
                        <li key={index}>
                          <Link to={url}>{item}</Link>
                        </li>
                      );
                    })
                  ) : (
                    " "
                  )}
                </ul>
              </div>
            ))}
            {midSectionsFeature.map((section, index) => (
              <div className="min-w-[20%] pt-3" key={index}>
                <p className="subHeading">{section.title}</p>
                <ul className="flex list-none flex-col pt-2 gap-2 flex-wrap">
                  {section.items ? (
                    section.items.map((item, index) => {
                      const cleanedItem = item
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]/g, '-')
                        .replace(/--+/g, '-')
                        .replace(/^-+|-+$/g, '');

                      const url = `/${city}-restaurants/${cleanedItem}-facilities`;

                      return (
                        <li key={index}>
                          <Link to={url}>{item}</Link>
                        </li>
                      );
                    })
                  ) : (
                    " "
                  )}
                </ul>
              </div>
            ))}
            {midSectionsLocations.map((section, index) => (
              <div className="min-w-[20%] pt-3" key={index}>
                <p className="subHeading">{section.title}</p>
                <ul className="flex list-none flex-col pt-2 gap-2 flex-wrap">
                  {section.items ? (
                    section.items.map((location, index) => {
                      const cleanedItem = location.name
                        .toLowerCase()
                        .replace(/[^a-zA-Z]/g, '-')
                        .replace(/--+/g, '-');
                      const cleanedArea = location.area
                        .toLowerCase()
                        .replace(/[^a-zA-Z]/g, '-')
                        .replace(/--+/g, '-');

                      const url = `/${city}-restaurants/${cleanedArea}/${cleanedItem}`;

                      return (
                        <li key={index}>
                          <Link to={url}>{location.name}</Link>
                        </li>
                      );
                    })
                  ) : (
                    " "
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <FooterBottom />
      </div>
    </>
  );
}
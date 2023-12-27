import React from 'react';
import "../css/selectLocation.css";
import cities from "../allCities";

const SelectLocation = ({ onSelectCity }) => {
    const handleCitySelect = (selectedCity) => {
        onSelectCity(selectedCity);
    };

    return (
        <>
            <div className="overlay show-overlay">
                <div className="loc-modal">
                    <h2 className='loc-model-heading'>Select City</h2>
                    <ul className="loc-model-cities">
                        {cities.map((c) => (
                            <li
                                key={c.cityName}
                                className="loc-model-city"
                                onClick={() => handleCitySelect(c.cityName)}
                            >
                                {c.cityName}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SelectLocation;

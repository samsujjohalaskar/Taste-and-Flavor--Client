import React from 'react';
import cities from "../allCities";

const SelectLocation = ({ onSelectCity }) => {
    const handleCitySelect = (selectedCity) => {
        onSelectCity(selectedCity);
    };

    return (
        <>
            <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-20 p-2">
                <div className="bg-white shadow-review text-left rounded">
                    <p className='bg-bg text-center text-text text-base rounded-t p-2'>Select City</p>
                    <ul className="flex justify-center flex-wrap gap-2 max-w-[510px] list-none py-5 text-text">
                        {cities.map((c) => (
                            <li
                                key={c.cityName}
                                className="p-2 border-[1px] border-border w-28 text-sm rounded text-center cursor-pointer"
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

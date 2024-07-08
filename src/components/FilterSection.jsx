import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const FilterSection = ({
    title,
    showFilters,
    setShowFilters,
    options,
    selectedOptions,
    optionInParams,
    handleOptionChange,
    showMoreOptions,
    setShowMoreOptions,
    handleClearClick
}) => {
    return (
        <div>
            {!showFilters &&
                <div className={`flex justify-between items-center w-full bg-white py-3 px-4 ${title === "Cuisines" && "rounded-t-md"} ${title === "Types" && "rounded-b-md"} border-b-2 border-bg text-filter text-sm font-extrabold`}>
                    {title}
                    <span className='cursor-pointer text-sm' onClick={() => setShowFilters(true)}><FaPlus /></span>
                </div>
            }
            {showFilters &&
                <div className={`w-full bg-white py-3 px-4 ${title === "Cuisines" && "rounded-t-md"} ${title === "Types" && "rounded-b-md"} border-b-2 border-bg text-filter text-sm font-extrabold`}>
                    {title}
                    <span className='cursor-pointer text-sm float-right' onClick={() => setShowFilters(false)}><FaMinus /></span>
                    <div className="mt-3">
                        {options.slice(0, 7).map((option) => (
                            <div key={option.value}>
                                <input
                                    className='cursor-pointer mx-2 my-1'
                                    type="checkbox"
                                    id={option.value}
                                    name={option.value}
                                    onChange={handleOptionChange}
                                    checked={selectedOptions.includes(option.label)}
                                    value={option.label}
                                    disabled={optionInParams === option.label}
                                />
                                <label className='text-xs font-medium' htmlFor={option.value}>{option.label}</label><br />
                            </div>
                        ))}
                        {!showMoreOptions && (
                            <p className='cursor-pointer text-filter font-medium text-sm mt-2 hover:text-theme' onClick={() => setShowMoreOptions(true)}>
                                Show more..
                            </p>
                        )}
                        {showMoreOptions &&
                            <div className='fixed flex justify-center items-center z-10 top-0 left-0 w-full h-full bg-filterFloat'>
                                <div className='flex flex-col text-left rounded bg-white h-max w-[500px]'>
                                    <div className='flex justify-between items-center bg-bg rounded-t text-base py-2 px-3'>
                                        <p>Filter by {title}</p>
                                        <p onClick={() => setShowMoreOptions(false)}>
                                            <span className='cursor-pointer text-2xl hover:text-theme' title='Close'><IoClose /></span>
                                        </p>
                                    </div>
                                    <div className='flex flex-wrap gap-1 py-3 px-5'>
                                        {options.map((option) => (
                                            <div key={option.value} title={`${option.label} ${title}`} className='flex items-center gap-1 w-[150px]'>
                                                <input
                                                    className='cursor-pointer'
                                                    type="checkbox"
                                                    id={option.value}
                                                    name={option.value}
                                                    onChange={handleOptionChange}
                                                    checked={selectedOptions.includes(option.label)}
                                                    value={option.label}
                                                    disabled={optionInParams === option.label}
                                                />
                                                <label htmlFor={option.value}>{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <div onClick={() => handleClearClick(title.toLowerCase())} title='Clear' className='w-max pl-3 pb-3 cursor-pointer hover:text-theme'>
                                        Clear
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default FilterSection;

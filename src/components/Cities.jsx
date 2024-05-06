import React from 'react'
import { Link } from 'react-router-dom';

export default function Cities({data}) {
    return (
        <>
            <div className="footerTop">
                <h4 className="subHeading">Available in</h4>
                <ul className="cities">
                    {data.map((c) => {
                        const cleanedCityName = c.cityName
                            .toLowerCase()
                            .replace(/[^a-zA-Z]/g, '-')
                            .replace(/--+/g, '-');

                        const url = `/${cleanedCityName}-restaurants`;

                        return (
                            <li key={c.cityName}>
                                <Link to={url}>{c.cityName}</Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}

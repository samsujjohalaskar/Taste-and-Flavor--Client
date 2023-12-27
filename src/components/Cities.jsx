import React from 'react'

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
                                <a href={url}>{c.cityName}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}

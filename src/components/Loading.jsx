import React from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../css/loading.css";

const Loading = () => {
    return (
        <div className="loading-div">
            <Loader
                type="Oval"
                color="#FF5757"
                height={70}
                width={70}
            />
        </div>
    )
}

export default Loading;

import React from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../css/loading.css";

const Loading = () => {
    return (
        <div className="loading-div">
            <Loader
                type="BallTriangle"
                color="#FF5757"
                height={50}
                width={50}
            />
        </div>
    )
}

export default Loading;

import React from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Loading = () => {
    return (
        <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-filterFloat z-50">
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

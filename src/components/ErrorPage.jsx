import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <>
      <div className ="flex justify-center items-center h-dvh">
            <div className ="text-center">
                <h1 className ="text-9xl font-bold">404</h1>
                <p className ="text-3xl"> <span className ="text-theme">Opps!</span> Page not found.</p>
                <p className ="text-2xl mb-6">
                    The page you’re looking for doesn’t exist.
                  </p>
                <Link to="/" className ="bg-theme text-white font-bold p-3 rounded hover:opacity-80">Go Home</Link>
            </div>
        </div>
    </>
  )
}

export default ErrorPage;

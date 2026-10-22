import React from 'react'
import './Error.css';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <>
      <div className="error-page">
        <div className="error">404</div>
        <br />
        <br />
        <span className="info">File not found</span>
        <img
          src="/images/nodatafound.png"
          className="static"
          alt="404-error"
        />
        <div className="home-button">
          <Link to="/home">Go To Home</Link>
        </div>
      </div>
    </>
  );
}

export default Error;

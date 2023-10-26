import React , { useState } from "react";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import "./index.css";

const contents = {
  // Sample contents, you can replace these with your actual data
  "Content1": { img: '../../assets/images/content1.jpg', text: 'Description for Content1' },
  "Content2": { img: '../../assets/images/content2.jpg', text: 'Description for Content2' },
  // ... add more contents as needed
};

const Home = () => {
  const [selectedContent, setSelectedContent] = useState(Object.keys(contents)[0]);

  return (
    <>
      <Navbar />
      <div className="banner-img">
        <div className="title">
          <h3>
            Find the <span>Right Product</span> In the
            <br />
            <span> Right Place</span>
          </h3>
          <div className="small-tagline">
            <p>Exclusice Discounts!! Get Ready to be buy</p>
          </div>
        </div>
        <div className="button" data-testid="btn">
          <Link to="/products">Browse Products</Link>
        </div>
      </div>

      {/* <nav>
        {Object.keys(contents).map(key => (
          <button key={key} onClick={() => setSelectedContent(key)}>
            {key}
          </button>
        ))}
      </nav>
      <div className="content">
        <img src={contents[selectedContent].img} alt={selectedContent} className="content-image" />
        <p>{contents[selectedContent].text}</p>
      </div> */}

      

    <div className="sections-container">
      <div className="section">
        <h2 className="section-heading">Our History</h2>
        <p className="section-content">Founded in 2010, we've transformed from a small online store to a leading e-commerce platform, serving millions globally.</p>
      </div>

      <div className="section">
        <h2 className="section-heading">Our Mission</h2>
        <p className="section-content">To offer quality products at great prices, ensuring a seamless and user-friendly shopping experience for all.</p>
      </div>

      <div className="section">
        <h2 className="section-heading">Who We Are</h2>
        <p className="section-content">A diverse team dedicated to excellence in online retail, fostering innovation and valuing every customer's journey.</p>
      </div>

      <div className="section">
        <h2 className="section-heading">What We Do</h2>
        <p className="section-content">We curate top-quality products, provide insightful reviews, and ensure a secure shopping experience with exceptional support.</p>
      </div>
    </div>
    <div className="social-media" data-testid="images">
        <img src="https://assets.website-files.com/5ec5d86528da2f24250d634c/5ec7175d7e0c401a3e668a1d_facebook-logo.svg" alt="fb" />
        <img src="https://assets.website-files.com/5ec5d86528da2f24250d634c/5ec7175d68c9b0a57ed94925_google-logo.svg" alt="google" />
        <img src="https://assets.website-files.com/5ec5d86528da2f24250d634c/601e13bc333df3521cce5b6a_youtube-logo-jobs-webflow-template.svg" alt="youtube" />
        <img src="https://assets.website-files.com/5ec5d86528da2f24250d634c/601e13bc774d5a00bcbb0baf_linkedin-logo-jobs-webflow-template.svg" alt="linkedin" />
      </div>
    </>
  );
};

export default Home;

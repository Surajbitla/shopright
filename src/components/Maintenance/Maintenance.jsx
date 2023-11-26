import React, { useState, useEffect } from 'react';
import './Maintenance.css'; // Make sure the CSS file is correctly linked

const Maintenance = () => {
    const calculateTimeLeft = () => {
        const now = new Date();
        let endTime = new Date();
        
        endTime.setHours(20, 43, 0); // 9:30 PM
        endTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      
        // If current time is past 7:30 PM, set endTime to 7:30 PM next day
        if (now > endTime) {
          endTime.setDate(now.getDate() + 1);
        }
      
        const difference = endTime - now;
        let timeLeft = {};
      
        if (difference > 0) {
          timeLeft = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          };
        }
      
        return timeLeft;
      };
      

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval]) {
            return;
        }

        return (
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });

    return (
        <div className="maintenance-container">
            <h1>We're Currently Under Maintenance</h1>
            <p>Sorry for the inconvenience. We'll be back shortly!</p>
            <div className="timer">
                {timerComponents.length ? timerComponents : <span>Time's up!</span>}
            </div>
            <div className="contact-info">
                <p>Need help? <a href="/contact">Contact us</a></p>
            </div>
        </div>
    );
};

export default Maintenance;

import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onNavigate }) => {
    return (
        <div className="landing-page">
            <div className="landing-overlay"></div>

            <div className="landing-content">
                <div className="logo-container">
                    <img src="/images.png" alt="Hunza Den Logo" className="logo" />
                </div>

                <h1 className="landing-title">
                    Hunza Den
                </h1>
                <p className="landing-subtitle">
                    Review Management System
                </p>

                <div className="button-group">
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate('create')}
                    >
                        Collect Customer Feedback
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => onNavigate('view')}
                    >
                        View All Reviews
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;

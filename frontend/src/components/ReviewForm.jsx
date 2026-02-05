import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReviewForm = ({ onBack, reviewToEdit = null }) => {
    const [formData, setFormData] = useState({
        customer_name: reviewToEdit?.customer_name || '',
        phone_number: reviewToEdit?.phone_number || '',
        ambience_rating: reviewToEdit?.ambience_rating || 0,
        management_rating: reviewToEdit?.management_rating || 0,
        food_rating: reviewToEdit?.food_rating || 0,
        dishes_tried: reviewToEdit?.dishes_tried || '',
        heard_from: reviewToEdit?.heard_from || '',
        overall_rating: reviewToEdit?.overall_rating || 0,
        additional_comments: reviewToEdit?.additional_comments || '',
        visit_type: reviewToEdit?.visit_type || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [touched, setTouched] = useState({});
    const [showThankYou, setShowThankYou] = useState(false);

    // Calculate form completion percentage
    const calculateProgress = () => {
        const requiredFields = [
            'customer_name',
            'ambience_rating',
            'management_rating',
            'food_rating',
            'heard_from',
            'overall_rating'
        ];

        const completed = requiredFields.filter(field => {
            if (field.includes('rating')) {
                return formData[field] > 0;
            }
            return formData[field] && formData[field].trim() !== '';
        }).length;

        return Math.round((completed / requiredFields.length) * 100);
    };

    const progress = calculateProgress();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.customer_name || !formData.ambience_rating || !formData.management_rating ||
            !formData.food_rating || !formData.heard_from || !formData.overall_rating) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const url = reviewToEdit
                ? `${API_URL}/reviews/${reviewToEdit.id}`
                : `${API_URL}/reviews`;

            const method = reviewToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                if (reviewToEdit) {
                    setMessage({
                        type: 'success',
                        text: 'Review updated successfully! ✓'
                    });
                    setTimeout(() => {
                        onBack();
                    }, 2000);
                } else {
                    // Scroll to top to show popup
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // Show thank you popup for new reviews
                    setShowThankYou(true);
                    setFormData({
                        customer_name: '',
                        phone_number: '',
                        ambience_rating: 0,
                        management_rating: 0,
                        food_rating: 0,
                        dishes_tried: '',
                        heard_from: '',
                        overall_rating: 0,
                        additional_comments: ''
                    });
                    setTouched({});

                    setTimeout(() => {
                        setShowThankYou(false);
                        onBack();
                    }, 4000);
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Something went wrong' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to connect to server. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingClick = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setTouched({ ...touched, [field]: true });
    };

    const handleFieldChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setTouched({ ...touched, [field]: true });
    };

    const renderRatingButtons = (field, currentValue) => {
        return (
            <div className="rating-buttons">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        type="button"
                        className={`rating-btn ${currentValue >= num ? 'active' : ''} ${touched[field] && currentValue === 0 ? 'error' : ''}`}
                        onClick={() => handleRatingClick(field, num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="review-form-page">
            <div className="form-container">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>

                <div className="form-card">
                    {loading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div>
                            <p className="loading-text">Submitting your feedback...</p>
                        </div>
                    )}

                    {/* Thank You Popup */}
                    {showThankYou && (
                        <div className="thankyou-overlay">
                            <div className="thankyou-card">
                                <div className="thankyou-icon">🙏</div>
                                <h2 className="thankyou-title">Thank You!</h2>
                                <p className="thankyou-message">
                                    We appreciate your valuable feedback.
                                </p>
                                <p className="thankyou-subtitle">See you again! 😊</p>
                                <div className="thankyou-checkmark">✓</div>

                                <div className="google-review-cta">
                                    <p className="google-text">Share your experience on Google!</p>
                                    <a
                                        href="https://www.google.com/maps/search/Hunza+Den+restaurant+Lahore/@31.5492471,74.3415174,17z"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="google-btn"
                                    >
                                        <img src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="Google" className="google-icon-img" />
                                        Review Hunza Den
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-header">
                        <div className="form-logo-container">
                            <img src="/images.png" alt="Hunza Den Logo" className="form-logo" />
                        </div>

                        <h1 className="form-title">
                            {reviewToEdit ? 'Edit Review' : 'Customer Feedback Form'}
                        </h1>
                        <p className="form-subtitle">Hunza Den</p>

                        {/* Progress Bar */}
                        {!reviewToEdit && (
                            <div className="progress-container">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="progress-text">{progress}% Complete</p>
                            </div>
                        )}
                    </div>

                    {message.text && (
                        <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Customer Name */}
                        <div className="form-group">
                            <label className="form-label">
                                Customer Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-input ${touched.customer_name && !formData.customer_name ? 'error' : ''}`}
                                placeholder="Enter your name"
                                value={formData.customer_name}
                                onChange={(e) => handleFieldChange('customer_name', e.target.value)}
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <label className="form-label">
                                Phone Number
                                <span className="optional">(Optional)</span>
                            </label>
                            <input
                                type="tel"
                                className="form-input"
                                placeholder="e.g., 0300-1234567"
                                value={formData.phone_number}
                                onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                                maxLength="20"
                            />
                        </div>

                        {/* Ambience Rating */}
                        <div className="form-group">
                            <label className="form-label">
                                Ambience Rating <span className="required">*</span>
                                <span className="rating-hint">(1-10)</span>
                            </label>
                            {renderRatingButtons('ambience_rating', formData.ambience_rating)}
                            {formData.ambience_rating > 0 && (
                                <p className="rating-feedback">
                                    {formData.ambience_rating >= 8 ? '😊 Excellent!' :
                                        formData.ambience_rating >= 6 ? '👍 Good' :
                                            formData.ambience_rating >= 4 ? '😐 Fair' : '😞 Needs improvement'}
                                </p>
                            )}
                        </div>

                        {/* Management Rating */}
                        <div className="form-group">
                            <label className="form-label">
                                Management & Service Rating <span className="required">*</span>
                                <span className="rating-hint">(1-10)</span>
                            </label>
                            {renderRatingButtons('management_rating', formData.management_rating)}
                            {formData.management_rating > 0 && (
                                <p className="rating-feedback">
                                    {formData.management_rating >= 8 ? '😊 Excellent!' :
                                        formData.management_rating >= 6 ? '👍 Good' :
                                            formData.management_rating >= 4 ? '😐 Fair' : '😞 Needs improvement'}
                                </p>
                            )}
                        </div>

                        {/* Food Rating */}
                        <div className="form-group">
                            <label className="form-label">
                                Food Quality Rating <span className="required">*</span>
                                <span className="rating-hint">(1-10)</span>
                            </label>
                            {renderRatingButtons('food_rating', formData.food_rating)}
                            {formData.food_rating > 0 && (
                                <p className="rating-feedback">
                                    {formData.food_rating >= 8 ? '😊 Excellent!' :
                                        formData.food_rating >= 6 ? '👍 Good' :
                                            formData.food_rating >= 4 ? '😐 Fair' : '😞 Needs improvement'}
                                </p>
                            )}
                        </div>

                        {/* Menu Categories */}
                        <div className="form-group">
                            <label className="form-label">
                                Which portion did you try?
                                <span className="optional">(Optional)</span>
                            </label>
                            <div className="checkbox-grid">
                                {['SmokeHouse', 'Steaks', 'Poultry', 'Burgers', 'Pizza', 'Pasta', 'Platter', 'Traditional'].map((category) => {
                                    const isChecked = formData.dishes_tried.includes(category);
                                    return (
                                        <label key={category} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    const currentDishes = formData.dishes_tried ? formData.dishes_tried.split(', ').filter(d => d) : [];
                                                    let newDishes;
                                                    if (e.target.checked) {
                                                        newDishes = [...currentDishes, category];
                                                    } else {
                                                        newDishes = currentDishes.filter(d => d !== category);
                                                    }
                                                    handleFieldChange('dishes_tried', newDishes.join(', '));
                                                }}
                                            />
                                            <span className="checkbox-text">{category}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Visit Type */}
                        <div className="form-group">
                            <label className="form-label">
                                Type of Visit
                                <span className="optional">(e.g., First-time, Regular, Celebration)</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="How would you describe your visit?"
                                value={formData.visit_type}
                                onChange={(e) => handleFieldChange('visit_type', e.target.value)}
                            />
                        </div>

                        {/* How did you hear about us */}
                        <div className="form-group">
                            <label className="form-label">
                                How did you hear about us? <span className="required">*</span>
                            </label>
                            <select
                                className={`form-select ${touched.heard_from && !formData.heard_from ? 'error' : ''}`}
                                value={formData.heard_from}
                                onChange={(e) => handleFieldChange('heard_from', e.target.value)}
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Walk-in Guest">Walk-in Guest</option>
                                <option value="Friend/Family">Friend/Family Recommendation</option>
                                <option value="Google">Google Search</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Overall Rating */}
                        <div className="form-group">
                            <label className="form-label">
                                Overall Experience Rating <span className="required">*</span>
                                <span className="rating-hint">(1-10)</span>
                            </label>
                            {renderRatingButtons('overall_rating', formData.overall_rating)}
                            {formData.overall_rating > 0 && (
                                <div className="rating-feedback overall">
                                    <p>
                                        {formData.overall_rating >= 8 ? '🌟 Outstanding Experience!' :
                                            formData.overall_rating >= 6 ? '✨ Great Experience' :
                                                formData.overall_rating >= 4 ? '👌 Decent Experience' : '💭 We can do better'}
                                    </p>
                                    {formData.ambience_rating > 0 && formData.management_rating > 0 && formData.food_rating > 0 && (
                                        <p className="average-hint">
                                            (Average of your ratings: {((formData.ambience_rating + formData.management_rating + formData.food_rating) / 3).toFixed(1)}/10)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Additional Comments */}
                        <div className="form-group">
                            <label className="form-label">
                                Additional Comments
                                <span className="optional">(Optional)</span>
                            </label>
                            <textarea
                                className="form-textarea"
                                placeholder="Any additional feedback or suggestions..."
                                value={formData.additional_comments}
                                onChange={(e) => handleFieldChange('additional_comments', e.target.value)}
                                rows="4"
                                maxLength="1000"
                            />
                            <p className="char-count">{formData.additional_comments.length}/1000</p>
                        </div>

                        <button type="submit" className="submit-button" disabled={loading || progress < 100}>
                            {loading ? 'Submitting...' : reviewToEdit ? 'Update Review' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;

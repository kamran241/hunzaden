import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReviewForm = ({ onBack, reviewToEdit = null }) => {
    const [formData, setFormData] = useState({
        customer_name: reviewToEdit?.customer_name || '',
        ambience_rating: reviewToEdit?.ambience_rating || 0,
        management_rating: reviewToEdit?.management_rating || 0,
        food_rating: reviewToEdit?.food_rating || 0,
        dishes_tried: reviewToEdit?.dishes_tried || '',
        heard_from: reviewToEdit?.heard_from || '',
        overall_rating: reviewToEdit?.overall_rating || 0,
        additional_comments: reviewToEdit?.additional_comments || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [touched, setTouched] = useState({});

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
                setMessage({
                    type: 'success',
                    text: reviewToEdit ? 'Review updated successfully! ✓' : 'Thank you for your feedback! ✓'
                });

                if (!reviewToEdit) {
                    setFormData({
                        customer_name: '',
                        ambience_rating: 0,
                        management_rating: 0,
                        food_rating: 0,
                        dishes_tried: '',
                        heard_from: '',
                        overall_rating: 0,
                        additional_comments: ''
                    });
                    setTouched({});
                }

                setTimeout(() => {
                    onBack();
                }, 2000);
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

                        {/* Dishes Tried */}
                        <div className="form-group">
                            <label className="form-label">
                                Which dishes did you try?
                                <span className="optional">(Optional)</span>
                            </label>
                            <textarea
                                className="form-textarea"
                                placeholder="e.g., Chicken Karahi, Chapshuro, Hunza Tea..."
                                value={formData.dishes_tried}
                                onChange={(e) => handleFieldChange('dishes_tried', e.target.value)}
                                rows="3"
                                maxLength="500"
                            />
                            <p className="char-count">{formData.dishes_tried.length}/500</p>
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
                                <p className="rating-feedback overall">
                                    {formData.overall_rating >= 8 ? '🌟 Outstanding Experience!' :
                                        formData.overall_rating >= 6 ? '✨ Great Experience' :
                                            formData.overall_rating >= 4 ? '👌 Decent Experience' : '💭 We can do better'}
                                </p>
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

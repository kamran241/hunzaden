import React, { useState } from 'react';
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
                    text: reviewToEdit ? 'Review updated successfully!' : 'Thank you for your feedback!'
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
    };

    const renderRatingButtons = (field, currentValue) => {
        return (
            <div className="rating-buttons">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                        key={num}
                        type="button"
                        className={`rating-btn ${currentValue >= num ? 'active' : ''}`}
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
                        </div>
                    )}

                    <div className="form-header">
                        <h1 className="form-title">
                            {reviewToEdit ? 'Edit Review' : 'Customer Feedback Form'}
                        </h1>
                        <p className="form-subtitle">Hunza Den</p>
                    </div>

                    {message.text && (
                        <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Customer Name */}
                        <div className="form-group">
                            <label className="form-label">Customer Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your name"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Ambience Rating */}
                        <div className="form-group">
                            <label className="form-label">Ambience Rating * (1-10)</label>
                            {renderRatingButtons('ambience_rating', formData.ambience_rating)}
                        </div>

                        {/* Management Rating */}
                        <div className="form-group">
                            <label className="form-label">Management & Service Rating * (1-10)</label>
                            {renderRatingButtons('management_rating', formData.management_rating)}
                        </div>

                        {/* Food Rating */}
                        <div className="form-group">
                            <label className="form-label">Food Quality Rating * (1-10)</label>
                            {renderRatingButtons('food_rating', formData.food_rating)}
                        </div>

                        {/* Dishes Tried */}
                        <div className="form-group">
                            <label className="form-label">Which dishes did you try?</label>
                            <textarea
                                className="form-textarea"
                                placeholder="e.g., Chicken Karahi, Chapshuro, Hunza Tea..."
                                value={formData.dishes_tried}
                                onChange={(e) => setFormData({ ...formData, dishes_tried: e.target.value })}
                                rows="3"
                            />
                        </div>

                        {/* How did you hear about us */}
                        <div className="form-group">
                            <label className="form-label">How did you hear about us? *</label>
                            <select
                                className="form-select"
                                value={formData.heard_from}
                                onChange={(e) => setFormData({ ...formData, heard_from: e.target.value })}
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
                            <label className="form-label">Overall Experience Rating * (1-10)</label>
                            {renderRatingButtons('overall_rating', formData.overall_rating)}
                        </div>

                        {/* Additional Comments */}
                        <div className="form-group">
                            <label className="form-label">Additional Comments</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Any additional feedback or suggestions..."
                                value={formData.additional_comments}
                                onChange={(e) => setFormData({ ...formData, additional_comments: e.target.value })}
                                rows="4"
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Submitting...' : reviewToEdit ? 'Update Review' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;

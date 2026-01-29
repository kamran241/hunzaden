import React, { useState, useEffect } from 'react';
import './EditReviewSelector.css';

const API_URL = 'http://localhost:5000/api';

const EditReviewSelector = ({ onBack, onSelectReview }) => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        const filtered = reviews.filter(review =>
            review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (review.dishes_tried && review.dishes_tried.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (review.additional_comments && review.additional_comments.toLowerCase().includes(searchTerm.toLowerCase())) ||
            review.heard_from.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReviews(filtered);
    }, [searchTerm, reviews]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/reviews`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.data);
                setFilteredReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className={`review-star ${index < rating ? '' : 'empty'}`}>
                ★
            </span>
        ));
    };

    if (loading) {
        return (
            <div className="edit-selector-page">
                <div className="selector-container">
                    <button className="back-button" onClick={onBack}>
                        ← Back to Home
                    </button>
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-selector-page">
            <div className="selector-container">
                <button className="back-button" onClick={onBack}>
                    ← Back to Home
                </button>

                <div className="selector-header">
                    <h1 className="selector-title">Select Review to Edit</h1>
                    <p className="selector-subtitle">Choose a review to update</p>
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search by name or review text..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <p className="empty-text">
                            {searchTerm ? 'No reviews found matching your search' : 'No reviews available to edit'}
                        </p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {filteredReviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="review-item"
                                onClick={() => onSelectReview(review)}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="review-item-header">
                                    <h3 className="review-item-name">{review.customer_name}</h3>
                                    <div className="review-item-rating">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="review-item-text">{review.review_text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditReviewSelector;

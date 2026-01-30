import React, { useState, useEffect } from 'react';
import './ViewReviews.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ViewReviews = ({ onBack, onEdit }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, averageOverall: 0, averageAmbience: 0, averageFood: 0 });
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/reviews`);
            const data = await response.json();

            if (data.success) {
                setReviews(data.data);
                calculateStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (reviewsData) => {
        const total = reviewsData.length;
        if (total === 0) {
            setStats({ total: 0, averageOverall: 0, averageAmbience: 0, averageFood: 0 });
            return;
        }

        const averageOverall = (reviewsData.reduce((sum, r) => sum + r.overall_rating, 0) / total).toFixed(1);
        const averageAmbience = (reviewsData.reduce((sum, r) => sum + r.ambience_rating, 0) / total).toFixed(1);
        const averageFood = (reviewsData.reduce((sum, r) => sum + r.food_rating, 0) / total).toFixed(1);

        setStats({ total, averageOverall, averageAmbience, averageFood });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reviews/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                fetchReviews();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Failed to delete review');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getSortedReviews = () => {
        const sorted = [...reviews];
        if (sortOrder === 'newest') {
            return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
    };

    if (loading) {
        return (
            <div className="reviews-page">
                <div className="reviews-container">
                    <button className="back-button" onClick={onBack}>
                        ← Back
                    </button>
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    const sortedReviews = getSortedReviews();

    return (
        <div className="reviews-page">
            <div className="reviews-container">
                <button className="back-button" onClick={onBack}>
                    ← Back
                </button>

                <div className="reviews-header">
                    <h1 className="reviews-title">Customer Reviews</h1>
                    <p className="reviews-subtitle">Hunza Den Feedback</p>
                </div>

                <div className="stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Reviews</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.averageOverall}/10</span>
                        <span className="stat-label">Overall Rating</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.averageAmbience}/10</span>
                        <span className="stat-label">Ambience</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.averageFood}/10</span>
                        <span className="stat-label">Food Quality</span>
                    </div>
                </div>

                {/* Filter Dropdown */}
                <div className="filter-container">
                    <label className="filter-label">Sort by:</label>
                    <select
                        className="filter-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                {reviews.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <p className="empty-text">No reviews yet.</p>
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {sortedReviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="review-card"
                            >
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <h3 className="reviewer-name">{review.customer_name}</h3>
                                        <p className="review-date">{formatDate(review.created_at)}</p>
                                    </div>
                                    <div className="overall-rating">
                                        <span className="rating-number">{review.overall_rating}</span>
                                        <span className="rating-max">/10</span>
                                    </div>
                                </div>

                                <div className="rating-details">
                                    <div className="rating-item">
                                        <span className="rating-label">Ambience:</span>
                                        <span className="rating-value">{review.ambience_rating}/10</span>
                                    </div>
                                    <div className="rating-item">
                                        <span className="rating-label">Management:</span>
                                        <span className="rating-value">{review.management_rating}/10</span>
                                    </div>
                                    <div className="rating-item">
                                        <span className="rating-label">Food:</span>
                                        <span className="rating-value">{review.food_rating}/10</span>
                                    </div>
                                </div>

                                {review.dishes_tried && (
                                    <div className="review-section">
                                        <strong>Dishes Tried:</strong>
                                        <p>{review.dishes_tried}</p>
                                    </div>
                                )}

                                <div className="review-section">
                                    <strong>Heard From:</strong>
                                    <p>{review.heard_from}</p>
                                </div>

                                {review.additional_comments && (
                                    <div className="review-section">
                                        <strong>Comments:</strong>
                                        <p>{review.additional_comments}</p>
                                    </div>
                                )}

                                <div className="review-actions">
                                    <button
                                        className="action-button edit-button"
                                        onClick={() => onEdit(review)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="action-button delete-button"
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewReviews;

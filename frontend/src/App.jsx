import { useState } from 'react';
import PasswordGate from './components/PasswordGate';
import LandingPage from './components/LandingPage';
import ReviewForm from './components/ReviewForm';
import ViewReviews from './components/ViewReviews';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setReviewToEdit(null);
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setCurrentPage('create');
  };

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'create':
        return (
          <ReviewForm
            onBack={() => handleNavigate('landing')}
            reviewToEdit={reviewToEdit}
          />
        );
      case 'view':
        return (
          <ViewReviews
            onBack={() => handleNavigate('landing')}
            onEdit={handleEditReview}
          />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;

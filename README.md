# 🏨 The Aura - Hotel Review System

A modern, full-stack review system built with React and Node.js, featuring a beautiful UI with glassmorphism effects and smooth animations.

## ✨ Features

- **Beautiful Landing Page** - Stunning hotel background with gradient overlays and floating particles
- **Write Reviews** - Interactive star rating system with smooth animations
- **View Reviews** - Grid layout with statistics and review cards
- **Edit Reviews** - Search and update existing reviews
- **Delete Reviews** - Remove reviews with confirmation
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Glassmorphism, gradients, and micro-animations

## 🚀 Tech Stack

### Frontend
- React 18
- Vite
- CSS3 (Custom Design System)
- Google Fonts (Inter)

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- CORS enabled

## 📦 Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with your Neon database URL

4. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Dependencies are already installed

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🌐 Deployment to Vercel

### Deploy Backend

1. Navigate to backend directory
2. Install Vercel CLI (if not installed):
```bash
npm i -g vercel
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string

5. Note the deployed URL (e.g., `https://your-backend.vercel.app`)

### Deploy Frontend

1. Update API URL in frontend components:
   - Open `src/components/ReviewForm.jsx`
   - Open `src/components/ViewReviews.jsx`
   - Open `src/components/EditReviewSelector.jsx`
   - Replace `const API_URL = 'http://localhost:5000/api'` with your Vercel backend URL

2. Build the frontend:
```bash
npm run build
```

3. Deploy to Vercel:
```bash
vercel
```

## 🎨 Customization

### Change Background Image

Replace `frontend/public/hotel-bg.jpg` with your own hotel image.

### Update Colors

Edit `frontend/src/index.css` and modify the CSS variables:
```css
:root {
  --primary: #FF6B35;
  --secondary: #004E89;
  --accent: #FFD23F;
  /* ... more colors */
}
```

### Change Hotel Name

Update in:
- `frontend/index.html` - `<title>` tag
- `frontend/src/components/LandingPage.jsx` - Main title

## 📱 API Endpoints

- `GET /api/health` - Health check
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🎯 Usage

1. **Landing Page**: Choose from three options
   - Write a Review
   - View Reviews
   - Edit Review

2. **Write Review**: 
   - Enter your name
   - Select star rating (1-5)
   - Write your feedback
   - Submit

3. **View Reviews**:
   - See all reviews in a beautiful grid
   - View statistics (total reviews, average rating)
   - Edit or delete any review

4. **Edit Review**:
   - Search for a review
   - Click to select
   - Update and save

## 🔒 Security Notes

- The `.env` file contains your database credentials
- Add `.env` to `.gitignore` before pushing to GitHub
- Use environment variables in Vercel for production

## 📄 License

MIT License - Feel free to use this project for your hotel!

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for The Aura Hotel**

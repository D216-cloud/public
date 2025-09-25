# TwitterAI Pro

A comprehensive Twitter automation and AI-powered content generation platform.

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Google OAuth credentials
- Twitter API credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both root and backend directories
   - Fill in your API keys and database URL

4. Start the development servers:
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   npm run dev
   ```

## Deployment Setup

### Environment Variables Configuration

For deployment, you need to configure environment variables in both frontend and backend:

1. **Frontend (.env)**:
   ```
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
   ```

2. **Backend (.env)**:
   ```
   FRONTEND_URL=https://your-frontend-domain.com
   MONGO_URI=your_production_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   GOOGLE_CLIENT_ID=your_production_google_client_id
   GOOGLE_CLIENT_SECRET=your_production_google_client_secret
   TWITTER_API_KEY=your_production_twitter_api_key
   TWITTER_API_SECRET=your_production_twitter_api_secret
   CLOUDINARY_CLOUD_NAME=your_production_cloudinary_name
   CLOUDINARY_API_KEY=your_production_cloudinary_key
   CLOUDINARY_API_SECRET=your_production_cloudinary_secret
   ```

### Deployment Steps

1. Set up your production environment variables in both directories
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the backend to your preferred hosting platform (e.g., Render, Heroku, AWS)
4. Deploy the frontend build to your preferred hosting platform (e.g., Vercel, Netlify, AWS S3)
5. Ensure both frontend and backend URLs are correctly configured in the environment variables

### Mobile Testing

For testing OAuth authentication on mobile devices:

#### Backend Network Access
1. The backend server needs to be accessible from your mobile device
2. Find your computer's local IP address (e.g., `192.168.1.100`)
3. Start the backend with network access:
   ```bash
   cd backend
   npm run dev
   ```
4. The server will be available at `http://YOUR_IP:5000`

#### Frontend Configuration
1. Start the frontend development server
2. Access the app from your mobile browser using your computer's IP:
   - `http://YOUR_IP:5173` (Vite dev server)
3. The app will automatically detect mobile access and adjust API calls

#### Google OAuth Setup
1. In Google Cloud Console, add authorized redirect URIs for mobile testing:
   - `http://YOUR_IP:5173`
   - `http://localhost:5173` (for desktop testing)
2. Ensure your Google Client ID allows
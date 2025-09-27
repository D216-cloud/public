# TwitterAI Pro

A comprehensive Twitter automation and AI-powered content generation platform.

## About This Project

This is a full-stack web application that helps users grow their Twitter presence through AI-powered content generation and scheduling.

## Quick Start

To run both frontend and backend simultaneously:

```bash
npm run dev:all
```

This will start:
- Frontend on http://localhost:8080
- Backend API on http://localhost:5000

Or run them separately:

```bash
# Terminal 1 - Start backend
npm run dev:backend

# Terminal 2 - Start frontend
npm run dev:frontend
```

## Twitter Integration

For detailed information about the secure Twitter integration flow, including OAuth setup and verification methods, please see our [Twitter Integration Guide](TWITTER_INTEGRATION.md).

## Deployment

For detailed deployment instructions, please see our [Deployment Guide](DEPLOYMENT.md).

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Google OAuth credentials
- Twitter API credentials
- Cloudinary account

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
   CLOUDINARY_CLOUD_NAME=your_production_cloudinary_name
   CLOUDINARY_API_KEY=your_production_cloudinary_key
   CLOUDINARY_API_SECRET=your_production_cloudinary_secret
   ```

### Deployment Process

For detailed deployment instructions, please refer to our [Deployment Guide](DEPLOYMENT.md).

1. Set up your production environment variables in both `.env` files
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the backend to your preferred hosting platform (e.g., Render, Heroku, etc.)
4. Deploy the frontend to your preferred static hosting platform (e.g., Vercel, Netlify, etc.)
5. Ensure both services can communicate with each other through the configured URLs

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
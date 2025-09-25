# Deployment Guide

This guide will help you deploy the TwitterAI Pro application to production environments.

## Prerequisites

1. A hosting platform for the backend (e.g., Render, Heroku, AWS, DigitalOcean)
2. A static hosting platform for the frontend (e.g., Vercel, Netlify, AWS S3)
3. Domain names for both frontend and backend (recommended)
4. All required API keys and credentials

## Environment Variables Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGO_URI=your_production_mongodb_connection_string

# Security
JWT_SECRET=your_secure_production_jwt_secret

# Server
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Twitter API (if using Twitter integration)
TWITTER_CALLBACK_URL=https://your-backend-domain.com/api/twitter/callback
# Note: Twitter API v2 keys would be added here if needed

# Cloudinary (for image storage)
CLOUDINARY_CLOUD_NAME=your_production_cloudinary_name
CLOUDINARY_API_KEY=your_production_cloudinary_key
CLOUDINARY_API_SECRET=your_production_cloudinary_secret
```

### Frontend Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

## Deployment Steps

### 1. Backend Deployment

1. Set up your production environment variables in the backend `.env` file
2. Choose your hosting platform and follow their deployment process
3. Ensure your hosting platform can access the required environment variables
4. Make sure the PORT is correctly configured (typically 5000)

### 2. Frontend Deployment

1. Set up your production environment variables in the root `.env` file
2. Build the frontend:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your static hosting platform
4. Configure your hosting platform to serve the built files

### 3. Post-Deployment Configuration

1. Update CORS settings in `backend/server.js` if needed to include your production domains
2. Test the connection between frontend and backend
3. Verify all authentication flows work correctly
4. Test all API endpoints

## Common Deployment Platforms

### Backend
- Render (recommended for simplicity)
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Google Cloud Run

### Frontend
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Google Cloud Storage

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your `FRONTEND_URL` in the backend `.env` file matches your actual frontend domain, and that the domain is included in the CORS configuration in `backend/server.js`.

### Environment Variables Not Loading
- Ensure environment variables are properly set in your hosting platform
- Check that there are no extra spaces or characters in the variable definitions
- Verify that sensitive values are properly quoted

### API Connection Issues
- Verify that `VITE_API_URL` in the frontend matches your backend domain
- Ensure the backend server is running and accessible
- Check firewall settings if deploying to a VPS

## Testing Deployment

After deployment, run the test scripts to verify everything is working:

```bash
# Test backend API
cd backend
node testAPI.js

# Test authentication endpoints
node ../test-auth.js
```
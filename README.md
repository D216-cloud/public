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
   - Copy `.env.example` to `.env`
   - Fill in your API keys and database URL

4. Start the development servers:
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend
   npm run dev
   ```

## Mobile Testing

For testing OAuth authentication on mobile devices:

### Backend Network Access
1. The backend server needs to be accessible from your mobile device
2. Find your computer's local IP address (e.g., `192.168.1.100`)
3. Start the backend with network access:
   ```bash
   cd backend
   npm run dev
   ```
4. The server will be available at `http://YOUR_IP:5000`

### Frontend Configuration
1. Start the frontend development server
2. Access the app from your mobile browser using your computer's IP:
   - `http://YOUR_IP:5173` (Vite dev server)
3. The app will automatically detect mobile access and adjust API calls

### Google OAuth Setup
1. In Google Cloud Console, add authorized redirect URIs for mobile testing:
   - `http://YOUR_IP:5173`
   - `http://localhost:5173` (for desktop testing)
2. Ensure your Google Client ID allows the redirect URIs

### Troubleshooting Mobile OAuth
- **"Access blocked" error**: Check CORS configuration and redirect URIs
- **"Authentication failed"**: Ensure backend is accessible from mobile
- **One Tap not working**: The app automatically uses button-based auth on mobile
- **Network errors**: Verify your IP address and firewall settings

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/twitterai
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
# TwitterAI Pro

TwitterAI Pro is an AI-powered platform that helps users grow their Twitter presence through automated content creation and strategic posting.

## Features

- AI-powered content generation
- Automated Twitter posting
- Audience growth analytics
- User-friendly dashboard
- Twitter account verification without OAuth

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Twitter Developer Account
- Google OAuth Credentials
- Gmail Account for Email Notifications

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd twitterai-pro
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../
   npm install
   ```

4. Create a `.env` file in the root directory based on `.env.example` and configure your environment variables.

## Environment Variables Setup

### Twitter API Configuration
To enable Twitter username verification, you need to set up Twitter API credentials:

1. Create a Twitter Developer account at [developer.twitter.com](https://developer.twitter.com/)
2. Create a new app in the Twitter Developer Dashboard
3. Generate a Bearer Token for your app
4. Add the following to your `.env` file:
   ```
   TWITTER_BEARER_TOKEN=your_bearer_token_here
   TWITTER_CLIENT_ID=your_twitter_client_id_here
   TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
   ```

### MongoDB Configuration
```
MONGO_URI=your_mongodb_connection_string_here
```

### JWT Configuration
```
JWT_SECRET=your_jwt_secret_here
```

### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Email Configuration (Gmail)
```
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd ../
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:8080`

## Twitter Account Verification

This application implements a unique Twitter verification flow that doesn't require users to leave the app or re-authenticate via OAuth:

1. Users enter their Twitter username in the Settings page
2. The system verifies the username exists on X (Twitter) using the Twitter API
3. If valid, users enter their X account email
4. A verification code is sent to that email
5. Users enter the code to complete verification and connect their account

This approach respects user privacy while ensuring account ownership verification.

## Troubleshooting

### Twitter API 401 Error
If you encounter a 401 Unauthorized error when verifying Twitter usernames:
1. Ensure your `TWITTER_BEARER_TOKEN` is correctly set in the `.env` file
2. Verify that your Twitter Developer account is approved and active
3. Check that your app has the correct permissions in the Twitter Developer Dashboard

### Common Issues
- Make sure all environment variables are properly configured
- Ensure MongoDB is running and accessible
- Check that ports 5000 (backend) and 8080 (frontend) are available

## License

MIT License

## Support

For support, please open an issue on the repository or contact the development team.
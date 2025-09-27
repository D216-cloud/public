# Twitter API Setup Guide

## Prerequisites
To use the Twitter API for username verification, you need to set up a Twitter Developer account and create an application.

## Steps to Get Twitter API Credentials

### 1. Create a Twitter Developer Account
1. Go to [developer.twitter.com](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account if you don't have one already
4. Complete the application process

### 2. Create a Twitter App
1. Navigate to the [Twitter Developer Dashboard](https://developer.twitter.com/en/portal/dashboard)
2. Click "Create App" or "Create Project" if you don't have one
3. Give your app a name (e.g., "TwitterAI Pro Verification")
4. Note down your App's:
   - API Key (Consumer Key)
   - API Secret Key (Consumer Secret)

### 3. Generate Bearer Token
1. In your app dashboard, go to the "Keys and Tokens" tab
2. Under "Authentication Tokens", click "Generate" next to "Bearer Token"
3. Copy the generated Bearer Token

### 4. Configure Environment Variables
Create a `.env` file in the root of your project (copy from `.env.example`) and add:

```env
# Twitter API Credentials
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
```

### 5. Required API Permissions
Make sure your Twitter app has the following permissions:
- App permissions: Read
- User authentication settings:
  - Enable 3-legged OAuth
  - Request email address from users (if needed)

## Testing the Setup
After configuring your environment variables:

1. Restart your backend server
2. Try verifying a Twitter username in the Settings page
3. Check the server logs for any errors

## Common Issues and Solutions

### 401 Unauthorized Error
This usually means:
1. Missing or incorrect Bearer Token
2. Expired credentials
3. Incorrect API endpoint usage

### 403 Forbidden Error
This usually means:
1. Insufficient permissions
2. Rate limiting

### 429 Rate Limit Error
This means you've exceeded the API rate limits:
1. Wait for the rate limit to reset (usually 15 minutes)
2. Consider implementing caching for frequently requested usernames

## Need Help?
If you continue to experience issues:
1. Double-check all your credentials
2. Ensure your Twitter Developer account is approved and active
3. Verify your app has the correct permissions
4. Check the Twitter API status at [status.twitterstat.us](https://status.twitterstat.us/)
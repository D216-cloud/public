# Twitter Integration Guide

This document explains how to set up and use the secure Twitter integration flow in the application.

## Overview

The Twitter integration implements a secure, production-ready flow that allows users to connect their Twitter accounts and verify ownership before enabling auto-posting. The implementation follows OAuth 2.0 standards and provides multiple verification options.

## Security Features

1. **OAuth 2.0 Authentication**: Uses Twitter's official OAuth flow - never requests or stores user passwords
2. **Account Verification**: Mandatory verification before enabling auto-posting
3. **Environment Variables**: All secrets stored securely in environment variables
4. **OTP Expiration**: OTP codes expire after 5 minutes
5. **Access Token Management**: Secure storage and refresh of OAuth tokens

## Flow Implementation

### 1. Primary Secure Flow (Recommended)

1. User authenticates via Google (already done)
2. User clicks "Connect Twitter" → Standard Twitter OAuth flow runs
3. Obtain `twitterId`, `screen_name`, `accessToken`, `refreshToken`
4. Ask user to enter Twitter username (prefill from OAuth data if available)
5. Verification Options:
   - **Email OTP**: If user provides email linked to Twitter account
   - **Verification Tweet**: Generate unique code for user to tweet

### 2. Verification Methods

#### Email OTP Verification
- Show text: "Enter the email linked to your Twitter account"
- Generate 6-digit OTP, send via Nodemailer (Gmail SMTP)
- User enters OTP → Verify and mark `verified = true`

#### Tweet Verification (Fallback & Recommended)
- Generate unique verification code (e.g., `MYAPP-VERIFY-XXXXXX`)
- Show user instruction and "Copy Code" button
- User posts exact text as tweet from connected account
- Backend polls timeline to find verification tweet
- Once detected → mark `verified = true`

## Backend Endpoints

### Authentication
- `GET /api/twitter/auth` - Begin OAuth flow
- `GET /api/twitter/callback` - Handle OAuth callback

### Verification
- `POST /api/twitter/send-otp` - Send OTP to email
- `POST /api/twitter/verify-otp` - Verify OTP
- `POST /api/twitter/generate-verify-code` - Generate tweet verification code
- `POST /api/twitter/check-verify-code` - Check for verification tweet

### Settings
- `POST /api/twitter/toggle-auto-post` - Enable/disable auto-posting
- `GET /api/twitter/status` - Get connection status
- `POST /api/twitter/confirm` - Confirm connection
- `POST /api/twitter/disconnect` - Disconnect account

## Database Model

### UserTwitterConnections Collection

```javascript
{
  userId: ObjectId,           // Reference to User
  twitterId: String,          // Twitter user ID
  screenName: String,         // Twitter handle
  accessToken: String,        // OAuth access token
  refreshToken: String,       // OAuth refresh token
  connectedAt: Date,          // Connection timestamp
  verified: Boolean,          // Verification status
  verifiedBy: String,         // 'email' or 'tweet'
  verifiedAt: Date,           // Verification timestamp
  verificationEmail: String,  // Email used for OTP (if applicable)
  verificationCode: String,   // Tweet verification code (if applicable)
  verificationCodeExpiry: Date, // Expiry for tweet verification code
  otp: String,                // Current OTP (if applicable)
  otpExpiry: Date,            // OTP expiry timestamp
  autoPostEnabled: Boolean,   // Auto-posting status
  autoPostSettings: Object    // Auto-posting configuration
}
```

## Environment Variables

Required environment variables for Twitter integration:

```bash
# Twitter API credentials
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=http://localhost:5000/api/twitter/callback

# Email configuration for OTP
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## Setup Instructions

1. **Create Twitter Developer Account**
   - Go to https://developer.twitter.com/
   - Create a developer account and application
   - Get your API Key and Secret

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Twitter API credentials
   - Configure email settings for OTP delivery

3. **Set Up Callback URL**
   - In your Twitter app settings, add the callback URL
   - For development: `http://localhost:5000/api/twitter/callback`

4. **Test the Integration**
   - Run the backend server
   - Use the frontend to connect a Twitter account
   - Complete the verification process

## Security Best Practices

1. **Never Store Passwords**
   - The implementation never requests or stores Twitter passwords
   - Always use OAuth for authentication

2. **Secure Token Storage**
   - Access tokens are stored securely in the database
   - Refresh tokens are used to maintain long-lived connections

3. **OTP Security**
   - OTPs expire after 5 minutes
   - Rate limiting on OTP requests
   - Secure transmission via email

4. **Verification Requirements**
   - Mandatory verification before enabling auto-posting
   - Multiple verification options for user convenience

## Error Handling

The implementation includes comprehensive error handling for:

- OAuth flow failures
- Network connectivity issues
- Invalid verification codes
- Expired OTPs
- Rate limiting
- Database errors

All errors are logged and appropriate user-friendly messages are displayed.

## Testing

To test the Twitter integration:

1. Run the backend server: `npm run dev:backend`
2. Use the frontend to navigate to the onboarding flow
3. Connect a Twitter account using the OAuth flow
4. Complete the verification process using either method
5. Enable auto-posting and verify the setting is saved

For automated testing, see the `testTwitterConnection.js` script in the backend directory.
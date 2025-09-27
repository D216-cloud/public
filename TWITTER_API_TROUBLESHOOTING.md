# Twitter API Troubleshooting Guide

## Common Twitter API Errors and Solutions

### 401 Unauthorized Error
**Cause**: Invalid or missing authentication credentials

**Solutions**:
1. **Check Bearer Token**: Ensure `TWITTER_BEARER_TOKEN` is correctly set in your `.env` file
2. **Verify Token Validity**: Go to your Twitter Developer Dashboard and confirm the token is still valid
3. **Check Token Permissions**: Ensure your app has the necessary permissions (at minimum, "Read" access)
4. **Regenerate Token**: If in doubt, generate a new Bearer Token from your Twitter Developer Dashboard

### 403 Forbidden Error
**Cause**: Insufficient permissions or suspended account

**Solutions**:
1. **Check App Permissions**: Ensure your Twitter app has "Read" permissions
2. **Verify Account Status**: The requested Twitter account may be suspended or private
3. **Check Rate Limits**: You may have exceeded API rate limits

### 404 Not Found Error
**Cause**: Requested resource doesn't exist

**Solutions**:
1. **Verify Username**: Double-check the Twitter username you're trying to verify
2. **Check Account Privacy**: The account may be private or deleted
3. **Use Correct Endpoint**: Ensure you're using the correct API endpoint

### 429 Rate Limit Exceeded
**Cause**: Too many requests in a short period

**Solutions**:
1. **Wait for Reset**: Twitter API rate limits reset every 15 minutes
2. **Implement Caching**: Cache results to reduce API calls
3. **Add Delays**: Implement request throttling in your application

### 500 Internal Server Error
**Cause**: Twitter API server issues

**Solutions**:
1. **Check Twitter Status**: Visit [Twitter API Status](https://status.twitterstat.us/) to check for outages
2. **Retry Later**: Wait a few minutes and try again
3. **Contact Support**: If the issue persists, contact Twitter Developer Support

## Environment Variable Setup

### Required Variables
```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_CLIENT_ID=your_twitter_client_id_here
TWITTER_CLIENT_SECRET=your_twitter_client_secret_here
```

### How to Get These Credentials
1. Go to [developer.twitter.com](https://developer.twitter.com/)
2. Create a Developer Account (if you don't have one)
3. Create a new App in the Developer Dashboard
4. Navigate to "Keys and Tokens" section
5. Generate a Bearer Token
6. Copy your API Key (Client ID) and API Secret Key (Client Secret)

## Testing Your Setup

### Manual Test
1. Ensure your `.env` file has the correct `TWITTER_BEARER_TOKEN`
2. Run the test script: `node backend/testTwitterAPI.js`
3. Check the output for success or error messages

### Expected Success Output
```
Testing Twitter API setup...
TWITTER_BEARER_TOKEN is set
Testing API connection...
✅ Twitter API connection successful!
User found: Elon Musk (@elonmusk)
User ID: 44196397
```

### Common Error Outputs and Solutions

#### Error: "Request failed with code 401"
```
❌ Twitter API test failed: Request failed with code 401
This indicates an authentication issue. Please check your TWITTER_BEARER_TOKEN.
```
**Solution**: Verify your Bearer Token is correct and has not expired.

#### Error: "Request failed with code 404"
```
❌ Twitter API test failed: Request failed with code 404
This indicates the requested resource was not found.
```
**Solution**: The username you're testing with doesn't exist or is suspended.

## Application-Specific Troubleshooting

### Twitter Username Verification Not Working
1. **Check Console Logs**: Look for error messages in browser console and server logs
2. **Verify Network Requests**: Use browser dev tools to check API request/response
3. **Test Endpoint Directly**: Use Postman or curl to test `/api/twitter/verify-username`

### Email Verification Not Sending
1. **Check Email Credentials**: Ensure `EMAIL_USER` and `EMAIL_PASS` are correctly set
2. **Verify Gmail Settings**: Make sure "Less secure app access" is enabled or use App Passwords
3. **Check Spam Folder**: Verification emails might be filtered to spam

## Best Practices

### Rate Limit Management
- Implement caching for frequently requested usernames
- Add delays between requests
- Monitor API usage in your Twitter Developer Dashboard

### Security
- Never commit actual credentials to version control
- Use environment variables for all sensitive data
- Rotate tokens periodically
- Use HTTPS in production

### Error Handling
- Always provide user-friendly error messages
- Log detailed errors for debugging
- Implement retry mechanisms for transient errors

## Need More Help?

If you're still experiencing issues:

1. **Check the Logs**: Look at both frontend and backend console output
2. **Verify All Credentials**: Double-check every environment variable
3. **Test with Postman**: Isolate whether the issue is with your code or the API
4. **Consult Twitter Documentation**: [Twitter API Documentation](https://developer.twitter.com/en/docs)
5. **Check Community Forums**: [Twitter Developer Community](https://twittercommunity.com/)
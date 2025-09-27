# Email Setup Guide

This guide explains how to configure Gmail SMTP for sending emails in the TwitterAI Pro application.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. An App Password generated for the application

## Setting up Gmail SMTP

### Step 1: Enable 2-Factor Authentication

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to set up 2FA

### Step 2: Generate an App Password

1. In your Google Account settings, under "Security", click on "App passwords"
2. If prompted, enter your password
3. Under "Select app", choose "Other (Custom name)"
4. Give it a name like "TwitterAI Pro"
5. Click "Generate"
6. Copy the 16-character password (without spaces)

### Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_generated_app_password
```

**Important Notes:**
- Replace `your_gmail_address@gmail.com` with your actual Gmail address
- Replace `your_generated_app_password` with the 16-character app password (without spaces)
- Do NOT use your regular Gmail password - it won't work with SMTP
- The App Password should be entered as a continuous string without spaces

Example:
```
EMAIL_USER=mahetadeepak421@gmail.com
EMAIL_PASS=abcdefghijkmnop
```

### Step 4: Test the Configuration

Run the test script to verify your configuration:

```bash
cd backend
npm run test:email
```

If successful, you should receive a welcome email at the EMAIL_USER address.

## Gmail SMTP Limits

Gmail's free tier has the following limits:
- 500 emails per day
- 20 emails per hour

These limits should be sufficient for development and small-scale production use.

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2FA is enabled on your account
   - Check that the App Password is entered without spaces

2. **"Authentication failed" error**
   - Double-check your EMAIL_USER and EMAIL_PASS values
   - Ensure there are no extra spaces in your credentials
   - Make sure you've generated a new App Password specifically for this application

3. **"Service not available" error**
   - Gmail might be temporarily unavailable
   - Your IP might be blocked (try a different network)

### Debugging Tips

1. Enable debug logging by setting `DEBUG=nodemailer` in your environment variables
2. Check that your Gmail account isn't locked or restricted
3. Verify that the Gmail account allows access from "less secure apps" (though App Passwords should work regardless)

If you continue to experience issues, try:
1. Generating a new App Password
2. Checking Gmail's security activity for any blocked sign-in attempts
3. Ensuring your firewall isn't blocking SMTP connections

## Security Best Practices

1. Never commit your `.env` file to version control
2. Regenerate App Passwords periodically for security
3. Use a dedicated Gmail account for development if possible
4. Monitor your Gmail account for any suspicious activity
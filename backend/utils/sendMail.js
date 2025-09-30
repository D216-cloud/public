const nodemailer = require('nodemailer');

/**
 * Create a reusable transporter object using Gmail SMTP
 * Configuration is loaded from environment variables
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send a welcome email to the user after Google OAuth login
 * @param {string} userEmail - The email address of the user
 * @param {string} userName - The name of the user
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }

    // Create transporter
    const transporter = createTransporter();

    // Define email content with styled HTML
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to TwitterAI Pro!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to TwitterAI Pro</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TwitterAI Pro</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">AI-Powered Twitter Growth</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333; margin-top: 0; font-size: 24px;">Welcome aboard, ${userName}!</h2>
                      
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        We're thrilled to have you join our community of Twitter growth enthusiasts. 
                        With TwitterAI Pro, you'll unlock the power of AI to supercharge your Twitter presence.
                      </p>
                      
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0; border: 1px solid #eaeaea;">
                        <h3 style="color: #1DA1F2; margin-top: 0; font-size: 18px;">What's Next?</h3>
                        <ul style="color: #555; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                          <li>Create compelling AI-generated content</li>
                          <li>Schedule posts for optimal engagement</li>
                          <li>Analyze your Twitter performance</li>
                          <li>Grow your audience with smart insights</li>
                        </ul>
                      </div>
                      
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        If you have any questions, our support team is always ready to help at 
                        <a href="mailto:support@twitteraipro.com" style="color: #1DA1F2; text-decoration: none;">support@twitteraipro.com</a>.
                      </p>
                      
                      <div style="text-align: center; margin: 40px 0 20px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}" 
                           style="background: linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                          Visit Your Dashboard
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #eee; text-align: center;">
                      <p style="color: #777; font-size: 14px; margin: 0;">
                        &copy; ${new Date().getFullYear()} TwitterAI Pro. All rights reserved.
                      </p>
                      <p style="color: #999; font-size: 12px; margin: 10px 0 0;">
                        123 AI Street, Tech City, TC 10001
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a verification code email for Twitter account verification
 * @param {string} userEmail - The email address of the user
 * @param {string} userName - The name of the user
 * @param {string} verificationCode - The verification code to send
 * @param {string} accountType - The type of account being verified
 * @returns {Promise<Object>} - Result of the email sending operation
 */
const sendVerificationCodeEmail = async (userEmail, userName, verificationCode, accountType) => {
  try {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured in environment variables');
    }

    // Create transporter
    const transporter = createTransporter();

    // Define email content with styled HTML
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Verify your ${accountType} for TwitterAI Pro`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your account</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TwitterAI Pro</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">AI-Powered Twitter Growth</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #333; margin-top: 0; font-size: 24px;">Verify your ${accountType}, ${userName}!</h2>
                      
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        To complete the connection of your ${accountType} to TwitterAI Pro, please use the verification code below:
                      </p>
                      
                      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin: 30px 0; border: 1px solid #eaeaea; text-align: center;">
                        <h3 style="color: #1DA1F2; margin-top: 0; font-size: 18px;">Your Verification Code</h3>
                        <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 5px; margin: 20px 0;">
                          ${verificationCode}
                        </div>
                        <p style="color: #777; font-size: 14px; margin: 0;">
                          This code will expire in 5 minutes
                        </p>
                      </div>
                      
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        Enter this code in the verification field on the TwitterAI Pro platform to complete the connection process.
                      </p>
                      
                      <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                        If you didn't request this verification, please ignore this email or contact our support team at 
                        <a href="mailto:support@twitteraipro.com" style="color: #1DA1F2; text-decoration: none;">support@twitteraipro.com</a>.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #eee; text-align: center;">
                      <p style="color: #777; font-size: 14px; margin: 0;">
                        &copy; ${new Date().getFullYear()} TwitterAI Pro. All rights reserved.
                      </p>
                      <p style="color: #999; font-size: 12px; margin: 10px 0 0;">
                        123 AI Street, Tech City, TC 10001
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Verification code email sent successfully to:', userEmail);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification code email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWelcomeEmail, sendVerificationCodeEmail };
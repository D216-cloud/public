const dotenv = require('dotenv');
const path = require('path');

// Load env vars from main project directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { sendWelcomeEmail } = require('./utils/sendMail');

// Test the email functionality
const testEmail = async () => {
  try {
    console.log('Testing email functionality...');
    
    // Check if required environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER and EMAIL_PASS must be set in .env file');
      return;
    }
    
    console.log(`Sending test email to: ${process.env.EMAIL_USER}`);
    
    const result = await sendWelcomeEmail(
      process.env.EMAIL_USER,
      'Test User'
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
    } else {
      console.error('❌ Failed to send email:', result.error);
    }
  } catch (error) {
    console.error('❌ Error in testEmail:', error.message);
  }
};

// Run the test if this file is executed directly
if (require.main === module) {
  testEmail();
}

module.exports = { testEmail };
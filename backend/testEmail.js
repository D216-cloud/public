const { sendVerificationCodeEmail } = require('./utils/sendMail');

// Test the email configuration
async function testEmail() {
  try {
    console.log('Testing email configuration...');
    
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ EMAIL_USER or EMAIL_PASS not set in environment variables');
      console.log('Please check your .env file');
      return;
    }
    
    console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`🔑 EMAIL_PASS length: ${process.env.EMAIL_PASS.length}`);
    console.log(`🔑 EMAIL_PASS (first 4 chars): ${process.env.EMAIL_PASS.substring(0, 4)}...`);
    
    // Check if EMAIL_PASS contains spaces (common mistake)
    if (process.env.EMAIL_PASS.includes(' ')) {
      console.log('❌ ERROR: EMAIL_PASS contains spaces!');
      console.log('   Gmail App Passwords should NOT contain spaces.');
      console.log('   Please remove any spaces from your App Password.');
      return;
    }
    
    // Check if EMAIL_PASS is the right length for an App Password
    if (process.env.EMAIL_PASS.length !== 16) {
      console.log('⚠️  WARNING: EMAIL_PASS might be incorrect!');
      console.log(`   Gmail App Passwords are usually 16 characters long.`);
      console.log(`   Your EMAIL_PASS is ${process.env.EMAIL_PASS.length} characters.`);
      console.log('   Please verify it is a valid Gmail App Password.');
    }
    
    // Test sending email
    console.log('Sending test email...');
    const result = await sendVerificationCodeEmail(
      process.env.EMAIL_USER, // Send to the same email
      'Test User',
      '123456',
      'testuser'
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`Message ID: ${result.messageId}`);
    } else {
      console.log('❌ Failed to send email');
      console.log(`Error: ${result.error}`);
      
      // Provide specific troubleshooting steps
      if (result.error.includes('Invalid login') || result.error.includes('EAUTH')) {
        console.log('\n🔧 TROUBLESHOOTING STEPS:');
        console.log('1. Verify your Gmail App Password is correct');
        console.log('2. Ensure 2-Factor Authentication is enabled on your Google account');
        console.log('3. Generate a NEW App Password specifically for "Mail"');
        console.log('4. Copy the 16-character code without any spaces');
        console.log('5. Update your .env file with the new App Password');
        console.log('6. Restart your server');
        console.log('\n📝 NOTE: If you continue having issues, consider using an alternative email service');
        console.log('   like SendGrid, Mailgun, or Amazon SES for more reliable email delivery.');
      }
    }
  } catch (error) {
    console.log('❌ Error testing email:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env' });

// Run the test
testEmail();
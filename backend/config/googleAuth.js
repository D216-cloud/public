const { OAuth2Client } = require('google-auth-library');

// Use the GOOGLE_CLIENT_ID from environment variables
const clientId = process.env.GOOGLE_CLIENT_ID;

// Validate that we have a client ID
if (!clientId) {
  console.error('❌ GOOGLE_CLIENT_ID is not set in environment variables');
  throw new Error('GOOGLE_CLIENT_ID is required for Google authentication');
}

const client = new OAuth2Client(clientId);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    throw new Error('Invalid Google token');
  }
}

module.exports = { verifyGoogleToken };
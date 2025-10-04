require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const UserTwitterConnection = require('./models/UserTwitterConnections');
const { TwitterApi } = require('twitter-api-v2');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const user = await User.findOne({});
    if (!user) { console.log('No user'); process.exit(0);}    
    console.log('User:', { id: user._id, twitterId: user.twitterId, twitterUsername: user.twitterUsername });
    const conn = await UserTwitterConnection.findOne({ userId: user._id });
    if (!conn) { console.log('No connection doc'); process.exit(0);}    
    console.log('Connection:', {
      id: conn._id,
      apiKeyExists: !!conn.apiKey,
      apiSecretExists: !!conn.apiSecret,
      accessTokenExists: !!conn.accessToken,
      accessTokenSecretExists: !!conn.accessTokenSecret,
      verified: conn.verified,
      verifiedAt: conn.verifiedAt
    });
    console.log('Env presence:', {
      TWITTER_API_KEY: !!process.env.TWITTER_API_KEY,
      TWITTER_API_SECRET: !!process.env.TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN: !!process.env.TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_TOKEN_SECRET: !!process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
    // Try raw auth
    const client = new TwitterApi({
      appKey: conn.apiKey || process.env.TWITTER_API_KEY,
      appSecret: conn.apiSecret || process.env.TWITTER_API_SECRET,
      accessToken: conn.accessToken || process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: conn.accessTokenSecret || process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    try {
      const me = await client.v2.me();
      console.log('v2.me success', me.data.username);
    } catch(e){
      console.log('v2.me failed', e.code, e.data?.title, e.data?.detail);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
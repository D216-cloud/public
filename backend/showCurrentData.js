// Quick test to see current posts and generated content in database
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const GeneratedContent = require('./models/GeneratedContent');

async function showCurrentData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(5);
    const generated = await GeneratedContent.find({}).sort({ createdAt: -1 }).limit(5);
    
    console.log(`\n📊 Current Database State:`);
    console.log(`Total Posts: ${await Post.countDocuments({})}`);
    console.log(`Total Generated Content: ${await GeneratedContent.countDocuments({})}`);
    
    console.log(`\n📝 Recent Posts:`);
    posts.forEach((post, i) => {
      console.log(`${i + 1}. ${post.content.substring(0, 50)}... (${post.platform || 'X'}) - ${post.createdAt.toLocaleDateString()}`);
    });
    
    console.log(`\n🤖 Recent Generated Content:`);
    generated.forEach((gen, i) => {
      console.log(`${i + 1}. ${gen.generatedText.substring(0, 50)}... - ${gen.createdAt.toLocaleDateString()}`);
    });
    
    console.log(`\n🎉 Your analytics page will show all this data!`);
    console.log(`Frontend URL: http://localhost:5173/analytics`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

showCurrentData();
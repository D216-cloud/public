const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "x",
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB database "x"');
  testOnboarding();
}).catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

const Onboarding = require('./models/Onboarding');

async function testOnboarding() {
  try {
    console.log('🧪 Testing Onboarding model...');
    
    // Test creating onboarding data
    const testData = {
      userId: new mongoose.Types.ObjectId(),
      goals: ['followers', 'engagement'],
      audience: 'Young professionals interested in productivity',
      niche: 'tech',
      contentTypes: ['tips', 'educational'],
      competitors: '@garyvee, @naval',
      postingFrequency: 'daily',
      tone: 'professional',
      autoPosting: true,
      isCompleted: false
    };
    
    const onboarding = new Onboarding(testData);
    await onboarding.save();
    
    console.log('✅ Onboarding data created successfully:', onboarding._id);
    
    // Test updating to completed
    onboarding.isCompleted = true;
    await onboarding.save();
    
    console.log('✅ Onboarding marked as completed');
    console.log('✅ Completed at:', onboarding.completedAt);
    
    // Clean up test data
    await Onboarding.deleteOne({ _id: onboarding._id });
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All onboarding tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}
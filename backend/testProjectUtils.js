const { verifyTwitterUsernameForProject, getTwitterUserInfo } = require('./utils/projectTwitterUtils');

async function testProjectUtils() {
  console.log('=== Testing Project Twitter Utilities ===\n');
  
  try {
    console.log('1. Testing verifyTwitterUsernameForProject with "elonmusk"...');
    const result1 = await verifyTwitterUsernameForProject('elonmusk');
    console.log('Result:', JSON.stringify(result1, null, 2));
    
    console.log('\n2. Testing verifyTwitterUsernameForProject with "twitter"...');
    const result2 = await verifyTwitterUsernameForProject('twitter');
    console.log('Result:', JSON.stringify(result2, null, 2));
    
    console.log('\n3. Testing verifyTwitterUsernameForProject with invalid username...');
    const result3 = await verifyTwitterUsernameForProject('thisusernamedoesnotexist12345');
    console.log('Result:', JSON.stringify(result3, null, 2));
    
    console.log('\n4. Testing getTwitterUserInfo with "elonmusk"...');
    const result4 = await getTwitterUserInfo('elonmusk');
    console.log('Result:', JSON.stringify(result4, null, 2));
    
    console.log('\n=== All tests completed ===');
    console.log('Your project utilities are ready to use!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProjectUtils();
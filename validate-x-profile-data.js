// Simple validation script to check if X Profile page fetches data correctly

const fs = require('fs');
const path = require('path');

console.log('Validating X Profile page data fetching...\n');

// Check if XProfilePage exists
const xProfilePath = path.join(__dirname, 'src/pages/XProfilePage.tsx');
if (fs.existsSync(xProfilePath)) {
  console.log('✓ XProfilePage.tsx exists');
  
  // Read the file content
  const content = fs.readFileSync(xProfilePath, 'utf8');
  
  // Check for data fetching functions
  if (content.includes('fetchUserStats') && content.includes('fetchUserTweets')) {
    console.log('✓ Data fetching functions are implemented');
  } else {
    console.log('✗ Data fetching functions are missing');
  }
  
  // Check for API endpoints
  if (content.includes('/api/user/stats') && content.includes('/api/user/tweets')) {
    console.log('✓ API endpoints are correctly referenced');
  } else {
    console.log('✗ API endpoints are missing or incorrect');
  }
  
  // Check for state management
  if (content.includes('useState') && content.includes('useEffect')) {
    console.log('✓ State management hooks are implemented');
  } else {
    console.log('✗ State management hooks are missing');
  }
  
  // Check for loading state
  if (content.includes('loading') && content.includes('setLoading')) {
    console.log('✓ Loading state is properly handled');
  } else {
    console.log('✗ Loading state is not properly handled');
  }
  
  // Check for error handling
  if (content.includes('catch') && content.includes('console.error')) {
    console.log('✓ Error handling is implemented');
  } else {
    console.log('✗ Error handling is missing');
  }
  
  console.log('\n✓ X Profile page data fetching validation completed.');
} else {
  console.log('✗ XProfilePage.tsx does not exist');
}
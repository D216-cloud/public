// Simple validation script to check if the X Profile page is correctly implemented

const fs = require('fs');
const path = require('path');

console.log('Validating X Profile page implementation...\n');

// Check if the file exists
const xProfilePath = path.join(__dirname, 'src/pages/XProfilePage.tsx');
if (fs.existsSync(xProfilePath)) {
  console.log('✓ XProfilePage.tsx exists');
  
  // Read the file content
  const content = fs.readFileSync(xProfilePath, 'utf8');
  
  // Check for white background
  if (content.includes('bg-white') && !content.includes('bg-black')) {
    console.log('✓ Profile page has white background');
  } else {
    console.log('✗ Profile page does not have white background');
  }
  
  // Check for proper header integration
  if (content.includes('<DashboardHeader />')) {
    console.log('✓ DashboardHeader is properly integrated');
  } else {
    console.log('✗ DashboardHeader is missing');
  }
  
  // Check for X-like styling
  if (content.includes('border-b border-gray-200') && 
      content.includes('text-gray-900') && 
      content.includes('text-gray-500')) {
    console.log('✓ X-like styling is implemented');
  } else {
    console.log('✗ X-like styling is incomplete');
  }
  
  // Check for profile elements
  if (content.includes('Profile Info') && 
      content.includes('Stats Bar') && 
      content.includes('Navigation Tabs')) {
    console.log('✓ Profile elements are properly structured');
  } else {
    console.log('✗ Profile elements are missing');
  }
  
  console.log('\n✓ X Profile page validation completed.');
} else {
  console.log('✗ XProfilePage.tsx does not exist');
}
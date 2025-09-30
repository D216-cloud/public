// Simple validation script to check if user endpoints are correctly implemented

const fs = require('fs');
const path = require('path');

console.log('Validating user endpoints implementation...\n');

// Check if required files exist
const filesToCheck = [
  'backend/routes/userRoutes.js',
  'backend/controllers/userController.js',
  'backend/server.js'
];

let allFilesExist = true;

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} does not exist`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✓ All required files exist. Checking content...');
  
  // Check if user routes are registered in server.js
  const serverContent = fs.readFileSync(path.join(__dirname, 'backend/server.js'), 'utf8');
  if (serverContent.includes('userRoutes') && serverContent.includes('/api/user')) {
    console.log('✓ User routes are registered in server.js');
  } else {
    console.log('✗ User routes are not registered in server.js');
  }
  
  // Check if user controller has required functions
  const controllerContent = fs.readFileSync(path.join(__dirname, 'backend/controllers/userController.js'), 'utf8');
  if (controllerContent.includes('getUserStats') && controllerContent.includes('getUserTweets')) {
    console.log('✓ User controller has required functions');
  } else {
    console.log('✗ User controller is missing required functions');
  }
  
  // Check if user routes have required endpoints
  const routesContent = fs.readFileSync(path.join(__dirname, 'backend/routes/userRoutes.js'), 'utf8');
  if (routesContent.includes('/stats') && routesContent.includes('/tweets')) {
    console.log('✓ User routes have required endpoints');
  } else {
    console.log('✗ User routes are missing required endpoints');
  }
  
  console.log('\n✓ User endpoints validation completed.');
} else {
  console.log('\n✗ Some files are missing. Please check the implementation.');
}
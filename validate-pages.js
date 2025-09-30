// Simple validation script to check if the new pages are correctly implemented

const fs = require('fs');
const path = require('path');

// Check if the files exist
const filesToCheck = [
  'src/pages/XProfilePage.tsx',
  'src/pages/ContentSchedulerPage.tsx',
  'src/App.tsx',
  'src/components/dashboard-header.tsx'
];

console.log('Validating page implementations...\n');

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
  console.log('\n✓ All files exist. Pages should be correctly implemented.');
  
  // Check if routes are added
  const appContent = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');
  if (appContent.includes('XProfilePage') && appContent.includes('ContentSchedulerPage')) {
    console.log('✓ Routes for new pages are added to App.tsx');
  } else {
    console.log('✗ Routes for new pages are missing from App.tsx');
  }
  
  // Check if navigation items are added
  const headerContent = fs.readFileSync(path.join(__dirname, 'src/components/dashboard-header.tsx'), 'utf8');
  if (headerContent.includes('Scheduler') && headerContent.includes('Profile')) {
    console.log('✓ Navigation items for new pages are added to dashboard-header.tsx');
  } else {
    console.log('✗ Navigation items for new pages are missing from dashboard-header.tsx');
  }
} else {
  console.log('\n✗ Some files are missing. Please check the implementation.');
}
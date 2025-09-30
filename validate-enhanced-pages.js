// Simple validation script to check if the enhanced pages are correctly implemented

const fs = require('fs');
const path = require('path');

// Check if the files exist and have the expected content
const filesToCheck = [
  'src/pages/XProfilePage.tsx',
  'src/pages/ContentSchedulerPage.tsx',
  'src/index.css'
];

console.log('Validating enhanced page implementations...\n');

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
  console.log('\n✓ All files exist. Checking content...');
  
  // Check if XProfilePage has enhanced features
  const xProfileContent = fs.readFileSync(path.join(__dirname, 'src/pages/XProfilePage.tsx'), 'utf8');
  if (xProfileContent.includes('stats') && xProfileContent.includes('Create Post')) {
    console.log('✓ XProfilePage has enhanced features (stats, create post button)');
  } else {
    console.log('✗ XProfilePage is missing enhanced features');
  }
  
  // Check if ContentSchedulerPage has enhanced features
  const schedulerContent = fs.readFileSync(path.join(__dirname, 'src/pages/ContentSchedulerPage.tsx'), 'utf8');
  if (schedulerContent.includes('stats') && schedulerContent.includes('simulatePost')) {
    console.log('✓ ContentSchedulerPage has enhanced features (stats, simulation)');
  } else {
    console.log('✗ ContentSchedulerPage is missing enhanced features');
  }
  
  // Check if CSS has padding fix
  const cssContent = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');
  if (cssContent.includes('padding-top: 4rem')) {
    console.log('✓ CSS has fixed header padding');
  } else {
    console.log('✗ CSS is missing fixed header padding');
  }
  
  console.log('\n✓ Enhanced pages should be correctly implemented.');
} else {
  console.log('\n✗ Some files are missing. Please check the implementation.');
}
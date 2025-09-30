// Simple validation script to check if both pages use 85% width

const fs = require('fs');
const path = require('path');

console.log('Validating 85% width implementation...\n');

// Check XProfilePage
const xProfilePath = path.join(__dirname, 'src/pages/XProfilePage.tsx');
if (fs.existsSync(xProfilePath)) {
  const xProfileContent = fs.readFileSync(xProfilePath, 'utf8');
  if (xProfileContent.includes('w-[85%]') || xProfileContent.includes('width: 85%')) {
    console.log('✓ XProfilePage uses 85% width');
  } else {
    console.log('✗ XProfilePage does not use 85% width');
  }
} else {
  console.log('✗ XProfilePage.tsx does not exist');
}

// Check ContentSchedulerPage
const schedulerPath = path.join(__dirname, 'src/pages/ContentSchedulerPage.tsx');
if (fs.existsSync(schedulerPath)) {
  const schedulerContent = fs.readFileSync(schedulerPath, 'utf8');
  if (schedulerContent.includes('w-[85%]') || schedulerContent.includes('width: 85%')) {
    console.log('✓ ContentSchedulerPage uses 85% width');
  } else {
    console.log('✗ ContentSchedulerPage does not use 85% width');
  }
} else {
  console.log('✗ ContentSchedulerPage.tsx does not exist');
}

console.log('\nValidation completed.');
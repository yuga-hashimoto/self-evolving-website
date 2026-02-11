const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const standaloneDir = path.join(projectRoot, '.next', 'standalone');
const standaloneNextDir = path.join(standaloneDir, '.next');

// Ensure destination directories exist
if (!fs.existsSync(standaloneDir)) {
  console.error('Error: .next/standalone directory not found. Did the build fail?');
  process.exit(1);
}

// Copy public directory
const publicSrc = path.join(projectRoot, 'public');
const publicDest = path.join(standaloneDir, 'public');

if (fs.existsSync(publicSrc)) {
  console.log(`Copying public/ to .next/standalone/public/...`);
  fs.cpSync(publicSrc, publicDest, { recursive: true });
} else {
  console.warn('Warning: public/ directory not found.');
}

// Copy .next/static directory
const staticSrc = path.join(projectRoot, '.next', 'static');
const staticDest = path.join(standaloneNextDir, 'static');

if (fs.existsSync(staticSrc)) {
    // Ensure parent directory exists (though Next.js usually creates it)
    if (!fs.existsSync(standaloneNextDir)) {
        fs.mkdirSync(standaloneNextDir, { recursive: true });
    }

  console.log(`Copying .next/static/ to .next/standalone/.next/static/...`);
  fs.cpSync(staticSrc, staticDest, { recursive: true });
} else {
  console.warn('Warning: .next/static/ directory not found.');
}

console.log('Standalone assets copied successfully.');

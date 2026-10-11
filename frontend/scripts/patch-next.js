const fs = require('fs');
const path = require('path');

const filesToPatch = [
  path.join(__dirname, '../node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js'),
  path.join(__dirname, '../node_modules/next/dist/esm/server/lib/router-utils/setup-dev-bundler.js'),
  path.join(__dirname, '../node_modules/next/dist/build/webpack-config.js'),
  path.join(__dirname, '../node_modules/next/dist/esm/build/webpack-config.js'),
];

let patchedCount = 0;
for (const filePath of filesToPatch) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('aggregateTimeout: 5,')) {
      content = content.replace(/aggregateTimeout:\s*5,/g, 'aggregateTimeout: 300,');
      fs.writeFileSync(filePath, content, 'utf8');
      patchedCount++;
    }
  }
}

if (patchedCount > 0) {
  console.log(`[patch-next] Successfully patched ${patchedCount} Next.js files with aggregateTimeout: 300ms.`);
} else {
  console.log('[patch-next] All target Next.js files are already up-to-date.');
}

const fs = require('fs');

const srcDir = 'assets';
const destDir = 'dist/assets';

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

fs.cpSync('src/index.html', 'dist/index.html');
console.log('Copied index.html to dist/');

if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`Copied all files from ${srcDir} to ${destDir}`);
} else {
    console.warn(`Warning: Source directory '${srcDir}' not found.`);
}

// // generate-image-list.js
// const fs = require('fs');
// const path = require('path');

// const imageFolder = path.join(__dirname, 'src/assets/news');
// const outputFile = path.join(__dirname, 'src/app/imageList.ts');

// const files = fs.readdirSync(imageFolder);
// const imagePaths = files
//   .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
//   .map(file => `'assets/news/${file}'`);

// const content = `export const imageList = [\n  ${imagePaths.join(',\n  ')}\n];\n`;
// fs.writeFileSync(outputFile, content);
// console.log('Image list generated.');

const fs = require('fs');
const path = require('path');

const imageFolder = path.join(__dirname, 'src/assets/news');
const outputFile = path.join(__dirname, 'src/app/imageList.ts');

const files = fs.readdirSync(imageFolder);
const imageObjects = files
  .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
  .map(file => {
    const altText = file
      .replace(/\.[^/.]+$/, '') // remove extension
      .replace(/[-_]/g, ' ')    // replace - and _ with space
      .replace(/\s+/g, ' ')     // collapse multiple spaces
      .trim();
    return `{ image: 'assets/news/${file}', alt: '${altText}' }`;
  });

const content = `export const imageList = [\n  ${imageObjects.join(',\n  ')}\n];\n`;
fs.writeFileSync(outputFile, content);

console.log('Image list generated with alt text.');
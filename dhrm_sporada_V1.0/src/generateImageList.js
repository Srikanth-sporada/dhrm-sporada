/** generate image path 
 * @constant folders 
 * @constant baseFolder
 * @constant outputFile imageList.ts
 */
const fs = require('fs');
const path = require('path');

const folders = ['news', 'home']; // Add folder names here
const baseFolder = path.join(__dirname, 'src/assets');
const outputFile = path.join(__dirname, 'src/app/imageList.ts');

let content = '';

folders.forEach(folder => {
  const folderPath = path.join(baseFolder, folder);
  const files = fs.readdirSync(folderPath);

  const imageObjects = files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => {
      const altText = file
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return `{ image: 'assets/${folder}/${file}', alt: '${altText}' }`;
    });

  content += `export const ${folder}Images = [\n  ${imageObjects.join(',\n  ')}\n];\n\n`;
});

fs.writeFileSync(outputFile, content);
console.log('Image lists generated for each folder.');
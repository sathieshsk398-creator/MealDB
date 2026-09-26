const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/data');
console.log('Checked files:', files.length);

const allDishes = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match dishes with strMeal and strMealThumb (both quoted and unquoted)
  const dishRegex = /(?:strMeal|"strMeal")\s*:\s*"([^"]+)"[\s\S]*?(?:strMealThumb|"strMealThumb")\s*:\s*"([^"]+)"/g;
  let match;
  while ((match = dishRegex.exec(content)) !== null) {
    allDishes.push({
      file: path.basename(f),
      dish: match[1],
      image: match[2]
    });
  }
});

console.log('Found', allDishes.length, 'dishes with strMeal & strMealThumb.');
console.log('Sample dishes:');
console.log(JSON.stringify(allDishes.slice(0, 10), null, 2));

// Check duplicates or fish/unrelated images
const imagesMap = new Map();
allDishes.forEach(d => {
  if (!imagesMap.has(d.image)) imagesMap.set(d.image, []);
  imagesMap.get(d.image).push(d.dish);
});

console.log('Unique images:', imagesMap.size);

// Check if any image is used for too many dishes
for (const [img, dishes] of imagesMap.entries()) {
  if (dishes.length > 2) {
    console.log(`Image reused across ${dishes.length} dishes: ${img}`);
    console.log(`Dishes: ${dishes.slice(0, 5).join(', ')}`);
  }
}

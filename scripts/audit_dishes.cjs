const fs = require('fs');
const path = require('path');

const dir = './src/data';

function getFiles(d) {
  let res = [];
  fs.readdirSync(d).forEach(f => {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) res = res.concat(getFiles(full));
    else if (full.endsWith('.js')) res.push(full);
  });
  return res;
}

const files = getFiles(dir);

const allDishes = [];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Simple parser to extract object items with idMeal, strMeal, strMealThumb
  // Using line-by-line scanning or regex
  const lines = content.split('\n');
  let currentDish = null;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const mealMatch = l.match(/(?:strMeal|"strMeal")\s*:\s*"([^"]+)"/);
    if (mealMatch) {
      if (!currentDish) currentDish = { file, line: i + 1 };
      currentDish.name = mealMatch[1];
    }
    const thumbMatch = l.match(/(?:strMealThumb|"strMealThumb")\s*:\s*"([^"]+)"/);
    if (thumbMatch) {
      if (!currentDish) currentDish = { file, line: i + 1 };
      currentDish.thumb = thumbMatch[1];
    }
    const categoryMatch = l.match(/(?:strCategory|"strCategory")\s*:\s*"([^"]+)"/);
    if (categoryMatch && currentDish) {
      currentDish.category = categoryMatch[1];
    }
    const areaMatch = l.match(/(?:strArea|"strArea")\s*:\s*"([^"]+)"/);
    if (areaMatch && currentDish) {
      currentDish.area = areaMatch[1];
    }

    if (currentDish && currentDish.name && currentDish.thumb) {
      allDishes.push(currentDish);
      currentDish = null;
    }
  }
});

console.log('Total dishes found:', allDishes.length);

const thumbMap = {};
allDishes.forEach(d => {
  if (!thumbMap[d.thumb]) thumbMap[d.thumb] = [];
  thumbMap[d.thumb].push(`${d.name} (${path.basename(d.file)}:${d.line})`);
});

const duplicates = Object.entries(thumbMap).filter(([k, v]) => v.length > 1);
console.log('Total unique thumbs:', Object.keys(thumbMap).length);
console.log('Thumbs reused > 1 times:', duplicates.length);

duplicates.forEach(([url, list]) => {
  console.log(`\nReused in ${list.length} dishes: ${url}`);
  list.forEach(item => console.log('  - ' + item));
});

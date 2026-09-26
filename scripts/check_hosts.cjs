const fs = require('fs');
const content = fs.readFileSync('src/data/indianDishesData.js', 'utf8');
const lines = content.split('\n');
const hosts = {};
lines.forEach(l => {
  const m = l.match(/strMealThumb:\s*([^,\n]+)/);
  if (m) {
    let clean = m[1].trim().replace(/^["']/, '').replace(/["']$/, '');
    let host = 'local-asset';
    if (clean.startsWith('http')) {
      try {
        host = new URL(clean).hostname;
      } catch (e) {
        host = 'invalid-url';
      }
    }
    hosts[host] = (hosts[host] || 0) + 1;
  }
});
console.log('Indian dishes image hosts:', hosts);

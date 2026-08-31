const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const themeStart = '@theme {';
const themeReplacement = `@theme {
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-display: 'Outfit', sans-serif;`;

css = css.replace(themeStart, themeReplacement);
fs.writeFileSync('src/index.css', css);
console.log("Done");

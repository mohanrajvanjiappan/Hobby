const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace('  @keyframes slide {\n    0% { background-position: 0 0; }\n    100% { background-position: 40px 0; }\n  }', '');
if (!css.includes('@keyframes slide')) {
  css += '\n@keyframes slide {\n  0% { background-position: 0 0; }\n  100% { background-position: 40px 0; }\n}\n';
  fs.writeFileSync('src/index.css', css);
}

const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
if (!css.includes('.animate-slide-stripe')) {
  css += '\n.animate-slide-stripe { animation: slide 2s linear infinite; }\n';
  fs.writeFileSync('src/index.css', css);
}

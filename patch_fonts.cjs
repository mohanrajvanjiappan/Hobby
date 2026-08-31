const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const headEnd = '</head>';
const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>`;

html = html.replace(headEnd, fontLinks);
fs.writeFileSync('index.html', html);
console.log("Done");

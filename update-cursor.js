const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3366" />
      <stop offset="33%" stop-color="#FF9933" />
      <stop offset="66%" stop-color="#33CC99" />
      <stop offset="100%" stop-color="#3399FF" />
    </linearGradient>
  </defs>
  <g transform="translate(10,10) rotate(-15 50 50)">
    <path d="M 35,80 C 25,80 20,95 20,95 L 80,95 C 80,95 75,80 65,80 Z" fill="url(#rainbow)" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 30,55 C 10,55 5,75 25,85" fill="url(#rainbow)" stroke="#222" stroke-width="4" stroke-linecap="round"/>
    <rect x="55" y="45" width="25" height="15" rx="7.5" fill="url(#rainbow)" stroke="#222" stroke-width="4"/>
    <rect x="55" y="58" width="25" height="15" rx="7.5" fill="url(#rainbow)" stroke="#222" stroke-width="4"/>
    <rect x="50" y="71" width="25" height="15" rx="7.5" fill="url(#rainbow)" stroke="#222" stroke-width="4"/>
    <path d="M 24,55 L 24,80 L 67,80 L 67,55 Z" fill="url(#rainbow)"/>
    <path d="M 33,20 L 33,55 C 33,65 53,65 53,55 L 53,20 C 53,5 33,5 33,20 Z" fill="url(#rainbow)" stroke="#222" stroke-width="4"/>
    <path d="M 33,50 L 33,75" stroke="#222" stroke-width="4"/>
    <path d="M 53,50 L 53,75" stroke="#222" stroke-width="4"/>
    <path d="M 23,55 C 23,45 67,45 67,55" fill="url(#rainbow)"/>
    <path d="M 38,65 L 38,80 M 46,65 L 46,80 M 54,65 L 54,80" stroke="#222" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;

const b64 = Buffer.from(svg).toString('base64');
const css = `
@import "leaflet/dist/leaflet.css";
@import "tailwindcss";
@theme {
  --animate-spin-slow: spin 3s linear infinite;
}

.presentation-container, .presentation-container * {
  cursor: url('data:image/svg+xml;base64,${b64}') 18 10, auto !important;
}
`;

fs.writeFileSync('src/index.css', css.trim());

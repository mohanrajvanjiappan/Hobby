const fs = require('fs');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 100 100">
  <defs>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="46"/>
    </clipPath>
  </defs>
  <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#000000" stroke-width="4"/>
  
  <g clip-path="url(#circleClip)">
    <polygon points="50,30 69,44 62,66 38,66 31,44" fill="#000000"/>
    <path d="M 50,30 L 50,0 M 69,44 L 100,34 M 62,66 L 81,100 M 38,66 L 19,100 M 31,44 L 0,34" stroke="#000000" stroke-width="5"/>
    
    <polygon points="50,0 25,-10 75,-10" fill="#000000"/>
    <polygon points="100,34 115,10 115,60" fill="#000000"/>
    <polygon points="81,100 105,75 50,115" fill="#000000"/>
    <polygon points="19,100 -5,75 50,115" fill="#000000"/>
    <polygon points="0,34 -15,10 -15,60" fill="#000000"/>
  </g>
  
  <circle cx="50" cy="50" r="48" fill="none" stroke="#000000" stroke-width="4"/>
</svg>`;

const b64 = Buffer.from(svg).toString('base64');
const css = `
@import "leaflet/dist/leaflet.css";
@import "tailwindcss";
@theme {
  --animate-spin-slow: spin 3s linear infinite;
}

.presentation-container, .presentation-container * {
  cursor: url('data:image/svg+xml;base64,${b64}') 16 16, auto !important;
}
`;

fs.writeFileSync('src/index.css', css.trim());

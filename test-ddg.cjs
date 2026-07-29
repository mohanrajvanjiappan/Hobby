const { image_search } = require('duckduckgo-images-api');
image_search({ query: "Toyota logo", moderate: true }).then(results => console.log(results[0])).catch(console.error);

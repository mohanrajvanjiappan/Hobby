import google from 'googlethis';
const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
google.image('Toyota logo', options).then(images => console.log(images[0])).catch(console.error);

import google from 'googlethis';
async function test() {
  const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
  const images = await google.image('2020 Porsche 911 Carrera S red front quarter view high quality', options);
  console.log(images[0]?.url);
}
test();

import google from "googlethis";
async function run() {
  const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
  const images = await google.image("apple fruit white background", options);
  console.log(images.slice(0, 3));
}
run();

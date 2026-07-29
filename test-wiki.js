async function run() {
  const q = "Eiffel Tower";
  const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json`);
  const searchData = await searchRes.json();
  const title = searchData.query.search[0].title;
  console.log("Title:", title);
  
  const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
  const imgData = await imgRes.json();
  const pages = imgData.query.pages;
  const pageId = Object.keys(pages)[0];
  console.log("Image URL:", pages[pageId].original?.source);
}
run();

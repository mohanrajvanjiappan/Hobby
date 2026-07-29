async function run() {
  const qs = ["Apple", "Mona Lisa", "Ford Mustang", "Eiffel Tower", "Golden Retriever"];
  for (const q of qs) {
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json`);
    const searchData = await searchRes.json();
    const title = searchData.query?.search?.[0]?.title;
    
    if (title) {
        const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
        const imgData = await imgRes.json();
        const pages = imgData.query.pages;
        const pageId = Object.keys(pages)[0];
        console.log(q, "->", pages[pageId].original?.source);
    } else {
        console.log(q, "-> NO TITLE");
    }
  }
}
run();

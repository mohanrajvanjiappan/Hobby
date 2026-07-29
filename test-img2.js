import google from 'googlethis';
async function test() {
  const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
  const images = await google.image('SpongeBob SquarePants character', options);
  let base64Image = null;
  for (const img of images) {
    for (const targetUrl of [img.url, img.preview?.url]) {
      if (!targetUrl) continue;
      try {
        const fetchRes = await fetch(targetUrl, { 
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
          signal: AbortSignal.timeout(3000)
        });
        if (fetchRes.ok) {
          const arrayBuffer = await fetchRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString('base64');
          const mimeType = fetchRes.headers.get('content-type') || 'image/jpeg';
          if (mimeType.startsWith('image/') || mimeType === 'application/octet-stream') {
            base64Image = `data:${mimeType === 'application/octet-stream' ? 'image/jpeg' : mimeType};base64,${base64.substring(0, 50)}...`;
            console.log("Success with", targetUrl);
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }
    if (base64Image) break;
  }
  console.log("Result:", base64Image);
}
test();

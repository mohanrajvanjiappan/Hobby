import puppeteer from 'puppeteer';
import fs from 'fs';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('ImportOffline Custom'));
    if(btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  const fileInput = await page.$('input[type=file]');
  if (fileInput) {
    fs.writeFileSync('dummy.json', JSON.stringify([{question: "test", options: ["1","2"], answer: "1", type: "multiple-choice", timeLimit: 10}]));
    await fileInput.uploadFile('dummy.json');
  }
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Start Offline Quiz'));
    if(btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Video Mode'));
    if(btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 5000));

  const dom = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('dom2.html', dom);
  console.log("DOM saved");

  await browser.close();
})();

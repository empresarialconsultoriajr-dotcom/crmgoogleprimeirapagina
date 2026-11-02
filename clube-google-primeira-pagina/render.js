const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('projeto.html'), { waitUntil: 'networkidle' });
  // detectar overflow por página
  const over = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('section.page').forEach((s, i) => {
      const inner = [...s.children].filter(c => !c.classList.contains('pf') && !c.classList.contains('ph'));
      let maxBottom = 0;
      inner.forEach(c => { const r = c.getBoundingClientRect(); maxBottom = Math.max(maxBottom, r.bottom - s.getBoundingClientRect().top); });
      const limit = s.getBoundingClientRect().height - 16 * 3.78 - 8; // bottom padding (16mm) in px
      if (maxBottom > limit) out.push({ page: i + 1, overflowPx: Math.round(maxBottom - limit) });
    });
    return out;
  });
  console.log('pages:', await page.evaluate(() => document.querySelectorAll('section.page').length));
  console.log('overflow:', JSON.stringify(over));
  await page.pdf({ path: process.argv[2] || 'out.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
})();

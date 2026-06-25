import htmlToDocx from 'html-to-docx';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { marked } from 'marked';
import { asyncHandler } from '../utils/errorHandler.js';

const slugifyTitle = (title = 'blog') =>
  title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'blog';

const buildHTMLDocument = (title, bodyContent, images = []) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.8; 
      max-width: 850px; 
      margin: 0 auto; 
      padding: 40px; 
      color: #1a202c; 
      background: #ffffff;
    }
    h1 { 
      color: #0c3b72; 
      font-size: 28px; 
      font-weight: 700; 
      margin-bottom: 32px; 
      line-height: 1.3;
      border-bottom: 3px solid #0c3b72;
      padding-bottom: 12px;
    }
    h2 { 
      color: #1a5490; 
      font-size: 22px; 
      font-weight: 600; 
      margin-top: 36px; 
      margin-bottom: 16px; 
      line-height: 1.4;
    }
    h3 { 
      color: #2563eb; 
      font-size: 18px; 
      font-weight: 600; 
      margin-top: 28px; 
      margin-bottom: 14px; 
    }
    h4, h5, h6 { 
      color: #374151; 
      font-weight: 600; 
      margin-top: 24px; 
      margin-bottom: 12px; 
    }
    p { 
      margin-bottom: 18px; 
      text-align: justify; 
      color: #374151;
      font-size: 15px;
    }
    ul, ol { 
      margin: 16px 0; 
      padding-left: 28px; 
    }
    li { 
      margin-bottom: 12px; 
      line-height: 1.7; 
      color: #374151;
    }
    strong, b { 
      color: #1f2937; 
      font-weight: 600; 
    }
    em, i { 
      font-style: italic; 
    }
    img { 
      max-width: 100%; 
      height: auto; 
      margin: 24px 0; 
      border-radius: 8px; 
      display: block;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .divider { 
      border: 0; 
      height: 2px; 
      background: linear-gradient(to right, #0c3b72, #3b82f6, #0c3b72); 
      margin: 32px 0; 
    }
    .images { 
      margin: 32px 0; 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 20px;
    }
    .images img { 
      width: 100%; 
      height: 250px; 
      object-fit: cover; 
      margin: 0;
    }
    blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 20px;
      margin: 24px 0;
      color: #4b5563;
      font-style: italic;
    }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    pre {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 20px 0;
    }
    pre code {
      background: none;
      padding: 0;
    }
    hr {
      border: 0;
      height: 1px;
      background: #e5e7eb;
      margin: 28px 0;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f9fafb;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="content">${bodyContent}</div>
  ${(() => {
    const hasImg = /<img\s/i.test(bodyContent || '');
    if (hasImg || !Array.isArray(images) || images.length === 0) return '';
    const block = images.map((img, i) => `<img src="${img.url}" alt="${img.alt || img.prompt || `Image ${i + 1}`}">`).join('\n');
    return `<hr class="divider" /><div class="images">${block}</div>`;
  })()}
</body>
</html>
`.trim();

async function inlineImagesInHtml(html) {
  if (!html) return html;

  const imgRegex = /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const uniqueSrcs = new Set();
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.startsWith('data:')) uniqueSrcs.add(src);
  }

  const srcToDataUri = new Map();
  for (const src of uniqueSrcs) {
    try {
      const response = await axios.get(src, { responseType: 'arraybuffer', timeout: 15000 });
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const base64 = Buffer.from(response.data).toString('base64');
      srcToDataUri.set(src, `data:${contentType};base64,${base64}`);
    } catch (e) {
      continue;
    }
  }

  if (srcToDataUri.size === 0) return html;

  let out = html;
  for (const [src, dataUri] of srcToDataUri.entries()) {
    const esc = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const replaceRegex = new RegExp(`(<img\\b[^>]*src=["'])${esc}(["'][^>]*>)`, 'g');
    out = out.replace(replaceRegex, `$1${dataUri}$2`);
  }
  return out;
}



export const exportToDOCXFile = asyncHandler(async (req, res) => {
  const { title = 'Blog', content = '', images = [] } = req.body;
  const looksLikeHTML = /<\w+[^>]*>/.test(content || '');
  const bodyHtml = looksLikeHTML ? content : marked.parse(content || '');
  const htmlRaw = buildHTMLDocument(title, bodyHtml, images);
  const html = await inlineImagesInHtml(htmlRaw);
  const buffer = await htmlToDocx(html, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${slugifyTitle(title)}.docx"`);
  res.send(Buffer.from(buffer));
});

export const exportToPDFFile = asyncHandler(async (req, res) => {
  const { title = 'Blog', content = '', images = [] } = req.body;
  const looksLikeHTML = /<\w+[^>]*>/.test(content || '');
  const bodyHtml = looksLikeHTML ? content : marked.parse(content || '');
  const htmlRaw = buildHTMLDocument(title, bodyHtml, images);
  const html = await inlineImagesInHtml(htmlRaw);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${slugifyTitle(title)}.pdf"`);
    res.send(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

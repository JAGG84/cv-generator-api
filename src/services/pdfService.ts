import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export async function generatePDF(data: any): Promise<Buffer> {
  // 1. Cargar plantilla Handlebars
  const templatePath = path.join(__dirname, '../templates/cv.hbs');
  const html = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(html);
  const filledHTML = template(data);

  // 2. Configurar Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Necesario para Docker
  });
  const page = await browser.newPage();

  // 3. Generar PDF
  await page.setContent(filledHTML);
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });

  await browser.close();
  return Buffer.from(pdf);
}
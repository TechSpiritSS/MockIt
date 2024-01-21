const pdfjs = require('pdfjs-dist/build/pdf');

async function getContent(fileBuffer) {
  try {
    const doc = await pdfjs.getDocument({ data: fileBuffer }).promise;
    const numPages = doc.numPages;
    const content = [];

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const textContent = await page.getTextContent();
      content.push(textContent.items.map((item) => item.str).join(' '));
    }

    return content;
  } catch (error) {
    throw new Error('Error reading PDF: ' + error.message);
  }
}

// Function to read text from a PDF file
async function readPDFText(fileBuffer) {
  try {
    const content = await getContent(fileBuffer);
    return content.join(' ');
  } catch (error) {
    throw new Error('Error reading PDF: ' + error.message);
  }
}

module.exports = readPDFText;

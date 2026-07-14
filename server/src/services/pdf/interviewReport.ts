import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Creates a simple PDF and returns it as bytes
// PDFs are NOT text, it is just lots of bytes
// Example:
// 24 12 22 23
// 52 63 47 61
// ...
// That's why we call it a binary response
const generateInterviewReportPdf = async (): Promise<Uint8Array> => {
    // Create an empty PDF document in memory
    const pdf = await PDFDocument.create();

    // Add one A4 page
    // This creates - Page 1
    // The numbers are the page size
    // These are the dimensions of an A4 page in PDF points, as a PDF doesn't understand pixels
    // 1 inch = 72 points
    // So, A4 - 595 × 842 point
    const page = pdf.addPage([595.28, 841.89]);

    // Built-in Helvetica font
    // Unlike HTML, font-family: Arial;
    // PDFs need the font embedded, so we are using a built-in font
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // Draw text on the page
    // This literally paints text onto the page
    // Unlike HTML, there is no layout engine
    // We decide everything where we want to place
    // Here we place the text 'Hello PDF!' at coordinate (50, 780)
    page.drawText('Hello PDF!', {
        x: 50,
        y: 780,
        size: 24,
        font,

        // pdf-lib expects values between 0 and 1 for colors
        // rgb(1,0,0) - Red, rgb(0,1,0) - Green, rgb(0,0,1) - Blue
        
        color: rgb(0.12, 0.23, 0.37)
    });

    // Convert the PDF into bytes
    // It generates the finished PDF in memory and returns its bytes
    // A PDF is binary data, that's why we used Uint8Array
    return await pdf.save();
};

export { generateInterviewReportPdf };

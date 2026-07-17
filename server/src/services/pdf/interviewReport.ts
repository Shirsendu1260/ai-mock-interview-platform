// This converts our HTML report into a PDF

import puppeteer from "puppeteer";
import type { IInterviewReportData } from "../../types/types.js";
import { generateInterviewReportHtml } from "./interviewReportHtml.js";

const generateInterviewReportPdf = async (interviewReportData: IInterviewReportData): Promise<Uint8Array> => {
    // Generate the complete HTML page first
    const html = generateInterviewReportHtml(interviewReportData);

    // Launch an invisible Chromium browser
    // headless:true means - browser runs in the background, no browser window appears
    const browser = await puppeteer.launch({ 
        executablePath: puppeteer.executablePath(),
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    try {
        // Create one empty browser tab (like opening a new Chrome tab)
        const page = await browser.newPage();

        // Load our generated HTML into that tab
        await page.setContent(html, {
            waitUntil: 'load' // Wait until everything inside the page finishes loading before printing the PDF
        });

        // Tell Chrome to print this page as PDF
        const pdf = await page.pdf({
            format: 'A4', // A4 paper size
            printBackground: true, // Print CSS background colors too
            margin: { // White space around the page
                top: '20mm',
                bottom: '20mm',
                left: '18mm',
                right: '18mm'
            }
        });

        // Puppeteer returns a Uint8Array
        return pdf;
    }
    finally {
        // Always close the Chromium browser
        // Otherwise invisible browser processes would remain running on the server
        await browser.close();
    }
};

export { generateInterviewReportPdf };

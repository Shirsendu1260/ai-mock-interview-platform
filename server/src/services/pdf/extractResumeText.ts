import fs from 'fs/promises';
import { extractText, getDocumentProxy } from 'unpdf';
import { ApiError } from '../../utils/ApiError.js';

// Reads a PDF resume from server storage and extracts its text
export const extractResumeText = async (resumePdfPath: string): Promise<string> => {
    // Read the PDF into memory as a Buffer
    console.log('Resume path: ', resumePdfPath);
    const pdfBuffer = await fs.readFile(resumePdfPath);
    console.log('Buffer size: ', pdfBuffer.length);

    // unpdf expects Uint8Array instead of Node.js Buffer
    const pdfData = new Uint8Array(pdfBuffer);

    let extractedText: string;
    try {
        // Parse the buffer and collect the resume text
        const parsedPdf = await getDocumentProxy(pdfData);
        console.log('PDF parsed.');
        const { text } = await extractText(parsedPdf, { mergePages: true });
        extractedText = text;
        console.log('Text extracted: ', extractedText.length);
    }
    catch(error) {
        console.error('Resume text extraction failed:', error);
        throw new ApiError(500, 'Unable to extract text from the uploaded resume.');
    }
    finally {
        // Delete the file anyway
        await fs.unlink(resumePdfPath).catch((error) => {
            console.error('Unable to delete uploaded resume:', error);
        });
    }

    // PDF extracted texts usually contains - multiple spaces, many blank lines, random tabs
    // We only normalize whitespace, we never remove resume content
    const cleanedText = extractedText
                            .replace(/\r/g, '') // Windows -> Unix line ending
                            .replace(/\t/g, ' ') // tabs -> single space
                            .replace(/\n{3,}/g, '\n\n') // 3+ blank lines -> 2 blank lines
                            .trim(); // remove leading/trailing spaces

    if(cleanedText.length < 50) {
        throw new ApiError(400, 'Unable to extract meaningful text from the uploaded resume, please try again.');
    }

    return cleanedText;
};

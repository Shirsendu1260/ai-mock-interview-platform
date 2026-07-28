import fs from 'fs/promises';
import { extractText, getDocumentProxy } from 'unpdf';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../config/logger.js';

// Reads a PDF resume from server storage and extracts its text
export const extractResumeText = async (resumePdfPath: string): Promise<string> => {
    // Read the PDF into memory as a Buffer
    logger.debug({ resumePdfPath }, 'Extracting text from uploaded resume');
    const pdfBuffer = await fs.readFile(resumePdfPath);
    logger.debug({ bufferSize: pdfBuffer.length }, 'Resume PDF loaded into memory');

    // unpdf expects Uint8Array instead of Node.js Buffer
    const pdfData = new Uint8Array(pdfBuffer);

    let extractedText: string;
    try {
        // Parse the buffer and collect the resume text
        const parsedPdf = await getDocumentProxy(pdfData);
        const { text } = await extractText(parsedPdf, { mergePages: true });
        extractedText = text;
        logger.info({ extractedLength: extractedText.length }, 'Resume text extracted successfully');
    }
    catch(error) {
        logger.error({ err: error, resumePdfPath }, 'Resume text extraction failed');
        throw new ApiError(500, 'Unable to extract text from the uploaded resume.');
    }
    finally {
        // Delete the file anyway
        await fs.unlink(resumePdfPath).catch((error) => {
            logger.warn({ err: error, resumePdfPath }, 'Unable to delete uploaded resume file');
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

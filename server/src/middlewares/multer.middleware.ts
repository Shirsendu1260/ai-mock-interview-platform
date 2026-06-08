import multer from 'multer';
import fs from 'fs';
import { UPLOAD_DIR } from '../constants.js';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Check if the directory exists or not at startup
if(!fs.existsSync(UPLOAD_DIR)) {
	fs.mkdirSync(UPLOAD_DIR, { recursive: true }); 
	// recursive: true means it won't throw an error if the folder already exists
	// and it will create it if it doesn't
}

// Upload files using DiskStorage engine provided by Multer
const storage = multer.diskStorage({
	// This function decides where the uploaded file will be saved
	destination: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, destination: string) => void
	) {
		// cb(null, './public/temp'); // error = null, means No error -> store file in upload directory
		cb(null, UPLOAD_DIR);
	},

	// This decides what the saved file name will be
	filename: function (
		req: Request,
		file: Express.Multer.File,
		cb: (error: Error | null, filename: string) => void
	) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // This creates an unique number
		cb(null, file.fieldname + '-' + uniqueSuffix);
	}
});

const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: FileFilterCallback
) => {
	const allowedTypes = ['application/pdf'];

	if(allowedTypes.includes(file.mimetype)) {
		cb(null, true); // true -> accept the file
	}
	else {
		cb(new ApiError(400, `'${file.mimetype.toUpperCase()}' filetype is not allowed.`));
	}
}

export const upload = multer({ 
	storage,
	limits: { fileSize: 6 * 1024 * 1024 }, // 6MB Max
	fileFilter
});
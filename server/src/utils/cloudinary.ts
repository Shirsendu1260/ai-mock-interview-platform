import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import type { UploadApiResponse, UploadApiOptions } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Return https URLs by setting secure: true
});

// Uploads a file to Cloudinary
const cloudinaryUploader = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    if (!localFilePath) return null;

    const options: UploadApiOptions = {
        use_filename: true, // Use original filename as public_id (unique identifier of the uploaded file)
        unique_filename: false, // Don't append random suffix to filename
        overwrite: true, // Overwrite if same filename already exists
        resource_type: 'auto', // Auto-detect file type
        allowed_formats: ['pdf'],
        folder: 'ai-interviewer-uploads',
    };

    try {
        // Upload the local file from server to Cloudinary cloud storage
        const uploadResult = await cloudinary.uploader.upload(localFilePath, options);
        console.log('UPLOAD SUCCESSFUL ON CLOUDINARY. SOURCE:', uploadResult.secure_url);

        return uploadResult;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log('CLOUDINARY UPLOAD ERROR:', error.message);
        } else {
            console.log('CLOUDINARY UPLOAD ERROR:', error);
        }

        return null;
    } finally {
        // safely delete the file now
        try {
            if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        }
        catch (unlinkError) {
            console.log('TEMP FILE DELETE ERROR:', unlinkError);
        }
    }
};

// Delete uploaded file
const cloudinaryDeleter = async (cloudinaryAssetUrl: string): Promise<boolean> => {
    try {
        if (!cloudinaryAssetUrl) return false;

        // Extract public_id from the Cloudinary secure_url

        const indexOfUpload = cloudinaryAssetUrl.indexOf('/upload/');
        if (indexOfUpload === -1) {
            console.log('CLOUDINARY DELETE ERROR: Invalid Cloudinary URL');
            return false;
        }

        // Slice everything after '/upload/' (+8 because '/upload/' is 8 characters)
        // Result: v1234567890/folder/subfolder/filename.pdf  (version may or may not exist)
        const afterUpload = cloudinaryAssetUrl.slice(indexOfUpload + 8);

        // Remove version prefix if present ('v' followed by digits and a slash)
        // v1234567890/folder/subfolder/filename.pdf -> folder/subfolder/filename.pdf
        const withoutVersion = afterUpload.replace(/^v\d+\//, '');

        // Remove file extension using lastIndexOf to handle filenames that contain dots
        // e.g. "my.photo.pdf" -> "my.photo" not "my"
        const indexOfLastDot = withoutVersion.lastIndexOf('.');
        const publicId = withoutVersion.slice(0, indexOfLastDot);
        // Final publicId: ai-interviewer-uploads/user/filename
        // console.log(publicId);

        const { result } = await cloudinary.uploader.destroy(publicId);

        if (result === 'ok') {
            console.log('DELETE SUCCESSFUL FROM CLOUDINARY. PUBLIC ID:', publicId);
            return true;
        }

        console.log('DELETE ATTEMPTED BUT FILE NOT FOUND ON CLOUDINARY:', publicId);

        return false;
    } catch (error: unknown) {
        // Don't throw error as it could block the main code that started running before it
        if (error instanceof Error) {
            console.log('CLOUDINARY DELETE ERROR:', error.message);
        }
        else {
            console.log('CLOUDINARY DELETE ERROR:', error);
        }

        return false;
    }
};

export { cloudinaryUploader, cloudinaryDeleter };

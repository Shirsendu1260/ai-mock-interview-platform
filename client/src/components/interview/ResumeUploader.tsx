import { useRef } from 'react';
import { motion } from 'motion/react';
import { FaCloudArrowUp, FaFilePdf } from 'react-icons/fa6';
import type { ResumeUploaderProps } from '../../types/types.js';

const ResumeUploader = ({ resumePdfFile, setResumePdfFile, error, setErrors }: ResumeUploaderProps) => {
    // Reference to the hidden input element (file uploader)
    const pdfUploaderInputRef = useRef<HTMLInputElement>(null);

    // Function to set uploaded file to its dedicated state
    // React.ChangeEvent<HTMLInputElement> -> Event that triggers on an input TAG for an change event
    const handleFileUploadState = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = event.target.files?.[0];

        if(!selectedFile) return;

        // Clear previous resume pdf error
        setErrors(prev => ({ ...prev, resume: '' }));

        if (selectedFile.type !== 'application/pdf') {
            setErrors(prev => ({ ...prev, resume: 'Only PDF files are allowed.' }));
            return;
        }

        if (selectedFile.size > 6 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, resume: 'Maximum file size is 6 MB.' }));
            return;
        }

        setResumePdfFile(selectedFile);
        setErrors(prev => ({ ...prev, resume: '' }));
    };

    return (
        <div className='space-y-2'>
            <label className='font-medium text-dark mb-2 block'>
                Resume (PDF)
            </label>

            <motion.div
                whileHover={{ scale: 1.013456 }}
                className='cursor-pointer rounded-xl border-2 border-dashed border-border
                bg-background p-8 transition'

                // When this div is clicked, trigger click on the hidden file uploader input element too
                onClick={() => pdfUploaderInputRef.current?.click()}
            >
                {
                    resumePdfFile
                    ? (
                        <div className='flex items-center justify-between gap-4'>
                            {/* File details */}
                            <div className='flex items-center gap-4'>
                                <FaFilePdf size={36} className='text-red-500' />

                                <div>
                                    <p className='font-medium text-dark'>
                                        {resumePdfFile.name}
                                    </p>
                                    <p className='text-sm text-muted'>
                                        {(resumePdfFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>

                            {/* Remove button */}
                            <button
                                type='button'
                                className='rounded-xl border border-red-200 px-4 py-2 text-sm font-medium
                                text-red-500 transition hover:bg-red-50'
                                onClick={(event) => {
                                    // Prevent parent div click from reopening file picker
                                    event.stopPropagation();
                                    // Without it, user clicks Remove. Parent <motion.div> also receives the click.
                                    // File picker opens immediately, which is not desired.
                                    // stopPropagation() prevents the click from bubbling to the parent.

                                    setResumePdfFile(null);
                                    setErrors(prev => ({ ...prev, resume: '' }));

                                    // Reset hidden input so same file can be uploaded again
                                    if (pdfUploaderInputRef.current) {
                                        pdfUploaderInputRef.current.value = '';
                                    }
                                    // User uploads resume.pdf. Removes it.
                                    // Wants to upload the same resume.pdf again.
                                    // Browsers will not trigger onChange because technically the file didn't change.
                                    // pdfUploaderInputRef.current.value = '';
                                    // forces the browser to treat the next selection as a fresh upload.
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    )
                    : (
                        <div className='flex flex-col items-center gap-4 text-center'>
                            <FaCloudArrowUp size={36} className='text-accent' />

                            <div>
                                <p className='font-medium text-dark'>Upload your resume</p>
                                <p className='mt-1 text-sm text-muted'>PDF only</p>
                                <p className='mt-1 text-sm text-muted'>
                                    Upload a text-based PDF only (image/scanned PDFs are not supported).
                                </p>
                                <p className='mt-1 text-sm text-muted'>
                                    Your resume is never stored. It is processed temporarily for analysis and deleted immediately afterward.
                                </p>
                                <p className='mt-1 text-sm text-muted'>Max size 6 MB</p>
                            </div>
                        </div>
                    )
                }
            </motion.div>

            {
                error && (
                    <p className='mt-1 text-sm text-red-500'>{error}</p>
                )
            }

            <input
                type='file'
                accept='.pdf'
                className='hidden'
                ref={pdfUploaderInputRef}
                onChange={handleFileUploadState}
            />
        </div>
    );
};

export default ResumeUploader;

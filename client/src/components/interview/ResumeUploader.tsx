import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FaCloudArrowUp, FaFilePdf } from 'react-icons/fa6';

const ResumeUploader = () => {
    // State to store uploaded pdf file
    const [pdfFile, setPdfFile] = useState<File | null>(null); // pdfFile: File | null

    // Reference to the hidden input element (file uploader)
    const pdfUploaderInputRef = useRef<HTMLInputElement>(null);

    // Function to set uploaded file to its dedicated state
    // React.ChangeEvent<HTMLInputElement> -> Event that triggers on an input for an change event
    const handleFileUploadState = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = event.target.files?.[0];
        if(!selectedFile) return;
        setPdfFile(selectedFile);
    };

    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-dark'>
                Resume (PDF)
            </label>

            <motion.div
                whileHover={{ scale: 1.013456 }}
                className='cursor-pointer rounded-3xl border-2 border-dashed border-border
                bg-background p-8 transition'

                // When this div is clicked, trigger click on the hidden file uploader input element too
                onClick={() => pdfUploaderInputRef.current?.click()}
            >
                {
                    pdfFile
                    ? (
                        <div className='flex items-center gap-4'>
                            <FaFilePdf size={36} className='text-red-500' />

                            <div>
                                <p className='font-medium text-dark'>{pdfFile.name}</p>
                                <p className='text-sm text-muted'>
                                    {/*Convert to Bytes to MB*/}
                                    {(pdfFile.size / 1024 / 1024).toFixed(2)}
                                    {' '}MB
                                </p>
                            </div>
                        </div>
                    )
                    : (
                        <div className='flex flex-col items-center gap-4 text-center'>
                            <FaCloudArrowUp size={36} className='text-accent' />

                            <div>
                                <p className='font-medium text-dark'>Upload your resume</p>
                                <p className='mt-1 text-sm text-muted'>PDF only</p>
                                <p className='mt-1 text-sm text-muted'>Max size 5 MB</p>
                            </div>
                        </div>
                    )
                }
            </motion.div>

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

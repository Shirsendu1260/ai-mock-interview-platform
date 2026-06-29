import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Button from './Button.jsx';
import type { ConfirmationModalProps } from '../../types/types.js';

const ConfirmationModal = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    onConfirm
}: ConfirmationModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal>
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 
                                -translate-y-1/2 rounded-2xl border border-border bg-white p-6 
                                shadow-2xl outline-none"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                        <FaExclamationTriangle className="text-xl text-red-600" />
                                    </div>

                                    <div className="flex-1">
                                        <Dialog.Title className="text-lg font-semibold text-dark">
                                            {title}
                                        </Dialog.Title>
                                        <Dialog.Description className="mt-2 text-sm leading-6 text-muted">
                                            {description}
                                        </Dialog.Description>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3">
                                    <Dialog.Close asChild>
                                        <Button variant="ghost" type="button">
                                            {cancelText}
                                        </Button>
                                    </Dialog.Close>
                                    <Button type="button" isLoading={isLoading} onClick={onConfirm}>
                                        {confirmText}
                                    </Button>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
};

export default ConfirmationModal;

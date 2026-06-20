import toast from 'react-hot-toast';

const showSuccessToast = (msg: string): void => {
    toast.success(msg);
};

const showSuccessToastWithToastId = (msg: string, toastId: string): void => {
    toast.success(msg, { id: toastId });
};

const showErrorToast = (msg: string): void => {
    toast.error(msg);
};

const showErrorToastWithToastId = (msg: string, toastId: string): void => {
    toast.error(msg, { id: toastId });
};

const showLoadingToast = (msg: string) => {
    return toast.loading(msg);
};

const showLoadingToastWithToastId = (msg: string, toastId: string): void => {
    toast.loading(msg, { id: toastId });
};

export {
    showSuccessToast,
    showSuccessToastWithToastId,
    showErrorToast,
    showErrorToastWithToastId,
    showLoadingToast,
    showLoadingToastWithToastId
};

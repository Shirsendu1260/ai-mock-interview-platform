import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { TbTrashXFilled } from "react-icons/tb";
import ConfirmationModal from "../ui/ConfirmationModal.jsx";
import { useState } from "react";
import { showErrorToast, showLoadingToast, showSuccessToastWithToastId } from "../../utils/toast.js";
import { ApiError } from "../../utils/ApiError.js";
import { useNavigate } from "react-router-dom";
import { deleteAccountHandler } from "../../handlers/auth.handler.js";

const DangerZoneCard = () => {
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();


    const handleDeleteAccount = async () => {
        // Prevent duplicate requests
        if(isDeleting) return;

        const toastId = showLoadingToast('Deleting your account...');

        try {
            setIsDeleting(true);
            await deleteAccountHandler();
            showSuccessToastWithToastId('Account deleted successfully.', toastId);
            navigate(`/`);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to delete your account.');
            }
        }
        finally {
            setIsDeleting(false);
            setIsDeleteAccountModalOpen(false);
        }
    };


    return (
        <>
            <Card>
                <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>

                <p className="mt-3 text-muted">
                    Permanently delete your account, interview history and interview results.
                    This action cannot be undone.
                </p>

                <Button
                    variant="secondary"
                    className="mt-8 w-full"
                    disabled={isDeleting}
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                >
                    <TbTrashXFilled/>
                    Delete Account
                </Button>
            </Card>

            {/*Modal for deleting account*/}
            <ConfirmationModal
                open={isDeleteAccountModalOpen}
                onOpenChange={setIsDeleteAccountModalOpen}
                title='Delete your account?'
                description="This permanently deletes your account, interview history and interview results. This action cannot be undone."
                confirmText='Delete Account'
                cancelText='Cancel'
                isLoading={isDeleting}
                onConfirm={handleDeleteAccount}
            />
        </>
    );
};

export default DangerZoneCard;

import { useAuthStore } from "../stores/auth.store.js";
import { USER_PLANS } from "../constants/app.js";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import PlanCard from "../components/payment/PlanCard.jsx";
import type { PaidPlan } from "../types/types.js";
import { showErrorToastWithToastId, showLoadingToast, showSuccessToastWithToastId } from "../utils/toast.js";
import { ApiError } from "../utils/ApiError.js";
import { LAYOUT } from "../constants/design.js";
import { openRazorpayCheckout } from "../utils/razorpay.js";
import { useNavigate } from "react-router-dom";
import { createRazorpayPaymentOrderHandler, verifyRazorpayPaymentHandler } from "../handlers/payment.handler.js";
import { getAuthUser } from "../api/auth.api.js";
import { useState } from "react";

const PaymentPage = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setUser = useAuthStore((state) => state.setUser);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const navigate = useNavigate();

    const handlePurchase = async (plan: PaidPlan) => {
        const planStrFormatted = plan.charAt(0).toUpperCase() + plan.slice(1);
        console.log(planStrFormatted);
        const toastId = showLoadingToast(`Initializing payment for ${planStrFormatted} plan...`);

        if(!user) {
            showErrorToastWithToastId('You need to be authenticated to initiate this payment.', toastId);
            navigate('/auth');
            return;
        }

        if(isPaymentProcessing) {
            showErrorToastWithToastId('Payment is still processing.', toastId);
            return;
        }

        try {
            setIsPaymentProcessing(true);
            const response = await createRazorpayPaymentOrderHandler(plan);
            showSuccessToastWithToastId('Opening Razorpay...', toastId);

            // Open Razorpay checkout popup window
            await openRazorpayCheckout({
                orderId: response.data.razorpayOrderId,
                amount: response.data.amount,
                plan: response.data.plan,
                fullName: user.fullName,
                email: user.email,

                // paymentResponse is RazorpayPaymentSuccessResponse which is returned by Razorpay server
                // contains - razorpay_payment_id, razorpay_order_id, razorpay_signature
                onSuccess: async (paymentResponse) => {
                    // console.log(paymentResponse);

                    // Verify payment signature
                    await verifyRazorpayPaymentHandler(paymentResponse);

                    // Fetch authenticated user
                    const authUserResponse = await getAuthUser();

                    // update Zustand store to get latest user state
                    setUser(authUserResponse.data.data);

                    showSuccessToastWithToastId(`${planStrFormatted} plan purchased successfully.`, toastId);
                },

                onDismiss: () => {
                    showSuccessToastWithToastId('Razorpay checkout closed.', toastId);
                }
            });
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToastWithToastId(error.message, toastId);
                console.error(`Error ${error.statusCode}: ${error.message}`);
            }
            else {
                showErrorToastWithToastId(`Unable to initiate payment for ${planStrFormatted} plan.`, toastId);
                console.error(error);
            }
        }
        finally {
            setIsPaymentProcessing(false);
        }
    };

    return (
        <PageContainer>
            <div className={`mx-auto ${LAYOUT.maxWidth}`}>
                <SectionHeading
                    description="Choose a plan to purchase additional credits."
                >
                    Upgrade Plan
                </SectionHeading>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {
                        USER_PLANS.map((plan) => (
                            <PlanCard
                                key={plan}
                                plan={plan}
                                currentPlan={user?.plan ?? 'free'}
                                isPaymentProcessing={isPaymentProcessing}
                                isAuthenticated={isAuthenticated}
                                onClick={handlePurchase} // calls handlePurchase(plan) because of the same memory reference of onClick(plan) prop
                            />
                        ))
                    }
                </div>
            </div>
        </PageContainer>
    );
};

export default PaymentPage;

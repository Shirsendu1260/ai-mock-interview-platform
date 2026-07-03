import { APP_NAME } from '../constants/app.js';
import type { RazorpayOptions } from '../types/razorpay.js';
import type { IOpenCheckoutProps } from '../types/types.js';
import largeLogo from '../assets/large-logo.png';

const openRazorpayCheckout = ({
    orderId,
    amount,
    plan,
    fullName,
    email,
    onSuccess,
    onDismiss
}: IOpenCheckoutProps) => {
    // Checkout config options
    const options: RazorpayOptions = {
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID!,
        amount,
        currency: 'INR',
        name: APP_NAME,
        description: `${plan.toUpperCase()} Plan`,
        order_id: orderId,
        image: largeLogo,
        handler: (response) => onSuccess(response),
        prefill: {
            name: fullName,
            email
        },
        theme: {
            color: '#2B4C78'
        },
        modal: {
            ondismiss: () => onDismiss?.(), // ?.() tells TS that if function is availabble, then fire
            escape: false, // No close on ESC press
            backdropclose: false, // No close on outside click
            confirm_close: true, // ask before close
            animation: true
        }
    };

    // Create Razorpay instance
    const razorpay = new window.Razorpay(options);

    // Open checkout
    razorpay.open();
}

export { openRazorpayCheckout };

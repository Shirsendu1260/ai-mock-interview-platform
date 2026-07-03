import { APP_NAME } from '../constants/app.js';
import type { RazorpayOptions } from '../types/razorpay.js';
import type { IOpenCheckoutProps } from '../types/types.js';
import largeLogo from '../assets/large-logo.png';
import { ApiError } from './ApiError.js';


// Loads the Razorpay checkout script dynamically only when payment is needed
// Avoids downloading Razorpay on every page
// Returns promise and resolves to 'true' if the script is ready
const loadRazorpay = (): Promise<boolean> => {
    // If the script is already loaded, no need to load again
    if(window.Razorpay) {
        return Promise.resolve(true); // creates an already-solved promise // Promise<true>
        // return new Promise((resolve) => resolve(true));
    }

    // Else load script
    return new Promise((resolve) => {
        const script = document.createElement('script');

        // Razorpay checkout script
        // After this script is loaded in browser, a new global object appears - window.Razorpay
        // This opens the payment popup
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';

        // Add script to HTML body
        document.body.appendChild(script);

        // After appending in DOM, If the script is loaded successfuly, then fire this
        // onload can never happen before appending
        script.onload = () => resolve(true); // Promise<true>

        // If error occurred
        script.onerror = () => resolve(false); // Promise<false>
    });
}


const openRazorpayCheckout = async ({
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
            ondismiss: () => onDismiss?.(), // ?.() tells TS that if function is available, then fire
            escape: false, // No close on ESC press
            backdropclose: false, // No close on outside click
            confirm_close: true, // ask before close
            animation: true
        }
    };

    // Lazy load Razorpay script
    const isRazorpayScriptLoaded = await loadRazorpay(); // now window.Razorpay is available
    if(!isRazorpayScriptLoaded) {
        throw new ApiError(500, 'Unable to load Razorpay.');
    }

    // Create Razorpay instance
    const razorpay = new window.Razorpay(options);

    // Open checkout
    razorpay.open();
}

export { loadRazorpay, openRazorpayCheckout };

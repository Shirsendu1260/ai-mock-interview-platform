// This file adds Razorpay to the browser's global 'window' object
// Normally TS knows about: window.location, window.localStorage, window.fetch etc.
// But Razorpay Checkout is loaded from an external script
// After that script loads, it creates: window.Razorpay
// TS does NOT know that by default, so we let TS know about it here

// Object returned after: const razorpay = new window.Razorpay()
interface RazorpayInstance {
    // Opens the Razorpay payment popup
    open: () => void;
}

// Data returned by Razorpay after successful payment
interface RazorpayPaymentSuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// Settings passed when creating Razorpay checkout
interface RazorpayOptions {
    // API Key ID from Razorpay Dashboard
    key: string;

    // Amount in paise
    amount: number;

    // INR
    currency: string;

    // Product/company name
    name: string;

    // Small text shown below company name
    description: string;

    // Razorpay order ID received from backend
    order_id: string;

    // Path of the logo shown at the top of the Razorpay checkout popup
    image?: string;

    // Called automatically after successful payment
    handler: (response: RazorpayPaymentSuccessResponse) => void;

    // Optional information to prefill for user
    prefill?: {
        name?: string;
        email?: string;
    };

    // Theme color of checkout
    theme?: {
        color?: string;
    };

    // Called if user closes the payment popup
    modal?: {
        // Called when user closes the popup without paying
        ondismiss?: () => void;

        // Disable ESC key for closing popup
        escape?: boolean;

        // Disable clicking outside of the popup to close it
        backdropclose?: boolean;

        // Show confirmation dialog before closing
        confirm_close?: boolean;

        // Enable/disable animation
        animation?: boolean;
    }
}

// For - new Razorpay(options)
interface RazorpayConstructor {
    new (options: RazorpayOptions): RazorpayInstance;
}

// Tells TS that window.Razorpay exists globally
declare global {
    interface Window {
        // Constructor given by Razorpay checkout script named 'Razorpay'
        // Example: const razorpay = new window.Razorpay(options);
        Razorpay: RazorpayConstructor;
    }
}

export type {
    RazorpayInstance,
    RazorpayPaymentSuccessResponse,
    RazorpayOptions,
    RazorpayConstructor
}

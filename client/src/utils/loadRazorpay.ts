// Loads the Razorpay checkout script dynamically only when payment is needed
// Avoids downloading Razorpay on every page
// Returns promise and resolves to 'true' if the script is ready

export const loadRazorpay = (): Promise<boolean> => {
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

        // If loaded successfuly
        script.onload = () => {
            document.body.appendChild(script); // Add script to HTML body
            resolve(true);
        }; // Promise<true>

        // If error occurred
        script.onerror = () => resolve(false); // Promise<false>
    });
}

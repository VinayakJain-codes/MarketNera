/**
 * Dynamically loads the Razorpay Checkout script in the browser.
 * Returns a promise that resolves to true once the script is loaded successfully,
 * or false if it fails to load.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // If script is already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay checkout SDK.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

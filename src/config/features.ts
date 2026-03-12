/**
 * Feature flags — toggle features without editing core logic.
 * In production, these can be driven by environment variables or a flag service.
 */
const featureFlags = {
    /** Show the Sign In button in the Navbar */
    enableSignIn: true,
    /** Show the user avatar in the Navbar */
    showUserAvatar: true,
    /** Enable the "Watch Demo" video modal */
    enableDemoVideo: false,
    /** Show the pricing section on the home page */
    showPricing: false,
    /** Enable analytics tracking (e.g. Google Analytics) */
    enableAnalytics: false,
};

export default featureFlags;

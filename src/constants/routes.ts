/**
 * Application route path constants.
 * All internal navigation links must reference these values — never hardcode strings.
 */
export const ROUTES = {
    HOME: "/",
    FEATURES: "/#features",
    PRICING: "/#pricing",
    CATEGORIES: "/#categories",
    ABOUT: "/about",
    CAREERS: "/careers",
    SUCCESS_STORIES: "/success-stories",
    HELP_CENTER: "/help",
    API_DOCS: "/docs",
    PRIVACY: "/privacy",
    MARKETPLACE: "/marketplace",
    DELIVERY: "/delivery",
    REGISTER: "/register",
    SIGNUP_CUSTOMER: "/register/customer",
    LOGIN_CUSTOMER: "/login/customer",
    CUSTOMER_DASHBOARD: "/customer/dashboard",
    CUSTOMER_PROFILE: "/customer/profile",
    SIGNUP_SHOPKEEPER: "/register/shopkeeper",
    LOGIN_SHOPKEEPER: "/login/shopkeeper",
    SHOPKEEPER_DASHBOARD: "/shopkeeper/dashboard",
    SHOPKEEPER_SETUP: "/shopkeeper/setup",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

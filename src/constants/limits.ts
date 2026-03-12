/**
 * Numeric thresholds and limits used across the application.
 * Never use magic numbers directly in components.
 */
export const LIMITS = {
    /** Number of local shopkeepers on the platform (shown in CTA section) */
    SHOPKEEPER_COUNT: 5000,

    /** Maximum number of items visible in main nav */
    MAX_NAV_ITEMS: 5,

    /** Maximum number of category cards displayed on home page */
    MAX_HOME_CATEGORIES: 4,

    /** Maximum number of feature cards displayed in the features section */
    MAX_HOME_FEATURES: 3,

    /** Footer copyright start year */
    FOUNDING_YEAR: 2024,
} as const;

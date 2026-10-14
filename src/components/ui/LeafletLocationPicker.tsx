"use client";

import GoogleLocationPicker, { GoogleLocationPickerProps } from "./GoogleLocationPicker";

export type LeafletLocationPickerProps = GoogleLocationPickerProps;

/**
 * Drop-in Google Maps replacement for LeafletLocationPicker.
 * Renders the new Google Maps location picker with built-in rate limiting and caching.
 */
export default function LeafletLocationPicker(props: LeafletLocationPickerProps) {
    return <GoogleLocationPicker {...props} />;
}

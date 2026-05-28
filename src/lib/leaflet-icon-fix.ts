// lib/leaflet-icon-fix.ts
// Turbopack/Next.js: DO NOT call L.divIcon() at module level.
// Instead export a factory function that is called only inside the component (client-side).
import type L from "leaflet";

let _icon: ReturnType<typeof L.prototype.divIcon> | null = null;
let _fixed = false;

export function getLeafletIcon() {
    // Safe to import here — this function is only called client-side inside components
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    if (!_fixed) {
        // Next.js Leaflet fix: disable the default icon image path resolution
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        L.Icon.Default.mergeOptions({
            iconUrl: transparentPixel,
            iconRetinaUrl: transparentPixel,
            shadowUrl: transparentPixel,
        });
        _fixed = true;
    }

    if (_icon) return _icon;

    _icon = L.divIcon({
        className: "",
        html: `<div style="width:28px;height:40px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.35))"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.63 14 26 14 26S28 23.63 28 14C28 6.27 21.73 0 14 0z" fill="#6366f1"/><circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/></svg></div>`,
        iconSize: [28, 40],
        iconAnchor: [14, 40],
        popupAnchor: [0, -40],
    });

    return _icon;
}

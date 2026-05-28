// lib/leaflet-icon-fix.ts
// Turbopack/Next.js breaks Leaflet's PNG imports via leaflet/dist/images/*.
// Instead, we create a clean SVG-based divIcon so no image files are needed.
import L from "leaflet";

export const defaultLeafletIcon = L.divIcon({
    className: "",
    html: `
    <div style="
        width: 28px;
        height: 40px;
        position: relative;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
    ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
            <path d="M14 0C6.27 0 0 6.27 0 14c0 9.63 14 26 14 26S28 23.63 28 14C28 6.27 21.73 0 14 0z" fill="#6366f1"/>
            <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
        </svg>
    </div>
  `,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
});


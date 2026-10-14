"use client";

import dynamic from "next/dynamic";
import { Loader2, X } from "lucide-react";
import type { LocationDetails } from "./GoogleMapInner";

// Dynamic import with ssr: false for client-side map rendering
const GoogleMap = dynamic(() => import("./GoogleMapInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate-100 animate-pulse flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
            <p className="text-sm font-semibold text-slate-600">Loading Google Maps...</p>
        </div>
    ),
});

export interface GoogleLocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelected: (locationDetails: LocationDetails) => void;
    title?: string;
}

export default function GoogleLocationPicker({
    isOpen,
    onClose,
    onLocationSelected,
    title = "Search / Choose Location",
}: GoogleLocationPickerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <GoogleMap onLocationSelected={onLocationSelected} />
            </div>
        </div>
    );
}

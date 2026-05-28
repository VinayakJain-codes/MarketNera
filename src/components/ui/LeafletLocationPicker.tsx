"use client";

import dynamic from "next/dynamic";

// CRITICAL: must be dynamic with ssr: false
const LeafletMap = dynamic(() => import("./LeafletMapInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-slate-100 animate-pulse flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-emerald-500 animate-spin mb-2">sync</span>
            <p className="text-sm font-semibold text-slate-600">Loading Map...</p>
        </div>
    ),
});

interface LeafletLocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelected: (locationDetails: {
        addressLine: string;
        city: string;
        pincode: string;
        lat: number;
        lng: number;
    }) => void;
    title?: string;
}

export default function LeafletLocationPicker({
    isOpen,
    onClose,
    onLocationSelected,
    title = "Search / Choose Location"
}: LeafletLocationPickerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <LeafletMap onLocationSelected={onLocationSelected} />
            </div>
        </div>
    );
}

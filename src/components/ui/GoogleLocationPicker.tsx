"use client";

import dynamic from "next/dynamic";
import { Loader2, X, ArrowLeft } from "lucide-react";
import type { LocationDetails } from "./GoogleMapInner";

// Dynamic import with ssr: false for client-side map rendering
const GoogleMap = dynamic(() => import("./GoogleMapInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-9 h-9 text-emerald-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-800">Initializing Map...</p>
            <p className="text-xs text-slate-400 mt-1">Acquiring neighborhood coordinates</p>
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
    title = "Select Delivery Location",
}: GoogleLocationPickerProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 sm:bg-black/70 backdrop-blur-xs animate-fade-in sm:p-4">
            {/* Mobile full-screen / Desktop centered modal */}
            <div className="bg-white w-full h-[100dvh] sm:h-[88vh] sm:max-h-[750px] sm:max-w-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-white z-30 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 sm:hidden cursor-pointer -ml-1"
                            aria-label="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                                {title}
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium sm:hidden">
                                Move pin to your exact doorstep
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center text-slate-500 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Map & Form Body */}
                <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50">
                    <GoogleMap onLocationSelected={onLocationSelected} />
                </div>
            </div>
        </div>
    );
}

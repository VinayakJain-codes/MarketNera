import Image from "next/image";
import siteConfig from "@/config/site";

export default function Logo() {
    return (
        <div className="group flex items-center gap-3 cursor-pointer">
            {/* Logo Image with dynamic rotation and drop-shadow glow */}
            <div className="relative transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2 group-hover:drop-shadow-[0_0_15px_rgba(45,158,75,0.6)]">
                <Image
                    src="/logo.png"
                    alt={`${siteConfig.name} Logo`}
                    width={200}
                    height={200}
                    className="h-10 w-auto object-contain md:h-12"
                    priority
                />
            </div>
            
            {/* Text container with alignment and illumination */}
            <div className="relative flex items-center pb-0.5 mt-1">
                {/* Intense glowing background that expands and pulses on hover */}
                <span className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-0 blur-xl transition-all duration-700 ease-out group-hover:opacity-40 group-hover:scale-110 group-hover:animate-pulse"></span>
                
                {/* The Animated Text - Segmented Indian Flag Colors */}
                <span className="relative flex items-center text-xl font-black tracking-tight md:text-2xl transition-all duration-500 ease-out group-hover:tracking-[0.05em]">
                    <span className="text-[#FF9933]">Mark</span>
                    <span className="text-white [-webkit-text-stroke:0.5px_darkgray] [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">e</span>
                    <span className="text-[#138808]">tnera</span>
                </span>
            </div>
        </div>
    );
}

import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export default function Card({
    children,
    className = "",
    hover = true,
}: CardProps) {
    const base = "rounded-2xl border border-primary/10 bg-white p-8";
    const hoverClasses = hover
        ? "transition-all hover:shadow-xl"
        : "";

    return (
        <div className={`${base} ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
}

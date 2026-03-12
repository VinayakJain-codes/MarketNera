import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-slate-950 shadow-lg shadow-primary/20 hover:scale-105",
    secondary:
        "border-2 border-primary text-primary hover:bg-primary/5",
    ghost: "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-10 min-w-[100px] px-5 text-sm",
    md: "h-12 min-w-[140px] px-6 text-sm",
    lg: "h-14 min-w-[180px] px-8 text-base",
};

export default function Button({
    variant = "primary",
    size = "lg",
    href,
    onClick,
    children,
    className = "",
    type = "button",
    disabled = false,
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer";
    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} className={`${classes} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} disabled={disabled}>
            {children}
        </button>
    );
}

import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-rose-700 text-white shadow-sm hover:bg-rose-800 hover:shadow-md focus-visible:outline-rose-600",
  secondary: "border border-neutral-200 bg-white text-ink-900 hover:border-rose-200 hover:bg-rose-50 focus-visible:outline-rose-600",
  ghost: "text-ink-700 hover:bg-rose-50 hover:text-rose-800 focus-visible:outline-rose-600",
  danger: "bg-danger text-white hover:brightness-90 focus-visible:outline-danger",
};
const sizeClasses: Record<Size, string> = { sm: "min-h-9 rounded-lg px-3 py-2 text-xs", md: "min-h-11 rounded-lg px-4 py-2.5 text-sm", lg: "min-h-12 rounded-xl px-6 py-3.5 text-sm" };
const shared = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className = "", variant = "primary", size = "md", ...props }, ref) => <button ref={ref} className={`${shared} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props} />);
Button.displayName = "Button";
interface ButtonLinkProps { href: string; variant?: Variant; size?: Size; className?: string; children: React.ReactNode; }
export function ButtonLink({ href, variant = "primary", size = "md", className = "", children }: ButtonLinkProps) { return <Link href={href} className={`${shared} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>{children}</Link>; }

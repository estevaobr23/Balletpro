import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, hint, children }: FieldWrapperProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-ink-900">{label}</span>
      )}
      {children}
      {hint && !error && <span className="text-xs text-ink-500">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

const baseFieldClass =
  "min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-neutral-400 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 disabled:bg-neutral-50 disabled:opacity-50";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <input ref={ref} className={`${baseFieldClass} ${className}`} {...props} />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = "", children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <select ref={ref} className={`${baseFieldClass} bg-white ${className}`} {...props}>
        {children}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint}>
      <textarea ref={ref} className={`${baseFieldClass} ${className}`} {...props} />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

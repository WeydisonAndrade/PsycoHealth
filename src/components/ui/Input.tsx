import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <input id={inputId} className={`input ${error ? "input-error" : ""} ${className}`} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <textarea
        id={inputId}
        className={`input textarea ${error ? "input-error" : ""} ${className}`}
        {...props}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, error, id, options, className = "", ...props }: SelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <select id={inputId} className={`input select ${error ? "input-error" : ""} ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

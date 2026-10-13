import React from 'react';

// ===== Shared Tailwind classes =====
const labelClass = 'mb-1.5 block text-xs font-medium text-slate-700';
const inputBaseClass =
  'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';
const errorInputClass = 'border-red-300 focus:border-red-400 focus:ring-red-100';
const errorTextClass = 'mt-1 text-xs text-red-500';

// ===== TextInput =====
interface TextInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function TextInput({ label, value, onChange, placeholder, disabled, error, required }: TextInputProps) {
  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-red-400">*</span> : null}
        </label>
      ) : null}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputBaseClass} ${error ? errorInputClass : ''}`}
      />
      {error ? <p className={errorTextClass}>{error}</p> : null}
    </div>
  );
}

// ===== NumberInput =====
interface NumberInputProps {
  label?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function NumberInput({ label, value, onChange, placeholder, disabled, error, required }: NumberInputProps) {
  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-red-400">*</span> : null}
        </label>
      ) : null}
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? undefined : Number(v));
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={`${inputBaseClass} ${error ? errorInputClass : ''}`}
      />
      {error ? <p className={errorTextClass}>{error}</p> : null}
    </div>
  );
}

// ===== TextAreaInput =====
interface TextAreaInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function TextAreaInput({ label, value, onChange, placeholder, rows = 3, disabled, error, required }: TextAreaInputProps) {
  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-red-400">*</span> : null}
        </label>
      ) : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${inputBaseClass} resize-y`}
      />
      {error ? <p className={errorTextClass}>{error}</p> : null}
    </div>
  );
}

// ===== SelectInput =====
interface SelectInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function SelectInput({ label, value, onChange, options, placeholder, disabled, error, required }: SelectInputProps) {
  return (
    <div>
      {label ? (
        <label className={labelClass}>
          {label}
          {required ? <span className="ml-0.5 text-red-400">*</span> : null}
        </label>
      ) : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputBaseClass} appearance-none`}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? <p className={errorTextClass}>{error}</p> : null}
    </div>
  );
}

// ===== ToggleInput =====
interface ToggleInputProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  desc?: string;
}

export function ToggleInput({ label, value, onChange, disabled, desc }: ToggleInputProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        {label ? <p className="text-sm font-medium text-slate-700">{label}</p> : null}
        {desc ? <p className="text-xs text-slate-500">{desc}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50 ${
          value ? 'bg-slate-950' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            value ? 'translate-x-[18px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
    </div>
  );
}

// ===== RadioGroup =====
interface RadioGroupProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

export function RadioGroup({ label, value, onChange, options, disabled }: RadioGroupProps) {
  return (
    <div>
      {label ? <label className={labelClass}>{label}</label> : null}
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
              value === opt.value
                ? 'border-slate-950 bg-slate-950 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name={label}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ===== FormField (unified dispatcher) =====
interface FormFieldProps {
  type: 'text' | 'number' | 'textarea' | 'select' | 'boolean';
  label?: string;
  value: unknown;
  onChange: (value: unknown) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  rows?: number;
}

export function FormField({ type, label, value, onChange, options, placeholder, disabled, error, required, rows }: FormFieldProps) {
  switch (type) {
    case 'text':
      return (
        <TextInput
          label={label}
          value={String(value ?? '')}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          required={required}
        />
      );
    case 'number':
      return (
        <NumberInput
          label={label}
          value={value != null ? Number(value) : undefined}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          required={required}
        />
      );
    case 'textarea':
      return (
        <TextAreaInput
          label={label}
          value={String(value ?? '')}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows ?? 3}
          disabled={disabled}
          error={error}
          required={required}
        />
      );
    case 'select':
      return (
        <SelectInput
          label={label}
          value={String(value ?? '')}
          onChange={onChange}
          options={options ?? []}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          required={required}
        />
      );
    case 'boolean':
      return <ToggleInput label={label} value={Boolean(value)} onChange={onChange} disabled={disabled} />;
    default:
      return null;
  }
}

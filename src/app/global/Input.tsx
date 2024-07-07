"use client";

import { ChangeEvent, KeyboardEventHandler, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import cn from "@/lib/clsx";

interface InputProps {
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string;
  value?: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

interface OptionFieldProps {
  label: string;
  required?: boolean;
  options: { id: string; value: string }[];
  className?: string;
  value?: string | Array<string>;
  name: string;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

interface SelectFieldProps {
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  className?: string;
  value?: string | Array<string>;
  name: string;
  handleChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

interface TextFieldProps extends InputProps {
  type: "email" | "text" | "password" | "number" | string;
}

export function TextField({
  label,
  placeholder,
  className,
  name,
  required,
  type = "text",
  handleChange,
  value,
  onKeyDown,
  disabled,
}: Readonly<TextFieldProps>) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            `first-letter:capitalize ${required ? "after:text-red-500 after:content-['*']" : ""}`,
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {type == "password" && (
          <button
            className="absolute right-3 mt-4 flex items-center px-2 text-neutral-400 hover:text-neutral-500 transition-all"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
        <input
          type={showPassword ? "text" : type}
          name={name}
          defaultValue={value}
          placeholder={placeholder}
          onChange={handleChange}
          id={name}
          className="w-full rounded-full border border-neutral-400 px-[18px] active:border-black hover:border-black py-[14px] text-black placeholder-neutral-500 focus:outline-none transition-all duration-500"
          required={required}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function TextArea({
  label,
  placeholder,
  className,
  required,
  name,
  value,
  disabled,
}: Readonly<InputProps>) {
  return (
    <div className={"flex flex-col gap-2 " + className}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            `first-letter:capitalize ${required ? "after:text-red-500 after:content-['*']" : ""}`,
          )}
        >
          {label}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={value}
        id={name}
        className="h-[144px] rounded-2xl border border-neutral-400 px-[18px] focus:border-black hover:border-black py-[14px] text-black placeholder-neutral-400 focus:outline-none transition-all duration-500"
        disabled={disabled}
      />
    </div>
  );
}

export function SelectField({
  label,
  options,
  className,
  required,
  value,
  name,
  handleChange,
  disabled,
}: Readonly<SelectFieldProps>) {
  return (
    <div className={"flex flex-col gap-2 " + className}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            `first-letter:capitalize ${required ? "after:text-red-500 after:content-['*']" : ""}`,
          )}
        >
          {label}
        </label>
      )}
      <select
        name={name}
        defaultValue={value}
        className="rounded-xl border border-neutral-400 px-[18px] active:border-black hover:border-black py-[14px] text-black placeholder-neutral-400 focus:outline-none transition-all duration-500"
        id={name}
        required={required}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="" disabled hidden>
          Pilih
        </option>
        {options &&
          options.map((option, index) => (
            <option value={option.value} key={index}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export function RadioField({
  label,
  options,
  className,
  required,
  value,
  name,
  disabled,
}: Readonly<OptionFieldProps>) {
  return (
    <div className={cn("flex flex-col gap-2 " + className)}>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            `first-letter:capitalize ${required ? "after:text-red-500 after:content-['*']" : ""}`,
          )}
        >
          {label}
        </label>
      )}
      {options &&
        options.map((option) => (
          <div className="flex gap-x-4 cursor-pointer" key={option.id}>
            <input
              type="radio"
              name={name}
              defaultChecked={option.value === value}
              value={option.value}
              className="w-5 h-5 cursor-pointer accent-primary-500 shrink-0 mt-0.5 border-gray-200 rounded-full text-primary-500 disabled:opacity-50 disabled:pointer-events-none transition-all ease-linear"
              id={option.id}
              required={required}
              disabled={disabled}
            />
            <label htmlFor={option.id} className="cursor-pointer text-sm ms-2">
              {option.value}
            </label>
          </div>
        ))}
    </div>
  );
}

export function CheckboxField({
  label,
  options,
  className,
  required,
  value,
  name,
  disabled,
}: Readonly<OptionFieldProps>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={label}
          className={cn(
            `first-letter:capitalize ${required ? "after:text-red-500 after:content-['*']" : ""}`,
          )}
        >
          {label}
        </label>
      )}
      {options &&
        options.map((option) => (
          <div className="flex gap-x-4 cursor-pointer" key={option.id}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={value?.includes(option.value)}
              className="w-4 h-4 cursor-pointer bg-white text-primary-500 accent-primary-500 shrink-0 mt-0.5 border-gray-200 rounded focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none transition-all"
              id={option.id}
              data-required={required}
              disabled={disabled}
            />
            <label htmlFor={option.id} className="cursor-pointer text-sm ms-2">
              {option.value}
            </label>
          </div>
        ))}
    </div>
  );
}

import React from "react";
import { EyeIcon, EyeOffIcon } from "./icons";

export const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showToggle,
  showPassword,
  onToggle,
}) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="mb-[6px] block text-left text-[14px] font-bold text-slate-900"
    >
      {label}
    </label>

    <div className="relative">
      <input
        id={id}
        type={showToggle ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          block
          box-border
          h-[40px]
          w-full
          rounded-[14px]
          border-[1.5px]
          bg-white
          px-4
          pr-[44px]
          text-[15px]
          leading-none
          text-left
          text-slate-800
          outline-none
          appearance-none
          transition-all
          duration-200
          ${error ? "border-red-500" : "border-slate-200 focus:border-blue-500"}
        `}
      />

      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Toggle visibility"
          className="
            absolute
            top-1/2
            right-[14px]
            flex
            -translate-y-1/2
            items-center
            justify-center
            bg-transparent
            p-0
            text-slate-400
            cursor-pointer
          "
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>

    {error && (
      <p className="mt-[5px] text-left text-[12px] text-red-500">{error}</p>
    )}
  </div>
);

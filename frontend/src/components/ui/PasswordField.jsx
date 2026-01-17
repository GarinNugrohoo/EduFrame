// src/components/ui/PasswordField.jsx
import React from "react";
import PropTypes from "prop-types";
import { LockIcon, EyeIcon, EyeSlashIcon } from "../icons/IkonWrapper";

const PasswordField = ({
  value,
  onChange,
  onBlur,
  showPassword,
  onToggleShowPassword,
  error,
  placeholder,
  className = "",
  ...props
}) => {
  return (
    <div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <LockIcon className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur && onBlur(e.target.value)}
          className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl outline-none transition-all text-base ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          } ${className}`}
          placeholder={placeholder}
          {...props}
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};

PasswordField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  showPassword: PropTypes.bool.isRequired,
  onToggleShowPassword: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default PasswordField;

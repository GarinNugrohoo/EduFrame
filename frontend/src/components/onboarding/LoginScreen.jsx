// src/components/onboarding/LoginScreen.jsx
import React, { useState, useEffect } from "react";
import logo from "../../assets/EduFrame.png";
import PropTypes from "prop-types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
} from "../icons/IkonWrapper";
import FloatingElements from "./FloatingElements";

const LoginScreen = ({
  formData,
  errors,
  apiError,
  rememberMe,
  isSubmitting,
  onBack,
  onSwitchToRegister,
  onFormChange,
  onRememberMeChange,
  onValidate,
  onSubmit,
  loginSuccessMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccessMessage) {
      setLocalSuccessMessage(loginSuccessMessage);
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loginSuccessMessage]);

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  const handleBlur = (field, value) => {
    onValidate(field, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <FloatingElements />

      {/* Back Button - Mobile Adjusted */}
      <button
        onClick={onBack}
        className="absolute top-4 md:top-6 left-4 md:left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
      >
        <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm md:text-base font-medium hidden md:inline">
          Kembali
        </span>
      </button>

      <div className="w-full max-w-md md:max-w-lg lg:max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl border border-gray-200/50 p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-100 to-rose-200 rounded-2xl md:rounded-3xl shadow-md md:shadow-lg mb-4 md:mb-6">
              <img src={logo} className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              Selamat Datang Kembali
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Masuk untuk melanjutkan pembelajaran Anda
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && localSuccessMessage && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-700 font-medium">
                      {localSuccessMessage}
                    </p>
                    <div className="w-full h-1 mt-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 animate-progress"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Error Message */}
          {apiError && (
            <div className="mb-6 animate-fade-in">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                  </div>
                  <p className="text-red-700 font-medium">{apiError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 md:py-3.5 border ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                  } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                  placeholder="nama@email.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 md:py-3.5 border ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                  } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                  placeholder="Masukkan password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => onRememberMeChange(e.target.checked)}
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-red-600 border-red-600"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isSubmitting ? "opacity-50" : ""}`}
                  >
                    {rememberMe && (
                      <CheckIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm md:text-base text-gray-700 select-none">
                  Ingat saya
                </span>
              </label>
              <button
                type="button"
                className="text-sm md:text-base text-red-600 hover:text-red-700 font-medium transition-colors text-left sm:text-right disabled:opacity-50"
                disabled={isSubmitting}
              >
                Lupa password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 md:py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl md:rounded-2xl font-semibold text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group ${
                isSubmitting
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 md:mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm md:text-base">
              Belum punya akun?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-red-600 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info - Desktop Only */}
        <div className="hidden md:block mt-6 text-center">
          <p className="text-xs text-gray-500">
            Dengan masuk, Anda menyetujui Syarat & Ketentuan kami
          </p>
        </div>
      </div>
    </div>
  );
};

LoginScreen.propTypes = {
  formData: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object,
  apiError: PropTypes.string,
  loginSuccessMessage: PropTypes.string,
  rememberMe: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onSwitchToRegister: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onRememberMeChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

LoginScreen.defaultProps = {
  apiError: "",
  loginSuccessMessage: "",
  isSubmitting: false,
};

export default LoginScreen;

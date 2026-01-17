// src/components/onboarding/RegisterScreen.jsx
import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
  GraduationIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  UserIcon,
  EnvelopeIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  KeyIcon,
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  BriefcaseIcon,
} from "../icons/IkonWrapper";
import FloatingElements from "./FloatingElements";

const RegisterScreen = ({
  formData,
  errors,
  onBack,
  onSwitchToLogin,
  onFormChange,
  onValidate,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (field, value) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleBlur = (field, value) => {
    onValidate(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Anda harus menyetujui Syarat & Ketentuan");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const length = formData.password.length;
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    let score = 0;
    if (length >= 8) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChar) score++;

    if (length === 0)
      return {
        text: "Masukkan password",
        width: "0%",
        color: "bg-gray-300",
        level: 0,
      };
    if (score <= 2)
      return { text: "Lemah", width: "33%", color: "bg-red-500", level: 1 };
    if (score <= 3)
      return { text: "Sedang", width: "66%", color: "bg-yellow-500", level: 2 };
    return { text: "Kuat", width: "100%", color: "bg-green-500", level: 3 };
  }, [formData.password]);

  const benefits = [
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: "Materi Lengkap",
      description: "Akses ribuan materi dari berbagai bidang",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Komunitas Aktif",
      description: "Diskusi dengan pelajar dan mentor",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Track Progress",
      description: "Pantau perkembangan belajar Anda",
    },
    {
      icon: <BriefcaseIcon className="w-6 h-6" />,
      title: "Persiapan Karir",
      description: "Kembangkan skill yang dibutuhkan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 md:p-6 lg:p-8 relative overflow-hidden">
      <FloatingElements />

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 md:top-6 left-4 md:left-6 lg:left-8 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
      >
        <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm md:text-base font-medium hidden md:inline">
          Kembali
        </span>
      </button>

      <div className="w-full max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Benefits & Stats */}
          <div className="lg:w-2/5 xl:w-2/5">
            <div className="h-full flex flex-col">
              {/* Logo & Brand */}
              <div className="mb-6 lg:mb-8">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl md:rounded-3xl shadow-lg flex items-center justify-center">
                    <GraduationIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      EduFrame
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                      Platform Pembelajaran Digital
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    Kenapa Bergabung?
                  </h2>
                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl flex items-center justify-center">
                          <div className="text-red-600">{benefit.icon}</div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-auto">
                <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-6">
                    Bergabung dengan Komunitas
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold">10K+</div>
                      <div className="text-sm opacity-90">Pengguna</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold">500+</div>
                      <div className="text-sm opacity-90">Materi</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold">98%</div>
                      <div className="text-sm opacity-90">Kepuasan</div>
                    </div>
                  </div>
                  <p className="mt-6 text-sm opacity-90 text-center">
                    Mulai perjalanan belajar Anda bersama kami
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-3/5 xl:w-3/5">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-200/50 p-6 md:p-8 lg:p-10">
              {/* Header */}
              <div className="mb-8 lg:mb-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Buat Akun Baru
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Isi formulir di bawah ini untuk mulai belajar
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        onBlur={(e) => handleBlur("name", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3.5 border ${
                          errors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        onBlur={(e) => handleBlur("email", e.target.value)}
                        className={`w-full pl-10 pr-4 py-3.5 border ${
                          errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="nama@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password & Confirm Password Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className={`w-full pl-10 pr-12 py-3.5 border ${
                          errors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="Minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Kekuatan Password:
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              passwordStrength.level === 1
                                ? "text-red-600"
                                : passwordStrength.level === 2
                                ? "text-yellow-600"
                                : passwordStrength.level === 3
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur("confirmPassword", e.target.value)
                        }
                        className={`w-full pl-10 pr-12 py-3.5 border ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="Ulangi password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4 md:p-5">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Persyaratan Password:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        formData.password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          formData.password.length >= 8
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>8+ karakter</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        /[A-Z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /[A-Z]/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Huruf besar</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        /[a-z]/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /[a-z]/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Huruf kecil</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        /\d/.test(formData.password)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          /\d/.test(formData.password)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Angka</span>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                          agreeTerms
                            ? "bg-red-600 border-red-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {agreeTerms && (
                          <CheckIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      Saya setuju dengan{" "}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-medium underline"
                      >
                        Syarat & Ketentuan
                      </button>{" "}
                      dan{" "}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-medium underline"
                      >
                        Kebijakan Privasi
                      </button>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreeTerms}
                    className={`w-full py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group ${
                      isSubmitting || !agreeTerms
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
                        <KeyIcon className="w-6 h-6" />
                        <span>Daftar Sekarang</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-base">
                  Sudah punya akun?{" "}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

RegisterScreen.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RegisterScreen;

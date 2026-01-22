import React, { useState, useMemo } from "react";
import logo from "../../assets/EduFrame.png";
import PropTypes from "prop-types";
import {
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
import authService from "../../api/auth";

const RegisterScreen = ({
  onBack,
  onSwitchToLogin,
  onRegisterSuccess,
  onTermsClick,
  onPrivacyClick,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) error = "Username diperlukan";
        else if (value.length < 3) error = "Username minimal 3 karakter";
        break;

      case "email":
        if (!value.trim()) error = "Email diperlukan";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Format email tidak valid";
        }
        break;

      case "password":
        if (!value) error = "Password diperlukan";
        else if (value.length < 8) error = "Password minimal 8 karakter";
        break;

      case "confirmPassword":
        if (!value) error = "Konfirmasi password diperlukan";
        else if (value !== formData.password) error = "Password tidak cocok";
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setApiError("");

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    ["username", "email", "password", "confirmPassword"].forEach((key) => {
      newTouched[key] = true;
      newErrors[key] = validateField(key, formData[key]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateAll()) {
      return;
    }

    if (!agreeTerms) {
      setApiError("Anda harus menyetujui Syarat & Ketentuan");
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const result = await authService.register(userData);

      if (result.success) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        setTouched({});
        setSuccessMessage("Registrasi berhasil! Silakan login.");
        setAgreeTerms(false);

        if (onRegisterSuccess) {
          onRegisterSuccess(result.data);
        }

        setTimeout(() => {
          if (onSwitchToLogin) {
            onSwitchToLogin();
          }
        }, 3000);
      } else {
        setApiError(result.message);

        if (result.errors) {
          setErrors((prev) => ({ ...prev, ...result.errors }));
        }
      }
    } catch (error) {
      setApiError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const length = formData.password.length;
    if (length === 0)
      return { text: "", width: "0%", color: "bg-gray-300", level: 0 };
    if (length < 8)
      return { text: "Lemah", width: "33%", color: "bg-red-500", level: 1 };
    if (length < 12)
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

      <button
        onClick={onBack}
        className="absolute top-4 md:top-6 left-4 md:left-6 lg:left-8 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 group "
      >
        <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm md:text-base font-medium hidden md:inline">
          Kembali
        </span>
      </button>

      <div className="w-full max-w-6xl relative z-10 mt-15">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5">
          <div className="lg:w-3/5 xl:w-3/5">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-200/50 p-10 md:p-10 lg:p-10">
              <div className="mb-8 lg:mb-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Buat Akun Baru
                </h2>
                <p className="text-gray-600 text-base md:text-lg">
                  Isi formulir di bawah ini untuk mulai belajar
                </p>
              </div>

              {successMessage && (
                <div className="mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-green-700 font-medium">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="mb-6">
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      onBlur={() => handleBlur("username")}
                      className={`w-full pl-10 pr-4 py-3.5 border ${
                        touched.username && errors.username
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                      } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                      placeholder="Masukkan username"
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.username && errors.username && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>

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
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full pl-10 pr-4 py-3.5 border ${
                        touched.email && errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                      } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                      placeholder="nama@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          handleChange("password", e.target.value)
                        }
                        onBlur={() => handleBlur("password")}
                        className={`w-full pl-10 pr-12 py-3.5 border ${
                          touched.password && errors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="Minimal 8 karakter"
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
                    </div>

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
                    {touched.password && errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

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
                          handleChange("confirmPassword", e.target.value)
                        }
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`w-full pl-10 pr-12 py-3.5 border ${
                          touched.confirmPassword && errors.confirmPassword
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-red-500 focus:ring-red-500"
                        } rounded-xl focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200 text-base`}
                        placeholder="Ulangi password"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

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

                <div className="pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-1 flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        disabled={isSubmitting}
                      />
                      <div
                        className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${
                          agreeTerms
                            ? "bg-red-600 border-red-600"
                            : "border-gray-300 hover:border-gray-400"
                        } ${isSubmitting ? "opacity-50" : ""}`}
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
                        className="text-red-600 hover:text-red-700 font-medium"
                        onClick={onTermsClick}
                      >
                        Syarat & Ketentuan
                      </button>{" "}
                      dan{" "}
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-700 font-medium"
                        onClick={onPrivacyClick}
                      >
                        Kebijakan Privasi
                      </button>
                    </span>
                  </label>
                </div>

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

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-base">
                  Sudah punya akun?{" "}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-red-600 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
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
  onBack: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  onRegisterSuccess: PropTypes.func,
  onTermsClick: PropTypes.func,
  onPrivacyClick: PropTypes.func,
};

RegisterScreen.defaultProps = {
  onRegisterSuccess: () => {},
  onTermsClick: () => {},
  onPrivacyClick: () => {},
};

export default RegisterScreen;

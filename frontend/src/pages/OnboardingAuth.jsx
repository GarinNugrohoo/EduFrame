// src/pages/OnboardingAuth.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import WelcomeScreen from "../components/onboarding/WelcomeScreen";
import LoginScreen from "../components/onboarding/LoginScreen";
import RegisterScreen from "../components/onboarding/RegisterScreen";
import OnboardingSlides from "../components/onboarding/OnboardingSlides";
import TermsConditions from "../components/onboarding/TermsConditions";
import PrivacyPolicy from "../components/onboarding/PrivacyPolicy";
import auth from "../api/auth";

const OnboardingAuth = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

  // Login state
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginApiError, setLoginApiError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [registerApiError, setRegisterApiError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Navigate functions
  const handleNextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/onboarding/welcome");
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkipSlides = () => {
    navigate("/onboarding/welcome");
  };

  const handleBackToWelcome = () => {
    navigate("/onboarding/welcome");
  };

  const handleGoToLogin = () => {
    navigate("/onboarding/login");
    setLoginApiError("");
  };

  const handleGoToRegister = () => {
    navigate("/onboarding/register");
    setRegisterApiError("");
  };

  const handleGoToTerms = () => {
    navigate("/onboarding/terms");
  };

  const handleGoToPrivacy = () => {
    navigate("/onboarding/privacy");
  };

  // Form validation for login
  const validateLogin = (field, value) => {
    let error = "";
    switch (field) {
      case "email":
        if (!value.trim()) error = "Email tidak boleh kosong";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Format email tidak valid";
        break;
      case "password":
        if (!value) error = "Password tidak boleh kosong";
        break;
    }
    setLoginErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  // Form validation for register
  const validateRegister = (field, value) => {
    let error = "";
    switch (field) {
      case "username":
        if (!value.trim()) error = "Username tidak boleh kosong";
        else if (value.length < 3) error = "Username minimal 3 karakter";
        break;
      case "email":
        if (!value.trim()) error = "Email tidak boleh kosong";
        else if (!/\S+@\S+\.\S+/.test(value))
          error = "Format email tidak valid";
        break;
      case "password":
        if (!value) error = "Password tidak boleh kosong";
        else if (value.length < 8) error = "Password minimal 8 karakter";
        break;
      case "confirmPassword":
        if (value !== registerFormData.password) error = "Password tidak cocok";
        break;
    }
    setRegisterErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginApiError("");
    setLoginSuccessMessage("");
    // Validasi form
    const emailValid = validateLogin("email", loginFormData.email);
    const passwordValid = validateLogin("password", loginFormData.password);

    if (!emailValid || !passwordValid) {
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await auth.login({
        email: loginFormData.email,
        password: loginFormData.password,
      });

      if (result.success) {
        setLoginSuccessMessage(
          "Login berhasil! Mengalihkan ke halaman utama..."
        );

        window.dispatchEvent(new Event("authChange"));
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 3000);
      } else {
        setLoginApiError(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginApiError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Register Submit dengan API
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterApiError("");

    const usernameValid = validateRegister(
      "username",
      registerFormData.username
    );
    const emailValid = validateRegister("email", registerFormData.email);
    const passwordValid = validateRegister(
      "password",
      registerFormData.password
    );
    const confirmValid = validateRegister(
      "confirmPassword",
      registerFormData.confirmPassword
    );

    if (!usernameValid || !emailValid || !passwordValid || !confirmValid) {
      return;
    }

    if (!agreeTerms) {
      setRegisterApiError("Anda harus menyetujui Syarat & Ketentuan");
      return;
    }

    setIsRegistering(true);

    try {
      const result = await auth.register({
        username: registerFormData.username,
        email: registerFormData.email,
        password: registerFormData.password,
      });

      if (result.success) {
        console.log("Registration successful:", result.data);

        setRegisterFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setRegisterErrors({});
        setAgreeTerms(false);

        navigate("/onboarding/login", {
          state: {
            successMessage:
              "Registrasi berhasil! Silakan login dengan akun Anda.",
          },
        });
      } else {
        setRegisterApiError(result.message);

        if (result.errors) {
          setRegisterErrors((prev) => ({ ...prev, ...result.errors }));
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterApiError(
        "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Routes>
      {/* Default redirect to slides */}
      <Route path="/" element={<Navigate to="slides" replace />} />

      {/* Onboarding slides */}
      <Route
        path="slides"
        element={
          <OnboardingSlides
            currentSlide={currentSlide}
            onNext={handleNextSlide}
            onPrevious={handlePreviousSlide}
            onSkip={handleSkipSlides}
          />
        }
      />

      {/* Welcome screen */}
      <Route
        path="welcome"
        element={
          <WelcomeScreen
            onLogin={handleGoToLogin}
            onRegister={handleGoToRegister}
          />
        }
      />

      {/* Login screen */}
      <Route
        path="login"
        element={
          <LoginScreen
            formData={loginFormData}
            errors={loginErrors}
            apiError={loginApiError}
            loginSuccessMessage={loginSuccessMessage}
            rememberMe={rememberMe}
            isSubmitting={isLoggingIn}
            onBack={handleBackToWelcome}
            onSwitchToRegister={handleGoToRegister}
            onFormChange={setLoginFormData}
            onRememberMeChange={setRememberMe}
            onValidate={validateLogin}
            onSubmit={handleLoginSubmit}
            onTermsClick={handleGoToTerms}
            onPrivacyClick={handleGoToPrivacy}
          />
        }
      />

      {/* Register screen */}
      <Route
        path="register"
        element={
          <RegisterScreen
            formData={registerFormData}
            errors={registerErrors}
            apiError={registerApiError}
            isSubmitting={isRegistering}
            agreeTerms={agreeTerms}
            onBack={handleBackToWelcome}
            onSwitchToLogin={handleGoToLogin}
            onFormChange={setRegisterFormData}
            onAgreeTermsChange={setAgreeTerms}
            onValidate={validateRegister}
            onSubmit={handleRegisterSubmit}
            onTermsClick={handleGoToTerms}
            onPrivacyClick={handleGoToPrivacy}
          />
        }
      />

      {/* Terms & Conditions */}
      <Route
        path="terms"
        element={<TermsConditions onBack={() => navigate(-1)} />}
      />

      {/* Privacy Policy */}
      <Route
        path="privacy"
        element={<PrivacyPolicy onBack={() => navigate(-1)} />}
      />

      {/* Redirect unknown routes to slides */}
      <Route path="*" element={<Navigate to="slides" replace />} />
    </Routes>
  );
};

export default OnboardingAuth;

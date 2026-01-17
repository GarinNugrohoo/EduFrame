import React, { useState } from "react";
import WelcomeScreen from "../components/onboarding/WelcomeScreen";
import LoginScreen from "../components/onboarding/LoginScreen";
import RegisterScreen from "../components/onboarding/RegisterScreen";
import OnboardingSlides from "../components/onboarding/OnboardingSlides";

const OnboardingAuth = () => {
  const [mode, setMode] = useState("slides"); // slides, welcome, login, register
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Navigate to different modes
  const handleNextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setMode("welcome");
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkipSlides = () => {
    setMode("welcome");
  };

  // Form validation
  const validate = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) error = "Nama tidak boleh kosong";
        else if (value.length < 3) error = "Nama minimal 3 karakter";
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
        if (value !== formData.password) error = "Password tidak cocok";
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      const emailValid = validate("email", formData.email);
      const passwordValid = validate("password", formData.password);
      if (emailValid && passwordValid) {
        console.log("Login:", {
          email: formData.email,
          password: formData.password,
        });
        // Handle login logic
      }
    } else if (mode === "register") {
      const nameValid = validate("name", formData.name);
      const emailValid = validate("email", formData.email);
      const passwordValid = validate("password", formData.password);
      const confirmValid = validate(
        "confirmPassword",
        formData.confirmPassword
      );
      if (nameValid && emailValid && passwordValid && confirmValid) {
        console.log("Register:", formData);
        // Handle register logic
      }
    }
  };

  // Render based on mode
  switch (mode) {
    case "slides":
      return (
        <OnboardingSlides
          currentSlide={currentSlide}
          onNext={handleNextSlide}
          onPrevious={handlePreviousSlide}
          onSkip={handleSkipSlides}
        />
      );
    case "welcome":
      return (
        <WelcomeScreen
          onLogin={() => setMode("login")}
          onRegister={() => setMode("register")}
        />
      );
    case "login":
      return (
        <LoginScreen
          formData={formData}
          errors={errors}
          rememberMe={rememberMe}
          onBack={() => setMode("welcome")}
          onSwitchToRegister={() => setMode("register")}
          onFormChange={setFormData}
          onRememberMeChange={setRememberMe}
          onValidate={validate}
          onSubmit={handleSubmit}
        />
      );
    case "register":
      return (
        <RegisterScreen
          formData={formData}
          errors={errors}
          onBack={() => setMode("welcome")}
          onSwitchToLogin={() => setMode("login")}
          onFormChange={setFormData}
          onValidate={validate}
          onSubmit={handleSubmit}
        />
      );
    default:
      return <OnboardingSlides />;
  }
};

export default OnboardingAuth;

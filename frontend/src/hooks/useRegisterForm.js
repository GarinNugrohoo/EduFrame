import { useState } from "react";

const useRegisterForm = (initialState = {}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    ...initialState,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
        else if (!/[A-Z]/.test(value)) error = "Harus mengandung huruf besar";
        else if (!/[a-z]/.test(value)) error = "Harus mengandung huruf kecil";
        else if (!/\d/.test(value)) error = "Harus mengandung angka";
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

    // Validasi realtime jika field sudah disentuh
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

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      newErrors[key] = validateField(key, formData[key]);
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setFormData,
  };
};

export default useRegisterForm;

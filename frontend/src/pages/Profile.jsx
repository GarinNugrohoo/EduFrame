import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/EduFrameLoading.png";
import {
  UserIcon,
  EnvelopeIcon,
  LockIcon,
  CalendarIcon,
  EyeIcon,
  EyeSlashIcon,
  SignOutAltIcon,
} from "../components/icons/IkonWrapper";
import { ConfirmModal } from "../components/sections/ConfirmModal";
import { ProfileSection } from "../components/sections/ProfileSection";
import { DangerButton } from "../components/sections/DangerButton";
import { formatProfileDate } from "../utils/dateFormatter";
import auth from "../api/auth";

const Profile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    joinDate: "",
    status: "active",
  });

  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [modal, setModal] = useState({ show: false, type: "" });
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const name = user.username || user.email.split("@")[0];
          const email = user.email || "";
          let joinDate = "15 Jan 2026";

          if (user.created_at) {
            joinDate = formatProfileDate(user.created_at);
          } else if (user.createdAt) {
            joinDate = formatProfileDate(user.createdAt);
          } else if (user.loginTimestamp) {
            joinDate = formatProfileDate(user.loginTimestamp);
          }

          setUserData({
            name: name,
            email: email,
            joinDate: joinDate,
            status: "active",
          });

          setFormData({
            name: name,
            email: email,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          navigate("/onboarding/login");
        }
      } catch (error) {
        navigate("/onboarding/login");
      }
    };

    loadUserData();
  }, [navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(
    (type) => {
      setValidationError("");

      switch (type) {
        case "name":
          if (!formData.name.trim()) {
            setValidationError("Nama tidak boleh kosong");
            return;
          }
          setUserData((prev) => ({ ...prev, name: formData.name }));

          const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
          updatedUser.username = formData.name;
          localStorage.setItem("user", JSON.stringify(updatedUser));

          setEditMode(null);
          alert("Nama berhasil diubah!");
          break;

        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!formData.email.trim()) {
            setValidationError("Email tidak boleh kosong");
            return;
          }
          if (!emailRegex.test(formData.email)) {
            setValidationError("Format email tidak valid");
            return;
          }
          setUserData((prev) => ({ ...prev, email: formData.email }));

          const updatedUserEmail = JSON.parse(
            localStorage.getItem("user") || "{}",
          );
          updatedUserEmail.email = formData.email;
          localStorage.setItem("user", JSON.stringify(updatedUserEmail));

          setEditMode(null);
          alert("Email berhasil diubah!");
          break;

        case "password":
          if (!formData.currentPassword) {
            setValidationError("Password saat ini harus diisi");
            return;
          }
          if (formData.newPassword.length < 8) {
            setValidationError("Password baru minimal 8 karakter");
            return;
          }
          if (formData.newPassword !== formData.confirmPassword) {
            setValidationError("Konfirmasi password tidak cocok");
            return;
          }
          setFormData((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
          setEditMode(null);
          alert("Password berhasil diubah!");
          break;
      }
    },
    [formData],
  );

  const handleCancel = useCallback(() => {
    setValidationError("");
    setFormData({
      name: userData.name,
      email: userData.email,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
    setEditMode(null);
  }, [userData]);

  const handleLogout = useCallback(async () => {
    try {
      await auth.logout();
    } catch (error) {
      auth.logoutImmediately();
    }
    setModal({ show: false, type: "" });
  }, []);

  const handleDeleteAccount = useCallback(() => {
    auth.logoutImmediately();
    alert("Akun berhasil dihapus");
    setModal({ show: false, type: "" });
  }, []);

  const togglePassword = useCallback((field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  if (!userData.email) {
    return (
      <div className="text-center py-12 mt-45" role="status" aria-live="polite">
        <div className="inline-block from-red-50 to-white rounded-2xl mb-2">
          <div className="relative">
            <img
              src={logo}
              alt="EduFrame Loading"
              className="w-20 h-22 text-red-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
        <p className="text-red-500 font-medium italic flex-row">
          Memuat Profile...
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          {[0, 100, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kelola data akun Anda</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 mb-16">
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                {userData.name}
              </h2>
              <div className="flex flex-col gap-1.5 mt-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 text-red-500" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4 text-red-400" />
                  <span>Bergabung {userData.joinDate}</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-green-700">
                  Akun Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ProfileSection
            field="name"
            icon={UserIcon}
            label="Nama Lengkap"
            description="Identitas akun Anda"
            value={userData.name}
            editMode={editMode}
            onEdit={setEditMode}
            onSave={handleSave}
            onCancel={handleCancel}
            validationError={editMode === "name" ? validationError : ""}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              placeholder="Masukkan nama lengkap"
              autoFocus
            />
          </ProfileSection>

          <ProfileSection
            field="email"
            icon={EnvelopeIcon}
            label="Alamat Email"
            description="Email untuk login"
            value={userData.email}
            editMode={editMode}
            onEdit={setEditMode}
            onSave={handleSave}
            onCancel={handleCancel}
            validationError={editMode === "email" ? validationError : ""}
          >
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
              placeholder="Masukkan email baru"
              autoFocus
            />
          </ProfileSection>

          <ProfileSection
            field="password"
            icon={LockIcon}
            label="Password"
            description="Keamanan akun"
            value=""
            editMode={editMode}
            onEdit={setEditMode}
            onSave={handleSave}
            onCancel={handleCancel}
            validationError={editMode === "password" ? validationError : ""}
          >
            <div className="space-y-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password Saat Ini
                </label>
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  placeholder="Masukkan password saat ini"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("current")}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword.current ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password Baru
                </label>
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword.new ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  placeholder="Ulangi password baru"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirm ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </ProfileSection>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-900 mb-4 mt-10">Aksi</h3>
          <div className="space-y-3 mt-5">
            <DangerButton
              icon={SignOutAltIcon}
              title="Keluar Akun"
              subtitle="Logout dari sesi ini"
              onClick={() => setModal({ show: true, type: "logout" })}
              variant="danger"
            />
            {/* <DangerButton
              icon={TrashIcon}
              title="Hapus Akun"
              subtitle="Tindakan ini tidak dapat dibatalkan"
              onClick={() => setModal({ show: true, type: "delete" })}
              variant="neutral"
            /> */}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modal.show && modal.type === "logout"}
        onClose={() => setModal({ show: false, type: "" })}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Anda akan keluar dari akun ini. Pastikan Anda telah menyimpan semua perubahan sebelum melanjutkan."
        confirmText="Ya, Logout"
        isDanger={true}
      />

      <ConfirmModal
        isOpen={modal.show && modal.type === "delete"}
        onClose={() => setModal({ show: false, type: "" })}
        onConfirm={handleDeleteAccount}
        title="Hapus Akun Permanen"
        message="Semua data Anda akan dihapus secara permanen dan tidak dapat dipulihkan. Apakah Anda benar-benar yakin?"
        confirmText="Ya, Hapus Akun"
        isDanger={false}
      />
    </div>
  );
};

export default Profile;

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/EduFrame.png";
import { UserIcon } from "../icons/IkonWrapper";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);

          if (user.username) {
            setUserName(user.username);
          } else if (user.email) {
            const nameFromEmail = user.email.split("@")[0];
            setUserName(nameFromEmail);
          }
        } else {
          setTimeout(() => {
            navigate("/onboarding/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    loadUserData();
  }, [navigate]);

  const navItems = [
    { path: "/home", label: "Beranda" },
    { path: "/quiz", label: "Quiz" },
    { path: "/panduan", label: "Panduan" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-100 px-4 py-3 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 group">
          <Link to="/" className="flex items-center space-x-3 no-underline">
            <div className="relative">
              <div className="flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <img
                  src={logo}
                  alt="EduFrame Logo"
                  className="w-9 h-9 object-contain"
                  width="32"
                  height="32"
                />
              </div>
              <div className="absolute inset-0 bg-red-500 rounded-xl opacity-20 blur-md -z-10 group-hover:opacity-30 transition-opacity"></div>
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-gray-500 bg-clip-text text-transparent leading-tight italic">
                EduFrame
              </h1>
              <p className="text-xs text-gray-500 leading-tight">
                Platform Edukasi Modern
              </p>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-red-50 to-red-100 text-red-600 border-red-200"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
              aria-current={isActive(item.path) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 truncate max-w-37.5">
              {userName}
            </p>
            <p className="text-xs text-gray-500">User</p>
          </div>

          <Link
            to="/profile"
            className={`relative group/avatar flex items-center justify-center transition-all duration-200 ${
              isActive("/profile") ? "ring-2 ring-red-100 ring-offset-2" : ""
            }`}
            aria-label="Profil pengguna"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden ${
                isActive("/profile")
                  ? "bg-gradient-to-r from-red-500 to-red-400"
                  : "bg-gradient-to-r from-red-400 to-red-300"
              } group-hover/avatar:from-red-500 group-hover/avatar:to-red-400 transition-all`}
            >
              <UserIcon className="text-white w-5 h-5" aria-hidden="true" />
            </div>

            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Lihat Profil
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {};

export default Navbar;

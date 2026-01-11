import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/EduFrame.png";
import { UserIcon } from "../icons/IkonWrapper";

const Header = () => {
  const location = useLocation();
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className=" from-red-500 to-red-300 rounded-xl flex items-center justify-center shadow-md">
              <img
                src={logo}
                alt="EduFrame Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-red-800 rounded-xl opacity-20 blur-md -z-10"></div>
          </div>

          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-red-600 to-gray-600 bg-clip-text text-transparent">
              EduFrame
            </h1>
            <p className="text-xs text-gray-500 -mt-1">
              Platform Edukasi Modern
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
              location.pathname === "/profile"
                ? "bg-linear-to-r from-red-500 to-red-300 ring-2 ring-red-300"
                : "bg-linear-to-r from-red-400 to-red-200 hover:from-red-500 hover:to-red-300"
            }`}
          >
            <UserIcon className="text-white" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

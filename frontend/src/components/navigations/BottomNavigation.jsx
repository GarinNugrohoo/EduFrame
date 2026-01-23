import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  GameIcon,
  UserIcon,
  HistoryIcon,
} from "../icons/IkonWrapper";

function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/home", label: "Beranda", icon: HomeIcon },
    { path: "/quiz", label: "Quiz", icon: GameIcon },
    { path: "/History", label: "History", icon: HistoryIcon },
    { path: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3">
      <ul className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <li key={item.path} className="flex flex-col items-center">
              <Link
                to={item.path}
                className={`flex flex-col items-center transition ${
                  isActive ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition ${
                    isActive ? "bg-red-100 scale-110" : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={isActive ? "text-red-500" : "text-gray-500"}
                  />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomNavigation;

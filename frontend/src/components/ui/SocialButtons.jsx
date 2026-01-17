// src/components/ui/SocialButtons.jsx
import React from "react";
import { GoogleIcon, FacebookIcon, AppleIcon } from "../icons/IkonWrapper";

const SocialButtons = () => {
  const socialButtons = [
    { icon: GoogleIcon, label: "Google", color: "hover:text-red-500" },
    { icon: FacebookIcon, label: "Facebook", color: "hover:text-blue-500" },
    { icon: AppleIcon, label: "Apple", color: "hover:text-gray-900" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {socialButtons.map((social, index) => {
        const Icon = social.icon;
        return (
          <button
            key={index}
            type="button"
            className="py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center group"
            aria-label={`Login dengan ${social.label}`}
          >
            <Icon
              className={`w-6 h-6 text-gray-600 ${social.color} transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default SocialButtons;

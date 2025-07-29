import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { imagePhim } from "../../Utilities/common";
import PAGE_TITLES from "../ui/PageTitles";

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location từ hook
  const { userData, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const pageTitle = PAGE_TITLES[location.pathname] || "";
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 bg-white shadow-md p-4 flex items-center justify-between z-50">
      <div className="text-2xl font-bold text-blue-700">{pageTitle}</div>
      <div className="relative">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setShowUserDropdown((prev) => !prev)}
        >
          {userData.avatar_url ? (
            <img
              src={`${imagePhim}${userData.avatar_url}`}
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <FaUserCircle className="text-gray-500 text-3xl" />
          )}
          <span className="font-semibold text-gray-800">
            {userData.name || "Admin User"}
          </span>
        </div>
        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md py-2 z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderAdmin;

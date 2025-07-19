import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import {
  FaChevronDown,
  FaUserCircle,
  FaAward,
  FaGift,
  FaUserTag,
  FaHistory,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContext";
import { imagePhim } from "../../Utilities/common";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, userData, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setShowUserDropdown(false);
    navigate("/");
  };

  const handleUserToggleDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const handleMobileDropdownToggle = (name) => {
    setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef]);

  const navItems = [
    {
      name: "Phim",
      dropdown: [
        { label: "Phim Đang Chiếu", path: "/phim-dang-chieu" },
        { label: "Phim Sắp Chiếu", path: "/phim-sap-chieu" },
      ],
    },
    {
      name: "Sản Phẩm",
      dropdown: [
        { label: "Bắp & Nước", path: "/bap-nuoc" },
        { label: "Combo", path: "/combo" },
      ],
    },
    {
      name: "Góc Điện Ảnh",
      dropdown: [
        { label: "Tin Điện Ảnh", path: "/tin-dien-anh" },
        { label: "Review Phim", path: "/review-phim" },
      ],
    },
    {
      name: "Sự Kiện",
      dropdown: [
        { label: "Sự Kiện Đặc Biệt", path: "/su-kien-dac-biet" },
        { label: "Ưu Đãi Thành Viên", path: "/uu-dai-thanh-vien" },
      ],
    },
    {
      name: "Rạp/Giá Vé",
      dropdown: [
        { label: "Hệ Thống Rạp", path: "/he-thong-rap" },
        { label: "Giá Vé", path: "/gia-ve" },
      ],
    },
  ];
  return (
    <header className="bg-gradient-to-tr from-blue-300 to-blue-500 py-8 px-4 w-full fixed top-0 left-0 z-[10000] shadow-md">
      <ToastContainer />
      <div className="w-full lg:w-[80%] mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link to="/">
          <img
            src="https://www.galaxycine.vn/_next/static/media/galaxy-logo-mobile.074abeac.png"
            alt="GalaxyCinema Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex space-x-10 cursor-pointer">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="text-black hover:text-orange-500 flex items-center gap-1 cursor-pointer
              font-semibold"
              >
                {item.name} <FaChevronDown className="w-3 h-3" />
              </button>
              <div
                className={`absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-2 z-50 transition-opacity 
                  duration-300 cursor-pointer ${
                    activeDropdown === item.name
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
              >
                {item.dropdown.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Search icon - Removed desktop search input */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:text-orange-600 transition"
            >
              <FiSearch className="w-5 h-5 text-black" />
            </button>
            {showSearch && (
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                className="absolute right-0 top-full mt-2 w-64 p-2 border rounded-lg bg-white"
              />
            )}
          </div>

          {/* User / Login */}
          {isLoggedIn ? (
            <div className="relative hidden lg:block" ref={userDropdownRef}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleUserToggleDropdown}
              >
                {userData.avatar_url ? (
                  <img
                    src={`${imagePhim}${userData.avatar_url}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-500" />
                )}
                <div className="flex flex-col text-sm">
                  <div className="flex items-center gap-1 font-semibold text-orange-500">
                    <FaAward className="w-4 h-4" />
                    {userData.name}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaGift className="w-4 h-4" />
                    {userData.stars} Stars
                  </div>
                </div>
              </div>
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-0 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  <Link
                    to="/account"
                    className="block px-4 py-2 hover:bg-gray-100 flex gap-2"
                  >
                    <FaUserTag />
                    Tài Khoản
                  </Link>
                  <Link
                    to="/history"
                    className="block px-4 py-2 hover:bg-gray-100 flex gap-2"
                  >
                    <FaHistory />
                    Lịch Sử
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left flex gap-2"
                  >
                    <FaSignOutAlt /> Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden lg:flex px-4 py-2 rounded-full transition duration-300 font-bold"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "black",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "var(--color-hover)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "var(--color-primary)";
                e.target.style.color = "black";
              }}
            >
              ĐĂNG NHẬP
            </Link>
          )}

          {/* Mobile user icon & menu */}
          <div className="flex lg:hidden items-center space-x-4">
            {isLoggedIn ? (
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleUserToggleDropdown}
              >
                {userData.avatar_url ? (
                  <img
                    src={`${imagePhim}/storage/${userData.avatar_url}`}
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 text-gray-500" />
                )}
                <div className="flex flex-col text-sm">
                  <div className="flex items-center gap-1 font-semibold text-orange-500">
                    <FaAward className="w-4 h-4" />
                    {userData.name}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaGift className="w-4 h-4" />
                    {userData.stars} Stars
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <FaUserCircle className="w-6 h-6 text-gray-700" />
              </Link>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu overlay */}
      {showMobileMenu && (
        <div
          className={`fixed top-0 bottom-0 right-0 w-[80vw] bg-white z-50 overflow-y-auto p-4 shadow-lg transform transition-transform duration-4000 ease-out ${
            showMobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header of mobile menu (Search and Close button) */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 w-full mr-4">
              <FiSearch className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="flex-1 outline-none"
              />
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="text-gray-600"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* User Info and Logout in Mobile Menu */}
          {isLoggedIn && (
            <div className="mb-4 border-b border-gray-200 pb-2">
              <div className="flex items-center space-x-2 mb-2">
                {userData.avatar_url ? (
                  <img
                    src={`${imagePhim}/storage/${userData.avatar_url}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-500" />
                )}
                <div className="flex flex-col text-sm">
                  <div className="flex items-center gap-1 font-semibold text-orange-500">
                    <FaAward className="w-4 h-4" />
                    {userData.name}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaGift className="w-4 h-4" />
                    {userData.stars} Stars
                  </div>
                </div>
              </div>
              <Link
                to="/account"
                className="block px-4 py-2 hover:bg-gray-100 flex gap-2"
                onClick={() => setShowMobileMenu(false)} // Close menu on navigation
              >
                <FaUserTag />
                Tài Khoản
              </Link>
              <Link
                to="/history"
                className="block px-4 py-2 hover:bg-gray-100 flex gap-2"
                onClick={() => setShowMobileMenu(false)} // Close menu on navigation
              >
                <FaHistory />
                Lịch Sử
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false); // Close menu on logout
                }}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left flex gap-2"
              >
                <FaSignOutAlt /> Đăng Xuất
              </button>
            </div>
          )}

          {/* Mobile nav items */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-2 last:border-b-0"
              >
                <button
                  className="flex justify-between items-center w-full py-2 text-lg font-semibold text-gray-800"
                  onClick={() => handleMobileDropdownToggle(item.name)}
                >
                  {item.name}
                  <FaChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeMobileDropdown === item.name ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeMobileDropdown === item.name && (
                  <div className="pl-4 pt-2 space-y-1">
                    {item.dropdown.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className="block py-1 text-gray-700 hover:text-orange-500"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

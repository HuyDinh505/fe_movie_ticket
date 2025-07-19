import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilm,
  FaUsers,
  FaBuilding,
  FaChartBar,
  FaUserCircle,
  FaPlusCircle,
  FaTrash,
  FaClock,
  FaTags,
} from "react-icons/fa";
import { VscPieChart, VscGraph } from "react-icons/vsc";
import { useAuth } from "../../contexts/AuthContext";
import { imagePhim } from "../../Utilities/common";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  // const [isQuanLyDropdownOpen, setIsQuanLyDropdownOpen] = useState(false);
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(false);
  const [isPhimDropdownOpen, setIsPhimDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTheaterDropdownOpen, setIsTheaterDropdownOpen] = useState(false);
  const [isShowtimeDropdownOpen, setIsShowtimeDropdownOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isConcessionOpen, setIsConcessionDropdownOpen] = useState(false);
  const [isTicketTypeOpen, setIsTicketTypeDropdownOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionDropdownOpen] = useState(false);
  const [isArticlesOpen, setIsArticlesDropdownOpen] = useState(false);
  const [isTicketOpen, setIsTicketDropdownOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [ScheduleDropdown, setScheduleDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-[#112D4E] text-white h-screen flex flex-col shadow-lg fixed left-0 top-0 p-0 m-0">
      <div
        className="text-3xl font-bold text-[#DBE2EF] mb-8 cursor-pointer p-4"
        onClick={() => navigate("/admin/dashboard")}
      >
        ADMIN PANEL
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll m-0 p-0">
        <nav>
          <ul className="space-y-4">
            <ul className="space-y-2">
              {" "}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() =>
                    setIsDashboardDropdownOpen(!isDashboardDropdownOpen)
                  }
                >
                  <span>Dashboard</span>
                  <span>{isDashboardDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isDashboardDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <VscGraph className="text-sm" />
                      <span>Tổng quan</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/dashboard_movie")}
                    >
                      <VscGraph className="text-sm" />
                      <span>Doanh thu theo phim</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/dashboard_theater")}
                    >
                      <VscGraph className="text-sm" />
                      <span>Doanh thu theo rạp</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* 1. Phim Dropdown */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsPhimDropdownOpen(!isPhimDropdownOpen)}
                >
                  <span>Quản lý Phim</span>
                  <span>{isPhimDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isPhimDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/movies")}
                    >
                      <FaFilm className="text-sm" />
                      <span>Danh sách phim</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/movies/deleted")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Phim đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý người dùng */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span>Quản lý người dùng</span>
                  <span>{isUserDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isUserDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/user")}
                    >
                      <FaUsers className="text-sm" />
                      <span>Danh sách người dùng</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý rạp phim */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() =>
                    setIsTheaterDropdownOpen(!isTheaterDropdownOpen)
                  }
                >
                  <span>Quản lý rạp phim</span>
                  <span>{isTheaterDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isTheaterDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/theater")}
                    >
                      <FaBuilding className="text-sm" />
                      <span>Danh sách rạp chiếu</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/delete_cinema")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Danh sách rạp chiếu đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý lịch chiếu  */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setScheduleDropdown(!ScheduleDropdown)}
                >
                  <span>Quản lý lịch chiếu</span>
                  <span>{ScheduleDropdown ? "▲" : "▼"}</span>
                </div>
                {ScheduleDropdown && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/schedule")}
                    >
                      <FaUsers className="text-sm" />
                      <span>Danh sách lịch chiếu</span>
                    </li>
                    {/* <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/schedule/deleted")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Lịch chiếu đã xóa</span>
                    </li> */}
                  </ul>
                )}
              </li>
              {/* Quản lý suất chiếu*/}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() =>
                    setIsShowtimeDropdownOpen(!isShowtimeDropdownOpen)
                  }
                >
                  <span>Quản lý suất chiếu</span>
                  <span>{isShowtimeDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isShowtimeDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/showtime")}
                    >
                      <FaClock className="text-sm" />
                      <span>Danh sách suất chiếu</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý thể loại */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                  <span>Quản lý Thể loại</span>
                  <span>{isGenreDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isGenreDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/genre")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách thể loại</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/genre_delete")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Danh sách thể loại đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý thức ăn */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsConcessionDropdownOpen(!isConcessionOpen)}
                >
                  <span>Quản lý thức ăn</span>
                  <span>{isConcessionOpen ? "▲" : "▼"}</span>
                </div>
                {isConcessionOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/concession")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách thức ăn</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/delete_concession")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách thức ăn đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý loại vé */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsTicketTypeDropdownOpen(!isTicketTypeOpen)}
                >
                  <span>Quản lý loại vé</span>
                  <span>{isTicketTypeOpen ? "▲" : "▼"}</span>
                </div>
                {isTicketTypeOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/ticket_type")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách loại vé</span>
                    </li>
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/ticket_type-delete")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách loại vé đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý đơn hàng */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsTicketDropdownOpen(!isTicketOpen)}
                >
                  <span>Quản lý đơn hàng</span>
                  <span>{isTicketOpen ? "▲" : "▼"}</span>
                </div>
                {isTicketOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/ticket_order")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách đơn hàng</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý khuyến mãi */}
              {/* <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsPromotionDropdownOpen(!isPromotionOpen)}
                >
                  <span>Quản lý khuyến mãi</span>
                  <span>{isPromotionOpen ? "▲" : "▼"}</span>
                </div>
                {isPromotionOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/promotion")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách khuyến mãi</span>
                    </li>
                  </ul>
                )}
              </li> */}
              {/* Quản lý bài viết */}
              <li>
                <div
                  className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
                  onClick={() => setIsArticlesDropdownOpen(!isArticlesOpen)}
                >
                  <span>Quản lý bài viết</span>
                  <span>{isArticlesOpen ? "▲" : "▼"}</span>
                </div>
                {isArticlesOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className="p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2"
                      onClick={() => navigate("/admin/articles")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách bài viết</span>
                    </li>
                  </ul>
                )}
              </li>
            </ul>{" "}
            {/* End of the promoted ul */}
          </ul>
        </nav>
      </div>

      {/* Admin User Section (at the bottom of sidebar) */}
      <div className="mt-auto border-t border-[#3F72AF] pt-4 relative">
        <div
          className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-[#3F72AF]"
          onClick={() => setShowUserDropdown((prev) => !prev)}
        >
          <img
            src={
              userData.avatar_url
                ? `${imagePhim}${userData.avatar_url}`
                : "/placeholder-avatar.jpg"
            }
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <span className="font-semibold">{userData.name || "Admin"}</span>
        </div>
        {showUserDropdown && (
          <div className="absolute left-0 bottom-14 w-48 bg-white text-black shadow-lg rounded-md py-2 z-50">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarAdmin;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaFilm,
  FaUsers,
  FaBuilding,
  FaTrash,
  FaClock,
  FaTags,
} from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
// import { useAuth } from "../../contexts/AuthContext"; // Không cần thiết nếu userData và logout đã được chuyển sang HeaderAdmin
// import { imagePhim } from "../../Utilities/common"; // Không cần thiết nếu avatar đã được chuyển sang HeaderAdmin

const SidebarAdmin = () => {
  const navigate = useNavigate();
  // const { userData, logout } = useAuth(); // Loại bỏ hoặc giữ lại nếu bạn cần userData ở nơi khác trong sidebar
  const location = useLocation();
  const currentPath = location.pathname;

  // Khởi tạo các trạng thái đóng/mở dropdown. Bạn có thể đặt dashboard mở mặc định.
  const [isDashboardDropdownOpen, setIsDashboardDropdownOpen] = useState(true);
  const [isPhimDropdownOpen, setIsPhimDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTheaterDropdownOpen, setIsTheaterDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [isShowtimeDropdownOpen, setIsShowtimeDropdownOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isConcessionOpen, setIsConcessionDropdownOpen] = useState(false);
  const [isTicketTypeOpen, setIsTicketTypeDropdownOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionDropdownOpen] = useState(false);
  const [isArticlesOpen, setIsArticlesDropdownOpen] = useState(false);
  const [isTicketOpen, setIsTicketDropdownOpen] = useState(false);
  const [ScheduleDropdown, setScheduleDropdown] = useState(false);

  // Định nghĩa nhóm đường dẫn để xác định active của mục cha
  const pathGroups = {
    dashboard: [
      "/admin/dashboard",
      "/admin/dashboard_movie",
      "/admin/dashboard_theater",
    ],
    phim: ["/admin/movies", "/admin/movies/deleted"],
    user: ["/admin/user"],
    theater: ["/admin/theater", "/admin/delete_cinema"],
    district: ["/admin/district", "/admin/delete_district"],
    schedule: ["/admin/schedule"],
    showtime: ["/admin/showtime"],
    genre: ["/admin/genre", "/admin/genre_delete"],
    concession: ["/admin/concession", "/admin/delete_concession"],
    ticketType: ["/admin/ticket_type", "/admin/ticket_type-delete"],
    ticket: ["/admin/ticket_order"],
    promotion: ["/admin/promotion"],
    articles: ["/admin/articles"],
  };

  // Hàm kiểm tra active cho mục cha (nhóm)
  const isActiveGroup = (group) =>
    pathGroups[group].some((path) => currentPath.startsWith(path));

  // Hàm kiểm tra active cho từng mục con
  const isActiveItem = (path) => currentPath.startsWith(path);

  // Hàm kiểm tra active cho mục cha: chỉ in đậm khi đúng path cha, không phải path con
  const isActiveParent = (parentPath, exceptPaths = []) =>
    currentPath === parentPath &&
    !exceptPaths.some((path) => currentPath.startsWith(path));

  // handleLogout đã được chuyển sang HeaderAdmin
  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("dashboard") ? "bg-[#3F72AF]" : ""
                  }`}
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
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/dashboard") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <VscGraph className="text-sm" />
                      <span>Tổng quan</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/dashboard_movie")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
                      onClick={() => navigate("/admin/dashboard_movie")}
                    >
                      <VscGraph className="text-sm" />
                      <span>Doanh thu theo phim</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/dashboard_theater")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/movies", ["/admin/movies/deleted"])
                      ? " bg-[#3F72AF]"
                      : ""
                  }`}
                  onClick={() => setIsPhimDropdownOpen(!isPhimDropdownOpen)}
                >
                  <span>Quản lý Phim</span>
                  <span>{isPhimDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isPhimDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/movies") &&
                        currentPath === "/admin/movies"
                          ? "bg-[#3F72AF] "
                          : ""
                      }`}
                      onClick={() => navigate("/admin/movies")}
                    >
                      <FaFilm className="text-sm" />
                      <span>Danh sách phim</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/movies/deleted")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/user") ? " bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span>Quản lý người dùng</span>
                  <span>{isUserDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isUserDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/user") ? "bg-[#3F72AF]" : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/theater", ["/admin/delete_cinema"])
                      ? " bg-[#3F72AF]"
                      : ""
                  }`}
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
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/theater") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/theater")}
                    >
                      <FaBuilding className="text-sm" />
                      <span>Danh sách rạp chiếu</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/delete_cinema")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
                      onClick={() => navigate("/admin/delete_cinema")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Danh sách rạp chiếu đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý quận huyện */}
              <li>
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/district", ["/admin/delete_district"])
                      ? "bg-[#3F72AF]"
                      : ""
                  }`}
                  onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                >
                  <span>Quản lý quận huyện</span>
                  <span>{isDistrictDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isDistrictDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/district") &&
                        currentPath === "/admin/district"
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
                      onClick={() => navigate("/admin/district")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách quận huyện</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/district_delete")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
                      onClick={() => navigate("/admin/district_delete")}
                    >
                      <FaTrash className="text-sm" />
                      <span>Danh sách quận huyện đã xóa</span>
                    </li>
                  </ul>
                )}
              </li>
              {/* Quản lý lịch chiếu */}
              <li>
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/schedule") ? "bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setScheduleDropdown(!ScheduleDropdown)}
                >
                  <span>Quản lý lịch chiếu</span>
                  <span>{ScheduleDropdown ? "▲" : "▼"}</span>
                </div>
                {ScheduleDropdown && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/schedule") ? "bg-[#3F72AF]" : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("showtime") ? "bg-[#3F72AF]" : ""
                  }`}
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
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/showtime") ? "bg-[#3F72AF]" : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveParent("/admin/genre", ["/admin/genre_delete"])
                      ? "bg-[#3F72AF]"
                      : ""
                  }`}
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                >
                  <span>Quản lý Thể loại</span>
                  <span>{isGenreDropdownOpen ? "▲" : "▼"}</span>
                </div>
                {isGenreDropdownOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/genre") &&
                        currentPath === "/admin/genre"
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
                      onClick={() => navigate("/admin/genre")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách thể loại</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/genre_delete")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("concession") ? "bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setIsConcessionDropdownOpen(!isConcessionOpen)}
                >
                  <span>Quản lý thức ăn</span>
                  <span>{isConcessionOpen ? "▲" : "▼"}</span>
                </div>
                {isConcessionOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/concession") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/concession")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách thức ăn</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/delete_concession")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("ticketType") ? "bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setIsTicketTypeDropdownOpen(!isTicketTypeOpen)}
                >
                  <span>Quản lý loại vé</span>
                  <span>{isTicketTypeOpen ? "▲" : "▼"}</span>
                </div>
                {isTicketTypeOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/ticket_type") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/ticket_type")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách loại vé</span>
                    </li>
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/ticket_type-delete")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("ticket") ? "bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setIsTicketDropdownOpen(!isTicketOpen)}
                >
                  <span>Quản lý đơn hàng</span>
                  <span>{isTicketOpen ? "▲" : "▼"}</span>
                </div>
                {isTicketOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/ticket_order")
                          ? "bg-[#3F72AF]"
                          : ""
                      }`}
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
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("promotion") ? "bg-[#3F72AF] " : ""
                  }`}
                  onClick={() => setIsPromotionDropdownOpen(!isPromotionOpen)}
                >
                  <span>Quản lý khuyến mãi</span>
                  <span>{isPromotionOpen ? "▲" : "▼"}</span>
                </div>
                {isPromotionOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/promotion") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/promotion")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách khuyến mãi</span>
                    </li>
                  </ul>
                )}
              </li> */}
              {/* Quản lý bài viết */}
              {/* <li>
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded hover:bg-[#3F72AF] ${
                    isActiveGroup("articles") ? "bg-[#3F72AF]" : ""
                  }`}
                  onClick={() => setIsArticlesDropdownOpen(!isArticlesOpen)}
                >
                  <span>Quản lý bài viết</span>
                  <span>{isArticlesOpen ? "▲" : "▼"}</span>
                </div>
                {isArticlesOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li
                      className={`p-2 rounded hover:bg-[#3F72AF] cursor-pointer flex items-center space-x-2 ${
                        isActiveItem("/admin/articles") ? "bg-[#3F72AF]" : ""
                      }`}
                      onClick={() => navigate("/admin/articles")}
                    >
                      <FaTags className="text-sm" />
                      <span>Danh sách bài viết</span>
                    </li>
                  </ul>
                )}
              </li> */}
            </ul>{" "}
            {/* End of the promoted ul */}
          </ul>
        </nav>
      </div>

      {/* Phần Admin User Section đã được di chuyển sang HeaderAdmin */}
    </div>
  );
};

export default SidebarAdmin;

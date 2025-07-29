import React, { useState, useEffect, useContext } from "react";
import ScheduleTable from "../../../components/admin/Schedule/ScheduleTable.jsx";
import ScheduleForm from "../../../components/admin/Schedule/ScheduleForm.jsx";
import Modal from "../../../components/ui/Modal";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetAllMovieSchedulesUS,
  useCreateMovieScheduleUS,
  useUpdateMovieScheduleUS,
  useDeleteMovieScheduleUS,
  useGetPhimUS,
  useGetManagedMoviesUS,
  useGetAllCinemasUS,
  useGetCinemaByIdUS,
  useGetPhimTheoRapUS, // Import hook mới
} from "../../../api/homePage/queries"; // Đảm bảo đường dẫn đúng
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  getApiMessage,
  handleApiError,
} from "../../../Utilities/apiMessage.js";

const ScheduleManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const queryClient = useQueryClient();

  // State cho tìm kiếm, lọc, phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMovie, setFilterMovie] = useState("");
  const [filterCinema, setFilterCinema] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterStatus, setFilterStatus] = useState(""); // "", "past", "current", "upcoming"

  // Lấy userData từ AuthContext
  const { userData } = useContext(AuthContext);
  const role =
    userData.role || (Array.isArray(userData?.roles) ? userData.roles[0] : "");

  // === FETCHING DATA DỰA TRÊN ROLE ===

  // 1. Lấy danh sách lịch chiếu
  const { data: SchedulesData, isLoading: loadingSchedules } =
    useGetAllMovieSchedulesUS();
  const schedules = SchedulesData?.data || [];

  // 2. Lấy danh sách phim theo role
  // Dùng useGetPhimTheoRapUS cho cinema_manager, showtime_manager, manager_district (nếu có cinema_id)
  const { data: phimTheoRapData, isLoading: loadingPhimTheoRap } =
    useGetPhimTheoRapUS(userData?.cinema_id, {
      enabled:
        !!userData?.cinema_id &&
        (role === "cinema_manager" ||
          role === "showtime_manager" ||
          role === "manager_district"), // Chỉ chạy nếu có cinema_id và là một trong các manager này
    });

  // Dùng useGetPhimUS cho admin và các role khác không có cinema_id hoặc không phải là manager cụ thể
  const { data: allMoviesData, isLoading: loadingAllMovies } = useGetPhimUS({
    enabled:
      !userData?.cinema_id ||
      (role !== "cinema_manager" &&
        role !== "showtime_manager" &&
        role !== "manager_district"), // Chỉ chạy nếu KHÔNG có cinema_id HOẶC KHÔNG phải manager cụ thể
  });

  // Dùng useGetManagedMoviesUS nếu vai trò là manager_district (có thể cần cả phim theo rạp và phim tổng quản lý)
  // Giữ lại để linh hoạt, nhưng ưu tiên phimTheoRapData nếu có cinema_id
  const { data: managedMoviesData, isLoading: loadingManagedMovies } =
    useGetManagedMoviesUS({
      enabled: role === "manager_district", // Chỉ chạy nếu LÀ manager_district
    });

  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    let finalMovieList = [];
    if (
      (role === "cinema_manager" ||
        role === "showtime_manager" ||
        role === "manager_district") &&
      userData.cinema_id
    ) {
      // CORRECTED: Access the 'movies' property inside data
      finalMovieList = phimTheoRapData?.data?.movies ?? [];
      if (phimTheoRapData?.data?.movies) {
        // Adjusted console log condition as well
        console.log(
          "ScheduleManagement - Manager: Fetched movies by cinema:",
          finalMovieList
        );
      } else if (loadingPhimTheoRap) {
        console.log(
          "ScheduleManagement - Manager: Loading movies by cinema..."
        );
      }
    } else if (role === "manager_district") {
      // This part was already correct for managedMoviesData structure
      finalMovieList = managedMoviesData?.data?.movies ?? [];
      if (managedMoviesData?.data?.movies) {
        console.log(
          "ScheduleManagement - Manager: Fetched managed movies:",
          finalMovieList
        );
      } else if (loadingManagedMovies) {
        console.log("ScheduleManagement - Manager: Loading managed movies...");
      }
    } else {
      // This part was already correct for allMoviesData structure
      finalMovieList = allMoviesData?.data?.movies ?? [];
      if (allMoviesData?.data?.movies) {
        console.log(
          "ScheduleManagement - Admin: Fetched all movies:",
          finalMovieList
        );
      } else if (loadingAllMovies) {
        console.log("ScheduleManagement - Admin: Loading all movies...");
      }
    }
    setMovieList(finalMovieList);
  }, [
    phimTheoRapData,
    allMoviesData,
    managedMoviesData,
    userData.cinema_id,
    role,
    loadingPhimTheoRap,
    loadingAllMovies,
    loadingManagedMovies,
  ]);

  // 3. Lấy danh sách rạp chiếu theo role (logic này giữ nguyên như lần trước, vì nó đã hoạt động tốt)
  const { data: allCinemasData, isLoading: loadingAllCinemas } =
    useGetAllCinemasUS({
      enabled:
        role === "admin" ||
        (role !== "cinema_manager" &&
          role !== "showtime_manager" &&
          role !== "manager_district"),
    });

  const { data: userCinemaData, isLoading: loadingUserCinema } =
    useGetCinemaByIdUS(userData?.cinema_id, {
      enabled:
        !!userData?.cinema_id &&
        (role === "cinema_manager" ||
          role === "showtime_manager" ||
          role === "manager_district"),
    });

  const [cinemaList, setCinemaList] = useState([]);

  useEffect(() => {
    let finalCinemaList = [];
    let defaultFilterCinemaId = "";

    if (
      role === "cinema_manager" ||
      role === "showtime_manager" ||
      role === "manager_district"
    ) {
      if (userCinemaData?.data) {
        finalCinemaList = [userCinemaData.data];
        defaultFilterCinemaId = userData.cinema_id;
        console.log(
          "ScheduleManagement - Manager: Fetched user's cinema:",
          finalCinemaList
        );
      } else if (loadingUserCinema) {
        console.log("ScheduleManagement - Manager: Loading user's cinema...");
      } else if (userData.cinema_id && !userCinemaData?.data) {
        console.warn(
          "ScheduleManagement - Manager: Could not fetch cinema for ID:",
          userData.cinema_id
        );
        toast.error(
          "Không thể tải thông tin rạp của bạn. Vui lòng kiểm tra lại."
        );
      }
    } else {
      if (allCinemasData?.data) {
        finalCinemaList = allCinemasData.data;
        console.log(
          "ScheduleManagement - Admin: Fetched all cinemas:",
          finalCinemaList
        );
      } else if (loadingAllCinemas) {
        console.log("ScheduleManagement - Admin: Loading all cinemas...");
      } else if (!allCinemasData?.data) {
        console.warn(
          "ScheduleManagement - Admin: No cinemas data available from useGetAllCinemasUS."
        );
      }
    }
    setCinemaList(finalCinemaList);

    if (defaultFilterCinemaId && !filterCinema) {
      setFilterCinema(defaultFilterCinemaId);
      console.log(
        "ScheduleManagement - Auto-selected cinema filter:",
        defaultFilterCinemaId
      );
    } else if (
      finalCinemaList.length > 0 &&
      !filterCinema &&
      role === "admin"
    ) {
      setFilterCinema(finalCinemaList[0].cinema_id);
    }
  }, [
    allCinemasData,
    userCinemaData,
    userData.cinema_id,
    role,
    filterCinema,
    loadingAllCinemas,
    loadingUserCinema,
  ]);

  // Mutation
  const createSchedule = useCreateMovieScheduleUS();
  const updateSchedule = useUpdateMovieScheduleUS();
  const deleteSchedule = useDeleteMovieScheduleUS();

  // Thêm hoặc cập nhật lịch chiếu
  const handleAddOrUpdateSchedule = (data) => {
    console.log("Submitting schedule data:", data);
    if (editingSchedule) {
      updateSchedule.mutate(
        { id: editingSchedule.movie_schedule_id, data },
        {
          onSuccess: (response) => {
            console.log("Update schedule response:", response);
            if (response?.data?.status === false) {
              handleApiError(response.data, "Cập nhật lịch chiếu thất bại");
              return;
            }
            toast.success("Cập nhật lịch chiếu thành công");
            setIsFormVisible(false);
            setEditingSchedule(null);
            queryClient.invalidateQueries(["GetAllMovieSchedulesAPI"]);
          },
          onError: (error) => {
            console.error("Update schedule error:", error);
            toast.error(getApiMessage(error, "Không thể cập nhật lịch chiếu"));
          },
        }
      );
    } else {
      createSchedule.mutate(data, {
        onSuccess: (response) => {
          console.log("Create schedule response:", response);
          if (response?.data?.status === false) {
            console.log("API Response:", response);
            handleApiError(response.data, "Thêm lịch chiếu mới thất bại");
            return;
          }
          toast.success("Thêm lịch chiếu thành công");
          setIsFormVisible(false);
          queryClient.invalidateQueries(["GetAllMovieSchedulesAPI"]);
        },
        onError: (error) => {
          console.error("Create schedule error:", error);
          toast.error(getApiMessage(error, "Không thể thêm lịch chiếu mới"));
        },
      });
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    setConfirmModal({ open: true, id });
  };

  const handleConfirmDelete = () => {
    deleteSchedule.mutate(confirmModal.id, {
      onSuccess: (response) => {
        console.log("API Response:", response);
        if (response?.data?.status === false) {
          console.log("API Response:", response);
          handleApiError(response.data, "Xóa lịch chiếu thất bại");
          return;
        }

        toast.success(response.message, "Xóa lịch chiếu thành công");
        queryClient.invalidateQueries(["GetAllMovieSchedulesAPI"]);
      },
      onError: (error) => {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Xóa lịch chiếu thất bại";
        toast.error(msg);
      },
    });
    setConfirmModal({ open: false, id: null });
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingSchedule(null);
  };

  // Lọc và tìm kiếm
  const filteredSchedules = schedules.filter((item) => {
    // Lọc theo phim
    // Cần đảm bảo movie_id trong item lịch chiếu trùng khớp với movie_id trong danh sách phim có sẵn
    if (filterMovie && String(item.movie_id) !== String(filterMovie)) {
      return false;
    }

    // Lọc theo rạp
    if (
      (role === "cinema_manager" ||
        role === "showtime_manager" ||
        role === "manager_district") &&
      userData.cinema_id
    ) {
      if (String(item.cinema_id) !== String(userData.cinema_id)) {
        return false;
      }
    } else {
      if (filterCinema && String(item.cinema_id) !== String(filterCinema))
        return false;
    }

    // Lọc theo trạng thái chiếu
    if (filterStatus) {
      const today = new Date();
      const start = item.start_date ? new Date(item.start_date) : null;
      const end = item.end_date ? new Date(item.end_date) : null;
      if (filterStatus === "past" && end && today <= end) return false;
      if (
        filterStatus === "current" &&
        (!start || !end || today < start || today > end)
      )
        return false;
      if (filterStatus === "upcoming" && start && today >= start) return false;
    }
    // Tìm kiếm theo tên phim hoặc rạp (nếu có dữ liệu)
    const movie = movieList.find(
      (m) => String(m.movie_id) === String(item.movie_id)
    );
    const cinema = cinemaList.find(
      (c) => String(c.cinema_id) === String(item.cinema_id)
    );
    const movieName = movie?.movie_name || movie?.title || movie?.name || "";
    const cinemaName = cinema?.cinema_name || cinema?.name || "";
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      if (
        !movieName.toLowerCase().includes(lower) &&
        !cinemaName.toLowerCase().includes(lower)
      ) {
        return false;
      }
    }
    return true;
  });

  // Phân trang
  const totalItems = filteredSchedules.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Khi filter/search thay đổi thì reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterMovie, filterCinema, filterStatus]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Lịch chiếu
        </h1>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 items-center bg-white p-4 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên phim hoặc rạp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        />
        <select
          value={filterMovie}
          onChange={(e) => setFilterMovie(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64"
        >
          <option value="">Tất cả phim</option>
          {movieList.map((movie) => (
            <option key={movie.movie_id} value={movie.movie_id}>
              {movie.movie_name || movie.title || movie.name}
            </option>
          ))}
        </select>
        {/* Conditional rendering cho dropdown rạp */}
        {role === "cinema_manager" ||
        role === "showtime_manager" ||
        role === "manager_district" ? (
          <div className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium sm:w-64">
            {cinemaList.length > 0
              ? cinemaList[0].cinema_name || cinemaList[0].name
              : "Đang tải..."}
          </div>
        ) : (
          <select
            value={filterCinema}
            onChange={(e) => setFilterCinema(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
          >
            <option value="">Tất cả rạp</option>
            {cinemaList.map((cinema) => (
              <option key={cinema.cinema_id} value={cinema.cinema_id}>
                {cinema.cinema_name || cinema.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="past">Đã chiếu</option>
          <option value="current">Đang chiếu</option>
          <option value="upcoming">Sắp chiếu</option>
        </select>
        <button
          onClick={handleAddSchedule}
          className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer"
        >
          <FaPlus className="mr-2" />
          Thêm lịch chiếu
        </button>
      </div>

      <div className="w-full bg-white max-h-[100vh]">
        <div className=" rounded-xl shadow-lg overflow-auto ">
          <ScheduleTable
            schedules={paginatedSchedules}
            movieList={movieList}
            cinemaList={cinemaList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loadingSchedules}
          />
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modal hiển thị form thêm/sửa */}
      <Modal open={isFormVisible} onClose={handleCancelEdit}>
        <div className="max-w-md mx-auto">
          <ScheduleForm
            movieList={movieList}
            cinemaList={cinemaList}
            initialData={editingSchedule}
            onSubmit={handleAddOrUpdateSchedule}
            onCancel={handleCancelEdit}
            loading={
              loadingAllMovies ||
              loadingManagedMovies ||
              loadingPhimTheoRap || // Thêm loading của phim theo rạp
              loadingAllCinemas ||
              loadingUserCinema ||
              createSchedule.isPending ||
              updateSchedule.isPending
            }
          />
        </div>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
      >
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Bạn có chắc chắn muốn xóa lịch chiếu này không?
          </h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setConfirmModal({ open: false, id: null })}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;

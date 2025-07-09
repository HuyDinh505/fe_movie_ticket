import React, { useState, useEffect } from "react";
import ShowtimeForm from "../../components/admin/Showtime/ShowtimeForm";
import ShowtimeTable from "../../components/admin/Showtime/ShowtimeTable";
import {
  FaPlus,
  FaSearch,
  FaExclamationTriangle,
  FaExclamationCircle,
} from "react-icons/fa";
import Modal from "../../components/ui/Modal";
import { useGetSeatMapUS } from "../../api/homePage/queries";
import Seat from "../../components/admin/Room/Seat";
import {
  useGetAllCinemasUS,
  useGetTheaterRoomsByCinemaUS,
  useGetPhimTheoRapUS,
  useGetFilteredShowtimesUS,
  useCreateShowtimeUS,
  useUpdateShowtimeUS,
  useReactivateShowtimeUS,
  useDeleteShowtimeUS,
} from "../../api/homePage/queries";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

const ShowtimeManagement = () => {
  const { userData } = useAuth();
  
  // Debug log để kiểm tra user data
  console.log("ShowtimeManagement - userData:", userData);
  console.log("ShowtimeManagement - userData.role:", userData.role);
  console.log("ShowtimeManagement - userData.cinema_id:", userData.cinema_id);
  
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [editingShowtime, setEditingShowtime] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showSeatMapModal, setShowSeatMapModal] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  // Lấy danh sách rạp
  const { data: cinemasData } = useGetAllCinemasUS();
  // Lấy danh sách phòng chiếu theo rạp
  const { data: roomsData } = useGetTheaterRoomsByCinemaUS(selectedCinema, {
    enabled: !!selectedCinema,
  });
  // Lấy danh sách phim theo rạp đã chọn
  const { data: moviesData } = useGetPhimTheoRapUS(selectedCinema, {
    enabled: !!selectedCinema,
  });
  // Lấy danh sách suất chiếu lọc
  const filteredShowtimesMutation = useGetFilteredShowtimesUS();

  // Các hook mutation cho suất chiếu
  const createShowtime = useCreateShowtimeUS();
  const updateShowtime = useUpdateShowtimeUS();
  const reactivateShowtime = useReactivateShowtimeUS();
  const deleteShowtime = useDeleteShowtimeUS();

  // Lấy danh sách rạp khi load trang và set giá trị mặc định
  useEffect(() => {
    if (cinemasData?.data) {
      let cinemasList = cinemasData.data;
      
      console.log("ShowtimeManagement - All cinemas from API:", cinemasList);
      console.log("ShowtimeManagement - User role:", userData.role);
      console.log("ShowtimeManagement - User cinema_id:", userData.cinema_id);
      
      // Nếu là showtime_manager, chỉ hiển thị rạp của họ
      if (userData.role === "showtime_manager" && userData.cinema_id) {
        cinemasList = cinemasList.filter(
          cinema => cinema.cinema_id == userData.cinema_id
        );
        console.log("ShowtimeManager - User cinema_id:", userData.cinema_id);
        console.log("ShowtimeManager - Filtered cinemas for user:", cinemasList);
        
        // Tự động chọn rạp của showtime_manager
        if (cinemasList.length > 0) {
          setSelectedCinema(userData.cinema_id);
          console.log("ShowtimeManager - Auto-selected cinema:", userData.cinema_id);
        }
      } else if (cinemasList.length > 0 && !selectedCinema) {
        // Chỉ set cinema đầu tiên nếu không phải showtime_manager
        const firstCinemaId = cinemasList[0].cinema_id;
        setSelectedCinema(firstCinemaId);
      }
      
      setCinemas(cinemasList);
    }
  }, [cinemasData, userData.role, userData.cinema_id]);

  // Khi chọn rạp, lấy danh sách phòng chiếu
  useEffect(() => {
    if (roomsData?.data?.theater_rooms) {
      const roomsList = roomsData.data.theater_rooms;
      setRooms(roomsList);
      if (roomsList.length > 0) {
        setSelectedRoom(roomsList[0].room_id);
      } else {
        setSelectedRoom("");
      }
    } else {
      setRooms([]);
      setSelectedRoom("");
    }
  }, [roomsData, selectedCinema]);

  // Lấy danh sách phim theo rạp đã chọn
  useEffect(() => {
    if (moviesData?.data?.movies) {
      setMovies(moviesData.data.movies);
    } else if (moviesData?.movies) {
      setMovies(moviesData.movies);
    } else {
      setMovies([]);
    }
  }, [moviesData, selectedCinema]);

  // Tự động tìm kiếm suất chiếu khi có đủ thông tin
  useEffect(() => {
    if (selectedCinema && selectedRoom && selectedDate) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [selectedCinema, selectedRoom, selectedDate]);

  // Xử lý tìm kiếm suất chiếu
  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    try {
      const filter = {
        cinema_id: selectedCinema,
        room_id: selectedRoom,
        date: selectedDate,
        status: statusFilter,
      };
      const res = await filteredShowtimesMutation.mutateAsync(filter);
      const mappedShowtimes = (res.data || []).map((item) => ({
        id: item.showtime_id,
        movie_id: item.movie_id,
        movie_name: item.movie?.movie_name || "",
        screen_type: item.screen_type || "2D",
        translation_type: item.translation_type || "Phụ đề",
        time_range:
          item.start_time && item.end_time
            ? `${new Date(item.start_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(item.end_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "",
        show_type: item.show_type || "",
        status: item.status || "",
        room_name: `${item.room?.room_name || ""} - ${
          item.room?.cinema?.cinema_name || ""
        }`,
        start_time: item.start_time,
        end_time: item.end_time,
        duration: item.movie?.duration || 0,
      }));
      setShowtimes(mappedShowtimes);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setShowtimes([]);
    }
    setLoading(false);
  };

  const toLocalTime = (isoString) => {
    const date = new Date(isoString);
    // Lấy giờ và phút theo local
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleEdit = (showtime) => {
    let date = "";
    let startTime = "";
    let endTime = "";
    if (showtime.start_time) {
      date = showtime.start_time.slice(0, 10);
      startTime = toLocalTime(showtime.start_time);
    }
    if (showtime.end_time) {
      endTime = toLocalTime(showtime.end_time);
    }
    console.log("showtime.start_time:", showtime.start_time);
    console.log("showtime.end_time:", showtime.end_time);
    setEditingShowtime({
      ...showtime,
      movieId: showtime.movie_id,
      date,
      startTime,
      endTime,
    });
    setIsFormVisible(true);
  };

  const handleReactivate = async (showtimeId) => {
    try {
      await reactivateShowtime.mutateAsync(showtimeId);
      handleSearch();
      toast.success("Kích hoạt lại suất chiếu thành công");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi khi kích hoạt lại suất chiếu!";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (showtimeId) => {
    setSelectedShowtime(showtimeId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteShowtime.mutateAsync(selectedShowtime);
      handleSearch();
      setIsDeleteModalVisible(false);
      setSelectedShowtime(null);
      toast.success("Xóa suất chiếu thành công");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi khi xóa suất chiếu!";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedShowtime(null);
  };

  // Thêm/sửa suất chiếu sử dụng API
  const handleAddOrUpdateShowtime = async (formData) => {
    // Tìm thông tin phim để lấy thời lượng
    const selectedMovie = movies.find(
      (m) => String(m.movie_id) === String(formData.movieId)
    );

    if (!selectedMovie) {
      toast.error("Không tìm thấy thông tin phim");
      return;
    }

    // Validation dữ liệu
    if (!formData.date || !formData.startTime) {
      toast.error("Vui lòng chọn ngày và thời gian bắt đầu");
      return;
    }

    if (!selectedMovie.duration) {
      toast.error("Không tìm thấy thông tin thời lượng phim");
      return;
    }

    // Tính toán end_time dựa trên thời lượng phim
    const startDateTime = new Date(`${formData.date} ${formData.startTime}`);
    const endDateTime = new Date(
      startDateTime.getTime() + selectedMovie.duration * 60000
    ); // duration * 60 * 1000 ms
    const endTime = endDateTime.toTimeString().slice(0, 5); // Lấy HH:mm

    // Validation room_id
    if (!selectedRoom) {
      toast.error("Vui lòng chọn phòng chiếu");
      return;
    }

    // Chuyển đổi dữ liệu cho backend - chỉ gửi những field backend cần
    const payload = {
      movie_id: parseInt(formData.movieId),
      room_id: parseInt(selectedRoom),
      start_time: `${formData.date} ${formData.startTime}`,
      end_time: `${formData.date} ${endTime}`,
    };

    console.log("Form data:", formData);
    console.log("Selected movie:", selectedMovie);
    console.log("Payload being sent:", payload);
    console.log("Selected room:", selectedRoom);
    console.log("Start time:", `${formData.date} ${formData.startTime}`);
    console.log("End time:", `${formData.date} ${endTime}`);
    try {
      if (editingShowtime && editingShowtime.id) {
        const res = await updateShowtime.mutateAsync({
          showtimeId: editingShowtime.id,
          showtimeData: payload,
        });
        if (res?.data?.status === false || res?.data?.code !== 200) {
          const msg = res?.data?.message || "Cập nhật suất chiếu thất bại";
          toast.error(msg);
          return;
        }
        toast.success("Cập nhật suất chiếu thành công");
      } else {
        const res = await createShowtime.mutateAsync(payload);
        console.log("Response from create showtime:", res);

        // Kiểm tra response theo cấu trúc thực tế
        if (res?.data?.status === false) {
          const msg = res?.data?.message || "Thêm suất chiếu thất bại";
          toast.error(msg);
          return;
        }

        if (res?.data?.code && res?.data?.code !== 200) {
          const msg = res?.data?.message || "Thêm suất chiếu thất bại";
          toast.error(msg);
          return;
        }

        toast.success("Thêm suất chiếu thành công");
      }
      setEditingShowtime(null);
      setIsFormVisible(false);
      handleSearch();
    } catch (err) {
      console.error("Error creating/updating showtime:", err);
      console.error("Error response:", err?.response?.data);

      // Xử lý lỗi validation từ backend
      if (err?.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const errorMessages = Object.values(validationErrors).flat();
        errorMessages.forEach((msg) => toast.error(msg));
        return;
      }

      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi khi thêm/sửa suất chiếu!";
      toast.error(errorMessage);
    }
  };

  const handleAddShowtime = () => {
    setEditingShowtime({
      date: selectedDate,
    });
    setIsFormVisible(true);
  };
  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingShowtime(null);
  };

  const handleViewSeats = (showtimeId) => {
    setSelectedShowtimeId(showtimeId);
    setShowSeatMapModal(true);
  };
  const handleCloseSeatMap = () => {
    setShowSeatMapModal(false);
    setSelectedShowtimeId(null);
  };

  const {
    data: seatMapData,
    isLoading: isLoadingSeatMap,
    isError: isErrorSeatMap,
    error: errorSeatMap,
  } = useGetSeatMapUS(selectedShowtimeId, {
    enabled: showSeatMapModal && !!selectedShowtimeId,
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <form
        className="flex flex-col md:flex-row gap-4 items-end bg-white rounded-xl shadow-md p-4 sm:p-6"
        onSubmit={handleSearch}
      >
        <div className="flex-1">
          <label className="block font-semibold mb-1">Rạp chiếu:</label>
          {userData.role === "showtime_manager" ? (
            <div className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium">
              {cinemas.find(c => c.cinema_id == selectedCinema)?.cinema_name || "Đang tải..."}
            </div>
          ) : (
            <select
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
              required
            >
              <option value="">Select a cinema</option>
              {cinemas.map((cinema) => (
                <option key={cinema.cinema_id} value={cinema.cinema_id}>
                  {cinema.cinema_name || cinema.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Phòng chiếu:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
            disabled={!selectedCinema}
            required
          >
            <option value="">Select a auditorium</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name || room.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Ngày chiếu:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-1">Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
          >
            <option value="">Tất cả</option>
            <option value="Sắp chiếu">Sắp chiếu</option>
            <option value="Đang chiếu">Đang chiếu</option>
            <option value="Đã chiếu">Đã chiếu</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold shadow-md transition-all cursor-pointer"
        >
          <FaSearch className="mr-2" />
          Tìm kiếm
        </button>
      </form>
      <div className="w-full">
        <Modal open={isFormVisible} onClose={handleCancelEdit}>
          <div className="min-w-[450px] max-w-[550px] min-h-[400px] max-h-[600px] overflow-y-auto">
            <ShowtimeForm
              initialData={editingShowtime}
              onSubmit={handleAddOrUpdateShowtime}
              onCancel={handleCancelEdit}
              movies={movies}
              mode={editingShowtime?.id ? "edit" : "add"}
              defaultDate={selectedDate}
            />
          </div>
        </Modal>

        <Modal open={isDeleteModalVisible} onClose={handleDeleteCancel}>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-500 mr-3 text-xl" />
              <h3 className="text-lg font-semibold">Xác nhận hủy suất chiếu</h3>
            </div>
            <p className="mb-4">
              Bạn có chắc chắn muốn hủy suất chiếu phim{" "}
              <span className="font-semibold">
                {selectedShowtime?.movie_name}
              </span>{" "}
              vào lúc{" "}
              <span className="font-semibold">
                {selectedShowtime?.time_range}
              </span>{" "}
              không?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </Modal>

        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          {/* Thông tin phía trên bảng */}
          <div className="mb-4">
            <div className="text-center font-semibold">
              Lịch chiếu ngày:{" "}
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("vi-VN")}
            </div>
            <div className="bg-blue-500 text-white text-center rounded py-2 my-2 font-semibold">
              Rạp:{" "}
              {(() => {
                const cinema = cinemas.find(
                  (c) => String(c.cinema_id) === String(selectedCinema)
                );
                return cinema?.cinema_name || cinema?.name || "";
              })()}
            </div>
            <div className="text-purple-600 font-semibold mb-2">
              {(() => {
                const room = rooms.find(
                  (r) => String(r.room_id) === String(selectedRoom)
                );
                return room?.room_name || room?.name || "";
              })()}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Số phim có sẵn: {movies.length} phim
            </div>
          </div>
          <ShowtimeTable
            showtimes={showtimes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onReactivate={handleReactivate}
            loading={loading}
            handleViewSeats={handleViewSeats}
          />
          <div className="flex justify-start mt-4 p-4">
            {movies.length === 0 && selectedCinema && (
              <div className="flex items-center text-orange-600 mb-2">
                <FaExclamationCircle className="mr-2" />
                <span>Không có phim nào được lên lịch chiếu cho rạp này</span>
              </div>
            )}
            <button
              onClick={handleAddShowtime}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold cursor-pointer"
              disabled={!selectedRoom || !selectedCinema || movies.length === 0}
            >
              <FaPlus className="mr-2" />
              Thêm lịch chiếu
            </button>
          </div>
        </div>
        {/* Modal hiển thị sơ đồ ghế */}
        {showSeatMapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
                onClick={handleCloseSeatMap}
              >
                &times;
              </button>
              <h3 className="text-lg font-bold mb-4 text-center">
                Sơ đồ ghế phòng chiếu
              </h3>
              {isLoadingSeatMap ? (
                <div>Đang tải sơ đồ ghế...</div>
              ) : isErrorSeatMap ? (
                <div className="text-red-500">
                  Lỗi: {errorSeatMap?.message || "Không thể tải sơ đồ ghế"}
                </div>
              ) : seatMapData?.data ? (
                <>
                  <div className="w-full bg-gray-800 text-white text-center py-2 rounded mb-4">
                    MÀN HÌNH
                  </div>
                  <div className="flex flex-col items-center overflow-x-auto">
                    {(() => {
                      let seatRows = seatMapData.data?.seat_map || [];
                      return seatRows.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center">
                          {row.map((seat) => (
                            <Seat
                              key={seat.seat_id}
                              label={seat.seat_display_name}
                              type={
                                seat.status === "unavailable"
                                  ? "unavailable"
                                  : seat.status === "booked"
                                  ? "vip"
                                  : "normal"
                              }
                            />
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                  {/* Chú thích */}
                  <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-purple-600" />{" "}
                      <span>Ghế thường</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-red-500" />{" "}
                      <span>Ghế đã đặt</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-pink-500" />{" "}
                      <span>Ghế COUPLE</span>
                    </div> */}
                  </div>
                </>
              ) : (
                <div>Không có dữ liệu ghế.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowtimeManagement;

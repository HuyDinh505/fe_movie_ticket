import axios from "../axios";
const NGROK_URL = import.meta.env.VITE_NGROK_URL || window.location.origin; // Đặt biến này trong .env của frontend
const END_POINT = {
  PHIM: "movie",
  CHITIETPHIM: "suatchieu/phim",
  LOAIVE: "ticket-type",
  DSGHE: "phong/dsghe",
  RAP: "rap",
  PHONG: "phong",
  BOOKING: "booking",
  DVANUONG: "dichvuanuong",
  USER: "user",
  USERS: "users",
  CINEMA: "cinema",
  GENRE: "genre",
  CONCESSION: "concession",
  THEATER_ROOMS: "room",
  SHOWTIME: "showtime",
  SCHEDULE: "movie-schedules",
  // MoMo Payment endpoints
  // MOMO_BOOK_AND_PAY: "payment/momo/book-and-pay",
  // MOMO_STATUS: "payment/momo/status",
  PAYMENT_INITIATE: "payment/initiate",
  PAYMENT_STATUS: "payment/status",
};

// =====================
// Helper/Utility
// =====================
// Hàm helper để tạo FormData
const createFormData = (data) => {
  const formData = new FormData();

  // Log để debug
  console.log("Creating FormData with:", data);

  // Xử lý từng trường dữ liệu
  Object.keys(data).forEach((key) => {
    if (key === "poster" && data[key] instanceof File) {
      console.log("Adding poster file:", data[key]);
      formData.append("poster", data[key], data[key].name);
    } else if (key === "avatar" && data[key] instanceof File) {
      // Chỉ thêm avatar nếu là File mới
      console.log("Adding avatar file:", data[key]);
      formData.append("avatar", data[key], data[key].name);
    } else if (key === "avatar" && data[key] === null) {
      // Nếu avatar là null, không thêm vào FormData để giữ ảnh cũ
      console.log("Keeping existing avatar");
    } else if (key === "genres_ids" && Array.isArray(data[key])) {
      data[key].forEach((id) => {
        console.log("Adding genre_id:", id);
        formData.append("genres_ids[]", id);
      });
    } else if (key === "actor") {
      console.log("Adding actor:", data[key]);
      formData.append("actor", data[key]);
    } else if (key === "screening_type") {
      console.log("Adding screening_type:", data[key]);
      formData.append("screening_type", data[key]);
    } else if (key === "screenin_type_ids" && Array.isArray(data[key])) {
      data[key].forEach((type) => {
        console.log("Adding screenin_type_id:", type);
        formData.append("screenin_type_ids[]", type);
      });
    } else {
      // Chuyển đổi tên trường để khớp với backend (nếu cần) và thêm vào FormData
      // Bao gồm cả password và password_confirmation
      let backendKey = key;
      let value = data[key];

      // Xử lý các trường cụ thể, nếu không thì dùng tên key mặc định
      switch (key) {
        case "movie_name":
          backendKey = "movie_name";
          break;
        case "description":
          backendKey = "description";
          break;
        case "duration":
          backendKey = "duration";
          value = parseInt(value);
          break;
        case "release_date":
          backendKey = "release_date";
          break;
        case "derector":
          backendKey = "derector";
          break;
        case "status":
          backendKey = "status";
          break;
        case "age_rating":
          backendKey = "age_rating";
          value = parseInt(value);
          break;
        case "country":
          backendKey = "country";
          break;
        case "user_id":
          backendKey = "user_id";
          break;
        case "full_name":
          backendKey = "full_name";
          break;
        case "email":
          backendKey = "email";
          break;
        case "password":
          backendKey = "password";
          break;
        case "password_confirmation":
          backendKey = "password_confirmation";
          break;
        case "phone":
          backendKey = "phone";
          break;
        case "role":
          backendKey = "role";
          break;
        case "birth_date":
          backendKey = "birth_date";
          break;
        case "gender":
          backendKey = "gender";
          break;
        case "_method":
          backendKey = "_method";
          break;
      }

      // Append _method for PATCH requests when updating, checking for 'id' OR 'user_id'
      if (
        (backendKey === "id" || backendKey === "user_id") &&
        value !== undefined &&
        value !== null
      ) {
        formData.append("_method", "put"); // Use 'put' as backend allows PUT/PATCH
      }

      // Kiểm tra giá trị trước khi thêm vào FormData
      if (value === undefined || value === null || value === "") {
        console.warn(`Warning: ${backendKey} is empty or undefined`);
      }

      if (value !== undefined && value !== null) {
        // Chỉ thêm nếu giá trị không phải undefined hoặc null
        console.log(`Adding ${backendKey}:`, value);
        formData.append(backendKey, value);
      }
    }
  });

  // Log FormData để debug
  console.log("Final FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }

  return formData;
};

// =====================
// Movie APIs (Phim)
// =====================
export const getPhimAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.PHIM,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    throw error;
  }
};

export const getPhimTheoRapAPI = async (cinemaId) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/cinema/${cinemaId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim theo rạp:", error);
    throw error;
  }
};

export const getChiTietPhimAPI = async (ma_phim) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/${ma_phim}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết phim:", error);
    throw error;
  }
};

export const getMovieWithShowtimesAPI = async (movieId) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/${movieId}/movieandshowtime`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phim và suất chiếu:", error);
    throw error;
  }
};

export const createPhimAPI = async (movieData) => {
  try {
    // Kiểm tra dữ liệu trước khi gửi
    console.log("Validating movie data before sending:");
    const requiredFields = [
      "movie_name",
      "description",
      "duration",
      "release_date",
      "derector",
      "status",
      "age_rating",
      "country",
      "genres_ids",
      "screening_type",
    ];

    requiredFields.forEach((field) => {
      if (!movieData[field]) {
        console.warn(`Missing required field: ${field}`);
      }
    });

    console.log("Movie data before FormData:", movieData);
    const formData = createFormData(movieData);

    // Log toàn bộ FormData trước khi gửi
    console.log("Final FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    const response = await axios({
      method: "POST",
      url: END_POINT.PHIM,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      transformRequest: [(data) => data], // Prevent axios from transforming FormData
    });

    return response.data;
  } catch (error) {
    console.error("Error in createPhimAPI:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Full error response:", error.response);

      // Log chi tiết lỗi validation nếu có
      if (error.response.data.errors) {
        console.error("Validation errors:", error.response.data.errors);
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            console.error(`Field ${field}:`, messages);
          }
        );
      }
    }
    throw error;
  }
};

export const updatePhimAPI = async (ma_phim, movieData) => {
  try {
    const formData = createFormData(movieData);
    formData.append("_method", "PUT"); // Thêm _method=PUT để Laravel xử lý như PUT request
    console.log("Sending PATCH request to:", `${END_POINT.PHIM}/${ma_phim}`);
    console.log("FormData:", Object.fromEntries(formData));
    const response = await axios({
      url: `${END_POINT.PHIM}/${ma_phim}`,
      method: "POST", // Vẫn giữ là POST nhưng thêm _method=PUT
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    console.log("Response from update:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật phim:",
      error.response?.data || error.message
    );
    // Log chi tiết lỗi validation nếu có
    if (error.response?.data?.errors) {
      console.error("Validation errors:", error.response.data.errors);
      Object.entries(error.response.data.errors).forEach(
        ([field, messages]) => {
          console.error(`Field ${field}:`, messages);
        }
      );
    }
    throw error;
  }
};

export const deletePhimAPI = async (ma_phim) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/${ma_phim}`,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi xóa phim ${ma_phim}:`, error);
    throw error;
  }
};

export const getDeletedMoviesAPI = async () => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/list/restore`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim đã xóa:", error);
    throw error;
  }
};

export const restoreMovieAPI = async (movieId) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/${movieId}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi khôi phục phim ${movieId}:`, error);
    throw error;
  }
};

// =====================
// Ticket Type APIs (Loại vé)
// =====================
export const getAllTicketTypesAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.LOAIVE,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại vé:", error);
    throw error;
  }
};

export const getDeletedTicketTypesAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.LOAIVE + "/list-restore",
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại vé đã xóa mềm:", error);
    throw error;
  }
};

export const createTicketTypeAPI = async (data) => {
  try {
    const formData = createFormData(data);
    const response = await axios({
      url: END_POINT.LOAIVE,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo loại vé:", error);
    throw error;
  }
};

export const updateTicketTypeAPI = async (id, data) => {
  try {
    const formData = createFormData(data);
    formData.append("_method", "PUT");
    const response = await axios({
      url: `${END_POINT.LOAIVE}/${id}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật loại vé:", error);
    throw error;
  }
};

export const deleteTicketTypeAPI = async (id) => {
  try {
    const response = await axios({
      url: `${END_POINT.LOAIVE}/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa loại vé:", error);
    throw error;
  }
};

export const restoreTicketTypeAPI = async (id) => {
  try {
    const response = await axios({
      url: `${END_POINT.LOAIVE}/${id}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi khôi phục loại vé:", error);
    throw error;
  }
};

// =====================
// Seat APIs (Ghế)
// =====================
export const getDSGHEAPI = async (ma_phong) => {
  try {
    const response = await axios({
      url: `${END_POINT.DSGHE}/${ma_phong}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghế:", error);
    throw error;
  }
};

export const getTrangThaiGheAPI = async (ma_suat_chieu) => {
  try {
    const response = await axios({
      url: `${END_POINT.DSGHE}/${ma_suat_chieu}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái ghế:", error);
    throw error;
  }
};

// =====================
// Cinema APIs (Rạp)
// =====================
export const getAllCinemasAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.CINEMA,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp:", error);
    throw error;
  }
};

export const getCinemaByIdAPI = async (cinemaId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CINEMA}/${cinemaId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin rạp:", error);
    throw error;
  }
};

export const createCinemaAPI = async (cinemaData) => {
  try {
    const formData = createFormData(cinemaData);
    const response = await axios({
      url: END_POINT.CINEMA,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo rạp:", error);
    throw error;
  }
};

export const updateCinemaAPI = async (cinemaId, cinemaData) => {
  try {
    const formData = createFormData(cinemaData);
    formData.append("_method", "PUT"); // Thêm _method=PUT để Laravel xử lý như PUT request
    const response = await axios({
      url: `${END_POINT.CINEMA}/${cinemaId}`,
      method: "POST", // Vẫn giữ là POST nhưng thêm _method=PUT
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin rạp:", error);
    throw error;
  }
};

export const deleteCinemaAPI = async (cinemaId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CINEMA}/${cinemaId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa rạp:", error);
    throw error;
  }
};

export const getDeletedCinemasAPI = async () => {
  try {
    const response = await axios({
      url: `${END_POINT.CINEMA}/list/restore`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách rạp đã xóa:", error);
    throw error;
  }
};

export const restoreCinemaAPI = async (cinemaId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CINEMA}/${cinemaId}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi khôi phục rạp ${cinemaId}:`, error);
    throw error;
  }
};

export const getPhongAPI = async (ma_phong) => {
  try {
    const response = await axios({
      url: `${END_POINT.PHONG}/${ma_phong}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phòng:", error);
    throw error;
  }
};

export const getRapAPI = async (ma_rap) => {
  try {
    const response = await axios({
      url: `${END_POINT.RAP}/${ma_rap}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin rạp:", error);
    throw error;
  }
};

export const getRapSCAPI = async (ma_phim) => {
  try {
    const response = await axios({
      url: `${END_POINT.CHITIETPHIM}/${ma_phim}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin rạp chiếu:", error);
    throw error;
  }
};

// =====================
// Theater Room APIs (Phòng chiếu)
// =====================
export const getAllTheaterRoomsAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.THEATER_ROOMS,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng chiếu:", error);
    throw error;
  }
};

export const getTheaterRoomByIdAPI = async (roomId) => {
  try {
    const response = await axios({
      url: `${END_POINT.THEATER_ROOMS}/${roomId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phòng chiếu:", error);
    throw error;
  }
};

export const createTheaterRoomAPI = async (roomData) => {
  try {
    const formData = createFormData(roomData);
    const response = await axios({
      url: END_POINT.THEATER_ROOMS,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo phòng chiếu:", error);
    throw error;
  }
};

export const updateTheaterRoomAPI = async (roomId, roomData) => {
  try {
    const formData = createFormData(roomData);
    formData.append("_method", "PUT"); // Thêm _method=PUT để Laravel xử lý như PUT request
    const response = await axios({
      url: `${END_POINT.THEATER_ROOMS}/${roomId}`,
      method: "POST", // Vẫn giữ là POST nhưng thêm _method=PUT
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin phòng chiếu:", error);
    throw error;
  }
};

export const deleteTheaterRoomAPI = async (roomId) => {
  try {
    const response = await axios({
      url: `${END_POINT.THEATER_ROOMS}/${roomId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa phòng chiếu:", error);
    throw error;
  }
};

export const restoreTheaterRoomAPI = async (roomId) => {
  try {
    const response = await axios({
      url: `${END_POINT.THEATER_ROOMS}/${roomId}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi khôi phục phòng chiếu:", error);
    throw error;
  }
};

export const getSeatMapByRoomIdAPI = async (roomId) => {
  try {
    const response = await axios({
      url: `room/${roomId}/listSeat`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy sơ đồ ghế phòng chiếu:", error);
    throw error;
  }
};

export const getTheaterRoomsByCinemaAPI = async (cinemaId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CINEMA}/${cinemaId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng chiếu của rạp:", error);
    throw error;
  }
};

// =====================
// Showtime APIs (Suất chiếu)
// =====================
export const getAllShowtimesAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.SHOWTIME,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách suất chiếu:", error);
    throw error;
  }
};

export const createShowtimeAPI = async (showtimeData) => {
  try {
    const response = await axios({
      url: END_POINT.SHOWTIME,
      method: "POST",
      data: showtimeData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo suất chiếu:", error);
    throw error;
  }
};

export const getShowtimeByIdAPI = async (showtimeId) => {
  try {
    const response = await axios({
      url: `${END_POINT.SHOWTIME}/${showtimeId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết suất chiếu:", error);
    throw error;
  }
};

export const updateShowtimeAPI = async (showtimeId, showtimeData) => {
  try {
    const response = await axios({
      url: `${END_POINT.SHOWTIME}/${showtimeId}`,
      method: "PUT",
      data: showtimeData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật suất chiếu:", error);
    throw error;
  }
};

export const deleteShowtimeAPI = async (showtimeId) => {
  try {
    const response = await axios({
      url: `${END_POINT.SHOWTIME}/${showtimeId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa suất chiếu:", error);
    throw error;
  }
};

export const reactivateShowtimeAPI = async (showtimeId) => {
  try {
    const response = await axios({
      url: `${END_POINT.SHOWTIME}/${showtimeId}/reactivate`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi kích hoạt lại suất chiếu:", error);
    throw error;
  }
};

export const getFilteredShowtimesAPI = async (filterData) => {
  try {
    const response = await axios({
      url: `${END_POINT.SHOWTIME}/getlistFilter`,
      method: "POST",
      data: filterData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lọc danh sách suất chiếu:", error);
    throw error;
  }
};

export const getSeatMapAPI = async (showtimeId) => {
  try {
    const response = await axios({
      url: `room/${showtimeId}/seatmap`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy sơ đồ ghế:", error);
    throw error;
  }
};

// =====================
// Concession APIs (Dịch vụ ăn uống)
// =====================
export const getAllConcessionsAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.CONCESSION,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách dịch vụ ăn uống:", error);
    throw error;
  }
};

export const getDVAnUongAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.CONCESSION,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách dịch vụ ăn uống:", error);
    throw error;
  }
};

export const getConcessionByIdAPI = async (concessionId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CONCESSION}/${concessionId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin dịch vụ ăn uống:", error);
    throw error;
  }
};

export const createConcessionAPI = async (concessionData) => {
  try {
    const formData = createFormData(concessionData);
    const response = await axios({
      url: END_POINT.CONCESSION,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo dịch vụ ăn uống:", error);
    throw error;
  }
};

export const updateConcessionAPI = async (concessionId, concessionData) => {
  try {
    const formData = createFormData(concessionData);
    formData.append("_method", "PUT");
    const response = await axios({
      url: `${END_POINT.CONCESSION}/${concessionId}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật dịch vụ ăn uống:", error);
    throw error;
  }
};

export const deleteConcessionAPI = async (concessionId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CONCESSION}/${concessionId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa dịch vụ ăn uống:", error);
    throw error;
  }
};
export const getDeletedConcessionAPI = async () => {
  try {
    const response = await axios({
      url: `${END_POINT.CONCESSION}/listDeleted`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thức ăn đã xóa:", error);
    throw error;
  }
};

export const restoreConcessionAPI = async (concessionId) => {
  try {
    const response = await axios({
      url: `${END_POINT.CONCESSION}/${concessionId}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi khôi phục dịch vụ ăn uống ${concessionId}: `, error);
    throw error;
  }
};

// =====================
// Genre APIs (Thể loại)
// =====================
export const getAllGenreAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.GENRE,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    throw error;
  }
};

export const getGenreByIdAPI = async (genreId) => {
  try {
    const response = await axios({
      url: `${END_POINT.GENRE}/${genreId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thể loại:", error);
    throw error;
  }
};

export const createGenreAPI = async (genreData) => {
  try {
    const formData = createFormData(genreData);
    const response = await axios({
      url: END_POINT.GENRE,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo thể loại:", error);
    throw error;
  }
};

export const updateGenreAPI = async (genreId, genreData) => {
  try {
    const formData = createFormData(genreData);
    const response = await axios({
      url: `${END_POINT.GENRE}/${genreId}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin thể loại:", error);
    throw error;
  }
};

export const deleteGenreAPI = async (genreId) => {
  try {
    const response = await axios({
      url: `${END_POINT.GENRE}/${genreId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa thể loại:", error);
    throw error;
  }
};

export const restoreGenreAPI = async (genreId) => {
  try {
    const response = await axios({
      url: `${END_POINT.GENRE}/${genreId}/restore`,
      method: "POST",
    });
    return response;
  } catch (error) {
    console.error(`Lỗi khi khôi phục thể loại ${genreId}:`, error);
    throw error;
  }
};

export const getDeletedGenresAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.GENRE + "/list-restore",
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại đã xóa mềm:", error);
    throw error;
  }
};

// =====================
// User APIs (Người dùng)
// =====================
export const getAllUsersAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.USERS,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};

export const getUserByIdAPI = async (userId) => {
  try {
    const response = await axios({
      url: `${END_POINT.USERS}/${userId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};

export const createUserAPI = async (userData) => {
  try {
    const formData = createFormData(userData);
    const response = await axios({
      url: END_POINT.USERS,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Full error response:", error.response);
    }
    throw error;
  }
};

export const updateUserAPI = async (userId, userData) => {
  try {
    if (!userData.avatar || !(userData.avatar instanceof File)) {
      userData.avatar = null;
    }

    const formData = createFormData(userData);
    formData.append("_method", "PATCH");
    console.log("Sending FormData for user update:", formData);
    console.log("User ID for update:", userId);

    const response = await axios({
      url: `${END_POINT.USERS}/${userId}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Full error response:", error.response);
    }
    throw error;
  }
};

export const deleteUserAPI = async (userId) => {
  try {
    const response = await axios({
      url: `${END_POINT.USERS}/${userId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};

export const getCurrentUserAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.USER,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân user:", error);
    throw error;
  }
};

// =====================
// Booking APIs (Đặt vé)
// =====================
export const postBooKingAPI = async (bookingData) => {
  try {
    const response = await axios({
      url: END_POINT.BOOKING,
      method: "POST",
      data: bookingData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi đặt vé:", error);
    throw error;
  }
};

// =====================
// Payment APIs (New)
// =====================
export const initiatePaymentAPI = async (bookingData) => {
  try {
    // Thêm callback URL cho MoMo/Onepay
    const payload = {
      ...bookingData,
      returnUrl: `${NGROK_URL}/api/payment/momo/return`,
      notifyUrl: `${NGROK_URL}/api/payment/momo/ipn`,
      // Nếu dùng Onepay hoặc các cổng khác, backend sẽ tự nhận biết qua method
    };
    const response = await axios({
      url: END_POINT.PAYMENT_INITIATE,
      method: "POST",
      data: payload,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi khởi tạo thanh toán:", error);
    throw error;
  }
};

export const checkPaymentStatusAPI = async (params = {}) => {
  try {
    const response = await axios({
      url: END_POINT.PAYMENT_STATUS,
      method: "GET",
      params,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
    throw error;
  }
};

// =====================
// Movie Schedule APIs (Lịch chiếu)
// =====================
export const getAllMovieSchedulesAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.SCHEDULE,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lịch chiếu:", error);
    throw error;
  }
};

export const getMovieScheduleByIdAPI = async (id) => {
  try {
    const response = await axios({
      url: `${END_POINT.SCHEDULE}/${id}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết lịch chiếu:", error);
    throw error;
  }
};

export const createMovieScheduleAPI = async (data) => {
  try {
    const response = await axios({
      url: END_POINT.SCHEDULE,
      method: "POST",
      data,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo lịch chiếu:", error);
    throw error;
  }
};

export const updateMovieScheduleAPI = async (id, data) => {
  try {
    const response = await axios({
      url: `${END_POINT.SCHEDULE}/${id}`,
      method: "PUT",
      data,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật lịch chiếu:", error);
    throw error;
  }
};

export const deleteMovieScheduleAPI = async (id) => {
  try {
    const response = await axios({
      url: `${END_POINT.SCHEDULE}/${id}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa lịch chiếu:", error);
    throw error;
  }
};

// =====================
// Booking APIs (Đặt vé)
// =====================
export const getAllBookingsAPI = async () => {
  try {
    const response = await axios({
      url: END_POINT.BOOKING,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt vé:", error);
    throw error;
  }
};

export const getBookingByIdAPI = async (bookingId) => {
  try {
    const response = await axios({
      url: `${END_POINT.BOOKING}/${bookingId}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đặt vé:", error);
    throw error;
  }
};

export const createBookingAPI = async (bookingData) => {
  try {
    const response = await axios({
      url: END_POINT.BOOKING,
      method: "POST",
      data: bookingData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi tạo đặt vé:", error);
    throw error;
  }
};

export const updateBookingAPI = async (bookingId, bookingData) => {
  try {
    const response = await axios({
      url: `${END_POINT.BOOKING}/${bookingId}`,
      method: "PUT",
      data: bookingData,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật đặt vé:", error);
    throw error;
  }
};

export const deleteBookingAPI = async (bookingId) => {
  try {
    const response = await axios({
      url: `${END_POINT.BOOKING}/${bookingId}`,
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xóa đặt vé:", error);
    throw error;
  }
};

// Lấy danh sách phim cho district manager
export const getManagedMoviesAPI = async () => {
  try {
    const response = await axios({
      url: `${END_POINT.PHIM}/managed/list`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim quản lý:", error);
    throw error;
  }
};

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import {
  getChiTietPhimAPI,
  getDSGHEAPI,
  getDVAnUongAPI,
  // getLoaiVeAPI,
  getPhimAPI,
  getPhimTheoRapAPI,
  getPhongAPI,
  getRapAPI,
  getRapSCAPI,
  postBooKingAPI,
  getTrangThaiGheAPI,
  createPhimAPI,
  updatePhimAPI,
  deletePhimAPI,
  getAllUsersAPI,
  getUserByIdAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  getAllCinemasAPI,
  getCinemaByIdAPI,
  createCinemaAPI,
  updateCinemaAPI,
  deleteCinemaAPI,
  getDeletedCinemasAPI,
  restoreCinemaAPI,
  getAllGenreAPI,
  getGenreByIdAPI,
  createGenreAPI,
  updateGenreAPI,
  deleteGenreAPI,
  getAllConcessionsAPI,
  getConcessionByIdAPI,
  createConcessionAPI,
  updateConcessionAPI,
  deleteConcessionAPI,
  restoreConcessionAPI,
  getTheaterRoomsByCinemaAPI,
  getAllTheaterRoomsAPI,
  getTheaterRoomByIdAPI,
  createTheaterRoomAPI,
  updateTheaterRoomAPI,
  deleteTheaterRoomAPI,
  restoreTheaterRoomAPI,
  getSeatMapByRoomIdAPI,
  getCurrentUserAPI,
  getAllShowtimesAPI,
  createShowtimeAPI,
  getShowtimeByIdAPI,
  updateShowtimeAPI,
  deleteShowtimeAPI,
  reactivateShowtimeAPI,
  getFilteredShowtimesAPI,
  getDeletedMoviesAPI,
  restoreMovieAPI,
  getDeletedConcessionAPI,
  getMovieWithShowtimesAPI,
  getSeatMapAPI,
  initiatePaymentAPI,
  checkPaymentStatusAPI,
  // testAPI,
  // testMomoAPI,
  getAllMovieSchedulesAPI,
  getMovieScheduleByIdAPI,
  createMovieScheduleAPI,
  updateMovieScheduleAPI,
  deleteMovieScheduleAPI,
  restoreGenreAPI,
  getDeletedGenresAPI,
  getAllTicketTypesAPI,
  getDeletedTicketTypesAPI,
  createTicketTypeAPI,
  updateTicketTypeAPI,
  deleteTicketTypeAPI,
  restoreTicketTypeAPI,
  getAllBookingsAPI,
  getBookingByIdAPI,
  createBookingAPI,
  updateBookingAPI,
  deleteBookingAPI,
  getManagedMoviesAPI,
  getAllPromotionsAPI,
  getPromotionByIdAPI,
  createPromotionAPI,
  updatePromotionAPI,
  deletePromotionAPI,
  getUserPromotionsAPI,
  calculatePromotionAPI,
  getScreenTypeAPI,
} from "./request";
import { optionsUseQuery } from "../../Utilities/common";

// =====================
// Movie APIs (Phim)
// =====================

export const useGetPhimUS = (option) => {
  return useQuery({
    queryKey: ["GetPhimAPI"],
    queryFn: getPhimAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetPhimTheoRapUS = (cinemaId, option) => {
  return useQuery({
    queryKey: ["GetPhimTheoRapAPI", cinemaId],
    queryFn: () => getPhimTheoRapAPI(cinemaId),
    enabled: !!cinemaId,
    optionsUseQuery,
    ...option,
  });
};

export const useGetChiTietPhimUS = (ma_phim, option) => {
  return useQuery({
    queryKey: ["GetChiTietPhimAPI", ma_phim],
    queryFn: () => getChiTietPhimAPI(ma_phim),
    optionsUseQuery,
    ...option,
  });
};

export const useGetMovieWithShowtimesUS = (movieId, option) => {
  return useQuery({
    queryKey: ["GetMovieWithShowtimesAPI", movieId],
    queryFn: () => getMovieWithShowtimesAPI(movieId),
    enabled: !!movieId,
    optionsUseQuery,
    ...option,
  });
};
// Hook thêm phim mới
export const useCreatePhimUS = (option) => {
  return useMutation({
    mutationFn: createPhimAPI,
    ...option,
  });
};

// Hook cập nhật phim
export const useUpdatePhimUS = (option) => {
  return useMutation({
    mutationFn: ({ ma_phim, movieData }) => updatePhimAPI(ma_phim, movieData),
    ...option,
  });
};

// Hook xóa phim
export const useDeletePhimUS = (option) => {
  return useMutation({
    mutationFn: deletePhimAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetDeletedMoviesUS = (option) => {
  return useQuery({
    queryKey: ["GetDeletedMoviesAPI"],
    queryFn: getDeletedMoviesAPI,
    ...option,
  });
};

export const useRestoreMovieUS = (option) => {
  return useMutation({
    mutationFn: restoreMovieAPI,
    ...option,
  });
};

// export const useGetLoaiVeUS = (option) => {
//   return useQuery({
//     queryKey: ["GetLoaiVeAPI"],
//     queryFn: getLoaiVeAPI,
//     optionsUseQuery,
//     ...option,
//   });
// };

export const useGetDVAnUongUS = (option) => {
  return useQuery({
    queryKey: ["GetDVAnUongAPI"],
    queryFn: getDVAnUongAPI,
    optionsUseQuery,
    ...option,
  });
};

// Ticket Type hooks
export const useGetAllTicketTypesUS = (option) => {
  return useQuery({
    queryKey: ["GetAllTicketTypesAPI"],
    queryFn: getAllTicketTypesAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetDeletedTicketTypesUS = (option) => {
  return useQuery({
    queryKey: ["GetDeletedTicketTypesAPI"],
    queryFn: getDeletedTicketTypesAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateTicketTypeUS = (option) => {
  return useMutation({
    mutationFn: createTicketTypeAPI,
    ...option,
  });
};

export const useUpdateTicketTypeUS = (option) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateTicketTypeAPI(id, data),
    ...option,
  });
};

export const useDeleteTicketTypeUS = (option) => {
  return useMutation({
    mutationFn: deleteTicketTypeAPI,
    ...option,
  });
};

export const useRestoreTicketTypeUS = (option) => {
  return useMutation({
    mutationFn: restoreTicketTypeAPI,
    ...option,
  });
};

//ghế
export const useGetDSGheUS = (ma_phong, option) => {
  return useQuery({
    queryKey: ["GetDSGheAPI", ma_phong],
    queryFn: () => getDSGHEAPI(ma_phong),
    optionsUseQuery,
    ...option,
  });
};
export const useGetTrangThaiGheUS = (ma_suat_chieu, option) => {
  return useQuery({
    queryKey: ["GetTrangThaiGheAPI", ma_suat_chieu],
    queryFn: () => getTrangThaiGheAPI(ma_suat_chieu),
    enabled: !!ma_suat_chieu,
    optionsUseQuery,
    ...option,
  });
};

// Cinema hooks
export const useGetAllCinemasUS = (option) => {
  return useQuery({
    queryKey: ["GetAllCinemasAPI"],
    queryFn: getAllCinemasAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetCinemaByIdUS = (cinemaId, option) => {
  return useQuery({
    queryKey: ["GetCinemaByIdAPI", cinemaId],
    queryFn: () => getCinemaByIdAPI(cinemaId),
    enabled: !!cinemaId,
    ...optionsUseQuery,
    ...option,
  });
};

export const useCreateCinemaUS = (option) => {
  return useMutation({
    mutationFn: createCinemaAPI,
    ...option,
  });
};

export const useUpdateCinemaUS = (option) => {
  return useMutation({
    mutationFn: ({ cinemaId, cinemaData }) =>
      updateCinemaAPI(cinemaId, cinemaData),
    ...option,
  });
};

export const useDeleteCinemaUS = (option) => {
  return useMutation({
    mutationFn: deleteCinemaAPI,
    ...option,
  });
};

export const useGetDeletedCinemasUS = (option) => {
  return useQuery({
    queryKey: ["GetDeletedCinemasAPI"],
    queryFn: getDeletedCinemasAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useRestoreCinemaUS = (option) => {
  return useMutation({
    mutationFn: restoreCinemaAPI,
    ...option,
  });
};
export const useGetRapUS = (ma_rap, option) => {
  return useQuery({
    queryKey: ["GetRapAPI", ma_rap],
    queryFn: () => getRapAPI(ma_rap),
    optionsUseQuery,
    ...option,
  });
};

export const useGePhongUS = (ma_phong, option) => {
  return useQuery({
    queryKey: ["GetPhongAPI", ma_phong],
    queryFn: () => getPhongAPI(ma_phong),
    optionsUseQuery,
    ...option,
  });
};
export const useGetRapSCUS = (ma_phim, option) => {
  return useQuery({
    queryKey: ["GetRapSCAPI", ma_phim],
    queryFn: () => getRapSCAPI(ma_phim),
    optionsUseQuery,
    ...option,
  });
};

//Phòng chiếu
// Thêm các hooks cho phòng chiếu
export const useGetAllTheaterRoomsUS = (option) => {
  return useQuery({
    queryKey: ["GetAllTheaterRoomsAPI"],
    queryFn: getAllTheaterRoomsAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetTheaterRoomByIdUS = (roomId, option) => {
  return useQuery({
    queryKey: ["GetTheaterRoomByIdAPI", roomId],
    queryFn: () => getTheaterRoomByIdAPI(roomId),
    enabled: !!roomId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateTheaterRoomUS = (option) => {
  return useMutation({
    mutationFn: createTheaterRoomAPI,
    ...option,
  });
};

export const useUpdateTheaterRoomUS = (option) => {
  return useMutation({
    mutationFn: ({ roomId, roomData }) =>
      updateTheaterRoomAPI(roomId, roomData),
    ...option,
  });
};

export const useDeleteTheaterRoomUS = (option) => {
  return useMutation({
    mutationFn: deleteTheaterRoomAPI,
    ...option,
  });
};

export const useRestoreTheaterRoomUS = (option) => {
  return useMutation({
    mutationFn: restoreTheaterRoomAPI,
    ...option,
  });
};

// Hook lấy sơ đồ ghế của 1 phòng chiếu
export const useGetSeatMapByRoomIdUS = (roomId, option) => {
  return useQuery({
    queryKey: ["GetSeatMapByRoomIdAPI", roomId],
    queryFn: () => getSeatMapByRoomIdAPI(roomId),
    enabled: !!roomId,
    optionsUseQuery,
    ...option,
  });
};

// Showtime hooks
export const useGetAllShowtimesUS = (option) => {
  return useQuery({
    queryKey: ["GetAllShowtimesAPI"],
    queryFn: getAllShowtimesAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateShowtimeUS = (option) => {
  return useMutation({
    mutationFn: createShowtimeAPI,
    ...option,
  });
};

export const useGetShowtimeByIdUS = (showtimeId, option) => {
  return useQuery({
    queryKey: ["GetShowtimeByIdAPI", showtimeId],
    queryFn: () => getShowtimeByIdAPI(showtimeId),
    enabled: !!showtimeId,
    optionsUseQuery,
    ...option,
  });
};

export const useUpdateShowtimeUS = (option) => {
  return useMutation({
    mutationFn: ({ showtimeId, showtimeData }) =>
      updateShowtimeAPI(showtimeId, showtimeData),
    ...option,
  });
};

export const useDeleteShowtimeUS = (option) => {
  return useMutation({
    mutationFn: deleteShowtimeAPI,
    ...option,
  });
};

export const useReactivateShowtimeUS = (option) => {
  return useMutation({
    mutationFn: reactivateShowtimeAPI,
    ...option,
  });
};

export const useGetFilteredShowtimesUS = (option) => {
  return useMutation({
    mutationFn: getFilteredShowtimesAPI,
    ...option,
  });
};

export const useGetSeatMapUS = (showtimeId, option) => {
  return useQuery({
    queryKey: ["GetSeatMapAPI", showtimeId],
    queryFn: () => getSeatMapAPI(showtimeId),
    enabled: !!showtimeId,
    optionsUseQuery,
    ...option,
  });
};

// Concession hooks
export const useGetAllConcessionsUS = (option) => {
  return useQuery({
    queryKey: ["GetAllConcessionsAPI"],
    queryFn: getAllConcessionsAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetConcessionByIdUS = (concessionId, option) => {
  return useQuery({
    queryKey: ["GetConcessionByIdAPI", concessionId],
    queryFn: () => getConcessionByIdAPI(concessionId),
    enabled: !!concessionId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateConcessionUS = (option) => {
  return useMutation({
    mutationFn: createConcessionAPI,
    ...option,
  });
};

export const useUpdateConcessionUS = (option) => {
  return useMutation({
    mutationFn: ({ concessionId, concessionData }) =>
      updateConcessionAPI(concessionId, concessionData),
    ...option,
  });
};

export const useDeleteConcessionUS = (option) => {
  return useMutation({
    mutationFn: deleteConcessionAPI,
    ...option,
  });
};
export const useGetDeletedConcessionUS = (option) => {
  return useQuery({
    queryKey: ["getDeletedConcessionAPI"],
    queryFn: getDeletedConcessionAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useRestoreConcessionUS = (option) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (concessionId) => restoreConcessionAPI(concessionId),
    onSuccess: () => {
      // Invalidate và refetch danh sách concession đã xóa
      queryClient.invalidateQueries({ queryKey: ["deletedConcessions"] });
      // Invalidate danh sách concession thường
      queryClient.invalidateQueries({ queryKey: ["concessions"] });
    },
    onError: (error) => {
      console.error("Lỗi khi khôi phục concession:", error);
    },
    ...option,
  });
};
// Thêm hook mới để lấy phòng chiếu của rạp
export const useGetTheaterRoomsByCinemaUS = (cinemaId, option) => {
  return useQuery({
    queryKey: ["GetTheaterRoomsByCinemaAPI", cinemaId],
    queryFn: () => getTheaterRoomsByCinemaAPI(cinemaId),
    enabled: !!cinemaId,
    optionsUseQuery,
    ...option,
  });
};
// Genre hooks
export const useGetAllGenresUS = (option) => {
  return useQuery({
    queryKey: ["GetAllGenresAPI"],
    queryFn: getAllGenreAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetGenreByIdUS = (genreId, option) => {
  return useQuery({
    queryKey: ["GetGenreByIdAPI", genreId],
    queryFn: () => getGenreByIdAPI(genreId),
    enabled: !!genreId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateGenreUS = (option) => {
  return useMutation({
    mutationFn: createGenreAPI,
    ...option,
  });
};

export const useUpdateGenreUS = (option) => {
  return useMutation({
    mutationFn: ({ genreId, genreData }) => updateGenreAPI(genreId, genreData),
    ...option,
  });
};

export const useDeleteGenreUS = (option) => {
  return useMutation({
    mutationFn: deleteGenreAPI,
    ...option,
  });
};

export const useRestoreGenreUS = (option) => {
  return useMutation({
    mutationFn: restoreGenreAPI,
    ...option,
  });
};
// Thêm các hooks cho user
export const useGetAllUsersUS = (option) => {
  return useQuery({
    queryKey: ["GetAllUsersAPI"],
    queryFn: getAllUsersAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetUserByIdUS = (userId, option) => {
  return useQuery({
    queryKey: ["GetUserByIdAPI", userId],
    queryFn: () => getUserByIdAPI(userId),
    enabled: !!userId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateUserUS = (option) => {
  return useMutation({
    mutationFn: createUserAPI,
    ...option,
  });
};

export const useUpdateUserUS = (option) => {
  return useMutation({
    mutationFn: ({ userId, userData }) => {
      console.log("[useUpdateUserUS] Gọi updateUserAPI với:", { userId, userData });
      return updateUserAPI(userId, userData);
    },
    ...option,
  });
};

export const useDeleteUserUS = (option) => {
  return useMutation({
    mutationFn: deleteUserAPI,
    ...option,
  });
};

// Hook lấy thông tin cá nhân user hiện tại
export const useGetCurrentUserUS = (option) => {
  return useQuery({
    queryKey: ["GetCurrentUserAPI"],
    queryFn: getCurrentUserAPI,
    optionsUseQuery,
    ...option,
  });
};

// =====================
// Payment Hooks (New)
// =====================
export const useInitiatePaymentUS = (option) => {
  return useMutation({
    mutationFn: initiatePaymentAPI,
    ...option,
  });
};

export const useCheckPaymentStatusUS = (option) => {
  return useMutation({
    mutationFn: checkPaymentStatusAPI,
    ...option,
  });
};

// // =====================
// // Test Hooks
// // =====================
// export const useTestAPIUS = (option) => {
//   return useQuery({
//     queryKey: ["TestAPI"],
//     queryFn: testAPI,
//     ...option,
//   });
// };

// export const useTestMomoAPIUS = (option) => {
//   return useMutation({
//     mutationFn: testMomoAPI,
//     ...option,
//   });
// };

// Lịch chiếu
export const useGetAllMovieSchedulesUS = (option) => {
  return useQuery({
    queryKey: ["GetAllMovieSchedulesAPI"],
    queryFn: getAllMovieSchedulesAPI,
    ...option,
  });
};

export const useGetMovieScheduleByIdUS = (id, option) => {
  return useQuery({
    queryKey: ["GetMovieScheduleByIdAPI", id],
    queryFn: () => getMovieScheduleByIdAPI(id),
    enabled: !!id,
    ...option,
  });
};

export const useCreateMovieScheduleUS = (option) => {
  return useMutation({
    mutationFn: createMovieScheduleAPI,
    ...option,
  });
};

export const useUpdateMovieScheduleUS = (option) => {
  return useMutation({
    mutationFn: ({ id, data }) => updateMovieScheduleAPI(id, data),
    ...option,
  });
};

export const useDeleteMovieScheduleUS = (option) => {
  return useMutation({
    mutationFn: deleteMovieScheduleAPI,
    ...option,
  });
};

export const useGetDeletedGenresUS = (option) => {
  return useQuery({
    queryKey: ["GetDeletedGenresAPI"],
    queryFn: getDeletedGenresAPI,
    ...option,
  });
};

// =====================
// Booking Hooks (Đặt vé)
// =====================
//booking
export const usePostBookingUS = (option) => {
  return useMutation({
    mutationFn: postBooKingAPI,
    ...option,
  });
};
export const useGetAllBookingsUS = (option) => {
  return useQuery({
    queryKey: ["GetAllBookingsAPI"],
    queryFn: getAllBookingsAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetBookingByIdUS = (bookingId, option) => {
  return useQuery({
    queryKey: ["GetBookingByIdAPI", bookingId],
    queryFn: () => getBookingByIdAPI(bookingId),
    enabled: !!bookingId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreateBookingUS = (option) => {
  return useMutation({
    mutationFn: createBookingAPI,
    ...option,
  });
};

export const useUpdateBookingUS = (option) => {
  return useMutation({
    mutationFn: ({ bookingId, bookingData }) =>
      updateBookingAPI(bookingId, bookingData),
    ...option,
  });
};

export const useDeleteBookingUS = (option) => {
  return useMutation({
    mutationFn: deleteBookingAPI,
    ...option,
  });
};

//district manager
export const useGetManagedMoviesUS = (option) => {
  return useQuery({
    queryKey: ["GetManagedMoviesAPI"],
    queryFn: getManagedMoviesAPI,
    optionsUseQuery,
    ...option,
  });
};

// =====================
// Promotion Hooks (Khuyến mãi)
// =====================
export const useGetAllPromotionsUS = (option) => {
  return useQuery({
    queryKey: ["GetAllPromotionsAPI"],
    queryFn: getAllPromotionsAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useGetPromotionByIdUS = (promotionId, option) => {
  return useQuery({
    queryKey: ["GetPromotionByIdAPI", promotionId],
    queryFn: () => getPromotionByIdAPI(promotionId),
    enabled: !!promotionId,
    optionsUseQuery,
    ...option,
  });
};

export const useCreatePromotionUS = (option) => {
  return useMutation({
    mutationFn: createPromotionAPI,
    ...option,
  });
};

export const useUpdatePromotionUS = (option) => {
  return useMutation({
    mutationFn: ({ id, data }) => updatePromotionAPI(id, data),
    ...option,
  });
};

export const useDeletePromotionUS = (option) => {
  return useMutation({
    mutationFn: deletePromotionAPI,
    ...option,
  });
};

export const useGetUserPromotionsUS = (option) => {
  return useQuery({
    queryKey: ["GetUserPromotionsAPI"],
    queryFn: getUserPromotionsAPI,
    optionsUseQuery,
    ...option,
  });
};

export const useCalculatePromotionUS = (option) => {
  return useMutation({
    mutationFn: calculatePromotionAPI,
    ...option,
  });
};

// ScreenType
export const useGetScreenTypeUS = (option) => {
  return useQuery({
    queryKey: ["getScreenTypeAPI"],
    queryFn: getScreenTypeAPI,
    optionsUseQuery,
    ...option,
  });
};

import React from "react";
import {
  useGetDeleteAllMovieSchedulesUS,
  useRestoreScheduleUS,
  useGetPhimUS,
  useGetAllCinemasUS,
} from "../../../api/homePage";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import ScheduleTable from "../../../components/admin/Schedule/ScheduleTable";
import { getApiMessage, handleApiError } from "../../../Utilities/apiMessage";
import Swal from "sweetalert2";

const DeleteSchedule = () => {
  const { data, isLoading: isSchedulesLoading } =
    useGetDeleteAllMovieSchedulesUS({ staleTime: 0 });
  const { data: moviesData, isLoading: isMoviesLoading } = useGetPhimUS({
    staleTime: 0,
  });
  const { data: cinemasData, isLoading: isCinemasLoading } = useGetAllCinemasUS(
    { staleTime: 0 }
  );

  const restoreSchedule = useRestoreScheduleUS();

  const queryClient = useQueryClient();

  const deletedSchedules = Array.isArray(data?.data) ? data.data : [];
  const movieList = Array.isArray(moviesData?.data) ? moviesData.data : [];
  const cinemaList = Array.isArray(cinemasData?.data) ? cinemasData.data : [];

  // Trạng thái loading chung
  const isLoading = isSchedulesLoading || isMoviesLoading || isCinemasLoading;

  // Hàm xử lý việc khôi phục lịch chiếu, sử dụng SweetAlert2 để xác nhận
  const handleAskRestore = (scheduleId) => {
    Swal.fire({
      title: "Bạn có chắc chắn không?",
      text: "Bạn muốn khôi phục lịch chiếu này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Vâng, khôi phục nó!",
      cancelButtonText: "Hủy bỏ",
      reverseButtons: true,
    }).then((result) => {
      // Nếu người dùng xác nhận
      if (result.isConfirmed) {
        // Gọi mutation để khôi phục lịch chiếu với scheduleId tương ứng
        restoreSchedule.mutate(scheduleId, {
          // Xử lý khi API call thành công
          onSuccess: (response) => {
            // Kiểm tra trạng thái trả về từ API
            if (response?.data?.status === false) {
              handleApiError(response.data, "Khôi phục lịch chiếu thất bại");
              return;
            }
            // Hiển thị thông báo thành công
            toast.success(
              getApiMessage(response, "Khôi phục lịch chiếu thành công")
            );
            // Invalidate (vô hiệu hóa) các queries liên quan để React Query fetch lại dữ liệu
            queryClient.invalidateQueries({
              queryKey: ["useGetDeleteAllMovieSchedulesUS"],
            });
            queryClient.invalidateQueries({
              queryKey: ["useGetAllMovieSchedulesUS"],
            }); // Giả định có hook này
          },
          // Xử lý khi API call thất bại
          onError: (error) => {
            toast.error(getApiMessage(error, "Không thể khôi phục lịch chiếu"));
          },
        });
      }
    });
  };

  return (
    <div className="ml-2 space-y-6 sm:space-y-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight mb-4 sm:mb-0">
          Danh sách Lịch chiếu đã xóa
        </h1>
      </div>
      <div className="w-full">
        {/* Render bảng hiển thị danh sách lịch chiếu đã xóa */}
        <ScheduleTable
          schedules={deletedSchedules}
          movieList={movieList}
          cinemaList={cinemaList}
          onDelete={handleAskRestore} // Sử dụng onDelete để trigger hành động khôi phục
          loading={isLoading}
          isDeletedView={true} // Bật chế độ hiển thị cho các mục đã xóa
        />
      </div>
    </div>
  );
};

export default DeleteSchedule;

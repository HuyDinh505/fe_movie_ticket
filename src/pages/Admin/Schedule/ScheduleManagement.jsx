import React, { useState, useContext } from "react";
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
} from "../../../api/homePage/queries";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../contexts/AuthContext";

const ScheduleManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });
  const queryClient = useQueryClient();

  // Lấy role hiện tại
  const { userData } = useContext(AuthContext);
  const role =
    userData?.role || (Array.isArray(userData?.roles) ? userData.roles[0] : "");

  // Lấy danh sách lịch chiếu
  const { data: schedulesData, isLoading: loadingSchedules } =
    useGetAllMovieSchedulesUS();
  const schedules = schedulesData?.data || [];

  // Lấy danh sách phim phù hợp theo role
  const { data: allMoviesData, isLoading: loadingAllMovies } = useGetPhimUS();
  const { data: managedMoviesData, isLoading: loadingManagedMovies } =
    useGetManagedMoviesUS();
  const movieList =
    role === "manager_district" || role === "district_manager"
      ? managedMoviesData?.data?.movies || managedMoviesData?.data || []
      : allMoviesData?.data?.movies || allMoviesData?.data || [];

  // Lấy danh sách rạp chiếu
  const { data: cinemasData, isLoading: loadingCinemas } = useGetAllCinemasUS();
  const cinemaList = cinemasData?.data || [];

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
            if (
              response?.data?.status === false ||
              (response?.data?.code && response?.data?.code >= 400)
            ) {
              const msg =
                response?.data?.message || "Cập nhật lịch chiếu thất bại";
              toast.error(msg);
              return;
            }
            toast.success("Cập nhật lịch chiếu thành công");
            setIsFormVisible(false);
            setEditingSchedule(null);
            queryClient.invalidateQueries(["GetAllMovieSchedulesAPI"]);
          },
          onError: (error) => {
            console.error("Update schedule error:", error);
            const msg =
              error?.response?.data?.message ||
              error?.message ||
              "Cập nhật lịch chiếu thất bại";
            toast.error(msg);
          },
        }
      );
    } else {
      createSchedule.mutate(data, {
        onSuccess: (response) => {
          console.log("Create schedule response:", response);
          if (
            response?.data?.status === false ||
            (response?.data?.code && response?.data?.code >= 400)
          ) {
            const msg = response?.data?.message || "Thêm lịch chiếu thất bại";
            toast.error(msg);
            return;
          }
          toast.success("Thêm lịch chiếu thành công");
          setIsFormVisible(false);
          queryClient.invalidateQueries(["GetAllMovieSchedulesAPI"]);
        },
        onError: (error) => {
          console.error("Create schedule error:", error);
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Thêm lịch chiếu thất bại";
          toast.error(msg);
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
      onSuccess: () => {
        toast.success("Xóa lịch chiếu thành công");
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

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Lịch chiếu
        </h1>
        <button
          onClick={handleAddSchedule}
          className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer"
        >
          <FaPlus className="mr-2" />
          Thêm lịch chiếu
        </button>
      </div>

      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-auto max-h-[70vh]">
          <ScheduleTable
            schedules={schedules}
            movieList={movieList}
            cinemaList={cinemaList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loadingSchedules}
          />
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
              loadingCinemas ||
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

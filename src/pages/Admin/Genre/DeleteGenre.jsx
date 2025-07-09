import React, { useState } from "react";
import {
  useGetDeletedGenresUS,
  useRestoreGenreUS,
} from "../../../api/homePage/queries";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import GenreTable from "../../../components/admin/Genre/GenreTable";
import Modal from "../../../components/ui/Modal";

const DeleteGenre = () => {
  const { data, isLoading } = useGetDeletedGenresUS();
  const restoreGenre = useRestoreGenreUS();
  const queryClient = useQueryClient();

  const [confirmRestore, setConfirmRestore] = useState({
    open: false,
    genreId: null,
  });

  const deletedGenres = Array.isArray(data?.data) ? data.data : [];

  const handleAskRestore = (genreId) => {
    setConfirmRestore({ open: true, genreId });
  };

  const handleConfirmRestore = () => {
    restoreGenre.mutate(confirmRestore.genreId, {
      onSuccess: () => {
        toast.success("Khôi phục thể loại thành công!");
        queryClient.invalidateQueries({ queryKey: ["GetDeletedGenresAPI"] });
        queryClient.invalidateQueries({ queryKey: ["GetAllGenresAPI"] });
      },
      onError: (error) => {
        toast.error("Khôi phục thể loại thất bại: " + error.message);
      },
    });
    setConfirmRestore({ open: false, genreId: null });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight mb-4 sm:mb-0">
          Danh sách Thể loại đã xóa
        </h1>
      </div>
      <div className="w-full pt-6">
        <GenreTable
          genres={deletedGenres}
          onDelete={handleAskRestore}
          loading={isLoading}
          isDeletedView={true}
        />
      </div>
      <Modal
        open={confirmRestore.open}
        onClose={() => setConfirmRestore({ open: false, genreId: null })}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            Xác nhận khôi phục thể loại
          </h2>
          <p>Bạn có chắc chắn muốn khôi phục thể loại này không?</p>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setConfirmRestore({ open: false, genreId: null })}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmRestore}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Khôi phục
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteGenre;

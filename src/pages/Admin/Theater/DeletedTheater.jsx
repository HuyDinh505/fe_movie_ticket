import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import TheaterTable from "../../../components/admin/Theater/TheaterTable";
import {
  useGetDeletedCinemasUS,
  useRestoreCinemaUS,
} from "../../../api/homePage/queries";
import Modal from "../../../components/ui/Modal";

const ITEMS_PER_PAGE = 10;

const DeletedTheater = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmRestore, setConfirmRestore] = useState({ open: false, cinemaId: null });

  const queryClient = useQueryClient();
  const { data: deletedCinemasData, isLoading } = useGetDeletedCinemasUS();
  const restoreCinema = useRestoreCinemaUS();

  const handleAskRestore = (cinemaId) => {
    setConfirmRestore({ open: true, cinemaId });
  };

  const handleConfirmRestore = () => {
    restoreCinema.mutate(confirmRestore.cinemaId, {
      onSuccess: () => {
        toast.success("Khôi phục rạp chiếu thành công!");
        queryClient.invalidateQueries({ queryKey: ["GetDeletedCinemasAPI"] });
        queryClient.invalidateQueries({ queryKey: ["GetAllCinemasAPI"] });
      },
      onError: (error) => {
        toast.error("Khôi phục rạp chiếu thất bại: " + error.message);
      },
    });
    setConfirmRestore({ open: false, cinemaId: null });
  };

  const filteredCinemas = Array.isArray(deletedCinemasData?.data)
    ? deletedCinemasData.data.filter((cinema) => {
        const matchSearch = cinema.cinema_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchSearch;
      })
    : [];

  const totalPages = Math.ceil(filteredCinemas.length / ITEMS_PER_PAGE);
  const paginatedCinemas = filteredCinemas.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Rạp chiếu đã xóa mềm
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-3">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm rạp chiếu đã xóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
            />
          </div>
        </div>
      </div>
      <div className="w-full pt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          <TheaterTable
            theaters={paginatedCinemas}
            onEdit={() => {}}
            onDelete={handleAskRestore}
            loading={isLoading}
            isDeletedView={true}
          />
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={confirmRestore.open}
        onClose={() => setConfirmRestore({ open: false, cinemaId: null })}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Xác nhận khôi phục rạp chiếu</h2>
          <p>Bạn có chắc chắn muốn khôi phục rạp chiếu này không?</p>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setConfirmRestore({ open: false, cinemaId: null })}
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

export default DeletedTheater;

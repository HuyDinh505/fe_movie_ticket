import React, { useState } from "react";
import GenreForm from "../../../components/admin/Genre/GenreForm";
import GenreTable from "../../../components/admin/Genre/GenreTable";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  useGetAllGenresUS,
  useCreateGenreUS,
  useUpdateGenreUS,
  useDeleteGenreUS,
  useRestoreGenreUS,
} from "../../../api/homePage/queries";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../../../components/ui/Modal";

const ITEMS_PER_PAGE = 10;

const GenreManagement = () => {
  const [editingGenre, setEditingGenre] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    genreId: null,
  });

  // React Query hooks
  const { data: genresData, isLoading } = useGetAllGenresUS();
  const createGenre = useCreateGenreUS();
  const updateGenre = useUpdateGenreUS();
  const deleteGenre = useDeleteGenreUS();
  const restoreGenre = useRestoreGenreUS();

  const queryClient = useQueryClient();

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setIsFormVisible(true);
  };

  const handleDelete = (genreId) => {
    setConfirmDelete({ open: true, genreId });
  };

  const handleRestore = (genreId) => {
    restoreGenre.mutate(genreId, {
      onSuccess: () => {
        toast.success("Khôi phục thể loại thành công!");
        queryClient.invalidateQueries({ queryKey: ["GetAllGenresAPI"] });
      },
      onError: (error) => {
        toast.error("Khôi phục thể loại thất bại: " + error.message);
      },
    });
  };

  const handleAddOrUpdateGenre = (genreData) => {
    if (genreData) {
      if (genreData.genre_id) {
        // Update existing genre
        updateGenre.mutate(
          { genreId: genreData.genre_id, genreData: genreData },
          {
            onSuccess: () => {
              toast.success("Cập nhật thể loại thành công!");
              setIsFormVisible(false);
              setEditingGenre(null);
              queryClient.invalidateQueries({ queryKey: ["GetAllGenresAPI"] });
            },
            onError: (error) => {
              toast.error("Cập nhật thể loại thất bại: " + error.message);
            },
          }
        );
      } else {
        // Create new genre
        createGenre.mutate(genreData, {
          onSuccess: () => {
            toast.success("Thêm thể loại thành công!");
            setIsFormVisible(false);
            queryClient.invalidateQueries({ queryKey: ["GetAllGenresAPI"] });
          },
          onError: (error) => {
            toast.error("Thêm thể loại thất bại: " + error.message);
          },
        });
      }
    }
  };

  const handleAddGenre = () => {
    setEditingGenre(null);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingGenre(null);
  };

  const handleConfirmDelete = () => {
    deleteGenre.mutate(confirmDelete.genreId, {
      onSuccess: () => {
        toast.success("Xóa thể loại thành công!");
        queryClient.invalidateQueries({ queryKey: ["GetAllGenresAPI"] });
      },
      onError: (error) => {
        toast.error("Xóa thể loại thất bại: " + error.message);
      },
    });
    setConfirmDelete({ open: false, genreId: null });
  };

  // Log the data to inspect its structure
  //   console.log("genresData from API:", genresData);
  //   console.log("genresData.data from API:", genresData?.data);
  //   console.log(
  //     "genresData.data.data (expected array):",
  //     genresData?.data?.genres
  //   );

  const filteredGenres = Array.isArray(genresData?.data)
    ? genresData.data.filter((genre) => {
        const matchSearch = genre.genre_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchSearch;
      })
    : [];

  const totalPages = Math.ceil(filteredGenres.length / ITEMS_PER_PAGE);
  const paginatedGenres = filteredGenres.slice(
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
          Quản lý Thể loại
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleAddGenre}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r 
            from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 
            hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Thêm thể loại mới
          </button>
        )}
      </div>

      {!isFormVisible && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-3">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thể loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full pt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          <GenreTable
            genres={paginatedGenres}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
            loading={isLoading}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${
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
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
        <Modal open={isFormVisible} onClose={handleCancelEdit}>
          <div className="max-w-md mx-auto">
            <GenreForm
              initialData={editingGenre}
              onSubmit={handleAddOrUpdateGenre}
              onCancel={handleCancelEdit}
            />
          </div>
        </Modal>
        <Modal
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, genreId: null })}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">
              Xác nhận xóa thể loại
            </h2>
            <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false, genreId: null })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Xóa
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GenreManagement;

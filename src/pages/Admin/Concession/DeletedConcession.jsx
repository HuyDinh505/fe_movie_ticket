import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  useGetDeletedConcessionUS,
  useRestoreConcessionUS,
} from "../../../api/homePage";
import { toast } from "react-toastify";
import ConcessionTable from "../../../components/admin/Concession/ConcessionTable";
import Modal from "../../../components/ui/Modal";
import { getApiMessage, handleApiError } from "../../../Utilities/apiMessage";

const ITEMS_PER_PAGE = 10;

const DeletedConcession = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedConcessionId, setSelectedConcessionId] = useState(null);
  const [selectedConcessionName, setSelectedConcessionName] = useState("");

  // Lấy danh sách concession đã xóa mềm
  const {
    data: deletedConcessionsData,
    isLoading,
    refetch: refetchDeletedConcessions,
  } = useGetDeletedConcessionUS();

  // Hook để khôi phục concession
  const { mutate: restoreConcession, isLoading: isRestoring } =
    useRestoreConcessionUS({
      onSuccess: (response) => {
        // Đổi tên 'data' thành 'response' cho rõ ràng
        // Kiểm tra lỗi nghiệp vụ từ phản hồi của server (nếu API trả về HTTP 200 nhưng có lỗi)
        // Dựa trên cách bạn xử lý ở ConcessionManagement.jsx, tôi giả định cấu trúc này
        if (response?.data?.status === false) {
          // console.log("API Restore Response (Business Error):", response);
          handleApiError(response.data, "Khôi phục đồ ăn/uống thất bại");
          // Không reset state ngay lập tức nếu có lỗi nghiệp vụ để người dùng có thể thấy thông báo
          // và quyết định hành động tiếp theo. Có thể reset sau 1 thời gian.
          // setShowConfirmModal(false);
          // setSelectedConcessionId(null);
          // setSelectedConcessionName("");
          return;
        }

        // Nếu thành công hoàn toàn
        handleApiError(response.data, "Khôi phục thể loại thành công");
        refetchDeletedConcessions();
        setCurrentPage(1);
        setShowConfirmModal(false); // Đóng modal và reset state khi thành công
        setSelectedConcessionId(null);
        setSelectedConcessionName("");
      },
      onError: (error) => {
        // Xử lý lỗi HTTP (ví dụ: 4xx, 5xx) hoặc lỗi mạng
        toast.error(getApiMessage(error, "Không thể khôi phục đồ ăn/uống"));
        setShowConfirmModal(false); // Đóng modal và reset state khi có lỗi HTTP/mạng
        setSelectedConcessionId(null);
        setSelectedConcessionName("");
      },
    });
  console.log(
    "DeletedConcession - deletedConcessionsData:",
    deletedConcessionsData
  );
  // Lọc theo tên
  const filteredConcessions = Array.isArray(
    deletedConcessionsData?.data?.concessions
  )
    ? deletedConcessionsData.data.concessions.filter((item) => {
        const matchSearch = item.concession_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchSearch;
      })
    : [];

  const totalPages = Math.ceil(filteredConcessions.length / ITEMS_PER_PAGE);
  const paginatedConcessions = filteredConcessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý khôi phục concession
  const handleRestore = (concessionId, concessionName) => {
    setSelectedConcessionId(concessionId);
    setSelectedConcessionName(concessionName);
    setShowConfirmModal(true);
  };

  const handleConfirmRestore = () => {
    restoreConcession(selectedConcessionId);
    setShowConfirmModal(false);
    setSelectedConcessionId(null);
    setSelectedConcessionName("");
  };

  const handleCancelRestore = () => {
    setShowConfirmModal(false);
    setSelectedConcessionId(null);
    setSelectedConcessionName("");
  };

  return (
    <div className="ml-2 space-y-6 sm:space-y-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Đồ ăn/uống đã xóa mềm
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-3">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đồ ăn/uống đã xóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <ConcessionTable
          concessions={paginatedConcessions}
          onEdit={() => {}} // Không cho phép edit trong view đã xóa
          onDelete={(concessionId, concessionName) =>
            handleRestore(concessionId, concessionName)
          } // Truyền thêm tên
          loading={isLoading}
          isDeletedView={true}
        />

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 py-4 border-t bg-white rounded-b-xl">
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
      <Modal open={showConfirmModal} onClose={handleCancelRestore}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xác nhận khôi phục
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn khôi phục đồ ăn/uống{" "}
            <span className="font-semibold text-blue-600">
              "{selectedConcessionName}"
            </span>{" "}
            không?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancelRestore}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRestoring ? "Đang khôi phục..." : "Khôi phục"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeletedConcession;

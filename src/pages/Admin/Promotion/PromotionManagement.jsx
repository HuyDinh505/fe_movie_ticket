import React, { useState } from "react";
import PromotionTable from "../../../components/admin/Promotion/PromotionTable";
import PromotionFrom from "../../../components/admin/Promotion/PromotionFrom";
import Modal from "../../../components/ui/Modal";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  useGetAllPromotionsUS,
  useCreatePromotionUS,
  useUpdatePromotionUS,
  useDeletePromotionUS,
} from "../../../api/homePage/queries";

const ITEMS_PER_PAGE = 10;

const PromotionManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editPromotion, setEditPromotion] = useState(null);

  // Lấy dữ liệu từ API
  const { data, isLoading, isError, refetch } = useGetAllPromotionsUS();
  const promotions = Array.isArray(data?.data) ? data.data : [];

  // Thêm, sửa, xóa mutation
  const createPromotion = useCreatePromotionUS({
    onSuccess: () => {
      setIsFormVisible(false);
      refetch();
    },
  });
  const updatePromotion = useUpdatePromotionUS({
    onSuccess: () => {
      setEditPromotion(null);
      setIsFormVisible(false);
      refetch();
    },
  });
  const deletePromotion = useDeletePromotionUS({
    onSuccess: () => {
      refetch();
    },
  });

  // Chuyển đổi dữ liệu cho bảng
  const mappedPromotions = promotions.map((promo) => ({
    ...promo,
    code: promo.code,
    discount:
      promo.type === "PERCENT_DISCOUNT"
        ? `${parseFloat(promo.discount_value)}%`
        : `${parseInt(promo.discount_value).toLocaleString()}đ`,
    quantity: promo.total_usage_limit,
    used: promo.total_usage_limit - (promo.usage_left ?? 0),
    status: promo.status === "active" ? "Kích hoạt" : "Ẩn",
    time: `${new Date(promo.start_date).toLocaleDateString()} - ${new Date(
      promo.end_date
    ).toLocaleDateString()}`,
  }));

  // Search
  const filteredPromotions = mappedPromotions.filter((promo) =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Thêm mới
  const handleAddPromotion = (formData) => {
    createPromotion.mutate(formData || {});
  };

  // Sửa
  const handleEditPromotion = (promotion) => {
    // Map lại status về giá trị gốc trước khi truyền vào form
    setEditPromotion({
      ...promotion,
      status: promotion.status === "Kích hoạt" ? "active" : "inactive",
    });
    setIsFormVisible(true);
  };
  const handleUpdatePromotion = (formData) => {
    if (editPromotion) {
      updatePromotion.mutate({
        id: editPromotion.promotion_id,
        data: formData,
      });
    }
  };

  // Xóa
  const handleDeletePromotion = (promotion) => {
    if (window.confirm(`Bạn có chắc muốn xóa khuyến mãi ${promotion.code}?`)) {
      deletePromotion.mutate(promotion.promotion_id);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Khuyến mãi
        </h1>
        {!isFormVisible && (
          <button
            onClick={() => {
              setEditPromotion(null);
              setIsFormVisible(true);
            }}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r 
            from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 
            hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base 
            cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Thêm khuyến mãi
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
                placeholder="Tìm kiếm mã khuyến mãi..."
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
          {isLoading ? (
            <div className="p-8 text-center text-blue-600 font-semibold">
              Đang tải dữ liệu khuyến mãi...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-600 font-semibold">
              Lỗi khi tải dữ liệu khuyến mãi!
            </div>
          ) : (
            <PromotionTable
              promotions={paginatedPromotions}
              onEdit={handleEditPromotion}
              onDelete={handleDeletePromotion}
            />
          )}
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
        <Modal
          open={isFormVisible}
          onClose={() => {
            setIsFormVisible(false);
            setEditPromotion(null);
          }}
        >
          <div className="max-w-md mx-auto">
            <PromotionFrom
              initialData={editPromotion}
              onSubmit={
                editPromotion ? handleUpdatePromotion : handleAddPromotion
              }
              // onCancel={() => {
              //   setIsFormVisible(false);
              //   setEditPromotion(null);
              // }}
              isEdit={!!editPromotion}
              loading={createPromotion.isLoading || updatePromotion.isLoading}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PromotionManagement;

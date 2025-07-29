import React, { useState, useEffect } from "react";
import TicketTable from "../../components/admin/Ticket/TicketTable";
import TicketDetail from "../../components/admin/Ticket/TicketDetail";
import TicketForm from "../../components/admin/Ticket/TicketForm";
import { toast } from "react-toastify";
import {
  useGetAllBookingsUS,
  useCreateBookingUS,
  useUpdateBookingUS,
  useGetBookingByIdUS,
} from "../../api/homePage/queries";

const TicketOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { data: bookingsData, isLoading, refetch } = useGetAllBookingsUS();
  const createBooking = useCreateBookingUS();
  const updateBooking = useUpdateBookingUS();

  // Lấy chi tiết booking khi chọn đơn hàng
  const { data: bookingDetail, isLoading: isDetailLoading } =
    useGetBookingByIdUS(selectedOrder?.id, {
      enabled: !!selectedOrder,
    });

  // Chuyển đổi dữ liệu từ API sang format hiển thị
  const transformBookingData = (booking) => {
    console.log("Transform booking data:", booking); // Debug log

    const transformedData = {
      id: booking.booking_id,
      movie: booking.movie_name || "Không rõ",
      showTime: booking.showtime_start_end,
      showDate: booking.showtime_date
        ? new Date(booking.showtime_date).toLocaleDateString("vi-VN")
        : booking.showtime_date,
      room: booking.room_name || "Phòng chiếu",
      status:
        booking.status === "paid"
          ? "Đã thanh toán"
          : booking.status === "pending"
          ? "Chờ thanh toán"
          : booking.status === "cancelled"
          ? "Đã hủy"
          : booking.status,
      total: booking.total_price?.toLocaleString() || "0",
      orderDate: booking.booking_date
        ? new Date(booking.booking_date).toLocaleDateString("vi-VN")
        : booking.booking_date,
      customer: booking.customer_name || "Khách hàng",
      phone: booking.customer_phone || "Chưa có",
      email: booking.customer_email || "Chưa có",
      discount: booking.discount?.toLocaleString() || "0",
      paymentMethod: booking.payment_method || "Chưa chọn",
      canEdit: booking.status === "pending",
      seats: booking.seats || [],
      services: booking.services || [],
      // Dữ liệu gốc để edit
      originalData: booking,
    };

    console.log("Transformed data:", transformedData); // Debug log
    return transformedData;
  };

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  useEffect(() => {
    console.log("BookingsData:", bookingsData); // Debug log
    if (!bookingsData?.data) return;

    let filtered = bookingsData.data.map(transformBookingData);

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.movie.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm)
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== "Tất cả") {
      filtered = filtered.filter((order) => {
        if (statusFilter === "Chờ thanh toán") {
          return (
            order.status === "Chờ thanh toán" || order.status === "pending"
          );
        } else if (statusFilter === "Đã thanh toán") {
          return order.status === "Đã thanh toán" || order.status === "paid";
        } else if (statusFilter === "Đã hủy") {
          return order.status === "Đã hủy" || order.status === "cancelled";
        } else {
          return order.status === statusFilter;
        }
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  }, [bookingsData, searchTerm, statusFilter]);

  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddOrder = () => {
    setShowForm(true);
    setEditingOrder(null);
    setIsEditMode(false);
  };

  const handleEditOrder = (order) => {
    if (!order.canEdit) {
      toast.warning("Không thể sửa đơn hàng này!");
      return;
    }
    setShowForm(true);
    setEditingOrder(order);
    setIsEditMode(true);
  };

  const handleSaveOrder = async (formData) => {
    try {
      if (isEditMode) {
        // Cập nhật đơn hàng hiện có
        const bookingId =
          editingOrder.originalData?.booking_id || editingOrder.id;
        await updateBooking.mutateAsync({
          bookingId: bookingId,
          bookingData: formData,
        });
        toast.success("Cập nhật đơn hàng thành công!");
      } else {
        // Thêm đơn hàng mới
        await createBooking.mutateAsync(formData);
        toast.success("Thêm đơn hàng thành công!");
      }

      setShowForm(false);
      setEditingOrder(null);
      setIsEditMode(false);
      refetch(); // Refresh data
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Có lỗi xảy ra!";
      toast.error(errorMessage);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingOrder(null);
    setIsEditMode(false);
  };

  // Không cần merge dữ liệu chi tiết booking, showtime, cinema nữa!
  let mergedDetail = bookingDetail;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Đơn hàng
        </h1>

        {/* Thanh tìm kiếm và lọc */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên khách, phim..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
          <button
            onClick={handleAddOrder}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>+</span>
            Thêm đơn hàng
          </button>
        </div>
      </div>

      <div className="w-full pt-6">
        {showForm ? (
          <TicketForm
            order={editingOrder}
            onSave={handleSaveOrder}
            onCancel={handleCancelForm}
            isEdit={isEditMode}
          />
        ) : !selectedOrder ? (
          <div className="bg-white rounded-xl shadow-lg overflow-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                <TicketTable
                  orders={paginatedOrders}
                  onRowClick={setSelectedOrder}
                  onEditClick={handleEditOrder}
                />
                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 mb-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="cursor-pointer px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`cursor-pointer px-3 py-1 mx-1 rounded ${
                          currentPage === idx + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="cursor-pointer px-3 py-1 mx-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            {isDetailLoading ? (
              <div className="p-8 text-center">
                Đang tải chi tiết đơn hàng...
              </div>
            ) : (
              <TicketDetail
                order={mergedDetail}
                onBack={() => setSelectedOrder(null)}
                onEdit={() => handleEditOrder(selectedOrder)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketOrder;

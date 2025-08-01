import React, { useState } from "react";

const ITEMS_PER_PAGE = 10;

const statusColor = (status) => {
  if (status === "Đã thanh toán" || status === "paid" || status === "active")
    return "bg-green-50 text-green-600 border border-green-200";
  if (
    status === "Đã hủy" ||
    status === "cancelled" ||
    status === "cancelled_by_room"
  )
    return "bg-red-50 text-red-600 border border-red-200";
  if (status === "Chờ thanh toán" || status === "pending")
    return "bg-yellow-50 text-yellow-600 border border-yellow-200";
  return "bg-gray-100 text-gray-600";
};

const TicketTable = ({ orders, onRowClick, onEditClick }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán phân trang
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEditClick = (e, order) => {
    e.stopPropagation(); // Ngăn không cho trigger onRowClick
    onEditClick(order);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Mã đơn hàng
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Tên phim
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Suất chiếu
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Phòng chiếu
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Trạng thái
            </th>
            <th className="py-3 px-4 text-right text-xs font-bold text-gray-700 uppercase">
              Tổng tiền
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase">
              Ngày đặt
            </th>
            <th className="py-3 px-4 text-center text-xs font-bold text-gray-700 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedOrders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              onClick={() => onRowClick(order)}
            >
              <td className="px-4 py-3 text-blue-600 font-medium underline">
                {order.id}
              </td>
              <td className="px-4 py-3">
                <span className="text-blue-600 font-medium underline cursor-pointer">
                  {order.movie}
                </span>
              </td>
              <td className="px-4 py-3 flex flex-col gap-1">
                <span className="inline-block text-red-500 border border-orange-200 bg-orange-50 rounded px-2 py-0.5 text-xs font-semibold w-fit">
                  {order.showTime}
                </span>
                <span className="inline-block text-green-600 border border-green-200 bg-green-50 rounded px-2 py-0.5 text-xs font-semibold w-fit">
                  {order.showDate}
                </span>
              </td>
              <td className="px-4 py-3">{order.room}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${statusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-blue-700">
                {order.total}
              </td>
              <td className="px-4 py-3">{order.orderDate}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={(e) => handleEditClick(e, order)}
                  disabled={!order.canEdit}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    order.canEdit
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={order.canEdit ? "Sửa đơn hàng" : "Không thể sửa"}
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const promotions = [
  {
    code: "HELLO",
    discount: "20%",
    quantity: 40,
    used: 0,
    status: "Ẩn",
    time: "11-05-2024 - 24-04-2024",
  },
  {
    code: "YEUDAU",
    discount: "30%",
    quantity: 50,
    used: 5,
    status: "Kích hoạt",
    time: "01-04-2024 - 30-04-2024",
  },
  {
    code: "THONGNHAT",
    discount: "50%",
    quantity: 200,
    used: 0,
    status: "Kích hoạt",
    time: "26-04-2024 - 05-05-2024",
  },
  {
    code: "THANG4",
    discount: "40%",
    quantity: 100,
    used: 0,
    status: "Kích hoạt",
    time: "29-03-2024 - 05-04-2024",
  },
];

const statusStyle = (status) =>
  status === "Kích hoạt"
    ? "bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-full text-xs font-semibold"
    : "bg-gray-200 text-gray-500 border border-gray-300 px-3 py-1 rounded-full text-xs font-semibold";

const PromotionTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
          <tr>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Mã khuyến mại
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Phần trăm giảm giá
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Số lượng
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Đã sử dụng
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="py-3 px-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
              Thời gian áp dụng
            </th>
            <th className="py-3 px-4 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {promotions.map((promo) => (
            <tr
              key={promo.code}
              className="hover:bg-blue-50 border-b transition-all duration-100"
            >
              <td className="py-3 px-4 whitespace-nowrap font-semibold text-gray-900">
                {promo.code}
              </td>
              <td className="py-3 px-4 whitespace-nowrap">{promo.discount}</td>
              <td className="py-3 px-4 whitespace-nowrap">{promo.quantity}</td>
              <td className="py-3 px-4 whitespace-nowrap">{promo.used}</td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={statusStyle(promo.status)}>
                  {promo.status}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">{promo.time}</td>
              <td className="py-3 px-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;

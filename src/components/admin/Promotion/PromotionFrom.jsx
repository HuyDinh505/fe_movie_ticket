import React from "react";

const PromotionFrom = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tạo khuyến mại</h2>
        <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold">
          &times;
        </button>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Mã khuyến mại
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter code"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Phần trăm trừ (%)
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter discount"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số lượng</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter quantity"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            defaultValue=""
          >
            <option value="" disabled>
              Select a status
            </option>
            <option value="active">Kích hoạt</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Select date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Select date"
          />
        </div>
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Lưu
        </button>
      </form>
    </div>
  );
};

export default PromotionFrom;

import React, { useState, useEffect } from "react";

const defaultFields = {
  name: "",
  code: "",
  description: "",
  start_date: "",
  end_date: "",
  type: "PERCENT_DISCOUNT",
  discount_value: "",
  max_discount_amount: "",
  min_order_amount: "",
  usage_limit_per_user: "",
  total_usage_limit: "",
  apply_to_product_type: "TICKET",
  status: "active",
};

const PromotionFrom = ({
  initialData = defaultFields,
  onSubmit,
  onCancel,
  isEdit = false,
  loading = false,
}) => {
  const [form, setForm] = useState(defaultFields);

  useEffect(() => {
    setForm({ ...defaultFields, ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <div
      className="p-6 w-full mx-auto"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {isEdit ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi"}
        </h2>
        {onCancel && (
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
            onClick={onCancel}
            type="button"
          >
            &times;
          </button>
        )}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên khuyến mãi
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập tên khuyến mãi"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Mã khuyến mãi
          </label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập mã khuyến mãi"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập mô tả"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="end_date"
              value={form.end_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Loại khuyến mãi
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="PERCENT_DISCOUNT">Phần trăm (%)</option>
            <option value="FIXED_DISCOUNT">Giảm giá cố định (VNĐ)</option>
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Giá trị giảm
              {form.type === "PERCENT_DISCOUNT" ? " (%)" : " (VNĐ)"}
            </label>
            <input
              type="number"
              name="discount_value"
              value={form.discount_value}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Giảm tối đa (VNĐ)
            </label>
            <input
              type="number"
              name="max_discount_amount"
              value={form.max_discount_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={0}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Đơn hàng tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              name="min_order_amount"
              value={form.min_order_amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={0}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Số lần dùng / người
            </label>
            <input
              type="number"
              name="usage_limit_per_user"
              value={form.usage_limit_per_user}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={1}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Tổng số lượt dùng
            </label>
            <input
              type="number"
              name="total_usage_limit"
              value={form.total_usage_limit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={1}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Áp dụng cho</label>
          <select
            name="apply_to_product_type"
            value={form.apply_to_product_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="TICKET">Vé xem phim</option>
            <option value="CONCESSION">Đồ ăn/uống</option>
            <option value="ALL">Tất cả</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="active">Kích hoạt</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition cursor-pointer"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PromotionFrom;

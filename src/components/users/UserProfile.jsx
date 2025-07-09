import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { imagePhim } from "../../Utilities/common";

const UserProfile = ({ user = {}, onUpdate, onChangePassword }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "",
    avatar: null,
    avatar_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        birth_date: user.birth_date ? user.birth_date.split("T")[0] : "",
        gender: user.gender || "",
        avatar: null,
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatar_url: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "avatar" && formData[key]) {
          formDataToSubmit.append("avatar", formData[key]);
        } else if (key !== "avatar_url") {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      await onUpdate(formDataToSubmit);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Thông tin cá nhân
      </h2>
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            formData.avatar_url
              ? formData.avatar_url.startsWith("blob:")
                ? formData.avatar_url
                : `${imagePhim}${formData.avatar_url}`
              : "/placeholder-avatar.jpg"
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-400 mb-2"
        />
        <label className="cursor-pointer text-blue-500 hover:underline text-sm">
          Đổi ảnh đại diện
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ tên
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border rounded-lg p-2.5 border-gray-200 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới tính
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2"
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onChangePassword}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Đổi mật khẩu
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { imagePhim } from "../../../Utilities/common";

const UserForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    user_id: null,
    full_name: "",
    email: "",
    avatar: null,
    password: "",
    password_confirmation: "",
    phone: "",
    role: "user",
    birth_date: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (initialData) {
      // Tạo một bản sao của initialData
      const formDataInit = {
        ...initialData,
        password: "",
        password_confirmation: "",
        role: Array.isArray(initialData.roles)
          ? initialData.roles[0]
          : initialData.role || "user",
      };

      // Không set avatar: null khi có dữ liệu cũ
      if (!initialData.avatar_url) {
        formDataInit.avatar = null;
      }

      setFormData(formDataInit);

      if (initialData.avatar_url) {
        setAvatarPreview(`${imagePhim}${initialData.avatar_url}`);
      } else {
        setAvatarPreview("");
      }
    } else {
      setFormData({
        user_id: null,
        full_name: "",
        email: "",
        avatar: null,
        password: "",
        password_confirmation: "",
        phone: "",
        role: "user",
        birth_date: "",
        gender: "",
      });
      setAvatarPreview("");
    }
    setErrors({});
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!initialData || formData.password) {
      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (!formData.password_confirmation) {
        newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu";
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Mật khẩu xác nhận không khớp";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.birth_date) {
      newErrors.birth_date = "Vui lòng chọn ngày sinh";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL để preview
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Cập nhật formData với file
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Log để kiểm tra
      console.log("Selected file:", file);
      console.log("Preview URL:", previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = { ...formData };

      // Nếu đang chỉnh sửa và không nhập mật khẩu mới, loại bỏ trường mật khẩu
      if (initialData && !dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.password_confirmation;
      }

      // Nếu không chọn file mới, loại bỏ trường avatar
      if (!dataToSend.avatar) {
        delete dataToSend.avatar;
      }

      onSubmit(dataToSend);
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {initialData ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <input
            type="text"
            name="full_name"
            placeholder="Họ và tên"
            value={formData.full_name}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.full_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Ảnh đại diện (chọn file mới nếu muốn thay đổi)
          </label>
          {avatarPreview && (
            <div className="mb-2">
              <img
                src={avatarPreview}
                alt="Ảnh đại diện hiện tại"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
            </div>
          )}
          <input
            type="file"
            name="avatar"
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
            className="w-full border rounded p-2 border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.avatar_url && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar_url}</p>
          )}
        </div>

        {!initialData || formData.password ? (
          <div className="space-y-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Xác nhận mật khẩu"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${
                  errors.password_confirmation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password_confirmation}
                </p>
              )}
            </div>
          </div>
        ) : null}

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
            <option value="district_manager">Quản lý cụm rạp</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.birth_date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.birth_date && (
            <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
          )}
        </div>

        <div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full border rounded p-2 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {initialData ? "Cập nhật" : "Thêm mới"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

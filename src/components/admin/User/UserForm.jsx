import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { imagePhim } from "../../../Utilities/common";
import { useGetAllCinemasUS } from "../../../api/homePage/queries";

const UserForm = ({ onSubmit, initialData, onCancel }) => {
  console.log("[UserForm] onSubmit prop:", onSubmit);
  const [formData, setFormData] = useState({
    user_id: null,
    full_name: "",
    email: "",
    avatar: null, // Mặc định là null
    password: "",
    password_confirmation: "",
    phone: "",
    role: "user",
    birth_date: "",
    gender: "",
    district_ids: [],
    cinema_id: "",
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");

  const { data: cinemasData } = useGetAllCinemasUS();
  const cinemas = cinemasData?.data || [];

  const districts = [];
  const districtMap = {};
  cinemas.forEach((cinema) => {
    if (cinema.district && !districtMap[cinema.district.district_id]) {
      districtMap[cinema.district.district_id] = true;
      districts.push({
        district_id: cinema.district.district_id,
        district_name: cinema.district.district_name,
      });
    }
  });

  useEffect(() => {
    if (initialData) {
      console.log("[UserForm] initialData nhận được khi sửa:", initialData);

      let districtIds = [];
      if (initialData.district_ids) {
        if (Array.isArray(initialData.district_ids)) {
          districtIds = initialData.district_ids.map((id) => Number(id));
        } else {
          districtIds = [Number(initialData.district_ids)];
        }
      }

      setFormData({
        user_id: initialData.user_id || null,
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        avatar: null,
        password: "",
        password_confirmation: "",
        phone: initialData.phone || "",
        // Đảm bảo role được lấy đúng nếu initialData.roles là mảng
        role:
          Array.isArray(initialData.roles) && initialData.roles.length > 0
            ? initialData.roles[0]
            : initialData.role || "user",
        birth_date: initialData.birth_date
          ? initialData.birth_date.slice(0, 10)
          : "",
        gender: initialData.gender || "",
        district_ids: districtIds,
        cinema_id: initialData.cinema_id || "",
      });

      // Chỉ set avatarPreview nếu có avatar_url cũ
      if (initialData.avatar_url) {
        setAvatarPreview(`${imagePhim}${initialData.avatar_url}`);
      } else {
        setAvatarPreview("");
      }
    } else {
      // Khi tạo mới
      setFormData({
        user_id: null,
        full_name: "",
        email: "",
        avatar: null, // Đảm bảo là null khi tạo mới
        password: "",
        password_confirmation: "",
        phone: "",
        role: "user",
        birth_date: "",
        gender: "",
        district_ids: [],
        cinema_id: "",
      });
      setAvatarPreview("");
    }
    setErrors({});
  }, [initialData]); // Dependency array chỉ cần initialData

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

    if (
      formData.role === "district_manager" &&
      (!formData.district_ids || formData.district_ids.length === 0)
    ) {
      newErrors.district_ids = "Vui lòng chọn ít nhất một cụm rạp quản lý";
    }
    if (
      (formData.role === "showtime_manager" ||
        formData.role === "booking_manager") &&
      !formData.cinema_id
    ) {
      newErrors.cinema_id = "Vui lòng chọn rạp quản lý";
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
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Chỉ chấp nhận file ảnh có định dạng: PNG, JPG, JPEG, WEBP"
        );
        // Đặt avatar về null nếu không hợp lệ
        setFormData((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview("");
        e.target.value = ""; // Reset input
        return;
      }

      if (file.size > maxSize) {
        toast.error("Kích thước file không được vượt quá 2MB");
        // Đặt avatar về null nếu không hợp lệ
        setFormData((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview("");
        e.target.value = ""; // Reset input
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      setFormData((prev) => ({
        ...prev,
        avatar: file, // Đảm bảo đây là một File object
      }));

      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: "" }));
      }
    } else {
      // Nếu người dùng chọn file rồi hủy, đảm bảo avatar trở lại null
      setFormData((prev) => ({ ...prev, avatar: null }));
      setAvatarPreview("");
    }
  };

  const handleDistrictChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    );
    setFormData((prev) => ({ ...prev, district_ids: selected }));
    if (errors.district_ids) {
      setErrors((prev) => ({ ...prev, district_ids: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[UserForm] Đã bấm nút Cập nhật!");
    if (validateForm()) {
      console.log(
        "[DEBUG] Giá trị của formData.avatar TRƯỚC KHI tạo FormData:",
        formData.avatar
      );
      console.log(
        "[DEBUG] formData.avatar instanceof File:",
        formData.avatar instanceof File
      );

      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("role", formData.role || "user");
      formDataToSend.append("birth_date", formData.birth_date || "");
      formDataToSend.append("gender", formData.gender || "");

      // Thêm user_id nếu đang edit
      // if (initialData && formData.user_id) {
      //   formDataToSend.append("user_id", formData.user_id);
      // }

      // Xử lý password - chỉ thêm khi có giá trị
      if (!initialData || formData.password) {
        if (formData.password) {
          formDataToSend.append("password", formData.password);
          formDataToSend.append(
            "password_confirmation",
            formData.password_confirmation
          );
        }
      }

      // Xử lý avatar file: CHỈ THÊM VÀO NẾU NÓ THỰC SỰ LÀ MỘT FILE MỚI ĐƯỢC CHỌN
      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }
      // QUAN TRỌNG: Không thêm trường 'avatar' nào khác nếu không có file mới được chọn.
      // Laravel sẽ tự động giữ ảnh cũ nếu trường 'avatar' không có trong request.

      // Xử lý district_ids cho district_manager
      if (formData.role === "district_manager") {
        if (
          Array.isArray(formData.district_ids) &&
          formData.district_ids.length > 0
        ) {
          formData.district_ids.forEach((id, index) => {
            formDataToSend.append(`district_ids[${index}]`, Number(id));
          });
        }
      }

      // Xử lý cinema_id cho showtime_manager và booking_manager
      if (["showtime_manager", "booking_manager"].includes(formData.role)) {
        if (formData.cinema_id) {
          formDataToSend.append("cinema_id", Number(formData.cinema_id));
        }
      }

      // Luôn append _method cho PATCH khi cập nhật
      // if (initialData && formData.user_id) {
      //   // Chỉ thêm _method: PATCH khi là update
      //   formDataToSend.append("_method", "PATCH");
      // }

      console.log(
        "[UserForm] Dữ liệu trong state formData trước khi submit:",
        formData
      );
      // Log toàn bộ FormData trước khi submit
      console.log("[UserForm] Dữ liệu thực tế trong FormDataToSend:");
      for (let pair of formDataToSend.entries()) {
        console.log("[FormData entry]", pair[0] + ":", pair[1]);
      }
      onSubmit(formDataToSend);
    } else {
      console.log("[UserForm] Validate lỗi, không submit!");
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
        encType="multipart/form-data" // Quan trọng cho upload file
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
          {/* Lỗi avatar_url nên được đổi thành errors.avatar nếu bạn muốn hiển thị lỗi cho trường avatar */}
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
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
            <option value="booking_manager">Quản lý đơn hàng</option>
            <option value="showtime_manager">Quản lý suất chiếu</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>

        {formData.role === "district_manager" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn cụm rạp quản lý (có thể chọn nhiều)
            </label>
            <select
              multiple
              name="district_ids"
              value={formData.district_ids}
              onChange={handleDistrictChange}
              className="w-full border border-gray-300 rounded p-2 h-32"
            >
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Giữ Ctrl (hoặc Cmd) để chọn nhiều cụm rạp
            </p>
            {errors.district_ids && (
              <p className="text-red-500 text-sm mt-1">{errors.district_ids}</p>
            )}
          </div>
        )}

        {["showtime_manager", "booking_manager"].includes(formData.role) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn rạp quản lý
            </label>
            <select
              name="cinema_id"
              value={formData.cinema_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Chọn rạp</option>
              {cinemas.map((cinema) => (
                <option key={cinema.cinema_id} value={cinema.cinema_id}>
                  {cinema.cinema_name}
                </option>
              ))}
            </select>
            {errors.cinema_id && (
              <p className="text-red-500 text-sm mt-1">{errors.cinema_id}</p>
            )}
          </div>
        )}

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

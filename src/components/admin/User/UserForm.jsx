import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { imagePhim } from "../../../Utilities/common"; // Đảm bảo đường dẫn này đúng
import { useGetAllCinemasUS } from "../../../api/homePage/queries"; // Đảm bảo đường dẫn này đúng

const UserForm = ({
  onSubmit,
  initialData, // Dữ liệu người dùng hiện có khi chỉnh sửa
  onCancel,
  districts = [],
  loadingDistricts,
}) => {
  console.log("[UserForm] onSubmit prop:", onSubmit);

  const [formData, setFormData] = useState({
    user_id: null,
    full_name: "",
    email: "",
    avatar: null, // Sẽ chứa File object khi người dùng chọn ảnh mới
    avatar_url_from_backend: "", // Thêm trường này để lưu URL ảnh hiện có từ backend
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

  useEffect(() => {
    if (initialData) {
      console.log("[UserForm] initialData nhận được khi sửa:", initialData);
      console.log("[UserForm] initialData.roles:", initialData.roles);
      console.log(
        "[UserForm] typeof initialData.roles:",
        typeof initialData.roles
      );
      console.log(
        "[UserForm] Array.isArray(initialData.roles):",
        Array.isArray(initialData.roles)
      );
      if (Array.isArray(initialData.roles)) {
        console.log("[UserForm] First role:", initialData.roles[0]);
      }

      let districtIds = [];
      console.log(
        "[UserForm] initialData.district_ids:",
        initialData.district_ids
      );
      console.log(
        "[UserForm] initialData.managed_districts:",
        initialData.managed_districts
      );
      console.log("[UserForm] initialData.cinema_id:", initialData.cinema_id);
      console.log(
        "[UserForm] initialData.cinema_id type:",
        typeof initialData.cinema_id
      );

      if (initialData.district_ids) {
        if (Array.isArray(initialData.district_ids)) {
          districtIds = initialData.district_ids.map((id) => Number(id));
        } else if (
          typeof initialData.district_ids === "number" ||
          typeof initialData.district_ids === "string"
        ) {
          districtIds = [Number(initialData.district_ids)];
        }
      } else if (initialData.district_id) {
        // Đề phòng trường hợp backend chỉ trả về district_id đơn
        districtIds = [Number(initialData.district_id)];
      } else if (
        initialData.managed_districts &&
        Array.isArray(initialData.managed_districts)
      ) {
        // Nếu backend trả về managed_districts (array tên quận), cần map sang district_id
        console.log(
          "[UserForm] Processing managed_districts:",
          initialData.managed_districts
        );
        // Map từ tên quận sang district_id
        if (districts && districts.length > 0) {
          console.log(
            "[UserForm] Available districts:",
            districts.map((d) => ({ id: d.district_id, name: d.district_name }))
          );
          districtIds = initialData.managed_districts
            .map((districtName) => {
              const district = districts.find(
                (d) => d.district_name === districtName
              );
              console.log(
                "[UserForm] Mapping district:",
                districtName,
                "->",
                district ? district.district_id : "not found"
              );
              return district ? Number(district.district_id) : null;
            })
            .filter((id) => id !== null);
          console.log(
            "[UserForm] Mapped district_ids from managed_districts:",
            districtIds
          );
        } else {
          console.log("[UserForm] No districts available for mapping");
        }
      }

      console.log("[UserForm] Final districtIds:", districtIds);

      setFormData({
        user_id: initialData.user_id || null,
        full_name: initialData.full_name || "",
        email: initialData.email || "",
        avatar: null, // Luôn reset avatar file khi load initialData
        avatar_url_from_backend: initialData.avatar_url || "", // Lưu URL từ backend
        password: "", // Luôn reset password khi load initialData
        password_confirmation: "", // Luôn reset password_confirmation khi load initialData
        phone: initialData.phone || "",
        role: (() => {
          let selectedRole = "user";
          if (
            Array.isArray(initialData.roles) &&
            initialData.roles.length > 0
          ) {
            selectedRole = initialData.roles[0];
            console.log(
              "[UserForm] Using role from roles array:",
              selectedRole
            );
          } else if (initialData.role) {
            selectedRole = initialData.role;
            console.log("[UserForm] Using role from role field:", selectedRole);
          } else {
            console.log("[UserForm] Using default role:", selectedRole);
          }
          console.log("[UserForm] Final selected role:", selectedRole);
          return selectedRole;
        })(),
        birth_date: initialData.birth_date
          ? initialData.birth_date.slice(0, 10)
          : "",
        gender: initialData.gender || "",
        district_ids: districtIds,
        cinema_id: initialData.cinema_id ? String(initialData.cinema_id) : "",
      });

      console.log("[UserForm] Final formData.role:", formData.role);
      console.log(
        "[UserForm] Final formData.district_ids:",
        formData.district_ids
      );
      console.log("[UserForm] Final formData.cinema_id:", formData.cinema_id);

      // Thiết lập avatarPreview
      if (initialData.avatar_url) {
        setAvatarPreview(`${imagePhim}${initialData.avatar_url}`);
      } else {
        setAvatarPreview("");
      }
    } else {
      // Logic cho trường hợp thêm mới
      setFormData({
        user_id: null,
        full_name: "",
        email: "",
        avatar: null,
        avatar_url_from_backend: "", // Cũng reset khi thêm mới
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

    // Validation cho mật khẩu:
    // Bắt buộc nhập nếu là chế độ "Thêm mới" (initialData không tồn tại)
    // HOẶC nếu người dùng đã nhập password (formData.password có giá trị)
    if (!initialData || (formData.password && formData.password.length > 0)) {
      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu";
      } else if (formData.password.length < 8) {
        // Cập nhật min length theo backend
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      }
      // Thêm kiểm tra regex cho mật khẩu nếu muốn validation khớp hoàn toàn với backend
      else if (
        !/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(formData.password)
      ) {
        newErrors.password =
          "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt";
      }

      if (!formData.password_confirmation) {
        newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu";
      } else if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Mật khẩu xác nhận không khớp";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(\+?\d{9,15})$/.test(formData.phone)) {
      // Cập nhật regex theo backend
      newErrors.phone =
        "Số điện thoại không hợp lệ. Chỉ được chứa số và có thể bắt đầu bằng dấu +";
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
      newErrors.district_ids =
        "Người dùng có vai trò 'Quản lý cụm rạp' bắt buộc phải quản lý ít nhất một quận.";
    }
    if (
      (formData.role === "showtime_manager" ||
        formData.role === "booking_manager") &&
      !formData.cinema_id
    ) {
      newErrors.cinema_id =
        "Người dùng có vai trò này bắt buộc phải thuộc một rạp chiếu.";
    }
    // Thêm các kiểm tra logic cross-field cho cinema_id và district_ids giống như trong withValidator của backend
    if (formData.role === "district_manager" && formData.cinema_id) {
      newErrors.cinema_id =
        'Người dùng có vai trò "Quản lý cụm rạp" không thể quản lý một rạp cụ thể.';
    }
    if (
      ["showtime_manager", "booking_manager"].includes(formData.role) &&
      Array.isArray(formData.district_ids) &&
      formData.district_ids.length > 0
    ) {
      newErrors.district_ids =
        "Người dùng với vai trò này không thể quản lý quận.";
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
    // Xóa lỗi khi người dùng bắt đầu nhập lại
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
        setFormData((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview("");
        e.target.value = ""; // Clear selected file
        return;
      }

      if (file.size > maxSize) {
        toast.error("Kích thước file không được vượt quá 2MB");
        setFormData((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview("");
        e.target.value = ""; // Clear selected file
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      setFormData((prev) => ({
        ...prev,
        avatar: file, // Lưu File object vào state
        avatar_url_from_backend: "", // Xóa URL cũ nếu có ảnh mới
      }));

      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: "" }));
      }
    } else {
      // Khi người dùng bấm "Cancel" trên hộp thoại chọn file hoặc xóa file đã chọn
      // Nếu có ảnh cũ từ backend, giữ lại preview đó
      if (formData.avatar_url_from_backend) {
        setAvatarPreview(`${imagePhim}${formData.avatar_url_from_backend}`);
      } else {
        setAvatarPreview("");
      }
      setFormData((prev) => ({ ...prev, avatar: null })); // Đặt lại avatar về null
    }
  };

  // Hàm xử lý khi chọn/bỏ chọn checkbox quận
  const handleDistrictCheckboxChange = (e) => {
    const districtId = Number(e.target.value);
    const isChecked = e.target.checked;

    setFormData((prev) => {
      const currentDistrictIds = prev.district_ids || [];
      let newDistrictIds;
      if (isChecked) {
        newDistrictIds = [...currentDistrictIds, districtId];
      } else {
        newDistrictIds = currentDistrictIds.filter((id) => id !== districtId);
      }
      return { ...prev, district_ids: newDistrictIds };
    });

    if (errors.district_ids) {
      setErrors((prev) => ({ ...prev, district_ids: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[UserForm] Đã bấm nút Cập nhật/Thêm mới!");

    if (validateForm()) {
      const formDataToSend = new FormData();

      // Chỉ thêm user_id nếu đang ở chế độ cập nhật
      if (initialData && formData.user_id) {
        formDataToSend.append("user_id", formData.user_id);
      }

      formDataToSend.append("full_name", formData.full_name || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("role", formData.role || "user");
      formDataToSend.append("birth_date", formData.birth_date || "");
      formDataToSend.append("gender", formData.gender || "");

      console.log("[UserForm] Submitting role:", formData.role);
      console.log("[UserForm] Role type:", typeof formData.role);

      // === Logic gửi password và password_confirmation ===
      // Chỉ gửi password và password_confirmation nếu chúng có giá trị (người dùng đã nhập)
      if (formData.password && formData.password.length > 0) {
        formDataToSend.append("password", formData.password);
        formDataToSend.append(
          "password_confirmation",
          formData.password_confirmation
        );
      }

      // === Logic gửi avatar (file hoặc url) ===
      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      } else if (formData.avatar_url_from_backend) {
        // Nếu không có file mới được chọn, nhưng có avatar_url từ backend,
        // thì gửi avatar_url này để backend biết giữ lại ảnh cũ
        formDataToSend.append("avatar_url", formData.avatar_url_from_backend);
      } else {
        // Nếu không có file mới và không có avatar_url từ backend (người dùng đã xóa hoặc chưa có)
        // Gửi một giá trị rỗng/null cho avatar_url để backend xóa ảnh nếu có,
        // hoặc không làm gì nếu backend mặc định là 'nullable'.
        // Tùy thuộc vào cách backend xử lý việc xóa ảnh cũ khi không gửi trường 'avatar'
        // Tôi khuyến nghị gửi một trường báo hiệu việc xóa nếu muốn xóa ảnh cũ
        // formDataToSend.append("avatar_url", ""); // Hoặc một cờ delete_avatar
      }

      // === Logic gửi district_ids và cinema_id dựa trên vai trò ===
      console.log("[UserForm] Submitting with role:", formData.role);
      console.log("[UserForm] formData.district_ids:", formData.district_ids);
      console.log("[UserForm] formData.cinema_id:", formData.cinema_id);

      console.log("[UserForm] Processing role in submit:", formData.role);
      if (formData.role === "district_manager") {
        if (
          Array.isArray(formData.district_ids) &&
          formData.district_ids.length > 0
        ) {
          // Laravel mong đợi district_ids[] hoặc district_ids[0], district_ids[1]...
          formData.district_ids.forEach((id) => {
            formDataToSend.append(`district_ids[]`, Number(id)); // Đúng định dạng cho mảng
          });
          console.log(
            "[UserForm] Added district_ids to FormData:",
            formData.district_ids
          );
        } else {
          console.log("[UserForm] No district_ids to add or empty array");
        }
        // Nếu district_manager nhưng không chọn quận nào, Laravel sẽ báo lỗi qua withValidator
        // Không cần append gì thêm cho district_ids ở đây nếu mảng rỗng.
        formDataToSend.delete("cinema_id"); // Đảm bảo không gửi cinema_id khi là district_manager
        console.log("[UserForm] Deleted cinema_id for district_manager");
      } else if (
        ["showtime_manager", "booking_manager"].includes(formData.role)
      ) {
        console.log(
          "[UserForm] Processing showtime_manager/booking_manager role"
        );
        if (formData.cinema_id) {
          formDataToSend.append("cinema_id", Number(formData.cinema_id));
          console.log(
            "[UserForm] Added cinema_id to FormData:",
            formData.cinema_id
          );
        } else {
          console.log("[UserForm] No cinema_id to add");
        }
        // Nếu showtime_manager/booking_manager nhưng không chọn rạp, Laravel sẽ báo lỗi qua withValidator
        formDataToSend.delete("district_ids"); // Đảm bảo không gửi district_ids khi là showtime/booking manager
        console.log(
          "[UserForm] Deleted district_ids for showtime/booking manager"
        );
      } else {
        // Với các vai trò khác ('user', 'admin'), không gửi cinema_id hay district_ids
        console.log("[UserForm] Processing other roles (user, admin)");
        formDataToSend.delete("cinema_id");
        formDataToSend.delete("district_ids");
        console.log(
          "[UserForm] Deleted cinema_id and district_ids for other roles"
        );
      }

      // === Thêm _method cho Laravel ===
      // Chỉ thêm _method nếu đây là request cập nhật (initialData tồn tại)
      // if (initialData) {
      //   formDataToSend.append("_method", "PATCH");
      // }

      console.log(
        "[UserForm] Dữ liệu trong state formData trước khi submit:",
        formData
      );
      console.log("[UserForm] Dữ liệu thực tế trong FormDataToSend:");
      for (let pair of formDataToSend.entries()) {
        // Lưu ý: FormData.entries() không hiển thị nội dung của File object, chỉ tên và loại.
        console.log("[FormData entry]", pair[0] + ":", pair[1]);
      }
      console.log(
        "[UserForm] Total FormData entries:",
        formDataToSend.entries().length
      );

      onSubmit(formDataToSend); // Gọi hàm onSubmit từ prop, truyền FormData
    } else {
      console.log("[UserForm] Validate lỗi, không submit!");
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-2 mt-10 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {initialData ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data" // Đảm bảo enctype này để gửi FormData
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
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
          )}
        </div>

        {/* Luôn hiển thị trường mật khẩu, nhưng validation frontend sẽ có điều kiện */}
        {/* Điều kiện !initialData đảm bảo trường mật khẩu luôn required khi thêm mới */}
        {/* Với trường hợp cập nhật, người dùng có thể nhập để thay đổi hoặc bỏ trống */}
        <div className="space-y-4">
          <div>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu (để trống nếu không đổi)"
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
              Chọn cụm rạp quản lý
            </label>
            <div
              className={`border rounded p-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto ${
                errors.district_ids ? "border-red-500" : "border-gray-300"
              }`}
            >
              {loadingDistricts ? (
                <p className="col-span-2 text-gray-500">Đang tải quận...</p>
              ) : districts.length > 0 ? (
                districts.map((district) => (
                  <label
                    key={district.district_id}
                    className="inline-flex items-center"
                  >
                    <input
                      type="checkbox"
                      value={district.district_id}
                      checked={formData.district_ids.includes(
                        district.district_id
                      )}
                      onChange={handleDistrictCheckboxChange}
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">
                      {district.district_name}
                    </span>
                  </label>
                ))
              ) : (
                <p className="col-span-2 text-gray-500">
                  Không có quận nào được tìm thấy.
                </p>
              )}
            </div>
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
              className={`w-full border rounded p-2 ${
                errors.cinema_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn rạp</option>
              {cinemas.length > 0 ? (
                cinemas.map((cinema) => (
                  <option key={cinema.cinema_id} value={cinema.cinema_id}>
                    {cinema.cinema_name}
                  </option>
                ))
              ) : (
                <option value="">Không có rạp nào được tìm thấy.</option>
              )}
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

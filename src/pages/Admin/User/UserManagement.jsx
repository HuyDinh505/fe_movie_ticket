import React, { useState, useEffect } from "react";
import UserTable from "../../../components/admin/User/UserTable.jsx";
import UserForm from "../../../components/admin/User/UserForm.jsx";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  useGetAllUsersUS,
  useCreateUserUS,
  useUpdateUserUS,
  useDeleteUserUS,
  useGetAllDistrictsUS,
  useGetUserByIdUS,
} from "../../../api/homePage/queries.jsx";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { handleApiError, getApiMessage } from "../../../Utilities/apiMessage"; // Đảm bảo handleApiError được import
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState(null);
  //thêm vào để lấy chi tiết user
  const [editingUserId, setEditingUserId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { userData } = useAuth();
  const queryClient = useQueryClient();

  // Sử dụng các hooks API và di chuyển logic onSuccess/onError vào đây
  const {
    data: usersData,
    isLoading: loadingUsers,
    error, // Thêm error để xử lý lỗi khi fetch dữ liệu
    refetch: fetchUsers, // Thêm refetch để có thể thử lại khi lỗi
  } = useGetAllUsersUS();
  const { data: detailedUserData, isLoading: loadingDetailedUser } =
    useGetUserByIdUS(editingUserId, {
      enabled: !!editingUserId, // Chỉ gọi khi có user_id
    });
  const { data: districtsData, isLoading: loadingDistricts } =
    useGetAllDistrictsUS();
  const districts = districtsData?.data || [];

  useEffect(() => {
    if (detailedUserData?.data && editingUserId) {
      // Sử dụng dữ liệu chi tiết từ API thay vì dữ liệu từ danh sách
      setEditingUser(detailedUserData.data);
    }
  }, [detailedUserData, editingUserId]);

  const { mutate: createUser, isPending: isCreatingUser } = useCreateUserUS({
    onSuccess: (response) => {
      // Kiểm tra lỗi nghiệp vụ từ phản hồi API
      if (response?.data?.status === false) {
        handleApiError(response.data, "Thêm người dùng mới thất bại");
        return;
      }
      toast.success(response.message || "Thêm người dùng mới thành công");
      setIsFormVisible(false);
      setEditingUser(null); // Đảm bảo reset editingUser sau khi tạo thành công
      queryClient.invalidateQueries(["GetAllUsersAPI"]);
    },
    onError: (error) => {
      toast.error(getApiMessage(error, "Không thể thêm người dùng mới"));
    },
  });

  const { mutate: updateUser, isPending: isUpdatingUser } = useUpdateUserUS({
    onSuccess: (response) => {
      // Kiểm tra lỗi nghiệp vụ từ phản hồi API
      if (response?.data?.status === false) {
        handleApiError(response.data, "Cập nhật người dùng thất bại");
        return;
      }
      toast.success(response.message || "Cập nhật người dùng thành công");
      setIsFormVisible(false);
      setEditingUser(null); // Đảm bảo reset editingUser sau khi cập nhật thành công
      queryClient.invalidateQueries(["GetAllUsersAPI"]);
    },
    onError: (error) => {
      toast.error(getApiMessage(error, "Không thể cập nhật người dùng"));
    },
  });

  const { mutate: deleteUserMutation, isPending: isDeletingUser } =
    useDeleteUserUS({
      onSuccess: (response) => {
        if (response?.data?.status === false) {
          Swal.fire(
            "Thất bại!",
            response?.data?.message || "Xóa người dùng thất bại",
            "error"
          );
          return;
        }
        Swal.fire(
          "Đã xóa!",
          response?.data?.message || "Xóa người dùng thành công",
          "success"
        );
        queryClient.invalidateQueries(["GetAllUsersAPI"]);
      },
      onError: (error) => {
        Swal.fire(
          "Thất bại!",
          getApiMessage(error, "Xóa người dùng thất bại."),
          "error"
        );
      },
    });

  const users = usersData?.data || [];

  // Xử lý lỗi khi fetch dữ liệu ban đầu
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Đã xảy ra lỗi</p>
          <p>{error.message}</p>
          <button
            onClick={() => fetchUsers()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Kiểm tra xem users có phải là một mảng không (vẫn giữ để đảm bảo an toàn)
  if (!Array.isArray(users)) {
    console.error("users is not an array:", users);
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Đã xảy ra lỗi khi tải dữ liệu người dùng.
      </div>
    );
  }

  const handleEdit = (user) => {
    setEditingUserId(user.user_id);
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa người dùng này không?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation(userId);
      }
    });
  };

  // Hàm này giờ chỉ gọi mutate mà không cần xử lý onSuccess/onError ở đây nữa
  const handleAddOrUpdateUser = (formDataFromUserForm) => {
    if (formDataFromUserForm) {
      const userId = formDataFromUserForm.get("user_id");
      if (userId) {
        updateUser({ userId: userId, userData: formDataFromUserForm });
      } else {
        createUser(formDataFromUserForm);
      }
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingUser(null);
    setEditingUserId(null);
  };

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      (user.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole
      ? Array.isArray(user.roles) && user.roles.includes(filterRole)
      : true;
    return matchSearch && matchRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Người dùng ({users.length})
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleAddUser}
            // Thêm disabled khi đang tạo người dùng
            disabled={isCreatingUser}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r
            from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600
            hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed" // Thêm style disabled
          >
            <FaPlus className="mr-2" />
            {isCreatingUser ? "Đang thêm..." : "Thêm người dùng mới"}
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
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
              />
            </div>
            <div className="flex-1">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="district_manager">District Manager</option>
                <option value="booking_manager">Booking manager</option>
                <option value="showtime_manager">Showtime Manager</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-auto max-h-[70vh]">
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loadingUsers}
            isDeleting={isDeletingUser}
            currentLoggedInUserId={userData.user_id}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 py-4 border-t">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${
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
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50
                  disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Sau
              </button>
            </div>
          )}
        </div>
        <Modal
          open={isFormVisible}
          onClose={handleCancelEdit}
          widthClass="min-w-[500px]"
        >
          <div className="mx-auto">
            <UserForm
              initialData={editingUser}
              onSubmit={handleAddOrUpdateUser}
              onCancel={handleCancelEdit}
              isSubmitting={isCreatingUser || isUpdatingUser}
              districts={districts} // Truyền danh sách quận vào UserForm
              loadingDistricts={loadingDistricts}
              loadingDetailedUser={loadingDetailedUser}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserManagement;

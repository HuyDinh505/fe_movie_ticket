import React, { useState } from "react";
import UserTable from "../../components/admin/User/UserTable.jsx";
import UserForm from "../../components/admin/User/UserForm.jsx";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  useGetAllUsersUS,
  useCreateUserUS,
  useUpdateUserUS,
  useDeleteUserUS,
} from "../../api/homePage/queries";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "../../components/ui/Modal";

const ITEMS_PER_PAGE = 10;

const UserManagement = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });

  // Tạm thời hardcode ID của người dùng đang đăng nhập (ví dụ: admin có ID 11)
  // Trong thực tế, ID này sẽ được lấy từ context xác thực hoặc global state
  const { userData } = useAuth();

  // Khởi tạo query client
  const queryClient = useQueryClient();

  // Sử dụng các hooks API
  const { data: usersData, isLoading } = useGetAllUsersUS();
  const createUser = useCreateUserUS();
  const updateUser = useUpdateUserUS();
  const deleteUser = useDeleteUserUS();

  // Đã sửa đổi để truy cập đúng mảng dữ liệu người dùng
  const users = usersData?.data?.users || [];

  // Kiểm tra xem users có phải là một mảng không
  if (!Array.isArray(users)) {
    console.error("users is not an array:", users);
    return; // hoặc xử lý lỗi theo cách khác
  }

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormVisible(true);
  };

  const handleDelete = (userId) => {
    setConfirmModal({ open: true, id: userId });
  };

  //Hàm xác nhận xóa
  const handleConfirmDelete = () => {
    if (confirmModal.id) {
      deleteUser.mutate(confirmModal.id, {
        onSuccess: () => {
          toast.success("Xóa người dùng thành công");
          queryClient.invalidateQueries(["GetAllUsersAPI"]);
        },
        onError: (error) => {
          let errorMessage = "Xóa người dùng thất bại.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        },
      });
    }
    setConfirmModal({ open: false, id: null });
  };

  const handleAddOrUpdateUser = (userData) => {
    // Log để kiểm tra userData ngay khi nhận được
    console.log("handleAddOrUpdateUser called with:", userData);

    if (userData) {
      if (userData.user_id) {
        // Update user
        console.log(
          "Updating user with ID:",
          userData.user_id,
          "and data:",
          userData
        );
        updateUser.mutate(
          { userId: userData.user_id, userData },
          {
            onSuccess: () => {
              toast.success("Cập nhật người dùng thành công");
              setIsFormVisible(false);
              setEditingUser(null);
              queryClient.invalidateQueries(["GetAllUsersAPI"]);
            },
            onError: (error) => {
              let errorMessage = "Cập nhật người dùng thất bại.";
              if (error.response && error.response.data) {
                if (error.response.data.errors) {
                  Object.entries(error.response.data.errors).forEach(
                    ([field, messages]) => {
                      messages.forEach((msg) => {
                        toast.error(`${field}: ${msg}`);
                      });
                    }
                  );
                  return;
                } else if (error.response.data.message) {
                  errorMessage = error.response.data.message;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
              toast.error(errorMessage);
            },
          }
        );
      } else {
        // Create new user
        console.log("Creating new user with data:", userData);
        createUser.mutate(userData, {
          onSuccess: () => {
            toast.success("Thêm người dùng thành công");
            setIsFormVisible(false);
            queryClient.invalidateQueries(["GetAllUsersAPI"]);
          },
          onError: (error) => {
            let errorMessage = "Thêm người dùng thất bại.";
            if (error.response && error.response.data) {
              if (
                error.response.data.errors &&
                Object.keys(error.response.data.errors).length > 0
              ) {
                Object.entries(error.response.data.errors).forEach(
                  ([field, messages]) => {
                    messages.forEach((msg) => {
                      toast.error(`${field}: ${msg}`);
                    });
                  }
                );
                return;
              } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
              }
            } else if (error.message) {
              errorMessage = error.message;
            }
            toast.error(errorMessage);
          },
        });
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
  };

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
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
          Quản lý Người dùng
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleAddUser}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base"
          >
            <FaPlus className="mr-2" />
            Thêm người dùng mới
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
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        {isFormVisible ? (
          <div className="bg-white rounded-xl shadow-lg max-w-7xl mx-auto">
            <UserForm
              initialData={editingUser}
              onSubmit={handleAddOrUpdateUser}
              onCancel={handleCancelEdit}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-auto max-h-[70vh]">
            <UserTable
              users={paginatedUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={isLoading}
              currentLoggedInUserId={userData.user_id}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 py-4 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded-lg ${
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
                  className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
      >
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Bạn có chắc chắn muốn xóa người dùng này không?
          </h2>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setConfirmModal({ open: false, id: null })}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;

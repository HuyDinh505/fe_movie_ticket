import React, { useState } from "react";
import TicketTypeForm from "../../../components/admin/TicketType/TicketTypeForm";
import TicketTypeTable from "../../../components/admin/TicketType/TicketTypeTable";
import {
  useGetAllTicketTypesUS,
  useCreateTicketTypeUS,
  useUpdateTicketTypeUS,
  useDeleteTicketTypeUS,
} from "../../../api/homePage/queries";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal";
import { useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

const TicketTypeManagement = () => {
  const [editingTicketType, setEditingTicketType] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const queryClient = useQueryClient();

  // Query hooks
  const { data, isLoading } = useGetAllTicketTypesUS();
  const createTicketType = useCreateTicketTypeUS();
  const updateTicketType = useUpdateTicketTypeUS();
  const deleteTicketType = useDeleteTicketTypeUS();

  const ticketTypes = Array.isArray(data?.data?.tickeType)
    ? data.data.tickeType.filter((type) =>
        type.ticket_type_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(ticketTypes.length / ITEMS_PER_PAGE);
  const paginatedTicketTypes = ticketTypes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAdd = () => {
    setEditingTicketType(null);
    setIsFormVisible(true);
  };

  const handleEdit = (type) => {
    setEditingTicketType(type);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleAddOrUpdate = (formData) => {
    if (editingTicketType) {
      updateTicketType.mutate(
        { id: editingTicketType.ticket_type_id, data: formData },
        {
          onSuccess: () => {
            toast.success("Cập nhật loại vé thành công!");
            setIsFormVisible(false);
            setEditingTicketType(null);
            queryClient.invalidateQueries({
              queryKey: ["GetAllTicketTypesAPI"],
            });
          },
          onError: (error) => {
            toast.error("Cập nhật loại vé thất bại: " + error.message);
          },
        }
      );
    } else {
      createTicketType.mutate(formData, {
        onSuccess: () => {
          toast.success("Thêm loại vé thành công!");
          setIsFormVisible(false);
          queryClient.invalidateQueries({ queryKey: ["GetAllTicketTypesAPI"] });
        },
        onError: (error) => {
          toast.error("Thêm loại vé thất bại: " + error.message);
        },
      });
    }
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingTicketType(null);
  };

  const handleConfirmDelete = () => {
    deleteTicketType.mutate(confirmDelete.id, {
      onSuccess: () => {
        toast.success("Xóa loại vé thành công!");
        queryClient.invalidateQueries({ queryKey: ["GetAllTicketTypesAPI"] });
      },
      onError: (error) => {
        toast.error("Xóa loại vé thất bại: " + error.message);
      },
    });
    setConfirmDelete({ open: false, id: null });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Loại vé
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base"
          >
            + Thêm loại vé mới
          </button>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-3">
            <input
              type="text"
              placeholder="Tìm kiếm loại vé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
            />
          </div>
        </div>
      </div>
      <div className="w-full pt-6">
        <div className="bg-white rounded-xl shadow-lg overflow-auto">
          <TicketTypeTable
            ticketTypes={paginatedTicketTypes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isLoading}
            isDeleting={deleteTicketType.isLoading}
            isDeletedView={false}
          />
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
        <Modal open={isFormVisible} onClose={handleCancelEdit}>
          <div className="max-w-md mx-auto">
            <TicketTypeForm
              initialData={editingTicketType}
              onSubmit={handleAddOrUpdate}
              onCancel={handleCancelEdit}
              isSubmitting={
                createTicketType.isLoading || updateTicketType.isLoading
              }
            />
          </div>
        </Modal>
        <Modal
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, id: null })}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa loại vé</h2>
            <p>Bạn có chắc chắn muốn xóa loại vé này không?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false, id: null })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TicketTypeManagement;

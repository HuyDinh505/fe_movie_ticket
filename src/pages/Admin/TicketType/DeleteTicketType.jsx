import React, { useState } from "react";
import TicketTypeTable from "../../../components/admin/TicketType/TicketTypeTable";
import {
  useGetDeletedTicketTypesUS,
  useRestoreTicketTypeUS,
} from "../../../api/homePage/queries";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal";
import { useQueryClient } from "@tanstack/react-query";

const DeleteTicketType = () => {
  const [confirmRestore, setConfirmRestore] = useState({
    open: false,
    id: null,
  });
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetDeletedTicketTypesUS();
  const restoreTicketType = useRestoreTicketTypeUS();
  const ticketTypes = data?.data || [];

  const handleRestore = (id) => {
    setConfirmRestore({ open: true, id });
  };

  const handleConfirmRestore = () => {
    restoreTicketType.mutate(confirmRestore.id, {
      onSuccess: () => {
        toast.success("Khôi phục loại vé thành công!");
        queryClient.invalidateQueries({
          queryKey: ["GetDeletedTicketTypesAPI"],
        });
      },
      onError: (error) => {
        toast.error("Khôi phục loại vé thất bại: " + error.message);
      },
    });
    setConfirmRestore({ open: false, id: null });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded shadow-none border border-gray-200 sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Loại vé đã xóa
        </h1>
      </div>
      <div className="w-full pt-6">
        <div className="bg-white rounded shadow-none border border-gray-200 overflow-auto">
          <TicketTypeTable
            ticketTypes={ticketTypes}
            onEdit={() => {}}
            onDelete={handleRestore}
            loading={isLoading}
            isDeleting={restoreTicketType.isLoading}
            isDeletedView={true}
          />
        </div>
        <Modal
          open={confirmRestore.open}
          onClose={() => setConfirmRestore({ open: false, id: null })}
        >
          <div className="p-4 bg-white rounded shadow-none border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Xác nhận khôi phục loại vé
            </h2>
            <p>Bạn có chắc chắn muốn khôi phục loại vé này không?</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setConfirmRestore({ open: false, id: null })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DeleteTicketType;

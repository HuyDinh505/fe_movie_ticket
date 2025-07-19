import React, { useState, useCallback } from "react";
import TheaterForm from "../../../components/admin/Theater/TheaterForm";
import TheaterTable from "../../../components/admin/Theater/TheaterTable";
import RoomTable from "../../../components/admin/Room/RoomTable";
import RoomForm from "../../../components/admin/Room/RoomForm";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  useGetAllCinemasUS,
  useCreateCinemaUS,
  useUpdateCinemaUS,
  useDeleteCinemaUS,
  useCreateTheaterRoomUS,
  useUpdateTheaterRoomUS,
  useDeleteTheaterRoomUS,
  useRestoreTheaterRoomUS,
} from "../../../api/homePage/queries";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "../../../components/ui/Modal";

const ITEMS_PER_PAGE = 10;

const TheaterManagement = () => {
  const [editingTheater, setEditingTheater] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCinemaIdForRooms, setSelectedCinemaIdForRooms] =
    useState(null);
  const [isRoomFormVisible, setIsRoomFormVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null, // "deleteRoom" | "restoreRoom" | "deleteTheater"
    id: null,
  });

  // React Query hooks
  const { data: cinemasData, isLoading } = useGetAllCinemasUS();
  const createCinema = useCreateCinemaUS();
  const updateCinema = useUpdateCinemaUS();
  const deleteCinema = useDeleteCinemaUS();
  const createRoom = useCreateTheaterRoomUS();
  const updateRoom = useUpdateTheaterRoomUS();
  const deleteRoom = useDeleteTheaterRoomUS();
  const restoreRoom = useRestoreTheaterRoomUS();
  const queryClient = useQueryClient();

  // Handle Google Maps loading error
  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setIsFormVisible(true);
    setSelectedCinemaIdForRooms(theater.cinema_id);
    setIsRoomFormVisible(false);
    setEditingRoom(null);
  };

  const handleDelete = (theaterId) => {
    setConfirmModal({ open: true, type: "deleteTheater", id: theaterId });
  };

  const handleAddOrUpdateTheater = (theaterData) => {
    if (theaterData) {
      // Lấy id từ FormData nếu là FormData, hoặc từ object nếu là object
      let cinemaId = theaterData.get ? theaterData.get('cinema_id') : theaterData.cinema_id;
      console.log('[TheaterManagement] handleAddOrUpdateTheater - cinemaId:', cinemaId);
      console.log('[TheaterManagement] handleAddOrUpdateTheater - theaterData:', theaterData);
      if (cinemaId) {
        console.log(`[TheaterManagement] Gọi updateCinema với endpoint: /cinema/${cinemaId}`);
        updateCinema.mutate(
          { cinemaId: cinemaId, cinemaData: theaterData },
          {
            onSuccess: () => {
              toast.success("Cập nhật rạp chiếu thành công!");
              setIsFormVisible(false);
              setEditingTheater(null);
              setSelectedCinemaIdForRooms(null);
              setIsRoomFormVisible(false);
              setEditingRoom(null);
              queryClient.invalidateQueries({ queryKey: ["GetAllCinemasAPI"] });
            },
            onError: (error) => {
              toast.error("Cập nhật rạp chiếu thất bại: " + error.message);
            },
          }
        );
      } else {
        console.log('[TheaterManagement] Gọi createCinema');
        // Create new theater
        createCinema.mutate(theaterData, {
          onSuccess: () => {
            toast.success("Thêm rạp chiếu thành công!");
            setIsFormVisible(false);
            setSelectedCinemaIdForRooms(null);
            setIsRoomFormVisible(false);
            setEditingRoom(null);
            queryClient.invalidateQueries({ queryKey: ["GetAllCinemasAPI"] });
          },
          onError: (error) => {
            toast.error("Thêm rạp chiếu thất bại: " + error.message);
          },
        });
      }
    }
  };

  const handleAddTheater = () => {
    setEditingTheater(null);
    setIsFormVisible(true);
    setSelectedCinemaIdForRooms(null);
    setIsRoomFormVisible(false);
    setEditingRoom(null);
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setEditingTheater(null);
    setSelectedCinemaIdForRooms(null);
    setIsRoomFormVisible(false);
    setEditingRoom(null);
  };

  const handleAddRoom = () => {
    setIsRoomFormVisible(true);
    setEditingRoom(null);
  };

  const handleEditRoom = (room) => {
    setIsRoomFormVisible(true);
    setEditingRoom(room);
  };

  const handleSaveRoom = (roomData) => {
    if (editingRoom) {
      // Update existing room
      updateRoom.mutate(
        {
          roomId: editingRoom.room_id,
          roomData: { ...roomData, cinema_id: selectedCinemaIdForRooms },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật phòng chiếu thành công!");
            setIsRoomFormVisible(false);
            setEditingRoom(null);
            queryClient.invalidateQueries({
              queryKey: [
                "GetTheaterRoomsByCinemaAPI",
                selectedCinemaIdForRooms,
              ],
            });
          },
          onError: (error) => {
            toast.error("Cập nhật phòng chiếu thất bại: " + error.message);
          },
        }
      );
    } else {
      // Create new room
      createRoom.mutate(
        { ...roomData, cinema_id: selectedCinemaIdForRooms },
        {
          onSuccess: () => {
            toast.success("Thêm phòng chiếu thành công!");
            setIsRoomFormVisible(false);
            queryClient.invalidateQueries({
              queryKey: [
                "GetTheaterRoomsByCinemaAPI",
                selectedCinemaIdForRooms,
              ],
            });
          },
          onError: (error) => {
            toast.error("Thêm phòng chiếu thất bại: " + error.message);
          },
        }
      );
    }
  };

  const handleDeleteRoom = (roomId) => {
    setConfirmModal({ open: true, type: "deleteRoom", id: roomId });
  };

  const handleRestoreRoom = (roomId) => {
    setConfirmModal({ open: true, type: "restoreRoom", id: roomId });
  };

  const handleCancelRoomForm = () => {
    setIsRoomFormVisible(false);
    setEditingRoom(null);
  };

  const handleConfirmAction = () => {
    if (confirmModal.type === "deleteRoom") {
      deleteRoom.mutate(confirmModal.id, {
        onSuccess: () => {
          toast.success("Xóa phòng chiếu thành công!");
          queryClient.invalidateQueries({
            queryKey: ["GetTheaterRoomsByCinemaAPI", selectedCinemaIdForRooms],
          });
        },
        onError: (error) => {
          toast.error("Xóa phòng chiếu thất bại: " + error.message);
        },
      });
    } else if (confirmModal.type === "restoreRoom") {
      restoreRoom.mutate(confirmModal.id, {
        onSuccess: () => {
          toast.success("Khôi phục phòng chiếu thành công!");
          queryClient.invalidateQueries({
            queryKey: ["GetTheaterRoomsByCinemaAPI", selectedCinemaIdForRooms],
          });
        },
        onError: (error) => {
          toast.error("Khôi phục phòng chiếu thất bại: " + error.message);
        },
      });
    } else if (confirmModal.type === "deleteTheater") {
      deleteCinema.mutate(confirmModal.id, {
        onSuccess: () => {
          toast.success("Xóa rạp chiếu thành công!");
          queryClient.invalidateQueries({ queryKey: ["GetAllCinemasAPI"] });
        },
        onError: (error) => {
          toast.error("Xóa rạp chiếu thất bại: " + error.message);
        },
      });
    }
    setConfirmModal({ open: false, type: null, id: null });
  };

  const filteredTheaters = (cinemasData?.data || []).filter((theater) => {
    const matchSearch = theater.cinema_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredTheaters.length / ITEMS_PER_PAGE);
  const paginatedTheaters = filteredTheaters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const geocodeAddress = useCallback((address) => {
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setSelectedCinemaIdForRooms(location.lat() + "," + location.lng());
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    }
  }, []);

  const handleAddressChange = (address) => {
    geocodeAddress(address);
  };

  // Get the map URL from editing theater or use a default
  const getMapUrl = () => {
    if (editingTheater && editingTheater.map_address) {
      return editingTheater.map_address;
    }
    // Default map URL if no map_address is available
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.435373360717!2d106.69937787427165!3d10.777928659167632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f48779307a5%3A0x9ba2ed64e9e3ef7b!2zQ0dWIFZpbmNvbSDEkOG7k25nIEto4bufaQ!5e0!3m2!1sen!2s!4v1750994606691!5m2!1sen!2s";
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Quản lý Rạp chiếu
        </h1>
        {!isFormVisible && (
          <button
            onClick={handleAddTheater}
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r 
            from-blue-500 to-blue-700 text-white rounded-xl hover:from-blue-600 
            hover:to-blue-800 font-semibold shadow-md transition-all text-sm sm:text-base cursor-pointer"
          >
            <FaPlus className="mr-2" />
            Thêm rạp chiếu mới
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
                placeholder="Tìm kiếm rạp chiếu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50 transition"
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full pt-6">
        {isFormVisible ? (
          <>
            <div className="flex flex-col lg:flex-row w-full space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="w-full lg:w-1/2">
                <TheaterForm
                  initialData={editingTheater}
                  onSubmit={handleAddOrUpdateTheater}
                  onCancel={handleCancelEdit}
                  onAddressChange={handleAddressChange}
                  cinemas={cinemasData?.data || []}
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col space-y-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  {/* <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h3 className="text-white font-semibold text-lg flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Vị trí Rạp chiếu
                    </h3>
                  </div> */}
                  <div className="relative">
                    <iframe
                      src={getMapUrl()}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-[450px]"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent to-transparent"></div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {editingTheater
                        ? `Bản đồ hiển thị vị trí rạp chiếu ${editingTheater.cinema_name}`
                        : "Bản đồ hiển thị vị trí rạp chiếu"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {selectedCinemaIdForRooms && (
              <RoomTable
                cinemaId={selectedCinemaIdForRooms}
                onAddRoom={handleAddRoom}
                onEditRoom={handleEditRoom}
                onDeleteRoom={handleDeleteRoom}
                onRestoreRoom={handleRestoreRoom}
              />
            )}

            {isRoomFormVisible && (
              <RoomForm
                onSubmit={handleSaveRoom}
                onCancel={handleCancelRoomForm}
                initialData={editingRoom}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg">
            <TheaterTable
              theaters={paginatedTheaters}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={isLoading}
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
        {/* Modal xác nhận xóa/khôi phục */}
        <Modal
          open={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, type: null, id: null })}
        >
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {confirmModal.type === "deleteRoom" &&
                "Bạn có chắc chắn muốn xóa phòng chiếu này không?"}
              {confirmModal.type === "restoreRoom" &&
                "Bạn có chắc chắn muốn khôi phục phòng chiếu này không?"}
              {confirmModal.type === "deleteTheater" &&
                "Bạn có chắc chắn muốn xóa rạp chiếu này không?"}
            </h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmAction}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
              <button
                onClick={() =>
                  setConfirmModal({ open: false, type: null, id: null })
                }
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TheaterManagement;

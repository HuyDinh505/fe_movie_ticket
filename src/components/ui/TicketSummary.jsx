import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TicketSummary = ({
  movieTitle,
  cinema,
  showtime,
  seats,
  seatsName = [],
  totalPrice,
  tickets,
  combos,
  allCombos,
  movie,
}) => {
  const navigate = useNavigate();

  const totalTicketsCount = tickets?.reduce((sum, t) => sum + t.count, 0) || 0;
  const canBook =
    showtime &&
    tickets &&
    tickets.some((t) => t.count > 0) &&
    seats &&
    seats.length === totalTicketsCount;

  const handleBookTicket = () => {
    if (!canBook) {
      toast.error("Vui lòng chọn suất chiếu, loại vé, số lượng vé và đủ ghế trước khi đặt vé!");
      return;
    }
    const bookingData = {
      movieTitle,
      cinema,
      showtime,
      seats,
      seatsName,
      tickets,
      combos,
      allCombos,
      totalPrice,
      movie,
    };
    navigate("/payment", { state: bookingData });
  };

  const formatTickets = () => {
    if (!tickets) return "";
    return tickets
      .filter((ticket) => ticket.count > 0)
      .map((ticket) => `${ticket.count} ${ticket.ticket_type_name}`)
      .join(", ");
  };

  const formatCombos = () => {
    if (!combos || !allCombos) return "";
    return Object.entries(combos)
      .filter(([, quantity]) => quantity > 0)
      .map(([comboId, quantity]) => {
        const comboDetail = allCombos.find(
          (combo) => combo.concession_id?.toString() === comboId?.toString()
        );
        return `${quantity} ${
          comboDetail ? comboDetail.concession_name : `Combo ${comboId}`
        }`;
      })
      .join(", ");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center py-4 bg-white border-t border-gray-200">
      <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0 px-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          {movieTitle}
        </h3>
        <p className="text-sm text-gray-600">
          {showtime.time} - {showtime.day} - {cinema}
        </p>
        <p className="text-sm text-gray-600">Ghế : {seatsName.join(", ")}</p>
        <p className="text-sm text-gray-600">{formatTickets()}</p>
        {combos && Object.values(combos).some((q) => q > 0) && (
          <p className="text-sm text-gray-600">{formatCombos()}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-4 w-full sm:w-auto">
        <div className="text-right w-full sm:w-auto">
          <p className="text-sm text-gray-600">Tạm tính:</p>
          <p
            className="text-lg sm:text-xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {totalPrice.toLocaleString()} VND
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors w-full">
            {showtime.time}
          </button>
          <button
            onClick={handleBookTicket}
            className="px-6 py-2 rounded-lg transition-colors w-full font-semibold cursor-pointer"
            style={{
              backgroundColor: canBook ? "var(--color-primary)" : "#eee",
              color: canBook ? "black" : "#aaa",
              cursor: canBook ? "pointer" : "not-allowed",
            }}
            disabled={!canBook}
            onMouseEnter={(e) => {
              if (canBook) {
                e.target.style.backgroundColor = "var(--color-hover)";
                e.target.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              if (canBook) {
                e.target.style.backgroundColor = "var(--color-primary)";
                e.target.style.color = "black";
              }
            }}
          >
            ĐẶT VÉ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSummary;

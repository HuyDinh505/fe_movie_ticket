import React, { useState, useEffect } from "react";
import { useGetAllTicketTypesUS } from "../../api/homePage/queries";

function TicketTypeSelector({ onTicketSelect, selectedTickets }) {
  const { data: ticketTypesData, isLoading, error } = useGetAllTicketTypesUS();

  const ticketTypes = ticketTypesData?.data?.tickeType || [];

  const [counts, setCounts] = useState(() => {
    if (selectedTickets && ticketTypes.length > 0) {
      // Initialize counts based on selectedTickets if available
      const initialCounts = Array(ticketTypes.length).fill(0);
      selectedTickets.forEach((selected) => {
        const index = ticketTypes.findIndex(
          (t) => t.ticket_type_id === selected.ticket_type_id
        );
        if (index !== -1) {
          initialCounts[index] = selected.count;
        }
      });
      return initialCounts;
    }
    return Array(ticketTypes.length).fill(0);
  });

  // Reset counts when ticketTypes change
  useEffect(() => {
    if (ticketTypes.length > 0) {
      setCounts(Array(ticketTypes.length).fill(0));
    }
  }, [ticketTypes]);

  // Dùng useEffect để gọi onTicketSelect khi counts thay đổi
  useEffect(() => {
    if (ticketTypes.length > 0) {
      const selected = counts
        .map((count, index) => ({
          ...ticketTypes[index],
          count: count,
        }))
        .filter((ticket) => ticket.count > 0);
      onTicketSelect(selected);
    }
  }, [counts, onTicketSelect, ticketTypes]);

  const handleChange = (index, delta) => {
    setCounts((prev) =>
      prev.map((count, i) => (i === index ? Math.max(count + delta, 0) : count))
    );
  };

  if (isLoading) {
    return (
      <section className="max-w-screen-xl mx-auto sm:px-6 md:px-8 lg:px-10 sm:py-8 md:py-10">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-orange-400 mb-6">
          CHỌN LOẠI VÉ
        </h2>
        <div className="text-center">Đang tải danh sách loại vé...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 sm:py-8 md:py-10">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-orange-400 mb-6">
          CHỌN LOẠI VÉ
        </h2>
        <div className="text-center text-red-500">
          Lỗi khi tải danh sách loại vé: {error.message}
        </div>
      </section>
    );
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 sm:py-8 md:py-10">
        <h2 className="text-center text-xl sm:text-2xl font-bold text-orange-400 mb-6">
          CHỌN LOẠI VÉ
        </h2>
        <div className="text-center">Không có loại vé nào khả dụng</div>
      </section>
    );
  }

  return (
    <section className="max-w-screen-xl mx-auto sm:px-6 md:px-8 lg:px-10 pt-2 pb-6 sm:pt-2 sm:pb-8 md:pt-2 md:pb-10">
      <h2
        className="text-center text-xl sm:text-2xl font-bold mb-6"
        style={{ color: "var(--color-text)" }}
      >
        CHỌN LOẠI VÉ
      </h2>
      <div className="flex gap-4 justify-center flex-wrap">
        {ticketTypes.map((ticket, index) => (
          <div
            key={ticket.ticket_type_id}
            className="border border-orange-300 p-4 rounded text-center w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-0.66rem)] lg:w-[calc(25%-0.75rem)]"
          >
            <h4 className="font-bold">{ticket.ticket_type_name}</h4>
            <p className="font-semibold mb-3">
              {ticket.ticket_price
                ? parseFloat(ticket.ticket_price).toLocaleString("vi-VN")
                : "0"}{" "}
              VNĐ
            </p>
            <div className="flex items-center justify-center gap-3 bg-gray-200 rounded px-3 py-1">
              <button
                onClick={() => handleChange(index, -1)}
                className="text-lg px-2 font-bold cursor-pointer"
              >
                -
              </button>
              <span>{counts[index]}</span>
              <button
                onClick={() => handleChange(index, 1)}
                className="text-lg px-2 font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TicketTypeSelector;

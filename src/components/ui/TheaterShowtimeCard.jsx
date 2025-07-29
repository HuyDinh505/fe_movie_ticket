// TheaterShowtimeCard.jsx
import React from "react";
import { FaChevronDown } from "react-icons/fa";

function TheaterShowtimeCard({
  theater, // Đối tượng 'theater' chứa 'showtimes'
  onSelectShowtime,
  selectedShowtime,
  isOpen,
  onToggle,
}) {
  const showtimes = theater.showtimes; // Truy cập showtimes từ đối tượng theater

  return (
    <div
      className="rounded p-4 mb-4 w-[80%] mx-auto"
      style={{ backgroundColor: "var(--color-showtime-bg)", opacity: 0.7 }}
    >
      <div
        className="flex justify-between items-center mb-2 cursor-pointer"
        onClick={onToggle}
      >
        <div>
          <h4 className="font-semibold text-white">{theater.name}</h4>
          <p className="text-sm text-white">{theater.address}</p>
          {theater.room_name && (
            <p className="text-sm italic text-white">
              {theater.room_name}
              {theater.room_type ? ` (${theater.room_type})` : ""}
            </p>
          )}
        </div>
        <FaChevronDown
          className={`transition-transform duration-300 text-xl ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {isOpen && showtimes && showtimes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {showtimes.map((showtimeItem, index) => {
              console.log(
                "Inside TheaterShowtimeCard - showtimeItem:",
                showtimeItem
              );
              const formattedTime = showtimeItem.time
                ? showtimeItem.time
                : showtimeItem.start_time
                ? new Date(showtimeItem.start_time).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "N/A";
              console.log(
                "Inside TheaterShowtimeCard - formattedTime:",
                formattedTime
              );

              const isSelected =
                selectedShowtime &&
                selectedShowtime.show_time_id === showtimeItem.show_time_id;

              console.log(
                `Comparing: selectedShowtime.show_time_id (${selectedShowtime?.show_time_id}) === showtimeItem.show_time_id (${showtimeItem.show_time_id}) => ${isSelected}`
              );
              console.log(
                `Types: selectedShowtime.show_time_id (${typeof selectedShowtime?.show_time_id}) | showtimeItem.show_time_id (${typeof showtimeItem.show_time_id})`
              );

              return (
                <button
                  key={index}
                  className={`px-3 py-1 rounded border font-bold transition cursor-pointer`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: "var(--color-hover-showtime)",
                          color: "white",
                          borderColor: "var(--color-hover-showtime)",
                        }
                      : {
                          backgroundColor: "white",
                          color: "var(--color-hover-showtime)",
                          borderColor: "var(--color-hover-showtime)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor =
                        "var(--color-hover-showtime)";
                      e.target.style.color = "var(--color-hover-showtime)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = "white";
                      e.target.style.color = "var(--color-hover-showtime)";
                    }
                  }}
                  onClick={() => onSelectShowtime(showtimeItem)}
                >
                  {formattedTime}
                </button>
              );
            })}
          </div>
        ) : isOpen ? (
          <p className="text-gray-600">Không có suất chiếu nào cho ngày này.</p>
        ) : null}
      </div>
    </div>
  );
}

export default TheaterShowtimeCard;

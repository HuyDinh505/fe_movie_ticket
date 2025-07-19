import React, { useState, useEffect } from "react";
import ShowtimeDateSelector from "../../components/ui/ShowtimeDateSelector";
import TheaterShowtimeCard from "../../components/ui/TheaterShowtimeCard";

function ShowtimeSection({ onShowtimeSelect, selectedShowtime, cinemas }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [openCinemas, setOpenCinemas] = useState({});

  useEffect(() => {
    if (cinemas && cinemas.length > 0) {
      // Lấy tất cả các ngày có suất chiếu (unique, không lặp)
      const dates = new Set();
      cinemas.forEach((cinema) => {
        cinema.rooms.forEach((room) => {
          room.showtimes_for_this_movie.forEach((showtime) => {
            let dateString = "";
            if (showtime.start_time.includes("T")) {
              dateString = showtime.start_time.split("T")[0];
            } else {
              dateString = showtime.start_time.split(" ")[0];
            }
            dates.add(dateString);
          });
        });
      });
      // Chuyển đổi thành mảng và sắp xếp
      const sortedDates = Array.from(dates).sort();
      // Format dates cho component
      const formattedDates = sortedDates.map((date) => {
        const d = new Date(date);
        return {
          day: d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }),
          weekday: d.toLocaleDateString("vi-VN", { weekday: "long" }),
          fullDate: date,
        };
      });
      setAvailableDates(formattedDates);
      if (formattedDates.length > 0 && selectedDate === null) {
        setSelectedDate(formattedDates[0]);
      }
      // Mặc định mở tất cả rạp khi render lần đầu
      const initialOpen = {};
      cinemas.forEach((_, idx) => {
        initialOpen[idx] = true;
      });
      setOpenCinemas(initialOpen);
    }
  }, [cinemas]);

  const toggleCinema = (index) => {
    setOpenCinemas((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 pt-6 pb-2 sm:px-6 md:px-8 lg:px-10 sm:pt-8 sm:pb-2 md:pt-10 md:pb-2">
      <h2
        className="text-center text-xl sm:text-2xl font-bold mb-4"
        style={{ color: "var(--color-text)" }}
      >
        LỊCH CHIẾU
      </h2>

      {availableDates.length > 0 && (
        <ShowtimeDateSelector
          dates={availableDates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      {selectedDate && (
        <div className="mt-8 flex flex-col items-center">
          <h2
            className="font-bold mb-4 text-center text-xl sm:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            DANH SÁCH PHÒNG CHIẾU
          </h2>
          {cinemas &&
            cinemas.map((cinema, cinemaIdx) =>
              cinema.rooms.map((room, roomIdx) => {
                // Lọc suất chiếu của phòng theo ngày
                const showtimes = room.showtimes_for_this_movie
                  .filter((showtime) => {
                    let showtimeDate = showtime.start_time.includes("T")
                      ? showtime.start_time.split("T")[0]
                      : showtime.start_time.split(" ")[0];
                    return showtimeDate === selectedDate.fullDate;
                  })
                  .map((showtime) => {
                    const d = new Date(showtime.start_time);
                    let timeString = d.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                    return {
                      ...showtime,
                      time: timeString,
                      room_name: room.room_name,
                      room_type: room.room_type,
                      room_id: room.room_id,
                      theater: cinema,
                    };
                  });

                if (showtimes.length === 0) return null;

                return (
                  <TheaterShowtimeCard
                    key={`${cinema.cinema_id}-${room.room_id}`}
                    theater={{
                      name: cinema.cinema_name,
                      address: cinema.address,
                      room_name: room.room_name,
                      room_type: room.room_type,
                      showtimes: showtimes,
                    }}
                    onSelectShowtime={onShowtimeSelect}
                    selectedShowtime={selectedShowtime}
                    selectedDate={selectedDate}
                    isOpen={openCinemas[`${cinemaIdx}-${roomIdx}`]}
                    onToggle={() => toggleCinema(`${cinemaIdx}-${roomIdx}`)}
                  />
                );
              })
            )}
        </div>
      )}
    </section>
  );
}

export default ShowtimeSection;

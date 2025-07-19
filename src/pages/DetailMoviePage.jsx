import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetMovieWithShowtimesUS,
  useGetDVAnUongUS,
} from "../api/homePage/queries";
import MovieDetailPageLayout from "../layouts/Home/MovieDetailPage.jsx";
import TicketTypeSelector from "../layouts/Home/TicketTypeSelector.jsx";
import ShowtimeSection from "../layouts/Home/ShowtimeSection.jsx";
import SeatSelector from "../components/ui/SeatSelector.jsx";
import ComboSelectorSection from "../layouts/Home/ComboSelectorSection.jsx";
import TicketSummaryPage from "../layouts/Home/TicketSummaryPage.jsx";

const DetailMoviePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [seatMap, setSeatMap] = useState([]);
  const seatSelectorRef = useRef();

  useEffect(() => {
    if (location.state?.selectedShowtime) {
      setSelectedShowtime(location.state.selectedShowtime);
      setCurrentStep(location.state.initialStep || 2);
    }
  }, [location.state]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromPayment = urlParams.get("fromPayment");
    if (location.state?.fromPayment || fromPayment === "true") {
      toast.info("Vui lòng kiểm tra lại danh sách ghế và chọn ghế khác.");
      setRefreshKey((prev) => prev + 1);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  const {
    data: movieDetailData,
    isLoading,
    error,
  } = useGetMovieWithShowtimesUS(id);

  const { data: concessionsData } = useGetDVAnUongUS();
  const allCombos = concessionsData?.data?.concessions || [];
  const movie = movieDetailData?.data || null;

  const totalTicketsCount = selectedTickets
    ? selectedTickets.reduce((sum, ticket) => sum + ticket.count, 0)
    : 0;

  const handleShowtimeSelect = useCallback((showtime) => {
    setSelectedShowtime(showtime);
    setCurrentStep(2);
  }, []);

  const handleTicketSelect = useCallback((tickets) => {
    setSelectedTickets(tickets);
    const totalTickets =
      tickets?.reduce((sum, ticket) => sum + ticket.count, 0) || 0;
    setCurrentStep(totalTickets > 0 ? 3 : 2);
  }, []);

  const handleSeatSelect = useCallback((seats, seatMapData) => {
    setSelectedSeats(seats);
    if (seatMapData) setSeatMap(seatMapData);
  }, []);

  const handleProceedAfterSeatSelection = useCallback(() => {
    if (selectedSeats.length !== totalTicketsCount) {
      toast.error(`Vui lòng chọn đủ ${totalTicketsCount} ghế!`);
      return;
    }
    setCurrentStep(4);
  }, [selectedSeats, totalTicketsCount]);

  const handleComboSelect = useCallback((combos) => {
    setSelectedCombos(combos);
    if (
      combos &&
      Object.keys(combos).length > 0 &&
      Object.values(combos).some((q) => q > 0)
    ) {
      setCurrentStep(5);
    } else {
      setCurrentStep(4);
    }
  }, []);

  const selectedSeatsName = selectedSeats
    .map((id) => {
      for (const row of seatMap) {
        const found = row.find((seat) => seat && seat.seat_id === id);
        if (found) return found.seat_display_name;
      }
      return null;
    })
    .filter(Boolean);

  // Polling seat map mỗi 5 giây khi ở bước chọn ghế
  useEffect(() => {
    if (currentStep < 3 || !selectedShowtime) return;
    const interval = setInterval(() => {
      if (seatSelectorRef.current && seatSelectorRef.current.refreshSeatMap) {
        seatSelectorRef.current.refreshSeatMap();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentStep, selectedShowtime]);

  if (isLoading) return <div>Đang tải chi tiết phim...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;
  if (!movie) return <div>Không tìm thấy phim.</div>;

  return (
    <>
      <MovieDetailPageLayout movie={movie} />
      <div className="max-w-6xl mx-auto px-4 pb-28">
        <ShowtimeSection
          onShowtimeSelect={handleShowtimeSelect}
          selectedShowtime={selectedShowtime}
          movieId={movie.movie_id}
          cinemas={movie.cinemas_with_showtimes}
        />
        {/* TicketSummaryPage luôn ở cuối trang khi đã chọn suất chiếu */}
        {selectedShowtime && (
          <TicketSummaryPage
            movieTitle={movie.movie_name}
            showtime={selectedShowtime}
            tickets={selectedTickets}
            seats={selectedSeats}
            seatsName={selectedSeatsName}
            combos={selectedCombos}
            allCombos={allCombos}
            movie={movie}
            cinema={selectedShowtime.theater?.cinema_name}
            theaterAddress={selectedShowtime.theater?.address}
          />
        )}
        {currentStep >= 2 && (
          <TicketTypeSelector
            onTicketSelect={handleTicketSelect}
            selectedTickets={selectedTickets}
          />
        )}
        {currentStep >= 3 && (
          <SeatSelector
            ref={seatSelectorRef}
            key={`${selectedShowtime?.show_time_id}-${refreshKey}`}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
            selectedShowtime={selectedShowtime}
            totalTicketsCount={totalTicketsCount}
            onProceed={handleProceedAfterSeatSelection}
          />
        )}
        {selectedTickets && selectedSeats.length > 0 && (
          <ComboSelectorSection onComboSelect={handleComboSelect} />
        )}
      </div>
    </>
  );
};

export default DetailMoviePage;

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import TicketSummary from "../../components/ui/TicketSummary";

const TICKET_SUMMARY_HEIGHT = 122; // px, chỉnh đúng chiều cao thực tế

const TicketSummaryPage = ({
  showtime,
  tickets,
  seats,
  seatsName = [],
  combos,
  movieTitle,
  allCombos,
  movie,
  cinema,
  theaterAddress,
}) => {
  const { footerRef } = useOutletContext();
  const [isAboveFooter, setIsAboveFooter] = useState(false);

  // Tính tổng giá
  const calculateTotalPrice = () => {
    let total = 0;
    if (tickets) {
      total += tickets.reduce((sum, ticket) => {
        const ticketPrice = parseFloat(ticket.ticket_price) || 0;
        const ticketCount = ticket.count || 0;
        return sum + ticketPrice * ticketCount;
      }, 0);
    }
    if (combos) {
      total += Object.entries(combos).reduce((sum, [comboId, quantity]) => {
        const numericComboId = Number(comboId);
        const combo = allCombos?.find(
          (c) => c.concession_id === numericComboId
        );
        const comboPrice = combo?.unit_price || 0;
        return sum + comboPrice * quantity;
      }, 0);
    }
    return total;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef?.current) return;
      const footerRect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (footerRect.top < windowHeight + TICKET_SUMMARY_HEIGHT) {
        setIsAboveFooter(true);
      } else {
        setIsAboveFooter(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [footerRef]);

  const totalPrice = calculateTotalPrice();

  return (
    <div
      className={`left-0 right-0 bg-[#006666] shadow-lg z-50 transition-transform duration-300 ease-in-out
        ${isAboveFooter ? "absolute" : "fixed"} bottom-0`}
      style={
        isAboveFooter && footerRef?.current
          ? {
              top: footerRef.current.offsetTop - TICKET_SUMMARY_HEIGHT,
              bottom: "auto",
            }
          : { bottom: 0 }
      }
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <TicketSummary
          movieTitle={movieTitle}
          cinema={`${cinema} - ${theaterAddress}`}
          showtime={showtime}
          seats={seats}
          seatsName={seatsName}
          totalPrice={totalPrice}
          tickets={tickets}
          combos={combos}
          allCombos={allCombos}
          movie={movie}
        />
      </div>
    </div>
  );
};

export default TicketSummaryPage;

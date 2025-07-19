import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PaymentForm from "./../components/ui/payment/PaymentForm";
import BookingSummary from "./../components/ui/payment/BookingSummary";
import PaymentSteps from "./../components/ui/payment/PaymentSteps";
import PaymentMethodSelection from "./../components/ui/payment/PaymentMethodSelection";
import PaymentActionButtons from "./../components/ui/payment/PaymentActionButtons";
import GradientModal from "../components/ui/GradientModal";
import {
  usePostBookingUS,
  useInitiatePaymentUS,
  useCalculatePromotionUS,
  useGetUserPromotionsUS,
} from "../api/homePage/queries";
import { useAuth } from "../contexts/AuthContext";
import PromotionCodeInput from "../components/ui/payment/PromotionCodeInput";
import { getApiMessage } from "../Utilities/apiMessage";

function calculateTotalPrice(bookingData) {
  let total = 0;
  // Tính tiền vé
  if (bookingData.tickets) {
    total += bookingData.tickets.reduce((sum, ticket) => {
      const ticketPrice = parseFloat(ticket.ticket_price) || 0;
      const ticketCount = ticket.count || 0;
      return sum + ticketPrice * ticketCount;
    }, 0);
  }
  // Tính tiền combo/concession
  if (bookingData.combos && bookingData.allCombos) {
    total += Object.entries(bookingData.combos).reduce(
      (sum, [comboId, quantity]) => {
        const combo = bookingData.allCombos.find(
          (c) => c.concession_id?.toString() === comboId?.toString()
        );
        const comboPrice = combo?.unit_price || 0;
        return sum + comboPrice * quantity;
      },
      0
    );
  }
  return total;
}

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    agreeAge: false,
    agreeTerms: false,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("momo");

  const bookingDetails = {
    movieTitle: bookingData.movieTitle || "Chưa có thông tin phim",
    age_rating:
      bookingData.movie?.age_rating || "Phim dành cho khán giả mọi lứa tuổi", // This should come from movie data
    cinemaName: bookingData.cinema || "Chưa chọn rạp",
    cinemaAddress: bookingData.cinema || "Chưa có địa chỉ",
    showtime: bookingData.showtime
      ? `${bookingData.showtime.time || ""} ${
          bookingData.showtime.day || ""
        }`.trim() || "Chưa chọn suất chiếu"
      : "Chưa chọn suất chiếu",
    room: bookingData.showtime.room_name || "01", // This should come from theater data
    ticketCount:
      bookingData.tickets?.reduce((sum, ticket) => sum + ticket.count, 0) || 0,
    ticketType:
      bookingData.tickets
        ?.map((t) => `${t.count} ${t.ticket_type_name || t.label || ""}`.trim())
        .join(", ") || "Chưa chọn vé",
    seatType: "Ghế Thường", // This should come from seat data
    seatNumber: bookingData.seatsName?.join(", ") || "Chưa chọn ghế",
    combo: bookingData.combos
      ? Object.entries(bookingData.combos)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => {
            const combo = bookingData.allCombos?.find(
              (c) => c.concession_id?.toString() === id?.toString()
            );
            return `${qty} ${combo?.concession_name || `Combo ${id}`}`;
          })
          .join(", ")
      : "Chưa chọn combo",
    total: calculateTotalPrice(bookingData),
    holdTime: 180, // Dummy hold time in seconds (3 minutes)
  };
  // console.log(bookingData);
  const [timeLeft, setTimeLeft] = useState(bookingDetails.holdTime);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [appliedPromotion, setAppliedPromotion] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(bookingDetails.total);
  const { mutate: calculatePromotion, isLoading: isCalculatingPromotion } =
    useCalculatePromotionUS();
  const { data: promotionsData } = useGetUserPromotionsUS();
  const allPromotions = promotionsData?.data || [];

  const {
    mutate: bookTicket,
    isLoading: _isBooking,
    isSuccess,
    isError,
    data: _bookingResponse,
    error: _bookingError,
  } = usePostBookingUS();

  const {
    mutate: initiatePayment,
    isLoading: isPaymentLoading,
    isSuccess: isPaymentSuccess,
    isError: isPaymentError,
    data: paymentResponse,
    error: paymentError,
  } = useInitiatePaymentUS();

  const { isLoggedIn, userData: _userData } = useAuth();

  const seatMapRef = useRef();

  // Refetch trạng thái ghế khi vào trang
  useEffect(() => {
    if (seatMapRef.current && seatMapRef.current.refreshSeatMap) {
      seatMapRef.current.refreshSeatMap();
    }
  }, []);
  //Hiển thị modal khi hết thời gian giữ vé
  useEffect(() => {
    if (timeLeft <= 0) {
      setShowTimeoutModal(true);
    }
  }, [timeLeft]);

  //Đếm ngược thời gian giữ vé
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  //Xử lý khi thanh toán thành công (MoMo, Onepay...)
  useEffect(() => {
    if (isPaymentSuccess && paymentResponse) {
      const payUrl = paymentResponse.data?.payment_details?.payUrl;
      //đúng chuyển sang trang thanh toán
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        // Xử lý lỗi không có URL thanh toán
        const errorMessage =
          paymentResponse.data?.message || "Không tìm thấy URL thanh toán";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Nếu là lỗi vé đã bị đặt, hiển thị thông báo hướng dẫn
        if (
          errorMessage.includes("đã được đặt") ||
          errorMessage.includes("không khả dụng") ||
          errorMessage.includes("booked")
        ) {
          toast.info("Vé đã bị người khác đặt. Vui lòng chọn ghế khác.", {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            const movieId =
              bookingData.movie?.movie_id || location.pathname.split("/").pop();
            window.location.href = `/movie/${movieId}?${new URLSearchParams({
              showtime: bookingData.showtime?.show_time_id || "",
              fromPayment: "true",
            })}`;
          }, 3000);
        }
      }
    }
  }, [isPaymentSuccess, paymentResponse]);

  // xử lý các trường hợp lỗi khi khởi tạo thanh toán
  useEffect(() => {
    if (isPaymentError && paymentError) {
      console.error("MoMo payment error:", paymentError);

      // Kiểm tra xem có phải lỗi ghế đã bị đặt không
      const errorMessage =
        paymentError?.data?.errors ||
        paymentError?.message ||
        "Có lỗi xảy ra khi tạo thanh toán.";

      if (errorMessage.includes("đã được đặt")) {
        // Lỗi ghế đã bị đặt - chuyển về trang chọn ghế
        toast.error("Ghế đã được người khác đặt. Vui lòng chọn ghế khác.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Chuyển về trang chọn ghế sau 3 giây
        setTimeout(() => {
          navigate(-1); // Quay lại trang trước (trang chọn ghế)
        }, 3000);
      } else {
        // Lỗi khác
        toast.error("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [isPaymentError, paymentError]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Đặt vé thành công! Vé của bạn đang chờ xác nhận.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (isError) {
      toast.error("Đặt vé thất bại! Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    // Nếu đã đăng nhập thì bỏ qua bước nhập thông tin khách hàng
    if (isLoggedIn) {
      setCurrentStep(2);
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form (validate, gửi data, chuyển bước...)
    // console.log("Customer Info:", formData);
    setCurrentStep(2); // Chuyển sang bước thanh toán
  };

  const handlePay = async () => {
    // Kiểm tra authentication
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thanh toán!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Refetch trạng thái ghế trước khi thanh toán
    if (seatMapRef.current && seatMapRef.current.refreshSeatMap) {
      await seatMapRef.current.refreshSeatMap();
    }

    // Xử lý concessions
    let concessions = [];
    if (bookingData.combos && bookingData.allCombos) {
      concessions = Object.entries(bookingData.combos)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({
          concession_id: Number(id),
          quantity: qty,
        }));
    } else if (Array.isArray(bookingData.concessions)) {
      concessions = bookingData.concessions;
    }

    // Chuẩn bị dữ liệu đúng định dạng backend yêu cầu
    const bookingPayload = {
      showtime_id:
        bookingData.showtime?.show_time_id ||
        bookingData.showtime?.id ||
        bookingData.showtime_id,
      tickets: [],
      concessions,
      payment_method: selectedPaymentMethod,
    };
    // Xử lý tickets
    if (
      Array.isArray(bookingData.tickets) &&
      Array.isArray(bookingData.seats)
    ) {
      let seatIndex = 0;
      bookingData.tickets.forEach((ticket) => {
        for (let i = 0; i < ticket.count; i++) {
          if (bookingData.seats[seatIndex] !== undefined) {
            bookingPayload.tickets.push({
              seat_id: bookingData.seats[seatIndex],
              ticket_type_id: ticket.id || ticket.ticket_type_id,
            });
            seatIndex++;
          }
        }
      });
    }

    // console.log("Booking payload:", bookingPayload);
    // console.log("User logged in:", isLoggedIn);
    // console.log("Token:", localStorage.getItem("token"));

    // Sử dụng MoMo API thật
    if (
      selectedPaymentMethod === "momo" ||
      selectedPaymentMethod === "onepay"
    ) {
      // console.log("Đang gọi initiatePayment với payload:", bookingPayload);
      initiatePayment(bookingPayload, {
        onSuccess: (data) => {
          // console.log("Onepay response:", data);
          // console.log("initiatePayment gọi thành công, dữ liệu trả về:", data);
          // ... các xử lý khác của bạn (ví dụ: cập nhật state, chuyển hướng)
        },
        // ... các callbacks onError hoặc onSettled khác nếu có
      });
    } else {
      // Fallback to regular booking
      bookTicket(bookingPayload);
    }
  };
  // Điều hướng về MovieDetailPage của phim hiện tại
  const handleTimeoutOk = () => {
    setShowTimeoutModal(false);
    const movieId = bookingData.movie?.movie_id;
    if (movieId) {
      navigate(`/movie/${movieId}`);
    } else {
      navigate("/");
    }
  };

  // Handler khi áp dụng mã khuyến mãi
  const handleApplyPromotion = (code) => {
    // console.log("Danh sách khuyến mãi user:", allPromotions);
    const promo = allPromotions.find((p) => p.code === code);
    if (!promo) {
      toast.error("Mã khuyến mãi không hợp lệ hoặc không tồn tại.");
      setAppliedPromotion(null);
      setDiscountAmount(0);
      setFinalTotal(bookingDetails.total);
      return;
    }
    // Lưu lại object promo gốc để lấy tên
    setAppliedPromotion(promo);
    calculatePromotion(
      {
        promotion_id: promo.promotion_id,
        total_price: bookingDetails.total,
        order_product_type: "TICKET",
      },
      {
        onSuccess: (res) => {
          const promoData = res?.data;
          const message = getApiMessage(res, "Áp dụng khuyến mãi thành công!");
          if (!promoData || typeof promoData.discount_amount === "undefined") {
            toast.error(message);
            setDiscountAmount(0);
            setFinalTotal(bookingDetails.total);
            return;
          }
          setDiscountAmount(promoData.discount_amount || 0);
          setFinalTotal(promoData.final_amount || bookingDetails.total);
          toast.success(
            `${message} Giảm ${promoData.discount_amount.toLocaleString()} VND`
          );
        },
        onError: (err) => {
          const message = getApiMessage(
            err,
            "Mã khuyến mãi không hợp lệ hoặc không áp dụng được."
          );
          setAppliedPromotion(null);
          setDiscountAmount(0);
          setFinalTotal(bookingDetails.total);
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">TRANG THANH TOÁN</h1>

      {/* Steps */}
      <PaymentSteps currentStep={currentStep} />

      {/* Main Content: Form + Summary */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section: Customer Info Form or Payment Methods */}
        <div className="w-full lg:basis-1/2">
          {currentStep === 1 && !isLoggedIn && (
            <PaymentForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleFormSubmit}
            />
          )}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Nhập mã khuyến mãi */}
              <PromotionCodeInput
                onApply={handleApplyPromotion}
                isLoading={isCalculatingPromotion}
                appliedPromotion={appliedPromotion}
              />

              <h2 className="text-xl font-semibold">
                Chọn phương thức thanh toán
              </h2>
              <PaymentMethodSelection
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={setSelectedPaymentMethod}
              />
              <PaymentActionButtons
                onBack={() => setCurrentStep(1)}
                onPay={handlePay}
                isLoading={isPaymentLoading}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              {!isPaymentLoading && (
                <div>
                  <h2 className="text-xl font-semibold text-green-600">
                    Thanh toán thành công!
                  </h2>
                  <p className="text-gray-600">
                    Vé của bạn đã được đặt thành công.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* màn hình bên phải: Booking Summary */}
        <BookingSummary
          ref={seatMapRef}
          bookingDetails={{
            ...bookingDetails,
            discountAmount,
            appliedPromotion, // object gốc có name
            finalTotal: finalTotal || bookingDetails.total,
          }}
          bookingData={bookingData}
          timeLeft={timeLeft}
        />
      </div>

      {/* Modal hết thời gian giữ vé */}
      <GradientModal open={showTimeoutModal} onClose={handleTimeoutOk}>
        <h2 className="text-2xl font-extrabold mb-4 text-white">
          HẾT THỜI GIAN MUA VÉ!
        </h2>
        <p className="mb-8 text-white text-lg">
          Thời gian giữ vé của bạn đã kết thúc, vui lòng thao tác lại!
        </p>
        <button
          className="w-full py-2 text-lg font-bold rounded border transition mt-2 cursor-pointer"
          style={{
            border: "2px solid var(--color-text)",
            color: "var(--color-text)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--color-text)";
            e.target.style.color = "#222";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--color-text)";
          }}
          onClick={handleTimeoutOk}
        >
          OK
        </button>
      </GradientModal>
    </div>
  );
}

export default PaymentPage;

import React from "react";
import { useGetPhimUS } from "../api/homePage/queries";
import Banner from "../components/layout/banner";
import QuickBookingSection from "../components/ui/QuickBookingSection";
import MovieList from "../layouts/Home/MovieList";
import NewsSection from "../layouts/Home/NewsSection";
import PromotionSection from "../layouts/Home/PromotionSection";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomePage() {
  const { data: moviesData, isLoading, error } = useGetPhimUS();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Xóa state để toast không lặp lại khi F5
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (isLoading) {
    return <div>Đang tải phim...</div>;
  }

  if (error) {
    // console.error("Error fetching movies:", error);
    // return <div>Lỗi: {error.message}</div>;
  }

  // Kiểm tra cấu trúc dữ liệu trả về
  // console.log("Movies data:", moviesData);

  // Lấy danh sách phim từ response
  const movies = moviesData?.data?.movies || [];
  const handleSeeMore = () => {
    navigate("/phim-dang-chieu");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <Banner />
        <div className="">
          <QuickBookingSection />
        </div>
        <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
          <MovieList
            movies={movies.slice(0, 8)}
            showSeeMore={movies.length > 8}
            onSeeMore={handleSeeMore}
          />
          <NewsSection />
          <PromotionSection />
        </div>
      </div>
    </>
  );
}

export default HomePage;

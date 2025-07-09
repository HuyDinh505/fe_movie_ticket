import React from "react";
import StatCard from "../../components/dashboard/StatCard";
import TopViewsBarChart from "../../components/dashboard/TopViewsBarChart";
import RevenueLineChart from "../../components/dashboard/RevenueLineChart";
import RevenueByMovieTable from "../../components/dashboard/RevenueByMovieTable";
import RevenueByCinemaTable from "../../components/dashboard/RevenueByCinemaTable";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  // Dummy data
  const stats = [
    {
      title: "Doanh thu trong ngày (15/5/2025)",
      value: "760,000₫",
      color: "blue",
    },
    { title: "Khách hàng mới (T5/2025)", value: "0", color: "green" },
    { title: "Tổng vé bán ra (T5/2025)", value: "9", color: "orange" },
    { title: "Tổng doanh thu (T5/2025)", value: "1,826,000₫", color: "red" },
  ];

  const topViewsData = [
    { name: "Điểm mặt L...", views: 25 },
    { name: "Chị Chị Em...", views: 14 },
    { name: "15 phim bộ...", views: 12 },
    { name: "Top 10 phim...", views: 11 },
    { name: "13 phim lẻ...", views: 10 },
  ];

  const revenueData = [
    { month: "1/2025", revenue: 76_000_000 },
    { month: "2/2025", revenue: 56_000_000 },
    { month: "3/2025", revenue: 3_000_000 },
    { month: "4/2025", revenue: 90_000_000 },
    { month: "5/2025", revenue: 1826000 },
  ];

  const movieRevenue = [
    { name: "Monkey Man Báo Thù", tickets: 5, revenue: 1_066_000 },
    { name: "Cái Giá Của Hạnh Phúc", tickets: 4, revenue: 760_000 },
  ];

  const cinemaRevenue = [
    { name: "HCinema Aeon Hà Đông", tickets: 9, revenue: 1_826_000 },
  ];

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
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="p-6 space-y-6">
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
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopViewsBarChart
          data={topViewsData}
          title="Top bài viết được xem nhiều nhất"
          dataKey="views"
          color="#3b82f6"
        />
        <RevenueLineChart data={revenueData} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueByMovieTable data={movieRevenue} />
        <RevenueByCinemaTable data={cinemaRevenue} />
      </div>
    </div>
  );
};

export default Dashboard;

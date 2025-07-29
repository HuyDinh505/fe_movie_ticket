import React from "react";
import StatCard from "../../../components/dashboard/StatCard";
import TopViewsBarChart from "../../../components/dashboard/TopViewsBarChart";
import RevenueLineChart from "../../../components/dashboard/RevenueLineChart";
import RevenueByMovieTable from "../../../components/dashboard/RevenueByMovieTable";
import RevenueByCinemaTable from "../../../components/dashboard/RevenueByCinemaTable";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetTotalRevenueUS } from "../../../api/homePage/queries";
import { getTotalRevenueAPI } from "../../../api/homePage/request";

const Dashboard = () => {
  // State cho period và date
  const [period, setPeriod] = React.useState("day");
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  // State để lưu params thực sự dùng để fetch
  const [searchParams, setSearchParams] = React.useState(null);

  // Gọi API doanh thu chỉ khi searchParams có giá trị
  const { data, isLoading } = useGetTotalRevenueUS(searchParams || {}, {
    enabled: !!searchParams,
  });
  const totalRevenue = Number(data?.data?.total_revenue || 0);
  const currency = data?.data?.currency || "VNĐ";
  const bookingsCount = data?.data?.bookings_count || 0;

  const selectedPeriod = searchParams?.period;
  const displayPeriod =
    selectedPeriod === "day"
      ? data?.data?.display_period
      : data?.data?.date_range_start && data?.data?.date_range_end
      ? `${data.data.date_range_start.split(" ")[0]} ~ ${
          data.data.date_range_end.split(" ")[0]
        }`
      : "-";

  // Dummy data cho các stat khác
  const stats = [
    {
      title: `Doanh thu (${displayPeriod})`,
      value: isLoading
        ? "..."
        : totalRevenue.toLocaleString("vi-VN") + " " + currency,
      color: "blue",
    },
    {
      title: "Tổng vé bán ra",
      value: isLoading ? "..." : bookingsCount,
      color: "orange",
    },
    // Các stat khác có thể cập nhật sau
  ];

  // Dummy data
  const topViewsData = [
    { name: "Điểm mặt L...", views: 25 },
    { name: "Chị Chị Em...", views: 14 },
    { name: "15 phim bộ...", views: 12 },
    { name: "Top 10 phim...", views: 11 },
    { name: "13 phim lẻ...", views: 10 },
  ];

  const movieRevenue = [
    { name: "Monkey Man Báo Thù", tickets: 5, revenue: 1_066_000 },
    { name: "Cái Giá Của Hạnh Phúc", tickets: 4, revenue: 760_000 },
  ];

  const cinemaRevenue = [
    { name: "HCinema Aeon Hà Đông", tickets: 9, revenue: 1_826_000 },
  ];

  // State cho dữ liệu doanh thu theo tháng
  const [revenueByMonth, setRevenueByMonth] = React.useState([]);
  const [loadingRevenueByMonth, setLoadingRevenueByMonth] =
    React.useState(false);

  // Hàm lấy danh sách tháng từ 1 đến tháng hiện tại
  const getMonthsOfYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const months = [];
    for (let m = 1; m <= currentMonth; m++) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      months.push({
        label: `${m}/${year}`,
        date: `${year}-${monthStr}-01`,
      });
    }
    return months;
  };

  // Fetch doanh thu từng tháng khi mount
  React.useEffect(() => {
    const fetchRevenueByMonth = async () => {
      setLoadingRevenueByMonth(true);
      const months = getMonthsOfYear();
      try {
        const results = await Promise.all(
          months.map(async (m) => {
            const res = await getTotalRevenueAPI({
              period: "month",
              date: m.date,
            });
            return {
              month: m.label,
              revenue: Number(res?.data?.total_revenue || 0),
            };
          })
        );
        setRevenueByMonth(results);
      } catch {
        setRevenueByMonth([]);
      } finally {
        setLoadingRevenueByMonth(false);
      }
    };
    fetchRevenueByMonth();
  }, []);

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
    <div className="pl-2">
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
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center sm:p-6 bg-white rounded-xl shadow-lg sticky top-0 z-30">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 tracking-tight mb-4 sm:mb-0">
          Tổng quan
        </h1>
      </div> */}
      {/* Bộ lọc doanh thu */}
      <div
        className="w-full mx-auto bg-white rounded-xl shadow-md p-4 flex flex-col
       sm:flex-row sm:items-end gap-4 mb-2 mt-1"
      >
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Chọn kỳ
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="day">Ngày</option>
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Chọn ngày
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={period === "year"}
          />
        </div>
        <div className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg 
            font-semibold shadow hover:bg-blue-700 transition cursor-pointer"
            style={{ minHeight: "42px" }} // Đảm bảo chiều cao bằng input
            onClick={() => setSearchParams({ period, date })}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-2">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* <TopViewsBarChart
          data={topViewsData}
          title="Top bài viết được xem nhiều nhất"
          dataKey="views"
          color="#3b82f6"
        /> */}
        <RevenueLineChart
          data={revenueByMonth}
          loading={loadingRevenueByMonth}
        />
      </div>
      {/* Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <RevenueByMovieTable data={movieRevenue} />
        <RevenueByCinemaTable data={cinemaRevenue} />
      </div>
    </div>
  );
};

export default Dashboard;

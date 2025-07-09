// 📁 pages/TheaterRevenueByDate.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TheaterRevenueTable from "../../components/dashboard/TheaterRevenueTable";
import TopViewsBarChart from "../../components/dashboard/TopViewsBarChart";

const TheaterRevenueByDate = () => {
  const [startDate, setStartDate] = useState(new Date("2024-04-01"));
  const [endDate, setEndDate] = useState(new Date("2024-05-15"));

  // Dữ liệu mẫu
  const theaters = [
    { name: "HCinema Aeon Hà Đông", sold: 45, revenue: 12000000 },
    { name: "CGV Vincom Nguyễn Chí Thanh", sold: 32, revenue: 9600000 },
    { name: "Lotte Cinema Keangnam", sold: 27, revenue: 8700000 },
    { name: "Beta Mỹ Đình", sold: 18, revenue: 5200000 },
  ];

  const handleLoadData = () => {
    // TODO: gọi API để lấy dữ liệu theo khoảng ngày
    console.log("Load data from", startDate, "to", endDate);
  };

  const handleExport = () => {
    // TODO: xuất báo cáo ra file
    console.log("Exporting theater report...");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Bộ lọc ngày và nút hành động */}
      <div className="flex flex-wrap items-center gap-4">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="border p-2 rounded"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="border p-2 rounded"
        />
        <button
          onClick={handleLoadData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load dữ liệu
        </button>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Xuất báo cáo
        </button>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopViewsBarChart
          data={theaters}
          title="Số vé bán theo rạp"
          dataKey="sold"
          color="#38bdf8"
        />
        <TopViewsBarChart
          data={theaters}
          title="Doanh thu theo rạp"
          dataKey="revenue"
          color="#f87171"
        />
      </div>

      {/* Bảng dữ liệu */}
      <TheaterRevenueTable data={theaters} />
    </div>
  );
};

export default TheaterRevenueByDate;

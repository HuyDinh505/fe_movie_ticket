import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MovieRevenueTable from "../../components/dashboard/MovieRevenueTable";
import TopViewsBarChart from "../../components/dashboard/TopViewsBarChart";

const MovieRevenueByDate = () => {
  const [startDate, setStartDate] = useState(new Date("2024-04-01"));
  const [endDate, setEndDate] = useState(new Date("2024-05-15"));

  // Dữ liệu mẫu
  const movies = [
    { name: "SUGA | Agust D TOUR", sold: 32, revenue: 8677300 },
    { name: "Kung Fu Panda 4", sold: 11, revenue: 4282000 },
    { name: "Quỷ Cái", sold: 26, revenue: 7791000 },
    { name: "Quật Mộ Trùng Ma", sold: 8, revenue: 2671000 },
    { name: "Monkey Man Báo Thù", sold: 23, revenue: 8118000 },
  ];

  const handleLoadData = () => {
    // TODO: gọi API để load dữ liệu theo khoảng ngày
    console.log("Load data from", startDate, "to", endDate);
  };

  const handleExport = () => {
    // TODO: xuất báo cáo ra Excel hoặc PDF
    console.log("Exporting report...");
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
          data={movies}
          title="Số vé bán ra theo phim"
          dataKey="sold"
          color="#60a5fa"
        />
        <TopViewsBarChart
          data={movies}
          title="Doanh thu theo phim"
          dataKey="revenue"
          color="#f472b6"
        />
      </div>

      {/* Bảng */}
      <MovieRevenueTable data={movies} />
    </div>
  );
};

export default MovieRevenueByDate;

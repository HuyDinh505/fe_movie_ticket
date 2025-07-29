import React, { useState } from "react";
import MovieRevenueTable from "../../../components/dashboard/MovieRevenueTable";
import TopViewsBarChart from "../../../components/dashboard/TopViewsBarChart";
import {
  useGetAllMoviesRevenueUS,
  useGetPhimUS,
  useGetMoviesRevenueByIDUS, // <-- Thêm dòng này!
} from "../../../api/homePage/queries";
import Papa from "papaparse";

const MovieRevenueByDate = () => {
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2025-07-31");
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State để lưu ID phim được chọn
  const [shouldFetchAll, setShouldFetchAll] = useState(false); // Để kiểm soát việc fetch tất cả phim
  const [shouldFetchSingle, setShouldFetchSingle] = useState(false); // Để kiểm soát việc fetch một phim

  // Hook để lấy danh sách tất cả các phim (dùng cho dropdown chọn phim nếu cần)
  const {
    data: allMoviesList,
    isLoading: loadingAllMoviesList,
    error: errorAllMoviesList,
  } = useGetPhimUS();

  // Hook để lấy doanh thu của TẤT CẢ PHIM trong khoảng thời gian
  const {
    data: allMoviesRevenueData,
    isLoading: isLoadingAllMoviesRevenue,
    isError: isErrorAllMoviesRevenue,
    refetch: refetchAllMoviesRevenue,
  } = useGetAllMoviesRevenueUS(
    {
      start_date: startDate,
      end_date: endDate,
    },
    { enabled: shouldFetchAll } // Chỉ fetch khi shouldFetchAll là true
  );

  // Hook để lấy doanh thu của MỘT PHIM CỤ THỂ theo ID và khoảng thời gian
  const {
    data: singleMovieRevenueData,
    isLoading: isLoadingSingleMovieRevenue,
    isError: isErrorSingleMovieRevenue,
    refetch: refetchSingleMovieRevenue,
  } = useGetMoviesRevenueByIDUS(
    selectedMovieId,
    {
      start_date: startDate,
      end_date: endDate,
    },
    { enabled: shouldFetchSingle && !!selectedMovieId }
  );

  // Xử lý dữ liệu doanh thu của tất cả phim để hiển thị
  const allMovies = (
    allMoviesRevenueData?.data?.["all movies revenue"] || []
  ).map((item) => ({
    name: item.movie_name,
    sold: item.bookings_count,
    revenue: Number(item.total_revenue),
  }));

  // Xử lý dữ liệu doanh thu của một phim cụ thể để hiển thị
  const singleMovie = singleMovieRevenueData?.data?.movie
    ? [
        {
          name: singleMovieRevenueData.data.movie.movie_name, // Truy cập qua .movie.movie_name
          sold: singleMovieRevenueData.data.booking_count, // Truy cập qua .booking_count (không phải bookings_count)
          revenue: Number(singleMovieRevenueData.data.total_revenue),
        },
      ]
    : [];

  // Hàm xử lý khi nhấn nút "Tìm kiếm" (áp dụng cho tất cả phim)
  const handleLoadData = () => {
    setShouldFetchAll(true);
    setShouldFetchSingle(false); // Đảm bảo không fetch phim đơn lẻ cùng lúc
    setSelectedMovieId(null); // Reset phim được chọn trong dropdown
    refetchAllMoviesRevenue();
  };

  // Hàm xử lý khi chọn một phim từ dropdown
  const handleFetchSingleMovieRevenue = (movieId) => {
    setSelectedMovieId(movieId);
    setShouldFetchSingle(true);
    setShouldFetchAll(false); // Đảm bảo không fetch tất cả phim cùng lúc
    refetchSingleMovieRevenue();
  };

  // Hàm xuất báo cáo CSV
  const handleExport = () => {
    let dataToExport = [];
    let fileNamePrefix = "bao_cao_doanh_thu";

    if (selectedMovieId && singleMovie.length > 0) {
      // Nếu có phim được chọn và có dữ liệu doanh thu của phim đó
      dataToExport = singleMovie;
      const movieName = singleMovie[0].name;
      // Tạo tên file an toàn bằng cách thay thế các ký tự không hợp lệ
      fileNamePrefix = `bao_cao_doanh_thu_phim_${movieName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}`;
    } else if (allMovies.length > 0) {
      // Nếu không có phim nào được chọn hoặc không có dữ liệu phim đơn lẻ, xuất tất cả phim
      dataToExport = allMovies;
      fileNamePrefix = "bao_cao_doanh_thu_tat_ca_phim";
    } else {
      alert("Không có dữ liệu để xuất báo cáo.");
      return;
    }

    // Tạo dữ liệu cho CSV với tên cột tiếng Việt
    const exportData = dataToExport.map((item) => ({
      "Tên Phim": item.name,
      "Số Vé Bán Ra": item.sold,
      "Doanh Thu": item.revenue.toLocaleString("vi-VN") + " đ",
    }));

    const csv = Papa.unparse(exportData);
    const BOM = "\uFEFF"; // Byte Order Mark cho tiếng Việt để tránh lỗi font
    const csvContent = BOM + csv;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Chuyển đổi định dạng ngày cho tên file
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    };

    const fileName = `${fileNamePrefix}_tu_${formatDate(
      startDate
    )}_den_${formatDate(endDate)}.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lấy dữ liệu, trạng thái loading và error để hiển thị trên UI
  // Ưu tiên hiển thị dữ liệu của một phim nếu có phim được chọn và có dữ liệu
  // Ngược lại, hiển thị dữ liệu của tất cả phim
  const displayMovies =
    selectedMovieId && singleMovie.length > 0 ? singleMovie : allMovies;
  const displayIsLoading =
    isLoadingSingleMovieRevenue || isLoadingAllMoviesRevenue;
  const displayIsError = isErrorSingleMovieRevenue || isErrorAllMoviesRevenue;

  return (
    <div className="">
      <div
        className="w-full mx-auto bg-white rounded-xl shadow-md p-4 flex flex-col
      sm:flex-row sm:items-end gap-4 mb-2 mt-2"
      >
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Chọn phim (tùy chọn)
          </label>
          <select
            value={selectedMovieId || ""} // Đảm bảo giá trị rỗng nếu không có gì được chọn
            onChange={(e) => {
              const movieId = e.target.value;
              if (movieId) {
                // Nếu người dùng chọn một phim cụ thể
                handleFetchSingleMovieRevenue(movieId);
              } else {
                // Nếu người dùng chọn "Tất cả phim"
                setSelectedMovieId(null);
                setShouldFetchSingle(false); // Ngừng fetch phim đơn lẻ
                setShouldFetchAll(true); // Kích hoạt fetch tất cả phim
                refetchAllMoviesRevenue(); // Fetch lại dữ liệu tất cả phim
              }
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả phim</option>
            {loadingAllMoviesList && (
              <option disabled>Đang tải danh sách phim...</option>
            )}
            {errorAllMoviesList && (
              <option disabled>Lỗi tải danh sách phim</option>
            )}
            {allMoviesList?.data?.movies.map((movie) => (
              <option key={movie.id} value={movie.movie_id}>
                {movie.movie_name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={handleLoadData}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition cursor-pointer"
            style={{ minHeight: "42px" }}
          >
            Tìm kiếm
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition cursor-pointer"
            style={{ minHeight: "42px" }}
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {displayIsLoading && <div>Đang tải dữ liệu...</div>}
      {displayIsError && <div>Lỗi khi tải dữ liệu! Vui lòng thử lại.</div>}

      {!displayIsLoading && !displayIsError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopViewsBarChart
              data={displayMovies}
              title="Số vé bán ra"
              dataKey="sold"
              color="#60a5fa"
            />
            <TopViewsBarChart
              data={displayMovies}
              title="Doanh thu"
              dataKey="revenue"
              color="#f472b6"
            />
          </div>

          <MovieRevenueTable data={displayMovies} />
        </>
      )}
    </div>
  );
};

export default MovieRevenueByDate;

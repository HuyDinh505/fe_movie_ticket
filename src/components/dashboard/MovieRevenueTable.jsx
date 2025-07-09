import React from "react";

const MovieRevenueTable = ({ data }) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 font-semibold">Tên phim</th>
            <th className="px-4 py-2 font-semibold">Tổng vé bán ra</th>
            <th className="px-4 py-2 font-semibold">Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((movie, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-blue-600 font-medium">
                {movie.name}
              </td>
              <td className="px-4 py-2">{movie.sold}</td>
              <td className="px-4 py-2">
                {movie.revenue.toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieRevenueTable;

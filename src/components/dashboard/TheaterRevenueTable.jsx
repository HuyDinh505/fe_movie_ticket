import React from "react";

const TheaterRevenueTable = ({ data }) => {
  return (
    <div className="bg-white overflow-x-auto border rounded-lg ml-2">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 font-semibold">Rạp chiếu</th>
            <th className="px-4 py-2 font-semibold">Tổng vé bán ra</th>
            <th className="px-4 py-2 font-semibold">Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((theater, index) => (
            <tr key={index} className="border-t hover:bg-gray-50 bg-white">
              <td className="px-4 py-2 text-blue-600 font-medium">
                {theater.name}
              </td>
              <td className="px-4 py-2">{theater.sold}</td>
              <td className="px-4 py-2">
                {theater.revenue.toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TheaterRevenueTable;

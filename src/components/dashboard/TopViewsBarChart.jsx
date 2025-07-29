import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopViewsBarChart = ({ data, title, dataKey, color }) => {
  const yourDesiredName = "Số vé:"; // <--- Tên bạn muốn thay thế

  // Hàm tùy chỉnh nội dung Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0]; // Lấy dữ liệu của cột đang rê chuột
      let displayText = dataItem.name; // Mặc định là tên của dataKey

      // Kiểm tra nếu dataKey là 'sold' thì đổi tên
      if (dataItem.name === "sold") {
        // 'sold' là dataKey bạn truyền vào
        displayText = yourDesiredName; // Thay thế bằng tên bạn muốn
      }
      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: "0" }}>{`${displayText} : ${dataItem.value}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill={color} barSize={100} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopViewsBarChart;

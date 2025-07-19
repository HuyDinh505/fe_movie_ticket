import React, { useState } from "react";

function PromotionCodeInput({ onApply }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã khuyến mãi.");
      return;
    }
    setError("");
    onApply && onApply(code.trim());
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <label className="font-semibold mb-1">Mã khuyến mãi</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--color-hover)",
            boxShadow: "none",
          }}
          placeholder="Nhập mã khuyến mãi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleApply}
          className="font-bold py-3 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "black",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--color-hover)";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "var(--color-primary)";
            e.target.style.color = "black";
          }}
        >
          Áp Dụng
        </button>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      <div className="text-xs text-gray-500 mt-1">
        Lưu ý: Có thể áp dụng nhiều vouchers vào 1 lần thanh toán
      </div>
    </div>
  );
}

export default PromotionCodeInput;

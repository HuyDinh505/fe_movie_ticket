import React, { useState } from "react";

function PromotionCodeInput({
  onApply,
  isLoading,
  appliedPromotion,
  allPromotions = [],
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPromotionList, setShowPromotionList] = useState(false);

  const handleApply = () => {
    if (!code.trim()) {
      setError("Vui lòng nhập mã khuyến mãi.");
      return;
    }
    setError("");
    onApply && onApply(code.trim());
  };

  const handleSelectPromotion = (promotion) => {
    setCode(promotion.code);
    setError("");
    onApply && onApply(promotion.code);
    setShowPromotionList(false);
  };

  const formatDiscountValue = (promotion) => {
    if (promotion.type === "PERCENT_DISCOUNT") {
      return `Giảm ${promotion.discount_value}% (tối đa ${Number(
        promotion.max_discount_amount
      ).toLocaleString()} VND)`;
    } else if (promotion.type === "FIXED_DISCOUNT") {
      return `Giảm ${Number(promotion.discount_value).toLocaleString()} VND`;
    }
    return "Giảm giá";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const isPromotionExpired = (promotion) => {
    const now = new Date();
    const endDate = new Date(promotion.end_date);
    console.log(`Checking if promotion ${promotion.name} is expired:`, {
      now: now.toISOString(),
      endDate: endDate.toISOString(),
      isExpired: now > endDate,
    });
    return now > endDate;
  };

  const isPromotionNotStarted = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    console.log(`Checking if promotion ${promotion.name} is not started:`, {
      now: now.toISOString(),
      startDate: startDate.toISOString(),
      isNotStarted: now < startDate,
    });
    return now < startDate;
  };

  const getPromotionStatus = (promotion) => {
    if (isPromotionExpired(promotion)) {
      return { text: "Đã hết hạn", color: "text-red-500" };
    }
    if (isPromotionNotStarted(promotion)) {
      return { text: "Chưa bắt đầu", color: "text-yellow-500" };
    }
    return { text: "Đang hoạt động", color: "text-green-500" };
  };

  // Debug promotions
  console.log("PromotionCodeInput - allPromotions:", allPromotions);
  console.log(
    "PromotionCodeInput - allPromotions length:",
    allPromotions.length
  );

  const availablePromotions = allPromotions.filter(
    (promotion) =>
      !isPromotionExpired(promotion) && !isPromotionNotStarted(promotion)
  );

  console.log("PromotionCodeInput - availablePromotions:", availablePromotions);
  console.log(
    "PromotionCodeInput - availablePromotions length:",
    availablePromotions.length
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-semibold mb-1">Mã khuyến mãi</label>

      {/* Nút hiển thị danh sách promotion */}
      <button
        type="button"
        onClick={() => setShowPromotionList(!showPromotionList)}
        className="text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        style={{
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {availablePromotions.length > 0
              ? `${availablePromotions.length} khuyến mãi có thể sử dụng`
              : "Không có khuyến mãi khả dụng"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showPromotionList ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Danh sách promotion */}
      {showPromotionList && (
        <div className="border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
          {availablePromotions.length > 0 ? (
            availablePromotions.map((promotion) => {
              const status = getPromotionStatus(promotion);
              const isSelected =
                appliedPromotion?.promotion_id === promotion.promotion_id;

              return (
                <div
                  key={promotion.promotion_id}
                  className={`p-3 border rounded-lg mb-2 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() => handleSelectPromotion(promotion)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{promotion.name}</h4>
                    <span className={`text-xs ${status.color}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {promotion.description}
                  </p>
                  <div className="text-xs text-blue-600 font-medium mb-1">
                    {formatDiscountValue(promotion)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Áp dụng cho đơn hàng từ{" "}
                    {Number(promotion.min_order_amount).toLocaleString()} VND
                  </div>
                  <div className="text-xs text-gray-500">
                    Hạn sử dụng: {formatDate(promotion.start_date)} -{" "}
                    {formatDate(promotion.end_date)}
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ✓ Đã chọn
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              Không có khuyến mãi khả dụng
            </div>
          )}
        </div>
      )}

      {/* Input nhập code thủ công (tùy chọn) */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "none",
          }}
          placeholder="Hoặc nhập mã khuyến mãi thủ công"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="font-bold py-3 px-8 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "black",
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "var(--color-hover)";
              e.target.style.color = "white";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.target.style.backgroundColor = "var(--color-primary)";
              e.target.style.color = "black";
            }
          }}
        >
          {isLoading ? "Đang xử lý..." : "Áp Dụng"}
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      {appliedPromotion && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-green-800">
                {appliedPromotion.name}
              </div>
              <div className="text-sm text-green-600">
                {appliedPromotion.code}
              </div>
            </div>
            <button
              onClick={() => {
                setCode("");
                onApply && onApply("");
              }}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        Lưu ý: Chỉ có thể áp dụng 1 khuyến mãi cho mỗi lần thanh toán
      </div>
    </div>
  );
}

export default PromotionCodeInput;

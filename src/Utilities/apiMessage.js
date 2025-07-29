// Hàm tiện ích lấy message từ response hoặc error của API
export function getApiMessage(resOrErr, defaultMsg = "Có lỗi xảy ra!") {
  return (
    resOrErr?.data?.message ||
    resOrErr?.response?.data?.message ||
    resOrErr?.message ||
    defaultMsg
  );
}

// Hàm xử lý lỗi theo code, dùng chung cho các trang admin
import { toast } from "react-toastify";
export function handleApiError(errorPayload, defaultMsg = "Có lỗi xảy ra") {
  // Đổi tên 'data' thành 'errorPayload' cho rõ ràng
  if (!errorPayload) {
    toast.error(defaultMsg);
    return;
  }
  switch (
    errorPayload.code // Truy cập 'code' trực tiếp từ 'errorPayload'
  ) {
    case 500:
      // SỬA: Đổi từ errorPayload.data.message thành errorPayload.message
      toast.error(errorPayload.message || "Tên đã tồn tại trong hệ thống.");
      break;
    case 400:
      // SỬA: Đổi từ errorPayload.data.message thành errorPayload.message
      toast.error(errorPayload.message || "Dữ liệu gửi lên không hợp lệ.");
      break;
    // Thêm các case khác nếu cần
    case 200:
      toast.success(errorPayload.message || "Thành công");
      break;
    default:
      toast.error(errorPayload.message || defaultMsg); // Lấy message trực tiếp
  }
}

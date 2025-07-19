// Hàm tiện ích lấy message từ response hoặc error của API
export function getApiMessage(resOrErr, defaultMsg = "Có lỗi xảy ra!") {
  return (
    resOrErr?.data?.message ||
    resOrErr?.response?.data?.message ||
    resOrErr?.message ||
    defaultMsg
  );
}

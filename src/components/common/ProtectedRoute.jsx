import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userData, isLoading } = useAuth();

  console.log("ProtectedRoute: isLoggedIn", isLoggedIn);
  console.log("ProtectedRoute: userRole", userData.role);
  console.log("ProtectedRoute: allowedRoles", allowedRoles);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    console.log("ProtectedRoute: No token, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    // Người dùng không có vai trò phù hợp, chuyển hướng đến trang không có quyền truy cập hoặc trang chủ
    console.log(
      `ProtectedRoute: User role "${userData.role}" not in allowed roles`,
      allowedRoles
    );
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute: Access granted");
  return children;
};

export default ProtectedRoute;

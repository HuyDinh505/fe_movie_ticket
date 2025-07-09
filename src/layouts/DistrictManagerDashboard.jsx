import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarDistrictManager from "../components/layout/Sidebar_district_manager";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DistrictManagerDashboard = () => {
  const location = useLocation();
  React.useEffect(() => {
    if (location.state?.loginSuccess) {
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="flex bg-gradient-to-r from-slate-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <SidebarDistrictManager />
      <div className="absolute top-0 left-64 w-[calc(100%-256px)] h-full flex flex-col pl-1.5 pr-1.5">
        <main className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DistrictManagerDashboard;

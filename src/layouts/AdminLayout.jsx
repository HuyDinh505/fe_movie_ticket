import React from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "../components/layout/SidebarAdmin";

const AdminLayout = () => {
  return (
    <div className="flex bg-gradient-to-r from-slate-100">
      <SidebarAdmin />
      <div className="absolute top-0 left-64 w-[calc(100%-256px)] h-full flex flex-col pl-1.5 pr-1.5">
        <main className="flex-1 overflow-x-auto">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React from "react";
import Sidebar from "./components/Sidebar";


function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;

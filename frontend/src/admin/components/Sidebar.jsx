import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MdDashboard,
  MdBookOnline,
  MdPeople,
  MdListAlt,
  MdAddBox,
  MdLogout,
} from "react-icons/md";
const user = JSON.parse(localStorage.getItem("user"));

const Sidebar = () => {
  const navigate = useNavigate();
   const [user, setUser] = useState(null);
   useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
     ${
       isActive
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  //  LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white p-4 flex flex-col">

      <h2 className="text-2xl font-bold mb-8">
        Admin Panel
      </h2>
      {/* ADMIN NAME */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <p className="text-sm text-gray-400">Logged in as</p>
        <h3 className="font-semibold text-lg">
          {user?.name || "Admin"}
        </h3>
      </div>

      {/* NAV LINKS */}
      <nav className="space-y-2 flex flex-col flex-grow">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <MdDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/bookings" className={linkClass}>
          <MdBookOnline size={20} />
          Bookings
        </NavLink>
        <NavLink to="/admin/listings" end className={linkClass}>
          <MdListAlt size={20} />
          Listings
        </NavLink>

        {/* <NavLink to="/admin/users" className={linkClass}>
          <MdPeople size={20} />
          Users
        </NavLink> */}


        {/* <NavLink to="/admin/listings/property_add" className={linkClass}>
          <MdAddBox size={20} />
          Add Listing
        </NavLink> */}
      </nav>

      {/* LOGOUT AT BOTTOM */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3  hover:text-red-600 cursor-pointer text-white px-4 py-2 rounded-lg mt-6"
      >
        <MdLogout size={20} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;

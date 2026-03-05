import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const roleColor = {
  admin: "bg-purple-100 text-purple-700",
  user: "bg-blue-100 text-blue-700",
};

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        User Management
      </h1>
<div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-wrap gap-6 justify-between">
  <div>
    <p className="text-gray-500 text-sm">Total Users</p>
    <p className="text-2xl font-bold">{users.length}</p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">Admins</p>
    <p className="text-2xl font-bold text-purple-600">
      {users.filter(u => u.role === "admin").length}
    </p>
  </div>

  <div>
    <p className="text-gray-500 text-sm">Normal Users</p>
    <p className="text-2xl font-bold text-blue-600">
      {users.filter(u => u.role === "user").length}
    </p>
  </div>
</div>
      <div className="space-y-5">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                {u.email?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div>
                <p className="font-semibold text-gray-900">{u.email}</p>

                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                    roleColor[u.role] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role}
                </span>
              </div>
            </div>

            {/* RIGHT SECTION */}
            {/* <div className="flex gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm transition">
                View
              </button>

              <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition">
                Delete
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
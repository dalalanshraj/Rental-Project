  import { useEffect, useState } from "react";
  import api from "../../api/axios";
  import { motion } from "framer-motion";
  import { useNavigate } from "react-router-dom";
  
  import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
  } from "recharts";

  const COLORS = ["#ff1d58", "#6366f1", "#f59e0b", "#06b6d4"];

  const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    api.get("/bookings/admin/dashboard")
      .then((res) => {
        console.log("FULL RESPONSE 👉", res);
        console.log("DATA 👉", res.data);
        setStats(res.data);
        
      })
      .catch((err) => {
        console.error("ERROR 👉", err);
      });
  }, []);

    if (!stats) return <p className="p-6">Loading...</p>;

    // ===== PIE DATA =====
    const pieData = [
      // { name: "Users", value: stats.totalUsers },
      { name: "Properties", value: stats.totalListing },
      { name: "Bookings", value: stats.totalBookings },
      { name: "Inquiry", value: stats.totalInquiry },
    ];

    // ===== LINE DATA =====
    const lineData = stats.monthlyBookings || [];

    return (
      <div className=" bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">
          Dashboard Overview
        </h1>

        {/* ===== STATS CARDS ===== */}
        <div className="grid md:grid-cols-3 gap-6 mb-5">
          {/* <StatCard title="Users" value={stats.totalUsers} color="from-pink-500 to-red-500" /> */}
          <StatCard title="Properties" value={stats.totalListing} color="from-purple-500 to-indigo-500" />
          <StatCard title="Bookings" value={stats.totalBookings} color="from-yellow-400 to-orange-500" />
         <StatCard
  title="Inquiry"
  value={stats.totalInquiry}
  color="from-cyan-400 to-blue-500"
  onClick={() => navigate("/admin/listings")}
/>
        </div>

        {/* ===== CHARTS ===== */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* ===== DONUT CHART ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-md"
          >
            <h3 className="font-semibold mb-4 text-lg">
              Booking Distribution
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                {/* CENTER VALUE */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xl font-bold"
                >
                  {stats.totalBookings}
                </text>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ===== LINE GRAPH ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-md"
          >
            <h3 className="font-semibold mb-4 text-lg">
              Monthly Booking Trend
            </h3>

            {lineData.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No booking data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={lineData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

        </div>

        {/* ===== MINI STATS ===== */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <MiniStat
  title="Total Reviews"
  value={stats.totalReviews}
  onClick={() => navigate("/admin/listings")}
/>
          <MiniStat title="Pending Reviews" value={stats.pendingReviews}
          onClick={() => navigate("/admin/listings")} />
        </div>
      </div>
    );
  };

  // ===== STAT CARD =====
const StatCard = ({ title, value, color, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    className={`p-5 rounded-3xl text-white shadow-lg bg-gradient-to-r ${color} cursor-pointer`}
  >
    <p className="text-xl opacity-80">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </motion.div>
);

  // ===== MINI STAT =====
  const MiniStat = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-3xl shadow-md cursor-pointer hover:shadow-lg"
  >
    <p className="text-gray-500">{title}</p>
    <h2 className="text-3xl font-bold">{value}</h2>
  </div>
);

  export default Dashboard;
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
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

const COLORS = ["#ff1d58", "#f75990", "#e1b382", "#00DDFF"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p className="p-6">Loading...</p>;

  // circle chart data
  const pieData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Properties", value: stats.totalListing },
    { name: "Bookings", value: stats.totalBookings },
    { name: "Pending", value: stats.pendingBookings },
  ];

  // example line graph data
  const lineData = [
    { month: "Jan", bookings: 3 },
    { month: "Feb", bookings: 6 },
    { month: "Mar", bookings: 4 },
    { month: "Apr", bookings: 8 },
    { month: "May", bookings: 10 },
  ];

  return (
    <div className="flex">
      <div className="p-6 flex-1 bg-gray-100 min-h-screen">
        <h1 className="text-2xl mb-6 font-bold">Dashboard</h1>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-4 gap-4 mb-8">
           <AnimatedCard title="Users" value={stats.totalUsers} color={COLORS[0]} />
  <AnimatedCard title="Properties" value={stats.totalListing} color={COLORS[1]} />
  <AnimatedCard title="Bookings" value={stats.totalBookings} color={COLORS[2]} />
  <AnimatedCard title="Pending" value={stats.pendingBookings} color={COLORS[3]} />
        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-2 gap-6">

          {/* PIE CHART */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="font-semibold mb-4">
              Booking Distribution
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* LINE GRAPH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow"
          >
            <h3 className="font-semibold mb-4">
              Monthly Booking Trend
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

        </div>

        {/* ================= REVIEW CARDS ================= */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <StatBox
            title="Total Reviews"
            value={stats.totalReviews}
            color="text-cyan-600"
          />

          <StatBox
            title="Pending Reviews"
            value={stats.pendingReviews}
            color="text-red-600"
          />
        </div>
      </div>
    </div>
  );
};



// ================= ANIMATED CARD =================
const AnimatedCard = ({ title, value , color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    style={{ backgroundColor: color }}
    className="p-4  text-white rounded-2xl shadow-lg"
  >
    <p>{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);


// ================= SMALL STAT BOX =================
const StatBox = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow">
    <h3 className="text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default Dashboard;

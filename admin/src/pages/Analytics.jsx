import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8070/api/admin/user/stats").then((res) => {
      setStats(res.data);
    });
  }, []);

  const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"];

  const pieData = [
    { name: "Verified", value: stats?.verified },
    { name: "Unverified", value: stats?.unverified },
    { name: "Active", value: stats?.active },
    { name: "New This Month", value: stats?.newThisMonth },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Overview</h2>

        {stats && (
          <div className="mb-4 space-y-2">
            <p>
              Total Users: <strong>{stats.totalUsers}</strong>
            </p>
            <p>
              Verified Users: <strong>{stats.verified}</strong>
            </p>
            <p>
              Unverified Users: <strong>{stats.unverified}</strong>
            </p>
            <p>
              Active Users (last 6 months): <strong>{stats.active}</strong>
            </p>
            <p>
              New Users This Month: <strong>{stats.newThisMonth}</strong>
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStats;

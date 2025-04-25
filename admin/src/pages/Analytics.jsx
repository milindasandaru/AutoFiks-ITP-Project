import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const AdminStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8070/api/admin/user/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  const COLORS = ["#34D399", "#F87171", "#60A5FA", "#FBBF24"];

  const pieData = stats
    ? [
        { name: "Verified", value: stats.verified },
        { name: "Unverified", value: stats.unverified },
        { name: "Active", value: stats.active },
        { name: "New This Month", value: stats.newThisMonth },
      ]
    : [];

  const predictedGrowth =
    stats && stats.totalUsers > 0
      ? (stats.newThisMonth / stats.totalUsers) * 100
      : 0;

  // Generate PDF Report (text only)
  const generatePdf = () => {
    if (!stats) return;

    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(18);
    pdf.text("User Statistics Report", 20, 20);

    // Stats section
    pdf.setFontSize(12);
    let y = 40;
    pdf.text(`Total Users: ${stats.totalUsers}`, 20, y);
    y += 10;
    pdf.text(`Verified Users: ${stats.verified}`, 20, y);
    y += 10;
    pdf.text(`Unverified Users: ${stats.unverified}`, 20, y);
    y += 10;
    pdf.text(`Active Users (last 6 months): ${stats.active}`, 20, y);
    y += 10;
    pdf.text(`New Users This Month: ${stats.newThisMonth}`, 20, y);
    y += 20;

    // Prediction section
    pdf.setFontSize(14);
    pdf.text("Growth Prediction", 20, y);
    y += 10;
    pdf.setFontSize(12);
    pdf.text(
      `Projected Growth Next Month: ${predictedGrowth.toFixed(2)}%`,
      20,
      y
    );

    // Save the PDF
    pdf.save("user_report.pdf");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div
        className="bg-white p-6 rounded-xl shadow-md"
        style={{ margin: "0 auto" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Overview</h2>

        {stats ? (
          <>
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

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        ) : (
          <p>Loading stats…</p>
        )}

        <div className="text-center mt-6">
          <button
            onClick={generatePdf}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition mt-5"
          >
            📄 Generate PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

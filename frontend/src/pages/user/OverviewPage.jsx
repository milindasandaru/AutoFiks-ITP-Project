import Sidebar from "../../components/user/UserDashboardNavBar";

const OverviewPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the dashboard overview. Here you can see your latest
        </p>
      </div>
    </div>
  );
};

export default OverviewPage;

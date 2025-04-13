import Sidebar from "../../components/user/UserDashboardNavBar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;

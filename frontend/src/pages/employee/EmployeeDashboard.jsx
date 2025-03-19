import User_img from "../../assets/images/User_img.png";
import redLight from "../../assets/images/redLight.png";
import greenLight from "../../assets/images/greenLight.png";

const EmployeeDashboard = () => {
  return (
    <div className="">
      <div className="flex flex-wrap md:flex-nowrap m-5">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl flex flex-col items-center justify-center text-center p-5 md:w-1/3">
          <img src={User_img} alt="User_img" className="w-24 mt-4" />
          <h1 className="text-black font-semibold mt-3">Sammuel Cliffered</h1>
          <p className="text-gray-400 text-sm font-medium">Technician</p>

          <div className="m-3 relative">
            <ul className="text-left text-gray-400 text-sm font-medium break-all">
              <li>Employee ID</li>
              <p className="text-black text-base mb-3">Emp000178</p>
              <li>Email</li>
              <p className="text-black text-base mb-3">
                SammuelCliffered@gmail.com
              </p>
              <li>Phone</li>
              <p className="text-black text-base mb-3">+94 76 766 7766</p>
              <li>Address</li>
              <p className="text-black text-base mb-3">
                Main Street, Horton Place, Wijerama
              </p>
              <li>Bio</li>
              <p className="text-black text-base mb-3">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
                sed necessitatibus alias nesciunt esse deserunt veritatis
                rerum,veritatis reru, Nisi sed necessitatibus alias voluptas
                quisquam.
              </p>
            </ul>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col w-full md:w-2/3 md:ml-5 mt-5 md:mt-0">
          <div className="bg-white rounded-2xl mb-3 p-5">
            <h1 className="text-lg font-semibold pl-3">Earning Report</h1>
            <div className="flex mt-4 md:space-x-48 space-x-9">
              <div>
                <ul className="text-left text-sm pl-3 space-y-5">
                  <li className="font-medium text-gray-400">Month</li>
                  <li>01/2025</li>
                  <li>12/2024</li>
                  <li>11/2024</li>
                  <li>10/2024</li>
                  <li>09/2024</li>
                </ul>
              </div>
              <div>
                <ul className="text-left text-sm space-y-5">
                  <li className="font-medium text-gray-400">Income($)</li>
                  <li>1580</li>
                  <li>1800</li>
                  <li>1675</li>
                  <li>2100</li>
                  <li>1725</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl mt-3 p-5">
            <h1 className="text-lg font-semibold pl-3">Leaving Request</h1>
            <p className="mt-2 text-gray-600">
              <div className="flex mt-4 md:space-x-48 space-x-9">
                <div>
                  <ul className="text-left text-sm pl-3 space-y-3">
                    <li className="font-medium text-gray-400">Date</li>
                    <li>10/01/2025</li>
                    <li>21/10/2024</li>
                    <li>20/10/2024</li>
                    <li>07/07/2024</li>
                    <li>13/05/2024</li>
                  </ul>
                </div>
                <div>
                  <ul className="text-left text-sm space-y-3">
                    <li className="font-medium text-gray-400">Reason</li>
                    <li>Casual</li>
                    <li>Medical</li>
                    <li>Medical</li>
                    <li>Casual</li>
                    <li>Casual</li>
                  </ul>
                </div>
                <div>
                  <ul className="text-left text-sm space-y-3">
                    <li className="font-medium text-gray-400">Status</li>
                    <li className="flex items-center">
                      <img
                        src={greenLight}
                        alt="status_light"
                        className="w-2"
                      />
                      <span className="ml-2">Approved</span>
                    </li>
                    <li className="flex items-center">
                      <img
                        src={greenLight}
                        alt="status_light"
                        className="w-2"
                      />
                      <span className="ml-2">Approved</span>
                    </li>
                    <li className="flex items-center">
                      <img
                        src={greenLight}
                        alt="status_light"
                        className="w-2"
                      />
                      <span className="ml-2">Approved</span>
                    </li>
                    <li className="flex items-center">
                      <img src={redLight} alt="status_light" className="w-2" />
                      <span className="ml-2">Rejected</span>
                    </li>
                    <li className="flex items-center">
                      <img src={redLight} alt="status_light" className="w-2" />
                      <span className="ml-2">Rejected</span>
                    </li>
                  </ul>
                </div>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

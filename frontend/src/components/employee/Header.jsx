import { HiOutlineBellAlert } from "react-icons/hi2";
import User_img from "../../assets/images/User_img.png";

const Header = () => {
  const today = new Date();

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const parts = today.toLocaleDateString("en-US", options).split(", ");
  const formattedDate = `${parts[0]}, ${parts[1].split(" ")[1]} ${
    parts[1].split(" ")[0]
  } ${parts[2]}`;

  return (
    <div className="flex justify-between items-center p-4">
      <div className="mt-2">
        <h1 className="text-lg font-bold">Welcome, Sams</h1>
        <p className="text-gray-500 text-sm font-medium">{formattedDate}</p>
      </div>

      <div className="flex items-center space-x-5">
        <button className="relative text-2xl text-gray-500 mt-1">
          <HiOutlineBellAlert size={28} />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-black text-white font-bold text-[9px] w-4 h-4 aspect-square rounded-full">
            9
          </span>
        </button>
        <img
          src={User_img}
          alt="profile_img"
          className="w-12 h-12 rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;

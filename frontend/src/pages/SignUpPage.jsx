import { motion } from "framer-motion";
import Input from "../components/Input";
import {
  User,
  Mail,
  Lock,
  Loader,
  UserRoundMinus,
  House,
  Phone,
  IdCard,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/AMS_logo2.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [NIC, setNIC] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [currentSection, setCurrentSection] = useState(1);
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(mail, password, name, username, phone, NIC, address);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };
  const goToNextSection = () => {
    setCurrentSection(2);
  };

  const goToPreviousSection = () => {
    setCurrentSection(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mt-[40px] mb-[40px] bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="pt-8 pr-8 pl-8">
        <div className="w-max-content h-20 place-items-center">
          <img src={logo} className="h-[75px]"></img>
        </div>
        <h2 className="text-2xl font-medium font-poppins mb-6 text-center bg-black text-transparent bg-clip-text ">
          Create an Account
        </h2>
        <form onSubmit={handleSignup}>
          {/* First Section */}
          {currentSection === 1 && (
            <>
              <p className="text-[#a3a3a3]">Full Name</p>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-[#a3a3a3]">Address</p>
              <Input
                icon={House}
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <p className="text-[#a3a3a3]">Phone</p>
              <Input
                icon={Phone}
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-[#a3a3a3]">NIC</p>
              <Input
                icon={IdCard}
                type="text"
                placeholder="NIC"
                value={NIC}
                onChange={(e) => setNIC(e.target.value)}
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToNextSection}
                className="mt-4 text-right cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[#2563eb] text-xl"
                />
              </motion.div>
            </>
          )}

          {/* Second Section */}
          {currentSection === 2 && (
            <>
              <p className="text-[#a3a3a3]">Username</p>
              <Input
                icon={UserRoundMinus}
                type="text"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-[#a3a3a3]">Email</p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
              <p className="text-[#a3a3a3]">Password</p>
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}
              <PasswordStrengthMeter password={password} />

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToPreviousSection}
                className="mt-4 text-left cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-[#2563eb] text-xl"
                />
              </motion.div>
              <motion.button
                className="mt-5 w-full py-3 px-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="animate-spin mx-auto" size={24} />
                ) : (
                  "Sign up"
                )}
              </motion.button>
            </>
          )}
        </form>
      </div>
      <div className="flex items-center w-full my-4">
        <div className="flex-grow border-t-4 border-black"></div>
        <span className="px-4 text-black font-semibold">OR</span>
        <div className="flex-grow border-t-4 border-black"></div>
      </div>
      <div className="px-8 py-4 bg-[#d4d4d8] bg-opacity-50 flex justify-center">
        <p className="text-sm text-black">
          Already have an account?{" "}
          <Link to={"/login"} className="text-[#2563eb] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/user/Input";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/images/AMS_logo2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faApple,
} from "@fortawesome/free-brands-svg-icons";

const LoginPage = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const { error, isLoading, login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(mail, password, navigate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-[25px] shadow-xl overflow-hidden mt-10 mb-10"
    >
      <div className="p-4">
        <div className="w-max-content h-20 place-items-center">
          <img src={logo} className="h-[75px]"></img>
        </div>
        <h2 className="text-2xl font-medium font-poppins h-[50px] text-center bg-black text-transparent bg-clip-text">
          Log in to your account
        </h2>
        <form onSubmit={handleLogin}>
          <p className="text-[#a3a3a3]">Email</p>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          ></Input>
          <p className="text-[#a3a3a3]">Password</p>
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>

          <div className="flex justify-end mb-6 w-full">
            <Link
              to="/forgot-password"
              className="text-sm text-[#2563eb] font-poppins hover:underline "
            >
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-[#2563eb] text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t-4 border-black"></div>
          <span className="px-4 text-black font-semibold">OR</span>
          <div className="flex-grow border-t-4 border-black"></div>
        </div>
      </div>
      <div className="space-y-4 h-[200px] pr-4 pb-4 pl-4">
        {/* Facebook Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="button"
        >
          <FontAwesomeIcon icon={faFacebook} className="w-6 h-6 mr-3" />
          Continue with Facebook
        </motion.button>

        {/* Google Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 flex items-center justify-center bg-white text-gray-900 font-semibold border border-gray-300 rounded-lg shadow-lg 
                   hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="button"
        >
          <FontAwesomeIcon
            icon={faGoogle}
            className="w-6 h-6 mr-3 text-red-500"
          />
          Continue with Google
        </motion.button>

        {/* Apple Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 flex items-center justify-center bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          type="button"
        >
          <FontAwesomeIcon icon={faApple} className="w-6 h-6 mr-3" />
          Continue with Apple
        </motion.button>
      </div>
      <div className="px-8 py-4 bg-[#d4d4d8] bg-opacity-500 flex justify-center">
        <p className="text-sm text-black">
          Don't have an account?{""}
          <Link to="/signup" className="text-[#2563eb] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;

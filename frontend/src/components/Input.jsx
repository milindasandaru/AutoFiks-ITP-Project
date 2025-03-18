const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#2563eb]"></Icon>
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-[#d4d4d8] bg-opacity-50 rounded-lg border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-black placeholder-gray-400 transition duration-200"
      />
    </div>
  );
};

export default Input;

const Button = ({ children, type = 'button', isLoading }) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? 'Đang xử lý...' : children}
    </button>
  );
};

export default Button;
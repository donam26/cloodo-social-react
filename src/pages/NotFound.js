import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
                    <div className="h-2 w-24 bg-blue-500 mx-auto rounded-full mb-8"></div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Oops! Trang này không tồn tại
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. 
                        Đừng lo lắng, hãy thử một trong những đề xuất dưới đây:
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 font-medium">
                            <FaHome className="text-lg" />
                            Về trang chủ
                        </button>
                    </Link>
                    <Link to="/search">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-colors duration-200 font-medium">
                            <FaSearch className="text-lg" />
                            Tìm kiếm
                        </button>
                    </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Nếu bạn tin rằng đây là lỗi, vui lòng 
                        <a href="#" className="text-blue-500 hover:underline ml-1">
                            báo cáo vấn đề
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
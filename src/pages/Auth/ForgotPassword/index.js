import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi email reset password ở đây
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Kiểm tra email của bạn
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
                            Vui lòng kiểm tra hộp thư (và thư mục spam) để tiếp tục.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Quên mật khẩu?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Đừng lo lắng! Chỉ cần nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-1"
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all"
                        >
                            Gửi hướng dẫn đặt lại mật khẩu
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
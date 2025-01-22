import { FaBell, FaFacebookMessenger, FaHome, FaUserFriends, FaVideo } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";
import { IoGridSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Search from "./";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </Link>
          <Search />
        </div>

        {/* Middle section - Navigation */}
        <div className="flex items-center justify-center flex-1 h-full">
          <nav className="flex h-full">
            <Link
              href="/"
              className="flex items-center px-10 h-full border-b-4 border-blue-500 hover:bg-gray-100"
            >
              <FaHome className="w-6 h-6 text-blue-500" />
            </Link>
            <Link
              href="/friends"
              className="flex items-center px-10 h-full border-blue-500 hover:bg-gray-100"
            >
              <FaUserFriends className="w-6 h-6 text-blue-500" />
            </Link>
            <Link
              href="/videos"
              className="flex items-center px-10 h-full  border-blue-500 hover:bg-gray-100"
            >
              <FaVideo className="w-6 h-6 text-blue-500" />
            </Link>
            <Link
              href="/groups"
              className="flex items-center px-10 h-full  border-blue-500 hover:bg-gray-100"
            >
              <MdGroups2 className="w-6 h-6 text-blue-500" />
            </Link>
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <IoGridSharp className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaFacebookMessenger className="w-6 h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FaBell className="w-6 h-6" />
          </button>
          <button className="ml-2">
            <img
              src="/images/avatar.jpg"
              alt="Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

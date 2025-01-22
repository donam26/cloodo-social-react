import { Input } from "antd";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  return (
    <div className="relative flex items-center max-w-[240px]">
      <div className="absolute left-3 text-gray-500">
        <FaSearch size={16} />
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm trên Cloodo"
        className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none hover:bg-gray-200  focus:shadow-md transition-all"
      />
    </div>
  );
};

export default Search;
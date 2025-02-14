import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(() => {
    // Khởi tạo state từ URL hoặc localStorage
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('query');
    const savedQuery = localStorage.getItem('lastSearchQuery');
    return urlQuery || savedQuery || "";
  });

  // Cập nhật query từ URL khi location thay đổi
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('query');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      // Cập nhật localStorage khi có query mới từ URL
      localStorage.setItem('lastSearchQuery', urlQuery);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSubmitSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    // Lưu query vào localStorage
    localStorage.setItem('lastSearchQuery', trimmedQuery);
    
    // Nếu đang ở trang search, chỉ cần cập nhật query parameter
    if (location.pathname === '/search') {
      navigate({
        pathname: '/search',
        search: `?query=${encodeURIComponent(trimmedQuery)}`
      }, { replace: true }); // Sử dụng replace để không tạo history mới
    } else {
      // Nếu đang ở trang khác, navigate đến trang search
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitSearch();
    }
  };

  return (
    <div className="relative flex items-center max-w-[240px]">
      <div 
        className="absolute left-3 text-gray-500 cursor-pointer" 
        onClick={handleSubmitSearch}
      >
        <FaSearch size={16} />
      </div>
      <input
        type="text"
        placeholder="Tìm kiếm trên Cloodo"
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        value={query}
        className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-full outline-none hover:bg-gray-200 focus:shadow-md transition-all"
      />
    </div>
  );
};

export default Search;

import Post from "../../components/Post";
import Story from "../../components/Story";
import { useGetPost } from "../../hooks/postHook";
import CreatePost from "../../components/Post/CreateModal";
import { FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";  
const Home = () => {
  const { data: posts, isPending } = useGetPost();
  
  const NoPostsMessage = () => (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <FaUserFriends className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">
          Chưa có bài viết nào để hiển thị
        </h3>
        <p className="text-gray-600 max-w-md">
          Hãy kết bạn với nhiều người hơn để xem các bài viết thú vị của họ. 
          Bạn cũng có thể chia sẻ những khoảnh khắc của mình để kết nối với mọi người!
        </p>
        <Link to="/friend"> 
          <button className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 font-medium">
            Tìm bạn mới
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Story />
      <CreatePost />
      {isPending ? (
        <>
          <Post isLoading={true} />
          <Post isLoading={true} />
          <Post isLoading={true} />
        </>
      ) : posts?.data?.length === 0 ? (
        <NoPostsMessage />
      ) : (
        posts?.data?.map((post) => (
          <Post key={post?.id} post={post} isLoading={false} />
        ))
      )}
    </div>
  );
};

export default Home;
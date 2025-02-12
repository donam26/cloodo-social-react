import Post from "../../components/Post";
import Story from "../../components/Story";
import { useGetPost } from "../../hooks/postHook";

const Home = () => {
  const { data: posts, isPending } = useGetPost();
  
  return (
    <div className="flex flex-col gap-4">
      <Story />
      {isPending ? (
        <>
          <Post isLoading={true} />
          <Post isLoading={true} />
          <Post isLoading={true} />
        </>
      ) : (
        posts?.data?.map((post) => (
          <Post key={post?.id} post={post} isLoading={false} />
        ))
      )}
    </div>
  );
};

export default Home;
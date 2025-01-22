import Post from "../../components/Post";
import Story from "../../components/Story";

const Home = () => {
    return (
      <div className="flex flex-col gap-4">
        <Story />
        <Post />
      </div>
    );
  } 

  export default Home;
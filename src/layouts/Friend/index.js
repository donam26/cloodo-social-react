import Header from "../../components/Layout/Header";
import Sidebar from "../../components/Layout/Sidebar";

const FriendLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="mt-14">
            <div className="px-2 flex flex-col md:flex-row w-full gap-4">
              <div className="hidden md:block md:w-1/4 lg:w-1/5">
                <div className="sticky top-16">
                  <Sidebar />
                </div>
              </div>
              <main className="flex-1 min-w-0 pt-4">
                {children}
              </main>
            </div>
          </div>
        </div>
      );
}

export default FriendLayout;
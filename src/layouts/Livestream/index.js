import Header from "../../components/Layout/Header";
import SidebarLivestream from "../../components/Layout/SidebarLivestream";

const LivestreamLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-14">
        <div className="max-w-[1920px] mx-auto px-4 mt-2">
          <div className="flex gap-4">
            {/* Sidebar */}
            <SidebarLivestream />
            
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestreamLayout; 
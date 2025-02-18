import Header from "../../components/Layout/Header";
import SidebarGroup from "../../components/Layout/SidebarGroup";

const GroupLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="mt-14">
            <div className="px-2 flex flex-col md:flex-row w-full gap-4">
              <div className="hidden md:block">
                <div className="sticky top-16">
                  <SidebarGroup />
                </div>
              </div>
              <main className="flex-1 min-w-0">
                {children}
              </main>
              
            </div>
          </div>
        </div>
      );
}

export default GroupLayout;
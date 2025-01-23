import { useState } from "react";
import { Drawer } from "antd";
import { FaBars } from "react-icons/fa";
import GroupHeader from "../../components/Group/GroupHeader";
import GroupSidebar from "../../components/Group/GroupSidebar";
import GroupFeed from "../../components/Group/GroupFeed";
import GroupSuggestions from "../../components/Group/GroupSuggestions";

const GroupsPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setShowSidebar(true)}
      >
        <FaBars className="w-6 h-6" />
      </button>

      {/* Mobile sidebar drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        className="lg:hidden"
      >
        <GroupSidebar />
      </Drawer>

      {/* Header */}
      <GroupHeader />

      {/* Main content */}
      <div className="flex gap-4">
        {/* Left sidebar - Desktop */}
        <div className="hidden lg:block w-[280px] xl:w-[360px] shrink-0">
          <div className="sticky top-4">
            <GroupSidebar />
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 min-w-0">
          <GroupFeed />
        </div>

        {/* Right sidebar - Desktop */}
        <div className="hidden xl:block w-[360px] shrink-0">
          <div className="sticky top-4">
            <GroupSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage; 
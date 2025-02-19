import { useState } from "react";
import { Button, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import AdminGroups from "../../../components/Group/AdminGroups";
import MemberGroups from "../../../components/Group/MemberGroups";

const YourGroups = () => {
  const [activeTab, setActiveTab] = useState("member");
  const navigate = useNavigate();

  const items = [
    {
      key: "member",
      label: "Nhóm đã tham gia",
      children: <MemberGroups />,
    },
    {
      key: "admin",
      label: "Nhóm quản lý",
      children: <AdminGroups />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Nhóm của bạn</h1>
            <Button
              type="primary"
              onClick={() => navigate("/groups/discover")}
            >
              Khám phá thêm
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="px-4"
        />
      </div>
    </div>
  );
};

export default YourGroups; 
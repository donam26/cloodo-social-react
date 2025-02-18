import { Avatar, Input, List, Dropdown, Modal, message } from 'antd';
import { FaSearch, FaEllipsisH } from 'react-icons/fa';
import { useGetMembers, useRemoveMember, usePromoteAdmin } from '../../../hooks/groupHook';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

const Members = ({ currentUserIsAdmin }) => {
  const { groupId } = useParams();
  const { data: members } = useGetMembers(groupId);
  const { mutate: removeMember } = useRemoveMember();
  const { mutate: promoteAdmin } = usePromoteAdmin();
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const handleMenuClick = (action, member) => {
    setSelectedMember(member);
    setModalAction(action);
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    if (modalAction === 'remove') {
      removeMember({ groupId, memberId: selectedMember.id }, {
        onSuccess: () => {
          message.success('Đã xóa thành viên khỏi nhóm');
        }
      });
    } else if (modalAction === 'promote') {
      promoteAdmin({ groupId, memberId: selectedMember.id }, {
        onSuccess: () => {
          message.success('Đã thêm quản trị viên mới');
        }
      });
    }
    setIsModalVisible(false);
  };

  const getDropdownItems = (member) => {
    const items = [];
    
    if (currentUserIsAdmin ) {
      items.push({
        key: 'promote',
        label: 'Thêm làm quản trị viên',
        onClick: () => handleMenuClick('promote', member)
      });
    }

    if (currentUserIsAdmin && member.id !== member.creator_id) {
      items.push({
        key: 'remove',
        label: 'Xóa khỏi nhóm',
        danger: true,
        onClick: () => handleMenuClick('remove', member)
      });
    }

    return items;
  };

  const modalTexts = {
    remove: {
      title: 'Xóa thành viên',
      content: `Bạn có chắc chắn muốn xóa ${selectedMember?.name} khỏi nhóm không?`
    },
    promote: {
      title: 'Thêm quản trị viên',
      content: `Bạn có chắc chắn muốn thêm ${selectedMember?.name} làm quản trị viên không?`
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Search */}
      <div className="p-4 border-b">
        <Input
          prefix={<FaSearch className="text-gray-400" />}
          placeholder="Tìm kiếm thành viên"
          className="rounded-full hover:border-blue-400 focus:border-blue-400"
        />
      </div>

      {/* Members List */}
      <div className="divide-y divide-gray-100">
        {members?.data?.map((member) => (
          <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <Link 
                to={`/profile/${member.id}`}
                className="flex-1 flex items-center gap-3 min-w-0"
              >
                <Avatar 
                  src={member.image} 
                  size={48}
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    {member.is_admin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Quản trị viên
                      </span>
                    )}
                    {member.id === member.creator_id && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Người tạo nhóm
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {member.role || "Thành viên"}
                  </p>
                </div>
              </Link>

              {currentUserIsAdmin && getDropdownItems(member).length > 0 && (
                <Dropdown
                  menu={{ items: getDropdownItems(member) }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2">
                    <FaEllipsisH className="text-gray-500 w-5 h-5" />
                  </button>
                </Dropdown>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={modalTexts[modalAction]?.title}
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>{modalTexts[modalAction]?.content}</p>
      </Modal>
    </div>
  );
};

export default Members; 
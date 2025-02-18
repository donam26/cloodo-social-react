import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BiMessageRounded } from "react-icons/bi";
import { FaUserPlus, FaUserMinus, FaUserTimes } from "react-icons/fa";
import { Avatar, Dropdown, Button, Skeleton, message, Modal } from "antd";
import { useGetProfile } from '../../../hooks/profileHook';
import { useFriendAction } from '../../../hooks/friendHook';
import Post from '../../../components/Post';
import ChatPopup from '../../../components/Layout/Header/Messenger/ChatPopup';
import TempChatPopup from '../../../components/Layout/Header/Messenger/TempChatPopup';

const ProfileDetail = () => {
  const { id } = useParams();
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const { data: profileData, isLoading } = useGetProfile(id);
  const { mutate: sendFriendAction, isPending: isSendingAction } = useFriendAction();

  const handleFriendAction = (action) => {
    sendFriendAction(
      { userId: id, action },
      {
        onError: () => {
          message.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const handleMessage = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setActiveChat(null);
  };

  const handleConversationCreated = (conversation) => {
    setActiveChat(conversation);
  };

  const renderFriendButton = () => {
    if (isLoading) return <Skeleton.Button active />;

    const messageButton = (
      <Button
        type="primary"
        icon={<BiMessageRounded className="text-xl" />}
        onClick={handleMessage}
        className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
      >
        <span>Nhắn tin</span>
      </Button>
    );

    const dropdownItems = {
      items: [
        {
          key: 'unfriend',
          label: 'Hủy kết bạn',
          icon: <FaUserMinus className="text-gray-600" />,
          onClick: () => handleFriendAction('cancel')
        },
        {
          key: 'block',
          label: 'Chặn',
          icon: <FaUserTimes className="text-red-500" />,
          danger: true,
          onClick: () => handleFriendAction('block')
        }
      ]
    };

    switch (profileData?.data?.friend_status) {
      case null:
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<FaUserPlus />}
              loading={isSendingAction}
              onClick={() => handleFriendAction('request')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Thêm bạn bè
            </Button>
            {messageButton}
          </div>
        );
      
      case 'pending_sent':
        return (
          <div className="flex gap-2">
            <Dropdown 
              menu={{
                items: [
                  {
                    key: 'cancel',
                    label: 'Hủy lời mời',
                    icon: <FaUserMinus className="text-gray-600" />,
                    onClick: () => handleFriendAction('cancel')
                  }
                ]
              }} 
              placement="bottomRight"
            >
              <Button
                icon={<FaUserMinus />}
                loading={isSendingAction}
                className="bg-gray-200 hover:bg-gray-300 text-black"
              >
                <div className="flex items-center gap-2">
                  <span>Đã gửi lời mời</span>
                </div>
              </Button>
            </Dropdown>
            {messageButton}
          </div>
        );

      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              loading={isSendingAction}
              onClick={() => handleFriendAction('accept')}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Xác nhận
            </Button>
            <Button
              loading={isSendingAction}
              onClick={() => handleFriendAction('cancel')}
              className="bg-gray-200 hover:bg-gray-300 text-black"
            >
              Xóa
            </Button>
            {messageButton}
          </div>
        );

      case 'accepted':
        return (
          <div className="flex gap-2">
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <Button 
                icon={<FaUserPlus />}
                className="bg-gray-200 hover:bg-gray-300 text-black flex items-center gap-2"
              >
                <span>Bạn bè</span>
              </Button>
            </Dropdown>
            {messageButton}
          </div>
        );

      default:
        return messageButton;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 p-4">
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </div>;
  }
  if (!profileData) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Cover Image */}
        <div className="relative h-[200px] md:h-[350px] bg-gray-300">
          <img
            src={profileData?.data?.image_background || '/images/default-cover.jpg'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-[1000px] mx-auto px-4">
          {/* Profile Info */}
          <div className="relative bg-white rounded-lg shadow -mt-[60px] md:-mt-[100px] p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative cursor-pointer group" onClick={() => setShowAvatarModal(true)}>
                <Avatar
                  src={profileData?.data?.image}
                  alt={profileData?.data?.name}
                  size={100}
                  className="rounded-full border-4 border-white transition-transform hover:opacity-90"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm md:text-base">Xem ảnh đại diện</span>
                </div>
              </div>

              {/* Avatar Modal */}
              <Modal
                open={showAvatarModal}
                onCancel={() => setShowAvatarModal(false)}
                footer={null}
                width={600}
                centered
              >
                <img
                  src={profileData?.data?.image}
                  alt={profileData?.data?.name}
                  className="w-full rounded-lg"
                  style={{ maxHeight: '80vh', objectFit: 'contain' }}
                />
              </Modal>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{profileData?.data?.name}</h1>
                    {profileData?.data?.bio && <p className="text-gray-600 mb-2 text-sm md:text-base">{profileData?.data?.bio}</p>}
                    <div className="flex items-center justify-center md:justify-start gap-6 text-gray-600 text-sm md:text-base">
                      <span>{profileData?.data?.friends?.total || 0} bạn bè</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-end gap-2">
                    {renderFriendButton()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 bg-white rounded-lg shadow overflow-x-auto">
            <div className="flex border-b min-w-max">
              <button className="px-4 md:px-6 py-3 md:py-4 font-semibold text-blue-500 border-b-2 border-blue-500 text-sm md:text-base">
                Bài viết
              </button>
              <button className="px-4 md:px-6 py-3 md:py-4 text-gray-600 hover:bg-gray-50 text-sm md:text-base">
                Giới thiệu
              </button>
              <button className="px-4 md:px-6 py-3 md:py-4 text-gray-600 hover:bg-gray-50 text-sm md:text-base">
                Bạn bè
              </button>
              <button className="px-4 md:px-6 py-3 md:py-4 text-gray-600 hover:bg-gray-50 text-sm md:text-base">
                Ảnh
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Left Sidebar */}
            <div className="space-y-4">
              {/* Giới thiệu */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-4 text-base md:text-lg">Giới thiệu</h2>
                {profileData?.data?.bio ? (
                  <p className="text-gray-600 text-sm md:text-base">{profileData?.data?.bio}</p>
                ) : (
                  <p className="text-gray-500 italic text-sm md:text-base">Chưa có thông tin giới thiệu</p>
                )}
              </div>

              {/* Bạn bè */}
              {profileData?.data?.friends?.items?.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-base md:text-lg">Bạn bè</h2>
                    <span className="text-gray-500 text-sm md:text-base">{profileData?.data?.friends?.total} bạn bè</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {profileData?.data?.friends?.items?.slice(0, 9).map(friend => (
                        <Link to={`/profile/${friend.id}`} key={friend.id} className="text-center">
                          <Avatar 
                            src={friend.image} 
                            size={60}
                            className="mb-1"
                          />
                          <p className="text-xs md:text-sm font-medium truncate">{friend.name}</p>
                        </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - Posts */}
            <div className="md:col-span-2 space-y-4">
              {profileData?.data?.posts?.items?.map(post => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Popups */}
      {showChat && !activeChat && !profileData?.data?.conversation && (
        <TempChatPopup
          user={profileData?.data}
          onClose={handleCloseChat}
          onConversationCreated={handleConversationCreated}
        />
      )}
      {activeChat && (
        <ChatPopup
          conversation={activeChat}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export default ProfileDetail; 
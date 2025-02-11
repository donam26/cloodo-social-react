import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BiEdit, BiMessageRounded, BiDotsHorizontalRounded } from "react-icons/bi";
import { FaUserPlus, FaUserMinus, FaUserTimes } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { BsBriefcase, BsGlobe2 } from "react-icons/bs";
import { IoSchoolOutline } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { Avatar, Dropdown, Button, Skeleton, message } from "antd";
import { useGetProfile } from '../../../hooks/profileHook';
import { useFriendAction } from '../../../hooks/friendHook';
import Post from '../../../components/Post';

const ProfileDetail = () => {
  const { id } = useParams();
  const [loadingAction, setLoadingAction] = useState(false);
  const { data: profileData, isLoading } = useGetProfile(id);
  const { sendFriendAction } = useFriendAction();

  const profile = profileData?.profile;
  const friendStatus = profileData?.friend_status;
  const isSelf = profileData?.is_self;

  const handleFriendAction = async (action) => {
    setLoadingAction(true);
    try {
      await sendFriendAction({ userId: id, action });
      switch(action) {
        case 'request':
          message.success('Đã gửi lời mời kết bạn');
          break;
        case 'accept':
          message.success('Đã chấp nhận lời mời kết bạn');
          break;
        case 'cancel':
          message.success('Đã hủy kết bạn/lời mời');
          break;
        case 'block':
          message.success('Đã chặn người dùng');
          break;
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoadingAction(false);
    }
  };

  const renderFriendButton = () => {
    if (isLoading) return <Skeleton.Button active />;
    if (isSelf) return null;

    const dropdownItems = {
      items: [
        {
          key: 'unfriend',
          label: 'Hủy kết bạn',
          icon: <FaUserMinus />,
          onClick: () => handleFriendAction('cancel')
        },
        {
          key: 'block',
          label: 'Chặn',
          icon: <FaUserTimes />,
          danger: true,
          onClick: () => handleFriendAction('block')
        }
      ]
    };

    switch (friendStatus) {
      case 'none':
        return (
          <Button
            type="primary"
            icon={<FaUserPlus />}
            loading={loadingAction}
            onClick={() => handleFriendAction('request')}
          >
            Thêm bạn bè
          </Button>
        );
      
      case 'pending_sent':
        return (
          <Button
            icon={<FaUserMinus />}
            loading={loadingAction}
            onClick={() => handleFriendAction('cancel')}
          >
            Hủy lời mời
          </Button>
        );

      case 'pending_received':
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              loading={loadingAction}
              onClick={() => handleFriendAction('accept')}
            >
              Chấp nhận
            </Button>
            <Button
              loading={loadingAction}
              onClick={() => handleFriendAction('cancel')}
            >
              Từ chối
            </Button>
          </div>
        );

      case 'friend':
        return (
          <div className="flex gap-2">
            <Button
              icon={<BiMessageRounded />}
              onClick={() => {/* Handle message */}}
            >
              Nhắn tin
            </Button>
            <Dropdown menu={dropdownItems} placement="bottomRight">
              <Button icon={<BiDotsHorizontalRounded />} />
            </Dropdown>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 p-4">
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="relative h-[350px] bg-gray-300">
        <img
          src={profile.image_background || '/images/default-cover.jpg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1000px] mx-auto px-4">
        {/* Profile Info */}
        <div className="relative bg-white rounded-lg shadow -mt-[100px] p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={profile.image}
                alt={profile.name}
                size={168}
                className="rounded-full border-4 border-white"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                  {profile.bio && <p className="text-gray-600 mb-2">{profile.bio}</p>}
                  <div className="flex items-center gap-6 text-gray-600">
                    <span>{profile.friends?.total || 0} bạn bè</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {renderFriendButton()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button className="px-6 py-4 font-semibold text-blue-500 border-b-2 border-blue-500">
              Bài viết
            </button>
            <button className="px-6 py-4 text-gray-600 hover:bg-gray-50">
              Giới thiệu
            </button>
            <button className="px-6 py-4 text-gray-600 hover:bg-gray-50">
              Bạn bè
            </button>
            <button className="px-6 py-4 text-gray-600 hover:bg-gray-50">
              Ảnh
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Giới thiệu */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Giới thiệu</h2>
              {profile.bio ? (
                <p className="text-gray-600">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 italic">Chưa có thông tin giới thiệu</p>
              )}
            </div>

            {/* Bạn bè */}
            {profile.friends?.items?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Bạn bè</h2>
                  <span className="text-gray-500">{profile.friends.total} bạn bè</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {profile.friends.items.slice(0, 9).map(friend => (
                    <div key={friend.id} className="text-center">
                      <Avatar 
                        src={friend.image} 
                        size={80}
                        className="mb-1"
                      />
                      <p className="text-sm font-medium truncate">{friend.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Posts */}
          <div className="col-span-2 space-y-4">
            {profile.posts?.items?.map(post => (
              <Post key={post.id} post={post} />
            ))}
            {console.log(profile.posts)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail; 
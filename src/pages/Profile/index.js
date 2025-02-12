import { BiEdit } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { BsBriefcase, BsGlobe2 } from "react-icons/bs";
import { IoSchoolOutline } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { Avatar, message, Modal, Upload, Button } from "antd";
import { useGetMyProfile, useUpdateProfile } from "../../hooks/profileHook";
import { useState } from "react";
import Post from "../../components/Post";
import { PlusOutlined } from '@ant-design/icons';
import CreatePostModal from "../../components/Post/CreateModal";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { data: profileData, isLoading } = useGetMyProfile();
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const handleEditProfile = () => {
    setIsEditingInfo(true);
  };

  const handleUpdateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      await updateProfile({ data: formData });
      setIsEditingAvatar(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
    }
  };

  const handleUpdateCover = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image_background', file);
      await updateProfile({ data: formData });
      setIsEditingCover(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật ảnh bìa');
    }
  };

  const handleUpdateInfo = async (values) => {
    try {
      await updateProfile({ data: values });
      setIsEditingInfo(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 p-4">
      <div className="animate-pulse">
        <div className="h-[350px] bg-gray-300 mb-4"></div>
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex gap-6">
              <div className="w-[168px] h-[168px] bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-300 w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }

  const profile = profileData?.data;

  if (!profile) return null;

  const tabs = [
    { key: 'posts', label: 'Bài viết' },
    { key: 'about', label: 'Giới thiệu' },
    { key: 'friends', label: 'Bạn bè' },
    { key: 'photos', label: 'Ảnh' },
    { key: 'videos', label: 'Video' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="relative h-[350px] bg-gray-300">
        <img
          src={profile?.image_background || '/images/default-cover.jpg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100"
          onClick={() => setIsEditingCover(true)}
        >
          <BiEdit className="text-xl" />
          <span>Thay ảnh bìa</span>
        </button>
      </div>

      <div className="max-w-[1000px] mx-auto px-4">
        {/* Profile Info */}
        <div className="relative bg-white rounded-lg shadow -mt-[100px] p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                src={profile?.image}
                alt={profile?.name}
                size={168}
                className="rounded-full border-4 border-white"
              />
              <button 
                className="absolute bottom-2 right-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                onClick={() => setIsEditingAvatar(true)}
              >
                <BiEdit className="text-xl" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile?.name}</h1>
                  <p className="text-gray-600 mb-2">{profile?.bio}</p>
                  <div className="flex items-center gap-6 text-gray-600">
                    <span>{profile?.friends?.total || 0} bạn bè</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-gray-200 px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300"
                    onClick={handleEditProfile}
                  >
                    <BiEdit className="text-xl" />
                    <span>Chỉnh sửa trang cá nhân</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              {profile?.location && (
                <div className="flex items-center gap-3 text-gray-600">
                  <HiLocationMarker className="text-xl" />
                  <span>Sống tại {profile?.location}</span>
                </div>
              )}
              {profile?.workplace && (
                <div className="flex items-center gap-3 text-gray-600">
                  <BsBriefcase className="text-xl" />
                  <span>Làm việc tại {profile?.workplace}</span>
                </div>
              )}
              {profile?.education && (
                <div className="flex items-center gap-3 text-gray-600">
                  <IoSchoolOutline className="text-xl" />
                  <span>Học tại {profile?.education}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {profile?.relationship_status && (
                <div className="flex items-center gap-3 text-gray-600">
                  <MdOutlineFavorite className="text-xl" />
                  <span>{profile?.relationship_status}</span>
                </div>
              )}
              {profile?.created_at && (
                <div className="flex items-center gap-3 text-gray-600">
                  <BsGlobe2 className="text-xl" />
                  <span>Tham gia {new Date(profile?.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 bg-white rounded-lg shadow">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`px-6 py-4 font-medium ${
                  activeTab === tab.key
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Giới thiệu</h2>
                <button 
                  className="text-blue-500 hover:bg-gray-100 p-2 rounded-md"
                  onClick={handleEditProfile}
                >
                  <BiEdit className="text-xl" />
                </button>
              </div>
              {profile?.bio ? (
                <p className="text-gray-600">{profile?.bio}</p>
              ) : (
                <p className="text-gray-500 italic">Thêm tiểu sử của bạn</p>
              )}
            </div>

            {/* Bạn bè */}
            {profile?.friends?.items?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Bạn bè</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{profile?.friends?.total} bạn bè</span>
                    <Button type="link" size="small">Xem tất cả</Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {profile?.friends?.items?.slice(0, 9).map(friend => (
                    <div key={friend.id} className="text-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
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

            {/* Ảnh */}
            {profile?.photos?.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Ảnh</h2>
                  <Button type="link" size="small">Xem tất cả</Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {profile?.photos?.slice(0, 9).map((photo, index) => (
                    <div key={index} className="aspect-square group relative cursor-pointer">
                      <Link to={`/profile/${profile?.id}/photos/${photo?.id}`}>
                        <image
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                      />
                      </Link>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content - Posts */}
          <div className="col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-3">
                <Avatar
                  src={profile?.image}
                  alt={profile?.name}
                  size={40}
                  className="rounded-full"
                />
                <button 
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-600 hover:bg-gray-200"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  Bạn đang nghĩ gì?
                </button>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <button 
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  <span>🖼️</span>
                  <span>Ảnh/Video</span>
                </button>
                <button 
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  <span>😊</span>
                  <span>Cảm xúc</span>
                </button>
                <button 
                  className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg"
                  onClick={() => setIsCreatePostModalOpen(true)}
                >
                  <span>📍</span>
                  <span>Check in</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            {profile?.posts?.items?.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        title="Cập nhật ảnh đại diện"
        open={isEditingAvatar}
        onCancel={() => setIsEditingAvatar(false)}
        footer={null}
      >
        <Upload.Dragger
          name="image"
          multiple={false}
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpdateAvatar(file);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo file để tải lên</p>
        </Upload.Dragger>
      </Modal>

      <Modal
        title="Cập nhật ảnh bìa"
        open={isEditingCover}
        onCancel={() => setIsEditingCover(false)}
        footer={null}
      >
        <Upload.Dragger
          name="image_background"
          multiple={false}
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpdateCover(file);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <PlusOutlined />
          </p>
          <p className="ant-upload-text">Nhấp hoặc kéo file để tải lên</p>
        </Upload.Dragger>
      </Modal>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isEditingInfo}
        onCancel={() => setIsEditingInfo(false)}
        footer={null}
        width={600}
      >
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiểu sử
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                defaultValue={profile?.bio}
                placeholder="Thêm tiểu sử của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi sống
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue={profile?.location}
                placeholder="Thêm nơi bạn đang sống"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nơi làm việc
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue={profile?.workplace}
                placeholder="Thêm nơi làm việc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học vấn
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue={profile?.education}
                placeholder="Thêm trường học"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tình trạng quan hệ
              </label>
              <select
                className="w-full p-2 border rounded-md"
                defaultValue={profile?.relationship_status}
              >
                <option value="">Chọn tình trạng</option>
                <option value="Độc thân">Độc thân</option>
                <option value="Hẹn hò">Hẹn hò</option>
                <option value="Đã kết hôn">Đã kết hôn</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsEditingInfo(false)}>Hủy</Button>
            <Button type="primary" loading={isUpdating} onClick={handleUpdateInfo}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      <CreatePostModal
        open={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage; 
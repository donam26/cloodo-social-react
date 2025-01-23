import { mockProfile } from "../../data/profile";
import { BiEdit, BiMessageRounded } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { BsBriefcase, BsGlobe2 } from "react-icons/bs";
import { IoSchoolOutline } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { Avatar } from "antd";

const ProfilePage = () => {
  const profile = mockProfile;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="relative h-[350px] bg-gray-300">
        <Avatar
          src={profile.coverImage}
          alt="Cover"
          size={168}
          className="object-cover"
        />
        <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100">
          <BiEdit className="text-xl" />
          <span>Chỉnh sửa ảnh bìa</span>
        </button>
      </div>

      <div className="max-w-[1000px] mx-auto px-4">
        {/* Profile Info */}
        <div className="relative bg-white rounded-lg shadow -mt-[100px] p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
                <Avatar
                src={profile?.avatar}
                alt={profile.fullName}
                size={168}
                className="rounded-full border-4 border-white"
              />
              <button className="absolute bottom-2 right-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <BiEdit className="text-xl" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile.fullName}</h1>
                  <p className="text-gray-600 mb-2">{profile.bio}</p>
                  <div className="flex items-center gap-6 text-gray-600">
                    <span>{profile.followers} người theo dõi</span>
                    <span>{profile.following} đang theo dõi</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-blue-600">
                    <FaUserPlus />
                    <span>Theo dõi</span>
                  </button>
                  <button className="bg-gray-200 px-6 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300">
                    <BiMessageRounded className="text-xl" />
                    <span>Nhắn tin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <HiLocationMarker className="text-xl" />
                <span>Sống tại {profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <BsBriefcase className="text-xl" />
                <span>Làm việc tại {profile.workplace}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <IoSchoolOutline className="text-xl" />
                <span>Học tại {profile.education}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MdOutlineFavorite className="text-xl" />
                <span>{profile.relationship}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <BsGlobe2 className="text-xl" />
                <span>Tham gia {profile.joinedDate}</span>
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
            <button className="px-6 py-4 text-gray-600 hover:bg-gray-50">
              Video
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Giới thiệu</h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-4">Ảnh</h2>
              <div className="grid grid-cols-3 gap-2">
                {/* Add photo grid here */}
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-3">
                <Avatar
                  src={profile?.avatar}
                  alt={profile.fullName}
                  size={40}
                  className="rounded-full"
                />
                <button className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-600 hover:bg-gray-200">
                  Bạn đang nghĩ gì?
                </button>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <span>🖼️</span>
                  <span>Ảnh/Video</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <span>😊</span>
                  <span>Cảm xúc</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
                  <span>📍</span>
                  <span>Check in</span>
                </button>
              </div>
            </div>

            {/* Posts will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
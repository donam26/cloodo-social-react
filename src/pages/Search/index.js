import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Drawer, Avatar, Skeleton } from "antd";
import { FaSearch, FaBars, FaUserFriends, FaImage, FaVideo, FaUsers, FaNewspaper } from "react-icons/fa";
import SideBarSearch from "../../components/Layout/Search/SideBarSearch";
import { useGetSearch, useSearchPeople, useSearchPosts, useSearchPhotos, useSearchVideos, useSearchGroups } from "../../hooks/searchHook";
import Post from "../../components/Post";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeType, setActiveType] = useState("all");
  
  // Queries
  const { data: allResults, isLoading: loadingAll } = useGetSearch(
    searchQuery,
    { enabled: activeType === 'all' }
  );
  const { data: peopleResults, isLoading: loadingPeople } = useSearchPeople(
    searchQuery,
    { enabled: activeType === 'people' }
  );
  const { data: postsResults, isLoading: loadingPosts } = useSearchPosts(
    searchQuery,
    { enabled: activeType === 'posts' }
  );
  const { data: photosResults, isLoading: loadingPhotos } = useSearchPhotos(
    searchQuery,
    { enabled: activeType === 'photos' }
  );
  const { data: videosResults, isLoading: loadingVideos } = useSearchVideos(
    searchQuery,
    { enabled: activeType === 'videos' }
  );
  const { data: groupsResults, isLoading: loadingGroups } = useSearchGroups(
    searchQuery,
    { enabled: activeType === 'groups' }
  );
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    const type = location.pathname.split('/')[2] || 'all';
    if (query) {
      setSearchQuery(query);
      console.log('Search Query:', query);
    }
    setActiveType(type);
  }, [location]);

  // Thêm console.log để debug
  console.log('All Results:', allResults);
  console.log('People Results:', peopleResults);
  console.log('Posts Results:', postsResults);

  const renderPeopleResults = () => {
    if (loadingPeople) {
      return <Skeleton active avatar paragraph={{ rows: 1 }} />;
    }

    return peopleResults?.data?.users?.items?.map(person => (
      <div key={person.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
           onClick={() => navigate(`/profile/${person.id}`)}>
        <Avatar src={person.image} size={48} />
        <div>
          <h3 className="font-semibold">{person.name}</h3>
          <p className="text-sm text-gray-500">{person.bio || 'Không có tiểu sử'}</p>
        </div>
      </div>
    ));
  };

  const renderPostResults = () => {
    if (loadingPosts) {
      return <Skeleton active paragraph={{ rows: 3 }} />;
    }

    return (
      <div className="space-y-4">
        {postsResults?.data?.posts?.items?.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  };

  const renderPhotoResults = () => {
    if (loadingPhotos) {
      return <Skeleton active paragraph={{ rows: 2 }} />;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photosResults?.data?.map(photo => (
          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  };

  const renderVideoResults = () => {
    if (loadingVideos) {
      return <Skeleton active paragraph={{ rows: 2 }} />;
    }

    return videosResults?.data?.map(video => (
      <div key={video.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="aspect-video rounded-lg overflow-hidden mb-2">
          <video src={video.url} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-500">{video.views} lượt xem</p>
      </div>
    ));
  };

  const renderGroupResults = () => {
    if (loadingGroups) {
      return <Skeleton active avatar paragraph={{ rows: 1 }} />;
    }

    return groupsResults?.data?.map(group => (
      <div key={group.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
           onClick={() => navigate(`/groups/${group.id}`)}>
        <Avatar src={group.avatar} size={48} />
        <div>
          <h3 className="font-semibold">{group.name}</h3>
          <p className="text-sm text-gray-500">{group.members} thành viên</p>
        </div>
      </div>
    ));
  };

  const renderContent = () => {
    if (!searchQuery) {
      return (
        <div className="text-center text-gray-500 py-8">
          <FaSearch className="mx-auto mb-4" size={48} />
          <p className="text-lg">Nhập từ khóa để tìm kiếm</p>
          <p className="text-sm">Bạn có thể tìm kiếm bài viết, hình ảnh, video và nhiều nội dung khác</p>
        </div>
      );
    }

    switch (activeType) {
      case 'people':
        return renderPeopleResults();
      case 'posts':
        return renderPostResults();
      case 'photos':
        return renderPhotoResults();
      case 'videos':
        return renderVideoResults();
      case 'groups':
        return renderGroupResults();
      default:
        if (loadingAll) {
          return (
            <div className="space-y-6">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              <Skeleton active avatar paragraph={{ rows: 2 }} />
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          );
        }

        if (!allResults?.data) {
          return (
            <div className="text-center text-gray-500 py-8">
              <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {/* People Section */}
            {allResults.data.users?.items?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaUserFriends className="text-blue-500" />
                    Mọi người
                  </h3>
                  <Button type="link" onClick={() => navigate(`/search/people?query=${searchQuery}`)}>
                    Xem tất cả ({allResults.data.users.total})
                  </Button>
                </div>
                <div className="space-y-4">
                  {allResults.data.users.items.slice(0, 3).map(person => (
                    <div key={person.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => navigate(`/profile/${person.id}`)}>
                      <Avatar src={person.image} size={48} />
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-gray-500">{person.bio || 'Không có tiểu sử'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {allResults.data.posts?.items?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaNewspaper className="text-blue-500" />
                    Bài viết
                  </h3>
                  <Button type="link" onClick={() => navigate(`/search/posts?query=${searchQuery}`)}>
                    Xem tất cả ({allResults.data.posts.total})
                  </Button>
                </div>
                <div className="space-y-4">
                  {allResults.data.posts.items.slice(0, 2).map(post => (
                    <Post key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Photos Section */}
            {allResults.data.photos && allResults.data.photos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaImage className="text-blue-500" />
                    Hình ảnh
                  </h3>
                  <Button type="link" onClick={() => navigate(`/search/photos?q=${searchQuery}`)}>
                    Xem tất cả
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allResults.data.photos.slice(0, 6).map(photo => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {allResults.data.videos && allResults.data.videos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaVideo className="text-blue-500" />
                    Video
                  </h3>
                  <Button type="link" onClick={() => navigate(`/search/videos?q=${searchQuery}`)}>
                    Xem tất cả
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allResults.data.videos.slice(0, 2).map(video => (
                    <div key={video.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="aspect-video rounded-lg overflow-hidden mb-2">
                        <video src={video.url} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-500">{video.views} lượt xem</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups Section */}
            {allResults.data.groups && allResults.data.groups.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FaUsers className="text-blue-500" />
                    Nhóm
                  </h3>
                  <Button type="link" onClick={() => navigate(`/search/groups?q=${searchQuery}`)}>
                    Xem tất cả
                  </Button>
                </div>
                <div className="space-y-4">
                  {allResults.data.groups.slice(0, 3).map(group => (
                    <div key={group.id} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => navigate(`/groups/${group.id}`)}>
                      <Avatar src={group.avatar} size={48} />
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.members} thành viên</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(allResults.data).every(key => !allResults.data[key]?.items?.length) && (
              <div className="text-center text-gray-500 py-8">
                <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setShowSidebar(true)}
      >
        <FaBars className="w-5 h-5" />
      </button>

      {/* Mobile sidebar drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Bộ lọc tìm kiếm</h2>
          </div>
        }
        placement="left"
        onClose={() => setShowSidebar(false)}
        open={showSidebar}
        className="md:hidden"
        width={320}
      >
        <SideBarSearch />
      </Drawer>

      <div className="bg-white rounded-xl shadow-sm">
        {/* Search Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-400" size={20} />
            <h2 className="text-xl font-semibold">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Tìm kiếm'}
            </h2>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
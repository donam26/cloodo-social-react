import { Tabs, Image } from 'antd';
import { FaImage, FaVideo } from 'react-icons/fa';

const Media = ({ photos = [], videos = [] }) => {
  const items = [
    {
      key: 'photos',
      label: (
        <span className="flex items-center gap-2">
          <FaImage />
          Ảnh
        </span>
      ),
      children: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square">
              <Image
                src={photo.url}
                alt={photo.description}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'videos',
      label: (
        <span className="flex items-center gap-2">
          <FaVideo />
          Video
        </span>
      ),
      children: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {videos.map((video, index) => (
            <div key={index} className="aspect-video">
              <video
                src={video.url}
                controls
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs items={items} />
    </div>
  );
};

export default Media; 
import { Button } from 'antd';
import { useState } from 'react';
import CreatePostModal from '../../Post/CreateModal';
import Post from '../../Post';

const Discussion = ({ group, posts }) => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  return (
    <>
      <CreatePostModal
        open={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        groupId={group?.id}
      />

      <div className="space-y-4 mt-4">
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Discussion; 
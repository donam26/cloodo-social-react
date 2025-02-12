import { memo, lazy, Suspense } from 'react';
import { Spin } from 'antd';

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const EmojiPickerPopover = memo(({ onEmojiClick }) => {
    return (
        <div className="emoji-picker-container">
            <Suspense fallback={<div className="p-4 flex justify-center"><Spin /></div>}>
                <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    lazyLoadEmojis={true}
                    searchDisabled={false}
                    skinTonesDisabled={true}
                    previewConfig={{
                        showPreview: false
                    }}
                    height={350}
                    width={300}
                />
            </Suspense>
        </div>
    );
});

EmojiPickerPopover.displayName = 'EmojiPickerPopover';

export default EmojiPickerPopover; 
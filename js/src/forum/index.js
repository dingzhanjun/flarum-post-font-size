import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import Button from 'flarum/common/components/Button';
import Post from 'flarum/forum/components/Post';
import CommentPost from 'flarum/forum/components/CommentPost';
import PostUser from 'flarum/forum/components/PostUser';

const STORAGE_KEY = 'freehuaren-post-font-size';
const SIZES = ['small', 'medium', 'large'];

function getSavedSize() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return SIZES.includes(saved) ? saved : 'medium';
}

function applySize(size) {
  const root = document.documentElement;

  SIZES.forEach((item) => {
    root.classList.remove(`FreeHuaren-post-font-${item}`);
  });

  root.classList.add(`FreeHuaren-post-font-${size}`);
  localStorage.setItem(STORAGE_KEY, size);
}

function FontSizeControls() {
  const current = getSavedSize();

  return (
    <div className="FreeHuarenFontSizeControl" role="group" aria-label="帖子字号">
      <span className="FreeHuarenFontSizeControl-label">字号</span>
      {[
        ['small', '小'],
        ['medium', '中'],
        ['large', '大'],
      ].map(([size, label]) => (
        <Button
          className={`Button Button--link FreeHuarenFontSizeControl-button ${current === size ? 'is-active' : ''}`}
          onclick={() => {
            applySize(size);
            m.redraw();
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

app.initializers.add('flarum-post-font-size', () => {
  applySize(getSavedSize());

  extend(PostUser.prototype, 'view', function (vnode) {
    if (!vnode || !vnode.children) return;
    console.log(vnode)
    if (Array.isArray(vnode.children)) {
      vnode.children.push(<FontSizeControls />);
    }
    // items.add('flarum-post-font-size', <FontSizeControls />, 5);
  });
});

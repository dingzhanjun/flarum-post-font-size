import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';

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

const FontSizeControls = {
  view() {
    const current = getSavedSize();

    return (
      <div className="FreeHuarenFontSizeControl" role="group" aria-label="帖子字号">
        {[
          ['small', 'A-'],
          ['medium', 'A'],
          ['large', 'A+'],
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
  },
};

app.initializers.add('flarum-post-font-size', () => {
  applySize(getSavedSize());

  extend(CommentPost.prototype, 'oninit', function () {
    this.subtree.check(() => getSavedSize());
  });

  extend(CommentPost.prototype, 'headerItems', function (items) {
    items.add('fontSize', <FontSizeControls />);
  });
});

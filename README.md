# FreeHuaren Post Font Size

Flarum 1.8 extension that adds 小 / 中 / 大 reading-size controls on discussion pages.

- 小: 15px
- 中: 17px (default)
- 大: 20px
- Only affects `.Post-body`
- Preference is stored in browser `localStorage`
- No database changes

## Install

Place the extension at:

`/app/packages/freehuaren-post-font-size`

Build frontend assets from the extension `js` directory using a temporary Node container:

```bash
cd /home/admin/new-hr-forum/flarum/packages/freehuaren-post-font-size/js
docker run --rm \
  -v "$PWD:/app" \
  -w /app \
  node:22-alpine \
  sh -c "npm install && npm run build"
```

Register once with Composer:

```bash
cd /app
composer config repositories.freehuaren-post-font-size path packages/freehuaren-post-font-size
composer require freehuaren/post-font-size:@dev
php flarum cache:clear
```

Register and install from the Flarum root using container because php container does not jave composer(only once):

```bash
cd /home/admin/new-hr-forum
docker run --rm   -v "$PWD/flarum:/app"   -w /app   composer:latest   composer config repositories.freehuaren-post-font-size   path packages/freehuaren-post-font-size
docker run --rm   -v "$PWD/flarum:/app"   -w /app   composer:latest   composer require freehuaren/freehuaren-post-font-size:@dev
```

Then enable **FreeHuaren Post Font Size** in Flarum Admin > Extensions.

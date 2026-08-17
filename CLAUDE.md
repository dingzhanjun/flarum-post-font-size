# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Flarum 1.8 forum extension (`freehuaren/flarum-post-font-size`) that adds 小/中/大 (small/medium/large)
reading font-size controls to discussion posts. It is frontend-only: no PHP backend logic and no database
changes. The composer.json declares a `src/` PSR-4 autoload root for `FreeHuaren\PostFontSize\`, but no PHP
classes exist yet — `extend.php` only registers the compiled JS and the LESS file.

## Architecture

- `extend.php` — the extension's entry point read by Flarum. Registers `js/dist/forum.js` (compiled) and
  `less/forum.less` for the `forum` frontend via `Extend\Frontend`.
- `js/src/forum/index.js` — all frontend logic:
  - Extends `CommentPost.prototype.headerItems` (via Flarum's `extend` helper) to add a `FontSizeControls`
    mithril component as an item in the post header's `ItemList` — the standard Flarum extension point for
    this, alongside `PostUser`/`PostMeta`/`PostEdited`. (An earlier version walked the rendered vnode tree
    from `Post.prototype.view` looking for a `.Post-header` class; that approach was broken because
    `CommentPost.content()` returns header+body as a plain array nested inside `Post.viewItems()`'s output,
    which `extend()` hands you *before* Mithril normalizes nested arrays into vnodes — so a naive
    `vnode.children` walk can never reach it. Prefer extending the relevant `*Items()` ItemList method over
    walking rendered vnodes.)
  - Reading-size preference (`small`/`medium`/`large`) is stored client-side in `localStorage` under
    key `freehuaren-post-font-size` — no server round-trip.
  - Applies the size by toggling a `FreeHuaren-post-font-{size}` class on `<html>`; actual font sizing is
    pure CSS (see `less/forum.less`), scoped to `.Post-body` only.
- `js/forum.js` — re-exports `./src/forum` (`export * from './src/forum';`); this is the webpack entry point
  referenced implicitly by `flarum-webpack-config`.
- `less/forum.less` — defines the three font-size rules and styling for the `.FreeHuarenFontSizeControl`
  button group.
- `js/dist/forum.js` is the build artifact `extend.php` actually loads. It is **not** checked into git and
  must be produced by running the build (see below) before the extension will work in a real Flarum instance.

## Build / development commands

All frontend tooling lives under `js/`.

```bash
cd js
npm install
npm run build   # production build -> js/dist/forum.js (required for extend.php to find anything)
npm run dev      # webpack --mode development --watch
```

There is no configured lint or test command for either the JS or PHP side of this repo.

The project has no local PHP/Composer/Flarum runtime — it's built to be dropped into an existing Flarum
installation's `packages/` directory and installed there via Composer path repository, e.g.:

```bash
composer config repositories.flarum-post-font-size path packages/flarum-post-font-size
composer require freehuaren/flarum-post-font-size:@dev
php flarum cache:clear
```

Because there's no local Flarum app to run, verifying a change means: build the JS, and reason about
correctness by reading Flarum core's mithril component structure (`Post`, `DiscussionPage`, etc.) rather
than by exercising it in a browser from this repo.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` (or manual dispatch): it SSHes into the deploy
host, `git reset --hard origin/main`s the extension's checkout under the target Flarum install's
`packages/flarum-post-font-size`, rebuilds `js/dist` inside a `node:22-alpine` container, and clears Flarum's
cache inside the running Flarum container. There's no CI test/lint gate — a push to `main` deploys directly.

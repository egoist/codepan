# CodePan

[![CircleCI](https://circleci.com/gh/egoist/codepan/tree/master.svg?style=shield&circle-token=e811a08d6464123dd65d2dcd52f62806bf9e37fc)](https://circleci.com/gh/egoist/codepan/tree/master) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

Play with JS/CSS/HTML so simple it hurts, the web playground that works offline.

## Why

> Aren't there already JSBin/CodePen/JSFiddle?

Yep! So why not one more? And this one could work **offline** for you!

How? `codepan` is just a single page app with **no-backend**! Built with Webpack and Vue.js, and the offline feature is provided by [offline-plugin](https://github.com/NekR/offline-plugin).

## Browser Support

We aim to support latest version of Chrome, Safari, Firefox and Microsoft Edge.

## Development

Clone this repository and install dependencies by running `yarn`, then:

- `yarn dev`: Run in development mode
- `yarn build`: Build in production mode
- `yarn lint`: Run eslint

## Set pans from the url GET parameters

You can use url GET param:

- `pans=html,css,js,console,output`

First specified pan will open,
their order is determined by specified,
you can also open multiple instances of same tab (idk why you would)

- `menu=false`

Any other value or not specifying it will show the menu header/side bar

- `layout=row|column`

Defaults to column layout

## License

MIT &copy; [EGOIST](https://github.com/egoist)

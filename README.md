# CodePan

[![CircleCI](https://circleci.com/gh/Prozi/codepan/tree/master.svg?style=shield)](https://circleci.com/gh/Prozi/codepan/tree/master) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

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

Sets types of visible open pans, any number is ok

- `layout=column|row`

Sets the desired layout of open pans

- `headless=false|true`

Doesnt show ads, menu or pan header titles

## License

MIT

v.0.1.x &copy; [EGOIST](https://github.com/egoist)
v.0.2.x &copy; [PROZI](https://github.com/Prozi)

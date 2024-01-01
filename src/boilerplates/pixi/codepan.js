const sprite = createSprite();
const app = createApp();

function createSprite() {
  const bunny = "https://pixijs.io/examples/examples/assets/bunny.png";
  const sprite = PIXI.Sprite.from(bunny);
  sprite.anchor.set(0.5);
  sprite.scale.set(3);
  return sprite;
}

function createApp() {
  return new PIXI.Tiled.FullscreenApplication(tick, { transparent: true });
}

function tick(time) {
  sprite.position.set(innerWidth / 2, innerHeight / 2);
  sprite.rotation = time / 100;
}

app.stage.addChild(sprite);

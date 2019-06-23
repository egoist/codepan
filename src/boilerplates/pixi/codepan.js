const sprite = createSprite()
const app = createApp()

function createSprite() {
  const sprite = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png')
  sprite.anchor.set(0.5)
  return sprite
}

function createApp() {
  return new PIXI.Tiled.FullscreenApplication(tick)
}

function tick(time) {
  sprite.position.set(innerWidth / 2, innerHeight / 2)
  sprite.rotation = time / 100
}

app.stage.addChild(sprite)

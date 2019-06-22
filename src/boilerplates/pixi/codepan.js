window.app = new window['pixi-tiled-utils'].TiledApplication()

const json = 'https://www.vikingsvillage.io/game/assets/json/island_kible_22.json'
const tileset = 'https://www.vikingsvillage.io/game/assets/img/Viking3.png'
const loader = new PIXI.Loader()

loader.add('resource', tileset).load((loader, { resource }) => {

  window.app.createTiles({
    tilewidth: 42,
    tileheight: 42,
    offset: 1,
    texture: resource.texture
  })

  window.app.createWorld(json, tileset, 42, ['Domek', 'Kibel', 'Bees', 'Thor', 'Meat'], ['Spawn']).then(() => {
    console.log('game ready')
  })
})

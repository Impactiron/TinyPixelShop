import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'
import { ANALYTICS } from './utils/analytics'
import { OrderUI } from './ui/orderPanel'

const width = 320, height = 180, scale = 3

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, parent: 'game', backgroundColor: '#22212b', pixelArt: true, roundPixels: true,
  scale: { width, height, mode: Phaser.Scale.NONE, zoom: scale },
  physics: { default: 'arcade', arcade: { debug: false, gravity: { y: 0 } } },
  scene: [BootScene, GameScene, UIScene]
}

window.addEventListener('load', ()=>{
  new Phaser.Game(config)
  ANALYTICS.initConsentUI()
  OrderUI.init() // wire DOM for ordering
})

import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { UIScene } from './scenes/UIScene'
import { ANALYTICS } from './utils/analytics'

const width = 320
const height = 180
const scale = 3

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#22212b',
  pixelArt: true,
  roundPixels: true,
  scale: { width, height, mode: Phaser.Scale.NONE, zoom: scale },
  physics: { default: 'arcade', arcade: { debug: false, gravity: { y: 0 } } },
  scene: [BootScene, GameScene, UIScene]
}

window.addEventListener('load', () => {
  const _ = new Phaser.Game(gameConfig)
  ANALYTICS.initConsentUI()
})

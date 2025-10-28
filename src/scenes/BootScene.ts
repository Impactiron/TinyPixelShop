import Phaser from 'phaser'
export class BootScene extends Phaser.Scene {
  constructor(){ super('boot') }
  preload(){
    const g = this.make.graphics({x:0,y:0,add:false})
    g.fillStyle(0xffffff,1).fillRect(0,0,8,8)
    g.generateTexture('px',8,8)
  }
  create(){ this.scene.start('game'); this.scene.launch('ui') }
}

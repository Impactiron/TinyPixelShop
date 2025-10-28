import Phaser from 'phaser'
import { GameState } from '../state/GameState'
import { CustomerSystem } from '../systems/customers'
import { ECON } from '../systems/economy'

const TILE=16, MAP_W=32, MAP_H=18

export class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keyE!: Phaser.Input.Keyboard.Key
  player!: Phaser.GameObjects.Rectangle
  grid:number[][]=[]
  customers!: CustomerSystem

  constructor(){ super('game') }

  create(){
    GameState.load()
    // grid map
    for(let y=0;y<MAP_H;y++){
      const row:number[]=[]
      for(let x=0;x<MAP_W;x++) row.push((y===0||y===MAP_H-1||x===0||x===MAP_W-1)?1:0)
      this.grid.push(row)
    }
    this.grid[3][27]=2; // register
    this.grid[8][8]=3;  // shelf
    // draw
    for(let y=0;y<MAP_H;y++){
      for(let x=0;x<MAP_W;x++){
        const t=this.grid[y][x]
        const color = t===1?0x44415a:((x+y)%2===0?0x2b283d:0x2e2b41)
        this.add.image(x*TILE+8,y*TILE+8,'px').setTint(color).setDisplaySize(TILE,TILE)
        if(t===2) this.add.image(x*TILE+8,y*TILE+8,'px').setTint(0xd9b28a).setDisplaySize(TILE,TILE)
        if(t===3) this.add.image(x*TILE+8,y*TILE+8,'px').setTint(0x7aa55a).setDisplaySize(TILE,TILE)
      }
    }
    // player
    this.player = this.add.rectangle(4*TILE+8,8*TILE+8,TILE,TILE,0xffd86b)
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keyE = this.input.keyboard!.addKey('E')
    // systems
    this.customers = new CustomerSystem(this, this.grid)
    // loop
    this.time.addEvent({ loop:true, delay:1000/30, callback: ()=> this.tick(1/30) })
  }

  tile(x:number,y:number){ return {tx:Math.floor(x/TILE), ty:Math.floor(y/TILE)} }

  tick(dt:number){
    // 48x speed => ~15 real min per day
    GameState.data.timeMin += 48 * dt
    if (GameState.data.timeMin >= 20*60){
      GameState.data.day += 1; GameState.data.timeMin = 8*60; 
      // daily costs
      ECON.chargeDailyCosts(); GameState.save()
    }
    // move
    const spd=90; let vx=0, vy=0
    if(this.cursors.left?.isDown) vx--; if(this.cursors.right?.isDown) vx++
    if(this.cursors.up?.isDown) vy--; if(this.cursors.down?.isDown) vy++
    const len=Math.hypot(vx,vy)||1
    this.player.x += (vx/len)*spd*dt; this.player.y += (vy/len)*spd*dt
    // interact
    if(Phaser.Input.Keyboard.JustDown(this.keyE)){
      const {tx,ty}=this.tile(this.player.x, this.player.y)
      for(let oy=-1;oy<=1;oy++) for(let ox=-1;ox<=1;ox++){
        const t=this.grid[ty+oy]?.[tx+ox]
        if(t===3){ GameState.data.stock = Math.min(99, GameState.data.stock+5) }
      }
    }
    // customers
    this.customers.update(dt)
  }
}

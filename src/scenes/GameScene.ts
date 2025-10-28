import Phaser from 'phaser'
import { GameState } from '../state/GameState'
import { CustomerSystem } from '../systems/customers'
import { ECON } from '../systems/economy'
import { ITEMS } from '../data/items'
import { OrderUI } from '../ui/orderPanel'

const TILE=16, MAP_W=32, MAP_H=18

export class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  keyE!: Phaser.Input.Keyboard.Key
  keyB!: Phaser.Input.Keyboard.Key
  player!: Phaser.GameObjects.Rectangle
  grid:number[][]=[]
  customers!: CustomerSystem

  constructor(){ super('game') }

  create(){
    GameState.load()
    // init stock/vk from items if first run
    if (Object.keys(GameState.data.stock).length===0){
      for (const it of ITEMS){ GameState.data.stock[it.id]=0; GameState.data.vk[it.id]=it.vk }
    }

    // map
    for(let y=0;y<MAP_H;y++){
      const row:number[]=[]
      for(let x=0;x<MAP_W;x++) row.push((y===0||y===MAP_H-1||x===0||x===MAP_W-1)?1:0)
      this.grid.push(row)
    }
    this.grid[3][27]=2; this.grid[8][8]=3;
    for(let y=0;y<MAP_H;y++){
      for(let x=0;x<MAP_W;x++){
        const t=this.grid[y][x]
        const color=t===1?0x44415a:((x+y)%2===0?0x2b283d:0x2e2b41)
        this.add.image(x*TILE+8,y*TILE+8,'px').setTint(color).setDisplaySize(TILE,TILE)
        if(t===2) this.add.image(x*TILE+8,y*TILE+8,'px').setTint(0xd9b28a).setDisplaySize(TILE,TILE)
        if(t===3) this.add.image(x*TILE+8,y*TILE+8,'px').setTint(0x7aa55a).setDisplaySize(TILE,TILE)
      }
    }

    // player
    this.player = this.add.rectangle(4*TILE+8,8*TILE+8,TILE,TILE,0xffd86b)
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keyE = this.input.keyboard!.addKey('E')
    this.keyB = this.input.keyboard!.addKey('B')

    this.customers = new CustomerSystem(this, this.grid)

    this.time.addEvent({ loop:true, delay:1000/30, callback: ()=> this.tick(1/30) })

    // wire order UI open
    this.input.keyboard!.on('keydown-B', ()=> OrderUI.open())
    document.getElementById('order-btn')?.addEventListener('click', ()=> OrderUI.open())
  }

  tick(dt:number){
    // time: ~15 min per real minute => 48x
    GameState.data.timeMin += 48*dt
    if (GameState.data.timeMin >= 24*60){ GameState.data.timeMin %= (24*60) } // keep sane
    // deliver next-day arrivals at 08:00
    if (Math.floor(GameState.data.timeMin)===8*60){ this.handleArrivals() }

    // day end at 20:00 → next day + costs
    if (GameState.data.timeMin >= 20*60 && GameState.data.timeMin < 20*60 + 1){
      // once per threshold: naive guard by saving
      ECON.chargeDailyCosts(); GameState.data.day += 1; GameState.save()
    }

    // movement
    const spd=90; let vx=0, vy=0
    if(this.cursors.left?.isDown) vx--; if(this.cursors.right?.isDown) vx++
    if(this.cursors.up?.isDown) vy--; if(this.cursors.down?.isDown) vy++
    const len=Math.hypot(vx,vy)||1
    this.player.x += (vx/len)*spd*dt; this.player.y += (vy/len)*spd*dt

    // interact
    if (Phaser.Input.Keyboard.JustDown(this.keyE)){
      const tx=Math.floor(this.player.x/16), ty=Math.floor(this.player.y/16)
      for(let oy=-1;oy<=1;oy++) for(let ox=-1;ox<=1;ox++){
        const t=this.grid[ty+oy]?.[tx+ox]
        if(t===3){ // restock cheat (placeholder dev)
          const any = Object.keys(GameState.data.stock)[0]
          if(any) GameState.data.stock[any] = Math.min(GameState.data.cap, GameState.data.stock[any]+5)
        }
      }
    }
  }

  handleArrivals(){
    const today = GameState.data.day
    let changed=false
    for (const p of GameState.data.pending){
      if (p.arrivalDay === today){
        GameState.data.stock[p.id] = (GameState.data.stock[p.id]||0) + p.qty
        changed = true
      }
    }
    if (changed){
      GameState.data.pending = GameState.data.pending.filter(p=>p.arrivalDay !== today)
      GameState.save()
    }
  }
}

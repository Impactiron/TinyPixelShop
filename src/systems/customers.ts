import Phaser from 'phaser'
import { GameState } from '../state/GameState'
type C = { x:number,y:number,tx:number,ty:number,phase:'enter'|'browse'|'queue'|'exit'|'gone',has:boolean,patience:number,rect:Phaser.GameObjects.Rectangle }
const TILE=16
export class CustomerSystem {
  scene: Phaser.Scene; grid:number[][]; list:C[]=[]; spawnTimer=0
  constructor(scene:Phaser.Scene, grid:number[][]){ this.scene=scene; this.grid=grid }
  spawn(){ const rect=this.scene.add.rectangle(1*TILE+8,9*TILE+8,TILE,TILE,0x9ad8ff); this.list.push({x:1,y:9,tx:8,ty:9,phase:'enter',has:false,patience:45*60,rect}); GameState.data.customers=this.list.length }
  update(dt:number){
    this.spawnTimer -= dt; if(this.spawnTimer<=0){ if(Math.random()<0.9) this.spawn(); this.spawnTimer = 2 + Math.random()*2 }
    for(const c of this.list){
      c.patience -= dt
      if(c.phase==='enter'){ c.tx=8;c.ty=9; this.step(c); if(c.x===c.tx&&c.y===c.ty) c.phase='browse' }
      else if(c.phase==='browse'){
        // find any stocked item (simplified: use total stock sum)
        const total = Object.values(GameState.data.stock).reduce((a,b)=>a+b,0)
        if(total>0){ c.has=true; this.takeAnyItem(); c.phase='queue'; c.tx=27;c.ty=3 } else { c.phase='queue'; c.tx=27;c.ty=3 }
      }
      else if(c.phase==='queue'){ this.step(c); if(c.x===27&&c.y===3){ /* price depends on item; MVP fixed 5€ */ GameState.data.cash += 5; c.phase='exit'; c.tx=1; c.ty=9 } }
      else if(c.phase==='exit'){ this.step(c); if(c.x===1&&c.y===9) c.phase='gone' }
      c.rect.x=c.x*TILE+8; c.rect.y=c.y*TILE+8; c.rect.fillColor=c.has?0x9ad8ff:0xc28bff
    }
    this.list = this.list.filter(c=>c.phase!=='gone' && c.patience>0)
    GameState.data.customers=this.list.length
  }
  takeAnyItem(){
    for (const k of Object.keys(GameState.data.stock)){
      if (GameState.data.stock[k]>0){ GameState.data.stock[k]-=1; return }
    }
  }
  step(c:C){ const dx=Math.sign(c.tx-c.x), dy=Math.sign(c.ty-c.y); const nx=c.x+dx, ny=c.y+dy; const t=this.grid[ny]?.[nx]; if(t===0||t===2||t===3){ c.x=nx;c.y=ny } }
}

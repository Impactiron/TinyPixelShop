import Phaser from 'phaser'
import { GameState } from '../state/GameState'
import { fmtTime } from '../utils/time'
export class UIScene extends Phaser.Scene {
  cashEl!:HTMLElement; dayEl!:HTMLElement; clockEl!:HTMLElement; stockEl!:HTMLElement; capEl!:HTMLElement; custEl!:HTMLElement; stockBadge!:HTMLElement;
  create(){
    this.cashEl = document.getElementById('cash')!
    this.dayEl = document.getElementById('day')!
    this.clockEl = document.getElementById('clock')!
    this.stockEl = document.getElementById('stock')!
    this.capEl = document.getElementById('cap')!
    this.custEl = document.getElementById('cust')!
    this.stockBadge = document.getElementById('stock-badge')!
    this.capEl.textContent = GameState.data.cap.toString()
    this.time.addEvent({ loop:true, delay:250, callback: ()=>{
      const s = GameState.data
      const total = Object.values(s.stock).reduce((a,b)=>a+b,0)
      this.cashEl.textContent = Math.round(s.cash).toString()
      this.dayEl.textContent = s.day.toString()
      this.clockEl.textContent = fmtTime(s.timeMin)
      this.stockEl.textContent = total.toString()
      this.custEl.textContent = s.customers.toString()
      // warn if any article below its min
      const low = total>0 && Object.values(s.stock).some(v=>v<5)
      this.stockBadge.classList.toggle('warn', low)
    }})
  }
}

import Phaser from 'phaser'
import { GameState } from '../state/GameState'
import { fmtTime } from '../utils/time'
export class UIScene extends Phaser.Scene {
  cashEl!:HTMLElement; dayEl!:HTMLElement; clockEl!:HTMLElement; stockEl!:HTMLElement; custEl!:HTMLElement;
  constructor(){ super('ui') }
  create(){
    this.cashEl = document.getElementById('cash')!
    this.dayEl = document.getElementById('day')!
    this.clockEl = document.getElementById('clock')!
    this.stockEl = document.getElementById('stock')!
    this.custEl = document.getElementById('cust')!
    this.time.addEvent({ loop:true, delay:250, callback: ()=>{
      const s = GameState.data
      this.cashEl.textContent = Math.round(s.cash).toString()
      this.dayEl.textContent = s.day.toString()
      this.clockEl.textContent = fmtTime(s.timeMin)
      this.stockEl.textContent = s.stock.toString()
      this.custEl.textContent = s.customers.toString()
    }})
  }
}

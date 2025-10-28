import Phaser from 'phaser'
import { GameState } from '../state/GameState'
import { fmtTime } from '../utils/time'

export class UIScene extends Phaser.Scene {
  cashEl?:HTMLElement; dayEl?:HTMLElement; clockEl?:HTMLElement; stockEl?:HTMLElement; capEl?:HTMLElement; custEl?:HTMLElement; stockBadge?:HTMLElement;

  create(){
    // DOM refs (können bei GH Pages später laden – daher optional)
    this.cashEl = document.getElementById('cash') || undefined
    this.dayEl = document.getElementById('day') || undefined
    this.clockEl = document.getElementById('clock') || undefined
    this.stockEl = document.getElementById('stock') || undefined
    this.capEl = document.getElementById('cap') || undefined
    this.custEl = document.getElementById('cust') || undefined
    this.stockBadge = document.getElementById('stock-badge') || undefined
    if (this.capEl) this.capEl.textContent = GameState.data.cap.toString()

    const safeSet = (el:HTMLElement|undefined, val:string)=>{ if(el) el.textContent = val }

    // Periodisches Update
    this.time.addEvent({
      loop:true, delay:250, callback: ()=>{
        const s = GameState.data
        const total = Object.values(s.stock).reduce((a,b)=>a+b,0)
        safeSet(this.cashEl, String(Math.round(s.cash)))
        safeSet(this.dayEl, String(s.day))
        safeSet(this.clockEl, fmtTime(s.timeMin))
        safeSet(this.stockEl, String(total))
        safeSet(this.custEl, String(s.customers))
        // Warnfarbe
        if (this.stockBadge){
          const low = Object.values(s.stock).some(v=>v < 5)
          this.stockBadge.classList.toggle('warn', low)
        }
      }
    })

    // Sofort-Refresh, wenn die Order-UI speichert
    document.addEventListener('tsps:stateChanged', ()=> {
      const s = GameState.data
      const total = Object.values(s.stock).reduce((a,b)=>a+b,0)
      safeSet(this.cashEl, String(Math.round(s.cash)))
      safeSet(this.stockEl, String(total))
    })
  }
}

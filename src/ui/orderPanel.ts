import { GameState } from '../state/GameState'
import { ITEMS } from '../data/items'

type RowRefs = { qty: HTMLInputElement, vk: HTMLInputElement, ship: HTMLSelectElement, costCell: HTMLTableCellElement }

export const OrderUI = {
  modal: null as HTMLDivElement | null,
  tableBody: null as HTMLTableSectionElement | null,
  sumCell: null as HTMLTableCellElement | null,
  rows: new Map<string, RowRefs>(),
  init(){
    this.modal = document.getElementById('order-modal') as HTMLDivElement
    this.tableBody = this.modal.querySelector('tbody') as HTMLTableSectionElement
    this.sumCell = document.getElementById('sum') as HTMLTableCellElement
    document.getElementById('order-btn')?.addEventListener('click', ()=> this.open())
    document.getElementById('order-cancel')?.addEventListener('click', ()=> this.close())
    document.getElementById('order-confirm')?.addEventListener('click', ()=> this.confirm())
  },
  open(){
    this.render()
    this.modal!.style.display = 'flex'
  },
  close(){
    this.modal!.style.display = 'none'
  },
  render(){
    this.rows.clear()
    this.tableBody!.innerHTML = ''
    for (const it of ITEMS){
      const tr = document.createElement('tr')
      const stock = GameState.data.stock[it.id] ?? 0
      const vk = GameState.data.vk[it.id] ?? it.vk
      tr.innerHTML = `
        <td>${it.name}</td>
        <td>${it.cat}</td>
        <td class="right">${it.ek.toFixed(2)} €</td>
        <td class="right"><input type="number" step="0.1" value="${vk.toFixed(1)}"></td>
        <td class="right">${stock}</td>
        <td>${it.min}</td>
        <td>
          <select>
            <option value="deferred">+1 Tag</option>
            <option value="instant">Sofort (+100%)</option>
          </select>
        </td>
        <td><input type="number" min="0" step="1" value="0"></td>
        <td class="right">0 €</td>
      `
      const cells = tr.querySelectorAll('td')
      const refs: RowRefs = {
        qty: cells[7].querySelector('input')!,
        vk: cells[3].querySelector('input')!,
        ship: cells[6].querySelector('select')!,
        costCell: cells[8] as HTMLTableCellElement
      }
      // events recalc
      const recalc = ()=> this.updateRowCost(it.id, it.ek)
      refs.qty.addEventListener('input', recalc)
      refs.ship.addEventListener('change', recalc)
      refs.vk.addEventListener('input', ()=>{
        const v = Math.max(0, Number(refs.vk.value)||0)
        GameState.data.vk[it.id] = v
      })
      this.rows.set(it.id, refs)
      this.tableBody!.appendChild(tr)
    }
    this.updateSum()
  },
  updateRowCost(id:string, ek:number){
    const r = this.rows.get(id)!
    const qty = Math.max(0, Math.floor(Number(r.qty.value)||0))
    const factor = r.ship.value==='instant' ? 2 : 1
    const cost = qty * ek * factor
    r.costCell.textContent = `${cost.toFixed(2)} €`
    this.updateSum()
  },
  updateSum(){
    let sum = 0, instock = 0
    for (const id of this.rows.keys()){
      const r = this.rows.get(id)!
      const qty = Math.max(0, Math.floor(Number(r.qty.value)||0))
      const ek = (ITEMS.find(i=>i.id===id)!).ek
      const factor = r.ship.value==='instant' ? 2 : 1
      sum += qty * ek * factor
      instock += qty * (r.ship.value==='instant' ? 1 : 0) // only instant counts now for capacity check
    }
    // capacity guard
    const current = Object.values(GameState.data.stock).reduce((a,b)=>a+b,0)
    const cap = GameState.data.cap
    if (current + instock > cap){
      this.sumCell!.textContent = `Kapazität überschritten! (${current+instock}/${cap})`
      this.sumCell!.style.color = '#ff6b6b'
    } else {
      this.sumCell!.textContent = `${sum.toFixed(2)} €`
      this.sumCell!.style.color = ''
    }
  },
  confirm(){
    // capacity recheck + cash check
    let sum = 0, willInstant = 0
    const orders: {id:string, qty:number, ship:'instant'|'deferred', cost:number}[] = []
    for (const it of ITEMS){
      const r = this.rows.get(it.id)!
      const qty = Math.max(0, Math.floor(Number(r.qty.value)||0))
      if (!qty) continue
      const factor = r.ship.value==='instant' ? 2 : 1
      const cost = qty * it.ek * factor
      sum += cost
      if (r.ship.value==='instant') willInstant += qty
      orders.push({ id: it.id, qty, ship: r.ship.value as any, cost })
    }
    const current = Object.values(GameState.data.stock).reduce((a,b)=>a+b,0)
    if (current + willInstant > GameState.data.cap){ alert('Kapazität überschritten. Verringere Sofort-Mengen.'); return }
    if (GameState.data.cash < sum){ alert('Nicht genug Geld für diese Bestellung.'); return }

    // apply
    GameState.data.cash -= sum
    const today = GameState.data.day
    for (const o of orders){
      if (o.ship==='instant'){
        GameState.data.stock[o.id] = (GameState.data.stock[o.id]||0) + o.qty
      } else {
        GameState.data.pending.push({ id:o.id, qty:o.qty, arrivalDay: today+1, cost:o.cost })
      }
    }
GameState.save()
document.dispatchEvent(new CustomEvent('tsps:stateChanged'))  // HUD sofort aktualisieren
this.close()
  }
}

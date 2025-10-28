import type { Item } from '../data/items'
const KEY='tsps-save-v011'
export type Pending = { id:string, qty:number, arrivalDay:number, cost:number }
export type SaveData = {
  cash:number; stock: Record<string, number>; day:number; timeMin:number; customers:number;
  cap:number; pending: Pending[]; vk: Record<string, number>;
}
export const GameState = {
  data: { cash:1500, stock:{}, day:1, timeMin:8*60, customers:0, cap:100, pending:[], vk:{} } as SaveData,
  load(){
    const raw = localStorage.getItem(KEY)
    if (raw){ try { this.data = { ...this.data, ...JSON.parse(raw) } } catch{} }
  },
  save(){ localStorage.setItem(KEY, JSON.stringify(this.data)) },
  reset(){ localStorage.removeItem(KEY); location.reload() }
}

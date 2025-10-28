export type SaveData = { cash:number, stock:number, day:number, timeMin:number, customers:number }
const KEY='tsps-save-v010'
export const GameState = {
  data: { cash:1500, stock:10, day:1, timeMin:8*60, customers:0 } as SaveData,
  load(){ const raw=localStorage.getItem(KEY); if(raw){ try{ this.data = { ...this.data, ...JSON.parse(raw) } }catch{} } },
  save(){ localStorage.setItem(KEY, JSON.stringify(this.data)) },
  reset(){ localStorage.removeItem(KEY); location.reload() }
}

import { GameState } from '../state/GameState'
export const ECON = {
  dailyCosts(){ return 50 + 15 }, // placeholder; later dynamic by size/power/staff
  chargeDailyCosts(){ GameState.data.cash -= this.dailyCosts() },
  canAfford(amount:number){ return GameState.data.cash >= amount },
  pay(amount:number){ GameState.data.cash -= amount }
}

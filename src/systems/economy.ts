import { GameState } from '../state/GameState'
const COSTS = { baseRent: 50, powerPerDay: 15 }
export const ECON = {
  chargeDailyCosts(){ GameState.data.cash -= (COSTS.baseRent + COSTS.powerPerDay) },
  sellItem(price:number){ GameState.data.cash += price }
}

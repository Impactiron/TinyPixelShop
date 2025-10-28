export type Item = { id:string, name:string, cat:'Snacks'|'Drinks'|'Hygiene'|'Haushalt', ek:number, vk:number, min:number }
export const ITEMS: Item[] = [
  { id:'snack_chips', name:'Kartoffelchips', cat:'Snacks', ek:1.0, vk:2.5, min:5 },
  { id:'snack_bar', name:'Müsliriegel', cat:'Snacks', ek:0.6, vk:1.9, min:5 },
  { id:'snack_cookies', name:'Kekse', cat:'Snacks', ek:0.9, vk:2.2, min:5 },
  { id:'drink_water', name:'Wasser 0,5L', cat:'Drinks', ek:0.2, vk:1.0, min:5 },
  { id:'drink_cola', name:'Cola 0,33L', cat:'Drinks', ek:0.5, vk:1.8, min:5 },
  { id:'drink_juice', name:'Saft 0,5L', cat:'Drinks', ek:0.7, vk:2.0, min:5 },
  { id:'hyg_soapp', name:'Flüssigseife', cat:'Hygiene', ek:1.2, vk:3.5, min:3 },
  { id:'hyg_paper', name:'Taschentücher', cat:'Hygiene', ek:0.5, vk:1.5, min:4 },
  { id:'hyg_tooth', name:'Zahnpasta', cat:'Hygiene', ek:1.1, vk:3.0, min:3 },
  { id:'hh_sponge', name:'Schwamm', cat:'Haushalt', ek:0.4, vk:1.2, min:4 },
  { id:'hh_bag', name:'Müllbeutel', cat:'Haushalt', ek:0.8, vk:2.2, min:4 },
  { id:'hh_light', name:'LED Lampe', cat:'Haushalt', ek:2.5, vk:5.0, min:2 },
]
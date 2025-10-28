export const ANALYTICS = {
  enabled:false,
  initConsentUI(){
    const key='tsps-telemetry'
    const saved=localStorage.getItem(key)
    const box=document.getElementById('consent') as HTMLDivElement
    if(!saved){
      box.style.display='block'
      document.getElementById('consent-yes')!.addEventListener('click', ()=>{ localStorage.setItem(key,'yes'); this.enabled=true; box.style.display='none'; this.event('consent','yes') })
      document.getElementById('consent-no')!.addEventListener('click', ()=>{ localStorage.setItem(key,'no'); this.enabled=false; box.style.display='none'; this.event('consent','no') })
    } else { this.enabled = saved==='yes' }
  },
  event(type:string, detail:string){ if(!this.enabled) return; console.log('[telemetry]', type, detail) }
}
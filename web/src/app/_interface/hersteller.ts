import { FilamentmitSpulen } from "./filament"

export interface Hersteller {
  id: string
  name: string
}

export interface HerstellerMitFilament{
  hersteller: Hersteller
  filament: FilamentmitSpulen[]
  offen?: boolean
}
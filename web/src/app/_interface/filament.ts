import { Hersteller } from "./hersteller"
import { Material } from "./material"
import { Spule } from "./spule"

export interface Filament {
  id: string
  farbe: string
  farbcode: string
  hersteller: Hersteller
  material: Material
  preis: number
  gewicht_filament: number
  gewicht_spule: number
  link: string
  temp_extruder: number
  temp_bed: number
}

export type FilamentSortMode = 
| 'farbe'
| 'material'
| 'hersteller'
| 'gewicht'

export interface FilamentmitSpulen {
  filament: Filament,
  spulen: Spule[]
  gesamtGewicht: number,
  gesamtVerbrauch: number,
  gesamtVerbleibend: number
}
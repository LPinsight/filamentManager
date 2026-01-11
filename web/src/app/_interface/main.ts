import { Filament } from "./filament"
import { Hersteller } from "./hersteller"
import { Material } from "./material"
import { Ort } from "./ort"
import { Spule } from "./spule"

export type sortDirection = 
| 'asc'
| 'desc'

export interface DataState {
  spule: Spule[]
  filament: Filament[]
  material: Material[]
  hersteller: Hersteller[]
  ort: Ort[]
}
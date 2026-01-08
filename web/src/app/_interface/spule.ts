import { Filament } from "./filament"
import { Ort } from "./ort"

export interface Spule {
  id: string
  filament: Filament
  verbrauchtes_Gewicht: number
  verbleibendes_Gewicht: number
  nfc: string
  nummer: number
  ort: Ort
  archiviert: boolean
}

export interface spuleDrop {
  spule: Spule,
  ort_id: string | null,
  sortIndex: number,
}

export interface spuleDropRequest {
  id: string,
  ort_id: string | null,
  sortIndex: number,
}

export type SpulenSortMode = 
| 'ort'
| 'farbe'
| 'material'
| 'hersteller'
| 'nummer'
| 'gewicht'
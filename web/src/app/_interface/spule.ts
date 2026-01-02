import { Filament } from "./filament"
import { Ort } from "./ort"

export interface Spule {
  id: string
  filament: Filament
  verbrauchtes_Gewicht: number
  verbleibendes_Gewicht: number
  nfc: string
  ort: Ort
  archiviert: boolean
}

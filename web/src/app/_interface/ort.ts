import { Spule } from "./spule"

export interface Ort {
  id: string
  name: string
}

export interface OrtmitSpulen {
  ort: Ort
  spulen: Spule[]
}
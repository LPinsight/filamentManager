import { Spule } from "./spule"

export interface Ort {
  id: string
  name: string
}

export interface OrtmitSpulen {
  ort: Ort
  spulen: Spule[]
}

export interface ortDrop {
  id: string
  sortIndex: number,
}
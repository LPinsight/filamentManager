export interface filamentFilter {
  farbe?: string,

  hersteller_id?: string | null
  material_id?: string | null

  preisMin?: number,
  preisMax?: number,

  gewichtMin?: number,
  gewichtMax?: number,
}


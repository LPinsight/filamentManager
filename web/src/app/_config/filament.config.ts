export interface FilamentFilterConfig {
  showPreis?: boolean;
  showGewicht?: boolean;

  gewichtLabel?: string;

  showOrt?: boolean;
  showArchiviert?: boolean;
}

export const FILAMENT_FILTER_CONFIG: FilamentFilterConfig = {
  showPreis: true,
  showGewicht: true,
  gewichtLabel: 'Gewicht (g)',
  showOrt: false,
  showArchiviert: false,
};

export const SPULE_FILTER_CONFIG: FilamentFilterConfig = {
  showPreis: true,
  showGewicht: true,
  gewichtLabel: 'Verbleibendes Gewicht (g)',
  showOrt: true,
  showArchiviert: true,
};

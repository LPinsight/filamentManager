package iface

type Filament struct {
	ID               string     `json:"id"`
	Farbe            string     `json:"farbe"`
	Farbcode         string     `json:"farbcode"`
	Hersteller       Hersteller `json:"hersteller"`
	Material         Material   `json:"material"`
	Preis            float32    `json:"preis"`
	Gewicht_Filament float32    `json:"gewicht_filament"`
	Gewicht_Spule    float32    `json:"gewicht_spule"`
	Link             string     `json:"link"`
	Temp_Extruder    int        `json:"temp_extruder"`
	Temp_Bed         int        `json:"temp_bed"`
}

type FilamentData struct {
	Farbe            string  `json:"farbe"`
	Farbcode         string  `json:"farbcode"`
	HerstellerID     string  `json:"hersteller_id"`
	MaterialID       string  `json:"material_id"`
	Preis            float32 `json:"preis"`
	Gewicht_Filament float32 `json:"gewicht_filament"`
	Gewicht_Spule    float32 `json:"gewicht_spule"`
	Link             string  `json:"link"`
	Temp_Extruder    int     `json:"temp_extruder"`
	Temp_Bed         int     `json:"temp_bed"`
}

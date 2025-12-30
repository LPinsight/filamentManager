package models

type Filament struct {
	FilamentID       string     `gorm:"primaryKey;size:191" json:"id"`
	Farbe            string     `json:"farbe"`
	Farbcode         string     `json:"farbcode"`
	Preis            float32    `json:"preis"`
	HerstellerID     string     `gorm:"size:191;not null;index"`
	Hersteller       Hersteller `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	MaterialID       string     `gorm:"size:191;not null;index"`
	Material         Material   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Gewicht_Filament float32    `json:"gewicht_filament"`
	Gewicht_Spule    float32    `json:"gewicht_spule"`
	Link             string     `json:"link"`
	Temp_Extruder    int        `json:"temp_extruder"`
	Temp_Bed         int        `json:"temp_bed"`
}

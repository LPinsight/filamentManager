package models

type Spule struct {
	SpuleID              string   `gorm:"primaryKey;size:191" json:"id"`
	FilamentID           string   `gorm:"size:191;not null;index"`
	Filament             Filament `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Verbrauchtes_Gewicht float32  `json:"verbrauchtes_Gewicht"`
	NFC                  string   `json:"nfc"`
	OrtID                *string  `gorm:"size:191;index"`
	Ort                  *Ort     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Archiviert           bool     `json:"archiviert"`
}

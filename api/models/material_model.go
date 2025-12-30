package models

type Material struct {
	MaterialID  string  `gorm:"primaryKey;size:191" json:"id"`
	Name        string  `json:"name"`
	Durchmesser float32 `json:"durchmesser"`
	Dichte      float32 `json:"dichte"`
}

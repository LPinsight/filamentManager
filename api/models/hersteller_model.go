package models

type Hersteller struct {
	HerstellerID string `gorm:"primaryKey;size:191" json:"id"`
	Name         string `json:"name"`
}

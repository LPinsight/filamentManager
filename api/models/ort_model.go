package models

type Ort struct {
	OrtID     string `gorm:"primaryKey" json:"id"`
	Name      string `json:"name"`
	SortIndex int    `gorm:"index" json:"sortIndex"`
}

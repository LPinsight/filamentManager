package utils

import "github.com/google/uuid"

func NewFilamentID() string {
	return "F-" + uuid.NewString()
}

func NewHerstellerID() string {
	return "H-" + uuid.NewString()
}

func NewMaterialID() string {
	return "M-" + uuid.NewString()
}

func NewSpulenID() string {
	return "S-" + uuid.NewString()
}

func NewOrtID() string {
	return "O-" + uuid.NewString()
}

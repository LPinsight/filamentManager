package iface

type Spule struct {
	ID                   string   `json:"id"`
	Filament             Filament `json:"filament"`
	Verbrauchtes_Gewicht float32  `json:"verbrauchtes_Gewicht"`
	NFC                  string   `json:"nfc"`
	Ort                  Ort      `json:"ort"`
	Archiviert           bool     `json:"archiviert"`
}

type SpuleData struct {
	FilamentID           string  `json:"filament_id"`
	Verbrauchtes_Gewicht float32 `json:"verbrauchtes_Gewicht"`
	NFC                  string  `json:"nfc"`
	OrtID                string  `json:"ort_id"`
	Archiviert           bool    `json:"archiviert"`
}

package iface

type Spule struct {
	ID                    string   `json:"id"`
	Filament              Filament `json:"filament"`
	Verbrauchtes_Gewicht  float32  `json:"verbrauchtes_Gewicht"`
	Verbleibendes_Gewicht float32  `json:"verbleibendes_Gewicht"`
	NFC                   string   `json:"nfc"`
	Nummer                int      `json:"nummer"`
	Ort                   Ort      `json:"ort"`
	Archiviert            bool     `json:"archiviert"`
}

type SpuleData struct {
	FilamentID           string  `json:"filament_id"`
	Verbrauchtes_Gewicht float32 `json:"verbrauchtes_Gewicht"`
	NFC                  string  `json:"nfc"`
	OrtID                string  `json:"ort_id"`
	Archiviert           bool    `json:"archiviert"`
}

type ArchivRequest struct {
	Archiviert bool `json:"archiviert"`
}

type OrtRequest struct {
	OrtID *string `json:"ort_id"`
}

type SpulenSortRequest struct {
	ID        string  `json:"id"`
	OrtID     *string `json:"ort_id"`
	SortIndex int     `json:"sortIndex"`
}

type NfcRemoveRequest struct {
	NFC    *string `json:"nfc"`
	Nummer *int    `json:"nummer"`
}

type NummerRequest struct {
	Nummer *int `json:"nummer"`
}

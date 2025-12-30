package iface

type Material struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Durchmesser float32 `json:"durchmesser"`
	Dichte      float32 `json:"dichte"`
}

type MaterialData struct {
	Name        string  `json:"name"`
	Durchmesser float32 `json:"durchmesser"`
	Dichte      float32 `json:"dichte"`
}
